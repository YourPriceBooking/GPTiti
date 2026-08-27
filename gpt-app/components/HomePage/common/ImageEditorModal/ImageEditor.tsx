"use client";

import { useEffect, useRef, useState } from "react";

import css from "./ImageEditor.module.css";

type Mode = "transform" | "annotate";
type Tool = "marker" | "text";

type CropRect = { x: number; y: number; w: number; h: number };
type Stroke = { color: string; points: { x: number; y: number }[] };
type TextItem = {
  id: string;
  x: number;
  y: number;
  value: string;
  color: string;
  onLight: boolean;
};

type HandleId = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "move";

type AnnotateAction =
  | { type: "stroke"; stroke: Stroke }
  | { type: "text"; text: TextItem };

const HANDLES: Exclude<HandleId, "move">[] = [
  "nw",
  "n",
  "ne",
  "e",
  "se",
  "s",
  "sw",
  "w",
];

const PALETTE = [
  "#111827",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#facc15",
  "#4ade80",
  "#38bdf8",
  "#3b82f6",
  "#a855f7",
  "#f472b6",
];

const MIN_CROP = 32;
const STROKE_WIDTH = 4;
const TEXT_FONT_SIZE = 20;
const TEXT_LINE_HEIGHT = 1.25;
const TEXT_PAD = 7;

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

function resizeCrop(
  start: CropRect,
  handle: HandleId,
  dx: number,
  dy: number,
  bounds: { w: number; h: number },
): CropRect {
  let { x, y, w, h } = start;

  if (handle === "move") {
    return {
      x: clamp(x + dx, 0, bounds.w - w),
      y: clamp(y + dy, 0, bounds.h - h),
      w,
      h,
    };
  }

  const right = x + w;
  const bottom = y + h;

  if (handle.includes("w")) {
    const nx = clamp(x + dx, 0, right - MIN_CROP);
    w = right - nx;
    x = nx;
  }
  if (handle.includes("e")) {
    w = clamp(w + dx, MIN_CROP, bounds.w - x);
  }
  if (handle.includes("n")) {
    const ny = clamp(y + dy, 0, bottom - MIN_CROP);
    h = bottom - ny;
    y = ny;
  }
  if (handle.includes("s")) {
    h = clamp(h + dy, MIN_CROP, bounds.h - y);
  }

  return { x, y, w, h };
}

type ImageEditorProps = {
  source: string;
  fileName: string;
  onSave: (file: File, url: string) => void;
  onClose: () => void;
};

