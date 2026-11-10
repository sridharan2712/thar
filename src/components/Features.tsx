import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, useSpring } from "framer-motion";

const features = [
  {
    number: "01",
    title: "Born for Battle",
    description: "Engineered with a ladder-frame chassis and three-link coil suspension for extreme off-road performance. The Thar conquers every terrain with unmatched composure.",
    stat: 800, unit: "mm", statLabel: "Wading Depth",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    accent: "from-brand/20 via-transparent to-transparent",
  },
  {
    number: "02",
    title: "Legendary Power",
    description: "The 2.0L mStallion TGDi petrol engine delivers 130 BHP and 300 Nm of torque — raw, responsive, relentless.",
    stat: 300, unit: "Nm", statLabel: "Peak Torque",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    accent: "from-orange-500/10 via-transparent to-transparent",
  },
  {
    number: "03",
    title: "Intelligent 4×4",
    description: "Shift-on-the-fly 4WD with 2H, 4H, and 4L modes. Conquer sand, mud, rock — and everything in between.",
    stat: null, unit: "4×4", statLabel: "All-Terrain",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    accent: "from-emerald-500/10 via-transparent to-transparent",
  },
  {
    number: "04",
    title: "5-Star Safety",
    description: "The Thar Roxx earned the maximum GNCAP rating — the safest SUV in its class, protecting what matters most.",
    stat: null, unit: "5★", statLabel: "GNCAP Safety",
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    accent: "from-purple-500/10 via-transparent to-transparent",
  },
];

function useCounter(target: number, inView: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView || target === 0) return;
    let frame = 0;
    const totalFrames = 80;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const timer = setInterval(() => {
      frame++;
      setCount(Math.round(easeOut(frame / totalFrames) * target));
      if (frame >= totalFrames) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return count;
}

function GlowOrb({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background: `radial-gradient(300px circle at ${mouseX}px ${mouseY}px, rgba(232,193,76,0.06), transparent 70%)`,
      }}
    />
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCounter(feature.stat ?? 0, inView);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 150, damping: 20 });
  const springY = useSpring(my, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
    setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
  }
  function onMouseLeave() { mx.set(0); my.set(0); }

  const displayStat = feature.stat ? (feature.stat < 10 ? feature.stat : count) : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 70 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="group relative cursor-pointer"
    >
      {/* Gradient border wrapper */}
      <div className="absolute inset-0 rounded-none bg-gradient-to-br from-white/10 via-white/[0.03] to-brand/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: 1 }} />
      <div
        className="relative overflow-hidden border border-white/[0.07] group-hover:border-transparent transition-colors duration-500"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Glow follower */}
        <GlowOrb mouseX={mouse.x} mouseY={mouse.y} />

        {/* Ghost number background */}
        <div className="absolute -right-4 -top-6 font-bebas text-[10rem] md:text-[13rem] leading-none text-white/[0.025] select-none pointer-events-none">
          {feature.number}
        </div>

        {/* Gradient accent */}
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} pointer-events-none`} />

        <div className="relative p-8 md:p-10">
          {/* Top row */}
          <div className="flex items-start justify-between mb-8">
            {/* Icon */}
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.04]">
              <svg className="w-5 h-5 text-brand/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
              </svg>
            </div>

            {/* Animated stat */}
            <div className="text-right">
              <div className="font-bebas leading-none text-5xl md:text-6xl text-white/90 tabular-nums">
                {displayStat !== null ? (
                  <>{displayStat}<span className="text-brand text-3xl ml-1">{feature.unit}</span></>
                ) : (
                  <span className="text-brand">{feature.unit}</span>
                )}
              </div>
              <p className="text-white/30 text-[10px] tracking-[0.25em] uppercase mt-1">{feature.statLabel}</p>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bebas text-white text-3xl md:text-4xl tracking-wide mb-3 group-hover:text-brand transition-colors duration-400">
            {feature.title}
          </h3>

          {/* Divider */}
          <div className="w-8 h-[1px] bg-brand/40 mb-4 group-hover:w-16 transition-all duration-500" />

          {/* Description */}
          <p className="text-white/45 text-sm leading-relaxed font-light">{feature.description}</p>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-brand via-brand/50 to-transparent group-hover:w-full transition-all duration-700" />
          <div className="absolute top-0 right-0 w-0 h-[1px] bg-gradient-to-l from-brand/30 to-transparent group-hover:w-1/2 transition-all duration-700 delay-100" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const headingRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headingRef, { once: true, margin: "-80px" });

  return (
    <section id="features" className="py-28 md:py-36 px-8 md:px-16 lg:px-24" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(232,193,76,0.03) 0%, #0a0a0a 60%)" }}>
      <div ref={headingRef} className="mb-16 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-8 h-[1px] bg-brand" />
          <p className="text-brand text-xs tracking-[0.35em] uppercase font-light">Built Different</p>
        </motion.div>
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: "100%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="font-bebas text-white text-6xl md:text-8xl lg:text-9xl tracking-tight leading-none"
          >
            Engineered for <span className="text-brand">Extremes</span>
          </motion.h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {features.map((f, i) => (
          <FeatureCard key={f.number} feature={f} index={i} />
        ))}
      </div>
    </section>
  );
}