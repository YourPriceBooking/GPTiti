import { IMAGE_COMPRESSION } from "@/config/modelLimits.config";

type CompressOpts = {
  maxLongSide?: number;
  quality?: number;
  /** Preferred output MIME type (e.g. `"image/webp"`). */
  mimeType?: string;
  /** Used when the preferred MIME type is unsupported by the browser. */
  fallbackMimeType?: string;
};

const EXT_BY_MIME: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

function renameWithExt(filename: string, mime: string): string {
  const ext = EXT_BY_MIME[mime] ?? "bin";
  const dot = filename.lastIndexOf(".");
  const base = dot > 0 ? filename.slice(0, dot) : filename;
  return `${base}.${ext}`;
}

async function loadAsDrawable(file: File): Promise<{
  source: CanvasImageSource;
  width: number;
  height: number;
  cleanup: () => void;
}> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        cleanup: () => bitmap.close?.(),
      };
    } catch {
      /* fall through to HTMLImageElement */
    }
  }

  const url = URL.createObjectURL(file);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = (e) => reject(e);
    el.src = url;
  });
  return {
    source: img,
    width: img.naturalWidth,
    height: img.naturalHeight,
    cleanup: () => URL.revokeObjectURL(url),
  };
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mime, quality);
  });
}

export async function compressImage(
  file: File,
  opts: CompressOpts = {}
): Promise<File> {
  if (typeof window === "undefined") return file;
  if (!file.type.startsWith("image/")) return file;
  if (file.type === "image/gif") return file;

  const maxLongSide = opts.maxLongSide ?? IMAGE_COMPRESSION.maxLongSide;
  const quality = opts.quality ?? IMAGE_COMPRESSION.quality;
  const preferredMime = opts.mimeType ?? IMAGE_COMPRESSION.mimeType;
  const fallbackMime =
    opts.fallbackMimeType ?? IMAGE_COMPRESSION.fallbackMimeType;

  let drawable: Awaited<ReturnType<typeof loadAsDrawable>>;
  try {
    drawable = await loadAsDrawable(file);
  } catch {
    return file;
  }

  try {
    const { source, width, height } = drawable;
    const longSide = Math.max(width, height);
    const scale = longSide > maxLongSide ? maxLongSide / longSide : 1;
    const targetW = Math.max(1, Math.round(width * scale));
    const targetH = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(source, 0, 0, targetW, targetH);

    let blob = await canvasToBlob(canvas, preferredMime, quality);
    let outMime = preferredMime;
    if (!blob || blob.size === 0) {
      blob = await canvasToBlob(canvas, fallbackMime, quality);
      outMime = fallbackMime;
    }
    if (!blob) return file;

    if (blob.size >= file.size) return file;

    return new File([blob], renameWithExt(file.name, outMime), {
      type: outMime,
      lastModified: Date.now(),
    });
  } finally {
    drawable.cleanup();
  }
}