export default function ImageEditor({
  source,
  fileName,
  onSave,
  onClose,
}: ImageEditorProps) {
  const [mode, setMode] = useState<Mode>("transform");
  const [tool, setTool] = useState<Tool>("marker");
  const [color, setColor] = useState("#ef4444");
  const [workingSrc, setWorkingSrc] = useState(source);
  const [displaySize, setDisplaySize] = useState<{
    w: number;
    h: number;
  } | null>(null);
  const [crop, setCrop] = useState<CropRect | null>(null);
  const [cropEnabled, setCropEnabled] = useState(true);
  const [texts, setTexts] = useState<TextItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [undoStack, setUndoStack] = useState<AnnotateAction[]>([]);
  const [redoStack, setRedoStack] = useState<AnnotateAction[]>([]);

  const editorRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const activeStrokeRef = useRef<Stroke | null>(null);
  const cropDragRef = useRef<{
    handle: HandleId;
    startX: number;
    startY: number;
    start: CropRect;
  } | null>(null);
  const textDragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    ox: number;
    oy: number;
  } | null>(null);
  const sampleCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const activeTextIdRef = useRef<string | null>(null);

  const workingSrcRef = useRef(workingSrc);
  workingSrcRef.current = workingSrc;
  useEffect(
    () => () => {
      if (workingSrcRef.current !== source) {
        URL.revokeObjectURL(workingSrcRef.current);
      }
    },
    [source],
  );

  const replaceWorkingSrc = (url: string) => {
    setWorkingSrc((prev) => {
      if (prev !== source) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    const w = el.clientWidth;
    const h = el.clientHeight;
    setDisplaySize({ w, h });
    setCrop({ x: 0, y: 0, w, h });
  };

  useEffect(() => {
    if (!displaySize) return;
    let cancelled = false;
    (async () => {
      try {
        const img = await loadImage(workingSrc);
        if (cancelled) return;
        const c = document.createElement("canvas");
        c.width = displaySize.w;
        c.height = displaySize.h;
        const ctx = c.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, displaySize.w, displaySize.h);
        sampleCtxRef.current = ctx;
      } catch {
        sampleCtxRef.current = null;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [workingSrc, displaySize]);

  const isLightAt = (x: number, y: number) => {
    const ctx = sampleCtxRef.current;
    if (!ctx || !displaySize) return false;
    const sx = clamp(Math.round(x), 0, displaySize.w - 1);
    const sy = clamp(Math.round(y), 0, displaySize.h - 1);
    const sw = Math.max(1, Math.min(90, displaySize.w - sx));
    const sh = Math.max(
      1,
      Math.min(TEXT_FONT_SIZE + TEXT_PAD * 2, displaySize.h - sy),
    );
    const data = ctx.getImageData(sx, sy, sw, sh).data;
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
      sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    }
    return sum / (data.length / 4) > 128;
  };

  /* --- drawing (marker) --- */

  const drawStrokes = (ctx: CanvasRenderingContext2D) => {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const stroke of strokesRef.current) {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = STROKE_WIDTH;
      ctx.beginPath();
      stroke.points.forEach((p, i) =>
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y),
      );
      ctx.stroke();
    }
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    drawStrokes(ctx);
  };

  useEffect(() => {
    if (mode !== "annotate" || !displaySize) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(displaySize.w * dpr);
    canvas.height = Math.round(displaySize.h * dpr);
    ctx.scale(dpr, dpr);
    drawStrokes(ctx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, displaySize]);

  const getCanvasPos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    if (tool === "text") {
      const p = getCanvasPos(e);
      const item: TextItem = {
        id: crypto.randomUUID(),
        x: p.x,
        y: p.y,
        value: "",
        color,
        onLight: isLightAt(p.x, p.y),
      };
      activeTextIdRef.current = item.id;
      setTexts((prev) => [...prev, item]);
      setUndoStack((prev) => [...prev, { type: "text", text: item }]);
      setRedoStack([]);
      return;
    }
    /* Drawing moves focus back to the editor so shortcuts keep working
       even right after typing in a text item. */
    activeTextIdRef.current = null;
    editorRef.current?.focus();
    e.currentTarget.setPointerCapture(e.pointerId);
    activeStrokeRef.current = { color, points: [getCanvasPos(e)] };
  };

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    const stroke = activeStrokeRef.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (!stroke || !ctx) return;

    const prev = stroke.points[stroke.points.length - 1];
    const p = getCanvasPos(e);
    stroke.points.push(p);

    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = STROKE_WIDTH;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };

  const handleCanvasPointerUp = () => {
    const stroke = activeStrokeRef.current;
    if (stroke) {
      strokesRef.current.push(stroke);
      setUndoStack((prev) => [...prev, { type: "stroke", stroke }]);
      setRedoStack([]);
      activeStrokeRef.current = null;
    }
  };

  /* --- undo / redo (annotate) --- */

  const undo = () => {
    const action = undoStack[undoStack.length - 1];
    if (!action) return;

    if (action.type === "stroke") {
      const i = strokesRef.current.lastIndexOf(action.stroke);
      if (i !== -1) strokesRef.current.splice(i, 1);
      redrawCanvas();
      setRedoStack((prev) => [...prev, action]);
    } else {
      /* The text may have been edited after creation — capture its
         current value so redo restores what the user last saw. */
      const current = texts.find((t) => t.id === action.text.id);
      setTexts((prev) => prev.filter((t) => t.id !== action.text.id));
      setRedoStack((prev) => [
        ...prev,
        { type: "text", text: current ?? action.text },
      ]);
    }
    setUndoStack((prev) => prev.slice(0, -1));
  };

  const redo = () => {
    const action = redoStack[redoStack.length - 1];
    if (!action) return;

    if (action.type === "stroke") {
      strokesRef.current.push(action.stroke);
      redrawCanvas();
    } else {
      setTexts((prev) => [...prev, action.text]);
    }
    setUndoStack((prev) => [...prev, action]);
    setRedoStack((prev) => prev.slice(0, -1));
  };

  /* Pull focus away from whatever was focused behind the modal (e.g. the
     chat textarea), so keyboard shortcuts reach the editor. */
  useEffect(() => {
    if (mode === "annotate") editorRef.current?.focus();
  }, [mode]);

  useEffect(() => {
    if (mode !== "annotate") return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;

      if (
        (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") &&
        editorRef.current?.contains(target)
      ) {
        return;
      }
      if (!(e.ctrlKey || e.metaKey)) return;

      const key = e.key.toLowerCase();
      if (key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (key === "y" || (key === "z" && e.shiftKey)) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  /* --- crop drag --- */

  const startCropDrag = (handle: HandleId) => (e: React.PointerEvent) => {
    if (!crop) return;
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    cropDragRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      start: crop,
    };
  };

  const moveCropDrag = (e: React.PointerEvent) => {
    const drag = cropDragRef.current;
    if (!drag || !displaySize) return;
    setCrop(
      resizeCrop(
        drag.start,
        drag.handle,
        e.clientX - drag.startX,
        e.clientY - drag.startY,
        displaySize,
      ),
    );
  };

  const endCropDrag = () => {
    cropDragRef.current = null;
  };

  /* --- text drag --- */

  const startTextDrag = (id: string) => (e: React.PointerEvent) => {
    const item = texts.find((t) => t.id === id);
    if (!item) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    textDragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      ox: item.x,
      oy: item.y,
    };
  };

  const moveTextDrag = (e: React.PointerEvent) => {
    const drag = textDragRef.current;
    if (!drag || !displaySize) return;
    const nx = clamp(drag.ox + e.clientX - drag.startX, 0, displaySize.w - 24);
    const ny = clamp(drag.oy + e.clientY - drag.startY, 0, displaySize.h - 24);
    setTexts((prev) =>
      prev.map((t) =>
        t.id === drag.id
          ? { ...t, x: nx, y: ny, onLight: isLightAt(nx, ny) }
          : t,
      ),
    );
  };

  const endTextDrag = () => {
    textDragRef.current = null;
  };

  /* --- actions --- */

  const rotate = async (dir: 1 | -1) => {
    if (busy) return;
    setBusy(true);
    try {
      const img = await loadImage(workingSrc);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalHeight;
      canvas.height = img.naturalWidth;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((dir * Math.PI) / 2);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      const blob = await canvasToBlob(canvas, "image/png");
      if (!blob) return;
      replaceWorkingSrc(URL.createObjectURL(blob));
    } finally {
      setBusy(false);
    }
  };

  const pickColor = (c: string) => {
    setColor(c);
    const id = activeTextIdRef.current;
    if (id) {
      setTexts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, color: c } : t)),
      );
    }
  };

  const openAnnotate = () => {
    setTool("marker");
    setUndoStack([]);
    setRedoStack([]);
    setMode("annotate");
  };

  const cancelAnnotate = () => {
    strokesRef.current = [];
    activeStrokeRef.current = null;
    setTexts([]);
    setUndoStack([]);
    setRedoStack([]);
    setMode("transform");
  };

  const applyAnnotations = async () => {
    if (busy || !displaySize) return;
    const strokes = strokesRef.current;
    const validTexts = texts.filter((t) => t.value.trim() !== "");

    if (strokes.length === 0 && validTexts.length === 0) {
      cancelAnnotate();
      return;
    }

    setBusy(true);
    try {
      const img = await loadImage(workingSrc);
      const ratio = img.naturalWidth / displaySize.w;
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (const stroke of strokes) {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = STROKE_WIDTH * ratio;
        ctx.beginPath();
        stroke.points.forEach((p, i) =>
          i === 0
            ? ctx.moveTo(p.x * ratio, p.y * ratio)
            : ctx.lineTo(p.x * ratio, p.y * ratio),
        );
        ctx.stroke();
      }

      ctx.textBaseline = "top";
      ctx.font = `600 ${TEXT_FONT_SIZE * ratio}px system-ui, -apple-system, sans-serif`;
      for (const t of validTexts) {
        ctx.fillStyle = t.color;
        t.value.split("\n").forEach((line, i) => {
          ctx.fillText(
            line,
            (t.x + TEXT_PAD) * ratio,
            (t.y + TEXT_PAD + i * TEXT_FONT_SIZE * TEXT_LINE_HEIGHT) * ratio,
          );
        });
      }

      const blob = await canvasToBlob(canvas, "image/png");
      if (!blob) return;

      strokesRef.current = [];
      setTexts([]);
      setUndoStack([]);
      setRedoStack([]);
      setMode("transform");
      replaceWorkingSrc(URL.createObjectURL(blob));
    } finally {
      setBusy(false);
    }
  };

  const handleDone = async () => {
    if (busy || !displaySize || !crop) return;
    setBusy(true);
    try {
      const img = await loadImage(workingSrc);
      const ratio = img.naturalWidth / displaySize.w;

      const useCrop =
        cropEnabled &&
        (crop.x > 0 ||
          crop.y > 0 ||
          crop.w < displaySize.w ||
          crop.h < displaySize.h);

      const sx = useCrop
        ? clamp(Math.round(crop.x * ratio), 0, img.naturalWidth - 1)
        : 0;
      const sy = useCrop
        ? clamp(Math.round(crop.y * ratio), 0, img.naturalHeight - 1)
        : 0;
      const sw = useCrop
        ? clamp(Math.round(crop.w * ratio), 1, img.naturalWidth - sx)
        : img.naturalWidth;
      const sh = useCrop
        ? clamp(Math.round(crop.h * ratio), 1, img.naturalHeight - sy)
        : img.naturalHeight;

      const outputType = /\.png$/i.test(fileName)
        ? "image/png"
        : /\.webp$/i.test(fileName)
          ? "image/webp"
          : "image/jpeg";

      const canvas = document.createElement("canvas");
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (outputType === "image/jpeg") {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, sw, sh);
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

      const blob = await canvasToBlob(canvas, outputType, 0.92);
      if (!blob) return;

      const file = new File([blob], fileName, { type: blob.type });
      onSave(file, URL.createObjectURL(file));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={css.editor} ref={editorRef} tabIndex={-1}>
      <div className={css.stage}>
        <div className={css.imageWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={workingSrc}
            alt="editing preview"
            onLoad={handleImgLoad}
            draggable={false}
          />

          {mode === "transform" && cropEnabled && crop && (
            <>
              <div className={css.cropDimLayer}>
                <div
                  className={css.cropDim}
                  style={{
                    left: crop.x,
                    top: crop.y,
                    width: crop.w,
                    height: crop.h,
                  }}
                />
              </div>
              <div
                className={css.cropRect}
                style={{
                  left: crop.x,
                  top: crop.y,
                  width: crop.w,
                  height: crop.h,
                }}
                onPointerDown={startCropDrag("move")}
                onPointerMove={moveCropDrag}
                onPointerUp={endCropDrag}
              >
                {HANDLES.map((h) => (
                  <span
                    key={h}
                    className={`${css.handle} ${css[`handle_${h}`]}`}
                    onPointerDown={startCropDrag(h)}
                    onPointerMove={moveCropDrag}
                    onPointerUp={endCropDrag}
                  />
                ))}
              </div>
            </>
          )}

          {mode === "annotate" && displaySize && (
            <>
              <canvas
                ref={canvasRef}
                className={css.drawCanvas}
                style={{ width: displaySize.w, height: displaySize.h }}
                onPointerDown={handleCanvasPointerDown}
                onPointerMove={handleCanvasPointerMove}
                onPointerUp={handleCanvasPointerUp}
              />
              {texts.map((t) => (
                <div
                  key={t.id}
                  className={css.textItem}
                  style={
                    {
                      left: t.x,
                      top: t.y,
                      color: t.color,
                      "--frameColor": t.onLight
                        ? "rgba(0, 0, 0, 0.85)"
                        : "rgba(255, 255, 255, 0.85)",
                    } as React.CSSProperties
                  }
                  onPointerDown={startTextDrag(t.id)}
                  onPointerMove={moveTextDrag}
                  onPointerUp={endTextDrag}
                >
                  <textarea
                    autoFocus
                    rows={t.value.split("\n").length}
                    value={t.value}
                    placeholder="Text"
                    style={{
                      width: `${Math.max(
                        ...t.value.split("\n").map((l) => l.length),
                        4,
                      )}ch`,
                    }}
                    onFocus={() => {
                      activeTextIdRef.current = t.id;
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      setTexts((prev) =>
                        prev.map((x) =>
                          x.id === t.id ? { ...x, value: e.target.value } : x,
                        ),
                      )
                    }
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {mode === "transform" ? (
        <div className={css.toolbar}>
          <button
            type="button"
            className={css.toolBtn}
            disabled={busy}
            onClick={onClose}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"
              />
            </svg>
            <span>Cancel</span>
          </button>
          <button
            type="button"
            className={`${css.toolBtn} ${cropEnabled ? css.toolBtnActive : ""}`}
            disabled={busy}
            onClick={() => setCropEnabled((prev) => !prev)}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M17 15h2V7c0-1.1-.9-2-2-2H9v2h8v8zM7 17V1H5v4H1v2h4v10c0 1.1.9 2 2 2h10v4h2v-4h4v-2H7z"
              />
            </svg>
            <span>Crop</span>
          </button>
          <button
            type="button"
            className={css.toolBtn}
            disabled={busy}
            onClick={() => rotate(-1)}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 5V2L7 6l5 4V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
              />
            </svg>
            <span>Rotate Left</span>
          </button>
          <button
            type="button"
            className={css.toolBtn}
            disabled={busy}
            onClick={() => rotate(1)}
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{ transform: "scaleX(-1)" }}
            >
              <path
                fill="currentColor"
                d="M12 5V2L7 6l5 4V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
              />
            </svg>
            <span>Rotate Right</span>
          </button>
          <button
            type="button"
            className={css.toolBtn}
            disabled={busy}
            onClick={openAnnotate}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              />
            </svg>
            <span>Marker</span>
          </button>
          <button
            type="button"
            className={`${css.toolBtn} ${css.doneBtn}`}
            disabled={busy}
            onClick={handleDone}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
              />
            </svg>
            <span>Done</span>
          </button>
        </div>
      ) : (
        <>
          <div className={css.toolbar}>
            <button
              type="button"
              className={css.toolBtn}
              disabled={busy}
              onClick={cancelAnnotate}
            >
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"
                />
              </svg>
              <span>Cancel</span>
            </button>
            <button
              type="button"
              className={css.toolBtn}
              disabled={busy || undoStack.length === 0}
              onClick={undo}
              aria-label="Undo"
            >
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"
                />
              </svg>
              <span>Undo</span>
            </button>
            <button
              type="button"
              className={css.toolBtn}
              disabled={busy || redoStack.length === 0}
              onClick={redo}
              aria-label="Redo"
            >
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"
                />
              </svg>
              <span>Redo</span>
            </button>
            <button
              type="button"
              className={`${css.toolBtn} ${tool === "text" ? css.toolBtnActive : ""}`}
              disabled={busy}
              onClick={() =>
                setTool((prev) => (prev === "text" ? "marker" : "text"))
              }
            >
              <span className={css.textGlyph}>A</span>
              <span>Text</span>
            </button>
            <button
              type="button"
              className={`${css.toolBtn} ${css.doneBtn}`}
              disabled={busy}
              onClick={applyAnnotations}
            >
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                />
              </svg>
              <span>Done</span>
            </button>
          </div>
          <div className={css.palette}>
            {PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Color ${c}`}
                className={`${css.swatch} ${color === c ? css.swatchActive : ""}`}
                style={{ background: c }}
                onClick={() => pickColor(c)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
