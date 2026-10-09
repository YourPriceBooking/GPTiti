/** Visualizer only: capture owns the stream; this never stops its tracks. */
export function attachVoiceWaveform(svg: SVGSVGElement, stream: MediaStream) {
  const bars = [...svg.querySelectorAll<SVGRectElement>("[data-wave-bar]")];
  const context = new AudioContext();
  let source: MediaStreamAudioSourceNode;
  let analyser: AnalyserNode;
  try {
    source = context.createMediaStreamSource(stream);
    analyser = context.createAnalyser();
    source.connect(analyser);
  } catch (error) {
    void context.close().catch(() => {});
    throw error;
  }
  analyser.fftSize = 2048;
  const samples = new Uint8Array(analyser.fftSize);
  const levels = new Float32Array(bars.length);
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let disposed = false;
  let ready = false;
  let frame = 0;
  let lastPaint = 0;
  const reset = () =>
    bars.forEach((bar) => {
      bar.setAttribute("height", "2");
      bar.setAttribute("y", "19");
      bar.setAttribute("opacity", ".35");
    });
  const draw = (now: number) => {
    if (disposed || motion.matches) return;
    if (now - lastPaint >= 1000 / 30) {
      lastPaint = now;
      analyser.getByteTimeDomainData(samples);
      bars.forEach((bar, index) => {
        const from = Math.floor((index * samples.length) / bars.length);
        const to = Math.floor(((index + 1) * samples.length) / bars.length);
        let sum = 0;
        for (let i = from; i < to; i++) sum += ((samples[i] - 128) / 128) ** 2;
        const target = Math.min(
          1,
          Math.max(0, Math.sqrt(sum / Math.max(1, to - from)) - 0.012) * 5,
        );
        levels[index] +=
          (target - levels[index]) * (target > levels[index] ? 0.42 : 0.18);
        const height = 2 + 32 * levels[index];
        bar.setAttribute("height", height.toFixed(2));
        bar.setAttribute("y", (20 - height / 2).toFixed(2));
        bar.setAttribute("opacity", (0.3 + 0.65 * levels[index]).toFixed(2));
      });
    }
    frame = requestAnimationFrame(draw);
  };
  const preferenceChanged = () => {
    cancelAnimationFrame(frame);
    levels.fill(0);
    reset();
    if (ready && !disposed && !motion.matches)
      frame = requestAnimationFrame(draw);
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    motion.removeEventListener("change", preferenceChanged);
    source.disconnect();
    analyser.disconnect();
    reset();
    void context.close().catch(() => {});
  };
  motion.addEventListener("change", preferenceChanged);
  reset();
  void context
    .resume()
    .then(() => {
      ready = true;
      if (!disposed && !motion.matches) frame = requestAnimationFrame(draw);
    })
    .catch(dispose);
  return dispose;
}
