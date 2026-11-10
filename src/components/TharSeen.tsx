import { useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const TOTAL_FRAMES = 240;
const FOLDER = "/THAR%20SEEN/ezgif-frame-";

function frameUrl(index: number): string {
  const n = String(index + 1).padStart(3, "0");
  return `${FOLDER}${n}.jpg`;
}

const overlays = [
  {
    range: [0.0, 0.08, 0.16] as [number, number, number],
    position: "bottom-center",
    eyebrow: "Design",
    heading: "COMMANDING\nPRESENCE",
    body: "Every angle tells a story of dominance. Bold surfaces, signature round lamps, and a stance that owns every road it touches.",
  },
  {
    range: [0.22, 0.30, 0.42] as [number, number, number],
    position: "right",
    eyebrow: "Interior",
    heading: "CRAFTED\nTO THRILL",
    body: "A cockpit built for the bold — 26.03cm touchscreen, ambient lighting, and premium leatherette seats that merge luxury with adventure.",
  },
  {
    range: [0.50, 0.58, 0.70] as [number, number, number],
    position: "left",
    eyebrow: "Technology",
    heading: "DRIVE\nINTELLIGENT",
    body: "AdrenoX connected tech, wireless Android Auto & Apple CarPlay, and an ADAS suite that keeps you in control at all times.",
  },
  {
    range: [0.76, 0.84, 1.0] as [number, number, number],
    position: "bottom-center",
    eyebrow: "Heritage",
    heading: "BORN\nIN 1947",
    body: "Over seven decades of unstoppable legacy. The Thar carries the spirit of every adventure ever taken and every road yet to be conquered.",
  },
];

function useOverlayMotion(
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"],
  range: [number, number, number]
) {
  const opacity = useTransform(
    scrollYProgress,
    [range[0], range[1], range[1] + (range[2] - range[1]) * 0.7, range[2]],
    [0, 1, 1, 0]
  );
  const y = useTransform(scrollYProgress, [range[0], range[1]], [50, 0]);
  return { opacity, y };
}

interface OverlayProps {
  overlay: (typeof overlays)[0];
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}

function Overlay({ overlay, scrollYProgress }: OverlayProps) {
  const { opacity, y } = useOverlayMotion(scrollYProgress, overlay.range);

  const posClass =
    overlay.position === "right"
      ? "right-8 md:right-16 lg:right-24 text-right items-end"
      : overlay.position === "left"
      ? "left-8 md:left-16 lg:left-24 text-left items-start"
      : "left-1/2 -translate-x-1/2 text-center items-center w-full max-w-2xl px-8";

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute bottom-20 flex flex-col gap-3 ${posClass}`}
    >
      <p className="text-brand text-[10px] tracking-[0.4em] uppercase font-light">
        {overlay.eyebrow}
      </p>
      <h2 className="font-bebas text-white leading-none text-5xl md:text-7xl lg:text-8xl tracking-tight whitespace-pre-line">
        {overlay.heading}
      </h2>
      <p className="text-white/55 text-xs md:text-sm leading-relaxed font-light max-w-xs md:max-w-sm">
        {overlay.body}
      </p>
    </motion.div>
  );
}

export default function TharSeen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const loadedCountRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = width / height;

    let drawW: number, drawH: number, drawX: number, drawY: number;
    if (canvasAspect > imgAspect) {
      drawW = width;
      drawH = width / imgAspect;
      drawX = 0;
      drawY = (height - drawH) / 2;
    } else {
      drawH = height;
      drawW = height * imgAspect;
      drawX = (width - drawW) / 2;
      drawY = 0;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  useEffect(() => {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = frameUrl(i);
      img.onload = () => {
        loadedCountRef.current++;
        if (loadedCountRef.current === 1) drawFrame(0);
      };
      imagesRef.current[i] = img;
    }
  }, [drawFrame]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(v * (TOTAL_FRAMES - 1)))
      );
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
      }
    });
  }, [scrollYProgress, drawFrame]);

  return (
    <section id="gallery" ref={containerRef} className="relative" style={{ height: "600vh" }}>
      {/* Section label that fades out with scroll */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Cinematic letterbox bars */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/30 to-transparent pointer-events-none" />

        {/* Section eyebrow — top left */}
        <div className="absolute top-24 left-8 md:left-16 lg:left-24 flex items-center gap-3">
          <div className="w-6 h-[1px] bg-brand" />
          <span className="text-white/40 text-[10px] tracking-[0.4em] uppercase font-light">
            Chapter II
          </span>
        </div>

        {/* Dynamic text overlays */}
        {overlays.map((overlay, i) => (
          <Overlay key={i} overlay={overlay} scrollYProgress={scrollYProgress} />
        ))}

        {/* Bottom progress bar */}
        <div className="absolute bottom-6 left-8 md:left-16 right-8 md:right-16 flex items-center gap-4">
          <span className="text-white/20 text-[10px] tracking-[0.3em] uppercase font-light shrink-0">
            Gallery
          </span>
          <div className="flex-1 h-[1px] bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-brand"
              style={{ width: progressBarWidth }}
            />
          </div>
          <motion.span
            className="text-white/30 text-[10px] font-light tabular-nums shrink-0"
          >
            {/* frame counter via scrollYProgress */}
          </motion.span>
        </div>
      </div>
    </section>
  );
}