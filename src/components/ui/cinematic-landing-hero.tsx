import React, { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "../../lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 240;
const frameUrl = (i: number) =>
  `/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;

const STYLES = `
  /* ── card starts below viewport; GSAP overrides via inline style ── */
  .ch-card { transform: translateY(200vh); }

  /* ── CSS-driven hero text reveal (no GSAP dependency) ─────── */
  @keyframes chFadeUp {
    from { opacity:0; transform:translateY(40px); filter:blur(14px); }
    to   { opacity:1; transform:translateY(0);    filter:blur(0);    }
  }
  @keyframes chClipReveal {
    from { clip-path:inset(0 100% 0 0); }
    to   { clip-path:inset(0 0%   0 0); }
  }

  .ch-tagline-1   { animation: chFadeUp     1.5s cubic-bezier(.16,1,.3,1)  0.2s both; }
  .ch-clip        { animation: chClipReveal 1.4s cubic-bezier(.76,0,.24,1) 0.7s both; }
  .ch-tagline-2   { animation: chFadeUp     1.2s cubic-bezier(.16,1,.3,1)  0.9s both; }
  .ch-sub-copy    { animation: chFadeUp     1.0s cubic-bezier(.16,1,.3,1)  1.3s both; }
  .ch-scroll-hint { animation: chFadeUp     0.8s cubic-bezier(.16,1,.3,1)  1.7s both; }

  /* ── utility ───────────────────────────────────────────────── */
  .ch-film-grain {
    position:absolute; inset:0; pointer-events:none; z-index:50;
    opacity:.045; mix-blend-mode:overlay;
    background:url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%25" height="100%25" filter="url(%23n)"/></svg>');
  }

  .ch-grid {
    background-size:60px 60px;
    background-image:
      linear-gradient(to right,  rgba(255,255,255,.035) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,.035) 1px, transparent 1px);
    mask-image:radial-gradient(ellipse 80% 70% at center,black 0%,transparent 100%);
    -webkit-mask-image:radial-gradient(ellipse 80% 70% at center,black 0%,transparent 100%);
  }

  .ch-text-silver {
    background:linear-gradient(180deg,#fff 0%,rgba(255,255,255,.45) 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    filter:drop-shadow(0 12px 28px rgba(0,0,0,.85)) drop-shadow(0 3px 8px rgba(0,0,0,.7));
  }

  .ch-text-gold {
    background:linear-gradient(180deg,#e8c14c 0%,#c49b28 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    filter:drop-shadow(0 0 50px rgba(232,193,76,.4)) drop-shadow(0 4px 12px rgba(0,0,0,.6));
  }

  .ch-card {
    background:linear-gradient(150deg,#1a1a1a 0%,#0c0c0c 60%,#0a0a0a 100%);
    box-shadow:
      0 70px 140px -20px rgba(0,0,0,.98),
      0 35px 70px  -20px rgba(0,0,0,.85),
      inset 0 1px 2px rgba(255,255,255,.07),
      inset 0 -2px 8px rgba(0,0,0,.95);
    border:1px solid rgba(232,193,76,.07);
  }

  .ch-sheen {
    position:absolute; inset:0; border-radius:inherit; pointer-events:none; z-index:5;
    background:radial-gradient(700px circle at var(--mx,50%) var(--my,50%), rgba(232,193,76,.04) 0%, transparent 55%);
    mix-blend-mode:screen;
  }

  .ch-badge {
    backdrop-filter:blur(28px); -webkit-backdrop-filter:blur(28px);
    background:linear-gradient(135deg,rgba(255,255,255,.08) 0%,rgba(255,255,255,.02) 100%);
    box-shadow:
      0 0 0 1px rgba(255,255,255,.1),
      0 24px 56px -10px rgba(0,0,0,.95),
      inset 0 1px 1px rgba(255,255,255,.14),
      inset 0 -1px 1px rgba(0,0,0,.7);
  }

  .ch-card-hdr {
    background:linear-gradient(180deg,rgba(255,255,255,.025) 0%,transparent 100%);
    border-bottom:1px solid rgba(255,255,255,.05);
  }

  .ch-btn-primary {
    background:linear-gradient(180deg,#e8c14c 0%,#c49b28 100%);
    color:#000; font-weight:700;
    box-shadow:0 0 0 1px rgba(0,0,0,.15),0 14px 32px -4px rgba(232,193,76,.45),inset 0 1px 1px rgba(255,255,255,.55);
    transition:all .38s cubic-bezier(.25,1,.5,1);
  }
  .ch-btn-primary:hover { transform:translateY(-3px); box-shadow:0 22px 44px -6px rgba(232,193,76,.6); }
  .ch-btn-primary:active{ transform:translateY(1px); }

  .ch-btn-ghost {
    border:1px solid rgba(255,255,255,.18); color:rgba(255,255,255,.85);
    backdrop-filter:blur(12px); transition:all .38s cubic-bezier(.25,1,.5,1);
  }
  .ch-btn-ghost:hover { border-color:rgba(255,255,255,.45); color:#fff; transform:translateY(-3px); }
  .ch-btn-ghost:active{ transform:translateY(1px); }

  .ch-vignette {
    background:
      linear-gradient(to top,   rgba(0,0,0,.72) 0%, transparent 45%),
      linear-gradient(to bottom,rgba(0,0,0,.30) 0%, transparent 35%),
      linear-gradient(to right, rgba(0,0,0,.22) 0%, transparent 30%),
      linear-gradient(to left,  rgba(0,0,0,.22) 0%, transparent 30%);
  }

  .ch-chapter-pill {
    background:rgba(232,193,76,.09);
    border:1px solid rgba(232,193,76,.18);
    backdrop-filter:blur(12px);
  }

  @keyframes chPulseLine { 0%,100%{opacity:.4} 50%{opacity:1} }
  .ch-scroll-line { animation:chPulseLine 1.8s ease-in-out infinite; }
`;

export interface TharCinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  onLoadProgress?: (pct: number) => void;
  onLoadComplete?: () => void;
  onBookTestDrive?: () => void;
  onConfigure?: () => void;
}

export function TharCinematicHero({
  onLoadProgress, onLoadComplete,
  onBookTestDrive, onConfigure,
  className, ...props
}: TharCinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef      = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const imagesRef    = useRef<HTMLImageElement[]>([]);
  const frameRef     = useRef(0);
  const rafRef       = useRef(0);
  const loadedRef    = useRef(0);
  const barRef       = useRef<HTMLDivElement>(null);

  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[idx];
    if (!canvas || !img?.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width: W, height: H } = canvas;
    const ia = img.naturalWidth / img.naturalHeight, ca = W / H;
    let dw: number, dh: number, dx: number, dy: number;
    if (ca > ia) { dw = W; dh = W / ia; dx = 0; dy = (H - dh) / 2; }
    else         { dh = H; dw = H * ia; dy = 0; dx = (W - dw) / 2; }
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.getContext("2d")?.scale(dpr, dpr);
    }
    drawFrame(frameRef.current);
  }, [drawFrame]);

  useEffect(() => {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = frameUrl(i);
      img.onload = () => {
        loadedRef.current++;
        onLoadProgress?.(Math.round((loadedRef.current / TOTAL_FRAMES) * 100));
        if (loadedRef.current === 1) { resizeCanvas(); drawFrame(0); }
        if (loadedRef.current === TOTAL_FRAMES) onLoadComplete?.();
      };
      imagesRef.current[i] = img;
    }
  }, [drawFrame, resizeCanvas, onLoadProgress, onLoadComplete]);

  useEffect(() => {
    const obs = new ResizeObserver(resizeCanvas);
    if (canvasRef.current?.parentElement) obs.observe(canvasRef.current.parentElement);
    return () => obs.disconnect();
  }, [resizeCanvas]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const card = cardRef.current;
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafRef.current); };
  }, []);

  /* ── GSAP: ONLY scroll-driven card sequence ──────────────────── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      /* hide card contents — NOT the hero text (CSS animations handle that) */
      gsap.set(".ch-card",         { y: window.innerHeight + 280 });
      gsap.set(".ch-canvas-layer", { autoAlpha: 0 });
      gsap.set(".ch-right-col",    { autoAlpha: 0, x: 24 });
      gsap.set([".ch-left-1",".ch-left-2",".ch-left-3"], { autoAlpha: 0 });
      gsap.set([".ch-badge-1",".ch-badge-2",".ch-badge-3"], { autoAlpha: 0 });
      gsap.set(".ch-card-topbar",  { autoAlpha: 0 });
      gsap.set(".ch-chapter",      { autoAlpha: 0 });
      gsap.set(".ch-cta",          { autoAlpha: 0, scale: 0.88, filter: "blur(28px)" });
      gsap.set(".ch-card-initial", { autoAlpha: 1 });

      const cp = { frame: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=7000",
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          onUpdate(self) {
            if (barRef.current) barRef.current.style.width = `${self.progress * 100}%`;
          },
        },
      });

      /* ① bg fades, card rises */
      tl.to([".ch-hero-text", ".ch-grid"],
            { scale: 1.1, filter: "blur(24px)", opacity: 0, ease: "power2.inOut", duration: 2 }, 0)
        .to(".ch-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)

      /* ② card expands full screen */
        .to(".ch-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.6 })

      /* ③ card contents appear */
        .to(".ch-card-topbar",  { autoAlpha: 1, duration: 0.8 }, "+=0.1")
        .to(".ch-card-initial", { autoAlpha: 0, duration: 0.6 }, "<")
        .to(".ch-canvas-layer", { autoAlpha: 1, duration: 1.0 }, "<")
        .to(".ch-chapter",      { autoAlpha: 1, duration: 0.7 }, "<")
        .to(".ch-right-col",    { autoAlpha: 1, x: 0, duration: 1.2, ease: "expo.out" }, "<")

      /* ── Ch1: The Reveal (frames 0-79) ── */
        .fromTo(".ch-left-1",
          { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "expo.out", duration: 1.0 })
        .to(cp, {
          frame: 79, duration: 1.5, ease: "none",
          onUpdate() { frameRef.current = Math.round(cp.frame); drawFrame(frameRef.current); },
        }, "<")
        .fromTo(".ch-badge-1",
          { autoAlpha: 0, y: 24, scale: 0.92 },
          { autoAlpha: 1, y: 0,  scale: 1, ease: "back.out(1.4)", duration: 0.55 }, "<+=0.4")
        .to(".ch-badge-1", { autoAlpha: 0, y: -18, duration: 0.35, ease: "power2.in" })

      /* Ch1 → Ch2 */
        .to(".ch-left-1", { autoAlpha: 0, x: -30, duration: 0.5, ease: "power2.in" })
        .fromTo(".ch-left-2",
          { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "expo.out", duration: 1.0 }, ">-=0.1")

      /* ── Ch2: No Road. No Rules. (frames 80-159) ── */
        .to(cp, {
          frame: 159, duration: 1.5, ease: "none",
          onUpdate() { frameRef.current = Math.round(cp.frame); drawFrame(frameRef.current); },
        }, "<")
        .fromTo(".ch-badge-2",
          { autoAlpha: 0, y: 24, scale: 0.92 },
          { autoAlpha: 1, y: 0,  scale: 1, ease: "back.out(1.4)", duration: 0.55 }, "<+=0.4")
        .to(".ch-badge-2", { autoAlpha: 0, y: -18, duration: 0.35, ease: "power2.in" })

      /* Ch2 → Ch3 */
        .to(".ch-left-2", { autoAlpha: 0, x: -30, duration: 0.5, ease: "power2.in" })
        .fromTo(".ch-left-3",
          { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "expo.out", duration: 1.0 }, ">-=0.1")

      /* ── Ch3: 130 Horses. Zero Limits. (frames 160-239) ── */
        .to(cp, {
          frame: TOTAL_FRAMES - 1, duration: 1.3, ease: "none",
          onUpdate() { frameRef.current = Math.round(cp.frame); drawFrame(frameRef.current); },
        }, "<")
        .fromTo(".ch-badge-3",
          { autoAlpha: 0, y: 24, scale: 0.92 },
          { autoAlpha: 1, y: 0,  scale: 1, ease: "back.out(1.4)", duration: 0.55 }, "<+=0.4")
        .to(".ch-badge-3", { autoAlpha: 0, y: -18, duration: 0.35, ease: "power2.in" })

      /* ④ canvas → CTA */
        .to({}, { duration: 0.6 })
        .to([".ch-canvas-layer",".ch-left-3",".ch-right-col",".ch-chapter",".ch-card-topbar"],
            { autoAlpha: 0, scale: 0.96, duration: 0.9, ease: "power2.in" })
        .set(".ch-hero-text", { autoAlpha: 0 })
        .to(".ch-cta", { autoAlpha: 1, scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 2 })

      /* ⑤ card pullback */
        .to(".ch-card",
            { width: "90vw", height: "86vh", borderRadius: "32px", ease: "expo.inOut", duration: 2 })

      /* ⑥ card exits up */
        .to(".ch-card",
            { y: -(window.innerHeight + 320), ease: "power3.in", duration: 1.5 });

    }, el);

    return () => ctx.revert();
  }, [drawFrame]);

  /* ── JSX ───────────────────────────────────────────────────── */
  return (
    <div
      ref={containerRef}
      className={cn("relative w-screen h-screen overflow-hidden flex items-center justify-center bg-[#0a0a0a]", className)}
      style={{ perspective: "1600px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="ch-film-grain" aria-hidden />
      <div className="ch-grid absolute inset-0 z-0 pointer-events-none opacity-50" aria-hidden />

      {/* ══ HERO TEXT — CSS animations, always visible ═══════════ */}
      <div className="ch-hero-text absolute z-10 flex flex-col items-center justify-center text-center w-full px-4 select-none pointer-events-none">

        <div className="ch-tagline-1 flex items-center gap-3 mb-6">
          <div className="w-6 h-[1px] bg-white/20" />
          <p className="text-white/30 text-[10px] tracking-[0.55em] uppercase font-light">Mahindra · Since 1947</p>
          <div className="w-6 h-[1px] bg-white/20" />
        </div>

        <div className="overflow-hidden mb-1">
          <h1 className="ch-tagline-1 font-bebas text-white text-[14vw] md:text-[11vw] leading-none tracking-tight"
              style={{ animationDelay: "0.35s" }}>
            Born for
          </h1>
        </div>

        <div className="overflow-hidden mb-1">
          <h1 className="ch-clip font-bebas ch-text-gold text-[20vw] md:text-[16vw] leading-none tracking-tighter">
            THAR
          </h1>
        </div>

        <div className="overflow-hidden">
          <h2 className="ch-tagline-2 font-bebas text-white/55 text-[8vw] md:text-[5.5vw] leading-none tracking-tight">
            the impossible.
          </h2>
        </div>

        <p className="ch-sub-copy text-white/30 text-xs md:text-sm font-light tracking-[0.1em] mt-6 max-w-sm leading-relaxed">
          Seven decades of legend. Reimagined for those who refuse to stay on the road.
        </p>

        <div className="ch-scroll-hint mt-10 flex flex-col items-center gap-2">
          <span className="text-white/20 text-[9px] tracking-[0.4em] uppercase">Scroll to discover</span>
          <div className="ch-scroll-line w-[1px] h-8 bg-gradient-to-b from-[#e8c14c]/50 to-transparent" />
        </div>
      </div>

      {/* ══ CINEMATIC CARD (z-20) ════════════════════════════════ */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div
          ref={cardRef}
          className="ch-card relative overflow-hidden pointer-events-auto w-[90vw] md:w-[84vw] h-[86vh] rounded-[32px] md:rounded-[40px]"
        >
          <div className="ch-sheen" aria-hidden />

          {/* top header bar */}
          <div className="ch-card-topbar absolute top-0 left-0 right-0 z-30 ch-card-hdr flex items-center justify-between px-7 md:px-10 py-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-[1px] bg-[#e8c14c]/40" />
              <span className="text-white/35 text-[9px] tracking-[0.45em] uppercase font-light">Mahindra Thar</span>
            </div>
            <span className="font-bebas text-white/20 text-sm tracking-[0.3em]">ROXX EDITION &nbsp;·&nbsp; 2025</span>
            <div className="flex items-center gap-3">
              <span className="text-white/35 text-[9px] tracking-[0.45em] uppercase font-light">4×4 AWD</span>
              <div className="w-4 h-[1px] bg-[#e8c14c]/40" />
            </div>
          </div>

          {/* card initial placeholder */}
          <div className="ch-card-initial absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
            <p className="text-white/10 text-[9px] tracking-[0.5em] uppercase mb-4">Mahindra</p>
            <span className="font-bebas text-white/[0.05] text-[22vw] leading-none tracking-tighter select-none">THAR</span>
            <div className="absolute bottom-10 flex items-center gap-2">
              <div className="w-4 h-[1px] bg-[#e8c14c]/15" />
              <span className="text-white/15 text-[9px] tracking-[0.4em] uppercase">Scroll to reveal</span>
              <div className="w-4 h-[1px] bg-[#e8c14c]/15" />
            </div>
          </div>

          {/* canvas */}
          <div className="ch-canvas-layer absolute inset-0 z-0">
            <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
            <div className="ch-vignette absolute inset-0 pointer-events-none" />
          </div>

          {/* chapter indicator */}
          <div className="ch-chapter absolute z-30 top-16 md:top-20 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
            {[["01","The Reveal"],["02","The Capability"],["03","The Power"]].map(([n,label]) => (
              <div key={n} className="flex items-center gap-1.5 px-3 py-1.5 ch-chapter-pill">
                <span className="text-[#e8c14c]/55 text-[8px] font-bold tabular-nums">{n}</span>
                <span className="text-white/35 text-[8px] tracking-[0.18em] uppercase hidden sm:inline">{label}</span>
              </div>
            ))}
          </div>

          {/* Ch1 left: A silhouette like no other */}
          <div className="ch-left-1 absolute z-20 left-8 md:left-12 lg:left-16 bottom-16 md:bottom-20 max-w-[270px] md:max-w-xs">
            <p className="text-[#e8c14c] text-[9px] tracking-[0.45em] uppercase mb-2 font-light">Chapter 01</p>
            <h3 className="font-bebas text-white text-4xl md:text-5xl lg:text-6xl leading-none tracking-tight mb-3">
              A silhouette<br/>like no other.
            </h3>
            <div className="w-8 h-[1px] bg-[#e8c14c]/40 mb-3" />
            <p className="text-white/40 text-xs leading-relaxed font-light">
              The Thar Roxx inherits seven decades of rugged heritage and transforms it into a modern icon. Bold round headlamps. A stance that owns every road it enters.
            </p>
          </div>

          {/* Ch2 left: No road. No rules. */}
          <div className="ch-left-2 absolute z-20 left-8 md:left-12 lg:left-16 bottom-16 md:bottom-20 max-w-[270px] md:max-w-xs">
            <p className="text-[#e8c14c] text-[9px] tracking-[0.45em] uppercase mb-2 font-light">Chapter 02</p>
            <h3 className="font-bebas text-white text-4xl md:text-5xl lg:text-6xl leading-none tracking-tight mb-3">
              No road.<br/>No rules.
            </h3>
            <div className="w-8 h-[1px] bg-[#e8c14c]/40 mb-3" />
            <p className="text-white/40 text-xs leading-relaxed font-light">
              4×4 Shift-on-Fly with 2H, 4H, and 4L modes. 800 mm wading depth. 226 mm ground clearance. Sand, mud, rock, river — nothing is out of reach.
            </p>
          </div>

          {/* Ch3 left: 130 Horses. Zero Limits. */}
          <div className="ch-left-3 absolute z-20 left-8 md:left-12 lg:left-16 bottom-16 md:bottom-20 max-w-[270px] md:max-w-xs">
            <p className="text-[#e8c14c] text-[9px] tracking-[0.45em] uppercase mb-2 font-light">Chapter 03</p>
            <h3 className="font-bebas text-white text-4xl md:text-5xl lg:text-6xl leading-none tracking-tight mb-3">
              130 horses.<br/>Zero limits.
            </h3>
            <div className="w-8 h-[1px] bg-[#e8c14c]/40 mb-3" />
            <p className="text-white/40 text-xs leading-relaxed font-light">
              The 2.0L mStallion TGDi delivers 300 Nm of torque and 130 BHP of raw, responsive, unapologetic force. This is what unstoppable feels like.
            </p>
          </div>

          {/* right stat column */}
          <div className="ch-right-col absolute z-20 right-8 md:right-12 lg:right-16 top-1/2 flex flex-col items-center gap-5 pointer-events-none"
               style={{ transform: "translateY(-50%)" }}>
            <div className="text-center">
              <p className="text-[#e8c14c] text-base leading-none mb-0.5">★★★★★</p>
              <p className="font-bebas text-white/80 text-2xl leading-none">5 STAR</p>
              <p className="text-white/25 text-[8px] tracking-[0.28em] uppercase">GNCAP Safety</p>
            </div>
            <div className="w-[1px] h-8 bg-gradient-to-b from-[#e8c14c]/20 to-transparent" />
            <div className="text-center">
              <p className="text-white/20 text-[8px] tracking-[0.35em] uppercase mb-0.5">Est.</p>
              <p className="font-bebas text-white/55 text-xl leading-none">1947</p>
            </div>
            <div className="w-[1px] h-8 bg-gradient-to-b from-transparent to-[#e8c14c]/20" />
            <div className="text-center">
              <p className="text-white/20 text-[8px] tracking-[0.3em] uppercase mb-0.5">Engine</p>
              <p className="font-bebas text-white/55 text-xl leading-none">2.0T</p>
              <p className="text-white/20 text-[8px] tracking-[0.18em]">mStallion</p>
            </div>
          </div>

          {/* badge 1: performance */}
          <div className="ch-badge ch-badge-1 absolute z-30 top-20 md:top-24 right-8 md:right-14 flex items-start gap-3 px-4 py-3 rounded-2xl pointer-events-none max-w-[200px]">
            <div className="w-9 h-9 rounded-full bg-[#e8c14c]/10 border border-[#e8c14c]/25 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-[#e8c14c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-[#e8c14c]/65 text-[8px] tracking-[0.35em] uppercase mb-0.5">Performance</p>
              <p className="font-bebas text-white text-2xl leading-none">130 BHP</p>
              <p className="text-white/35 text-[9px] leading-tight mt-0.5">2.0L mStallion Turbo<br/>300 Nm peak torque</p>
            </div>
          </div>

          {/* badge 2: all-terrain */}
          <div className="ch-badge ch-badge-2 absolute z-30 bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 flex items-start gap-3 px-4 py-3 rounded-2xl pointer-events-none max-w-[220px]">
            <div className="w-9 h-9 rounded-full bg-[#e8c14c]/10 border border-[#e8c14c]/25 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-[#e8c14c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <p className="text-[#e8c14c]/65 text-[8px] tracking-[0.35em] uppercase mb-0.5">All-Terrain</p>
              <p className="font-bebas text-white text-2xl leading-none">4×4 SOF</p>
              <p className="text-white/35 text-[9px] leading-tight mt-0.5">2H · 4H · 4L modes<br/>800 mm wading depth</p>
            </div>
          </div>

          {/* badge 3: clearance */}
          <div className="ch-badge ch-badge-3 absolute z-30 top-20 md:top-24 left-8 md:left-14 flex items-start gap-3 px-4 py-3 rounded-2xl pointer-events-none max-w-[210px]">
            <div className="w-9 h-9 rounded-full bg-[#e8c14c]/10 border border-[#e8c14c]/25 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-[#e8c14c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <div>
              <p className="text-[#e8c14c]/65 text-[8px] tracking-[0.35em] uppercase mb-0.5">Clearance</p>
              <p className="font-bebas text-white text-2xl leading-none">226 mm</p>
              <p className="text-white/35 text-[9px] leading-tight mt-0.5">Approach angle 41.8°<br/>Nothing stands in the way</p>
            </div>
          </div>

          {/* CTA — inside card, z-40 */}
          <div className="ch-cta absolute inset-0 z-40 flex flex-col items-center justify-center text-center px-6 pointer-events-auto">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-[1px] bg-[#e8c14c]/50" />
              <p className="text-[#e8c14c]/65 text-[9px] tracking-[0.55em] uppercase font-light">Experience the Legend</p>
              <div className="w-8 h-[1px] bg-[#e8c14c]/50" />
            </div>

            <h2 className="font-bebas ch-text-silver text-[12vw] md:text-[8.5vw] leading-none tracking-tight mb-2">
              THE NEW THAR
            </h2>
            <p className="text-white/35 text-xs md:text-sm tracking-[0.3em] uppercase mb-5">
              Roxx Edition &nbsp;·&nbsp; 2025
            </p>

            <p className="text-white/35 text-sm md:text-base font-light leading-relaxed max-w-lg mb-8">
              The most capable. The most connected. The most adventurous Thar ever built.
              Five stars of safety. Seven decades of unstoppable DNA.
            </p>

            <div className="flex items-center gap-5 md:gap-8 mb-10 flex-wrap justify-center">
              {[
                ["★★★★★", "5-Star GNCAP"],
                ["◆", "Most Awarded SUV"],
                ["◆", "75+ Years of Heritage"],
              ].map(([icon, label]) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-[#e8c14c] text-xs">{icon}</span>
                  <span className="text-white/28 text-[9px] tracking-[0.22em] uppercase">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <button onClick={onBookTestDrive} className="ch-btn-primary text-xs tracking-[0.22em] uppercase px-10 py-4">
                Book a Test Drive
              </button>
              <button onClick={onConfigure} className="ch-btn-ghost text-xs tracking-[0.22em] uppercase px-10 py-4">
                Configure Yours
              </button>
            </div>

            <p className="text-white/18 text-[10px] tracking-widest">
              Starting at&nbsp;
              <span className="text-[#e8c14c]/55 font-semibold">₹12.99 Lakh*</span>
              &nbsp;&nbsp;·&nbsp;&nbsp;*Ex-showroom, Delhi
            </p>
          </div>

          {/* scroll progress bar */}
          <div className="absolute z-30 bottom-0 left-0 right-0 h-[2px] bg-white/[0.04]">
            <div ref={barRef} className="h-full bg-gradient-to-r from-[#e8c14c]/50 to-[#e8c14c]"
                 style={{ width: "0%", transition: "none" }} />
          </div>
        </div>
      </div>
    </div>
  );
}