import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useUI } from "../context/UIContext";

const heroMetrics = [
  { value: 130, unit: "BHP", label: "Max Power", sub: "@ 5000 rpm", color: "#e8c14c" },
  { value: 300, unit: "Nm", label: "Peak Torque", sub: "1750–3500 rpm", color: "#e8c14c" },
  { value: 226, unit: "mm", label: "Ground Clear.", sub: "Approach 41.8°", color: "#e8c14c" },
  { value: 800, unit: "mm", label: "Wading Depth", sub: "Water crossing", color: "#e8c14c" },
];

const specGroups = [
  {
    id: "engine",
    label: "Engine",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    specs: [
      { key: "Engine Type", value: "2.0L mStallion TGDi", bar: null },
      { key: "Displacement", value: "1997 cc", bar: null },
      { key: "Max Power", value: "130 BHP", bar: 75 },
      { key: "Max Torque", value: "300 Nm", bar: 82 },
      { key: "Transmission", value: "6-Speed MT / AT", bar: null },
      { key: "Fuel Type", value: "Petrol / Diesel", bar: null },
    ],
  },
  {
    id: "dimensions",
    label: "Dimensions",
    icon: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4",
    specs: [
      { key: "Length", value: "4428 mm", bar: 68 },
      { key: "Width", value: "1820 mm", bar: 55 },
      { key: "Height", value: "1840 mm", bar: 56 },
      { key: "Wheelbase", value: "2850 mm", bar: 80 },
      { key: "Kerb Weight", value: "1905 kg", bar: 60 },
      { key: "Seating", value: "5 Persons", bar: null },
    ],
  },
  {
    id: "performance",
    label: "Performance",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    specs: [
      { key: "Ground Clearance", value: "226 mm", bar: 88 },
      { key: "Wading Depth", value: "800 mm", bar: 95 },
      { key: "Approach Angle", value: "41.8°", bar: 78 },
      { key: "Departure Angle", value: "36.4°", bar: 70 },
      { key: "Ramp Breakover", value: "27.1°", bar: 62 },
      { key: "GNCAP Rating", value: "5-Star ★★★★★", bar: 100 },
    ],
  },
  {
    id: "drivetrain",
    label: "Drivetrain",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    specs: [
      { key: "Drive System", value: "4×4 Shift-on-Fly", bar: null },
      { key: "Transfer Case", value: "2H / 4H / 4L", bar: null },
      { key: "Suspension F", value: "Indep. Double Wishbone", bar: null },
      { key: "Suspension R", value: "Multi-link Coil", bar: null },
      { key: "Brakes F/R", value: "Disc / Disc", bar: null },
      { key: "Tyre Size", value: "255/65 R18", bar: null },
    ],
  },
];

function useCounter(target: number, inView: boolean, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => {
      let frame = 0;
      const total = 70;
      const ease = (t: number) => 1 - Math.pow(1 - t, 4);
      const timer = setInterval(() => {
        frame++;
        setCount(Math.round(ease(frame / total) * target));
        if (frame >= total) clearInterval(timer);
      }, 16);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(timeout);
  }, [inView, target, delay]);
  return count;
}

function MetricCard({ metric, index, inView }: { metric: typeof heroMetrics[0]; index: number; inView: boolean }) {
  const count = useCounter(metric.value, inView, index * 120);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className="relative group overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

      <div className="p-6 md:p-8">
        <p className="text-white/30 text-[10px] tracking-[0.35em] uppercase mb-3 font-light">{metric.label}</p>
        <div className="font-bebas leading-none mb-1">
          <span className="text-5xl md:text-6xl text-white tabular-nums">{count}</span>
          <span className="text-brand text-2xl md:text-3xl ml-1">{metric.unit}</span>
        </div>
        <p className="text-white/25 text-[10px] tracking-wide">{metric.sub}</p>

        {/* Animated progress bar */}
        <div className="mt-4 h-[2px] bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: "100%" } : {}}
            transition={{ duration: 1.2, delay: index * 0.1 + 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-brand/60 to-brand"
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand group-hover:w-full transition-all duration-500" />
    </motion.div>
  );
}

function SpecRow({ spec, index, inView }: { spec: typeof specGroups[0]["specs"][0]; index: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group py-4 border-b last:border-0 border-white/[0.05] hover:border-brand/15 transition-colors"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-white/35 text-xs font-light">{spec.key}</span>
        <span className="text-white/85 text-xs font-medium tracking-wide">{spec.value}</span>
      </div>
      {spec.bar !== null && (
        <div className="h-[2px] bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${spec.bar}%` } : {}}
            transition={{ duration: 0.8, delay: index * 0.05 + 0.2, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-brand/40 to-brand/80"
          />
        </div>
      )}
    </motion.div>
  );
}

export default function Specs() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeTab, setActiveTab] = useState("engine");
  const { openModal, showToast } = useUI();

  const activeGroup = specGroups.find((g) => g.id === activeTab)!;

  function handleBrochure() {
    showToast("Preparing brochure PDF…", "info");
    setTimeout(() => showToast("Thar_Roxx_Brochure.pdf downloaded!", "success"), 2200);
  }

  return (
    <section
      id="specs"
      className="py-28 md:py-36 px-8 md:px-16 lg:px-24"
      style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(232,193,76,0.04) 0%, #060606 55%)" }}
    >
      <div ref={ref}>
        {/* Header */}
        <div className="mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-8 h-[1px] bg-brand" />
            <p className="text-brand text-xs tracking-[0.35em] uppercase font-light">Technical Data</p>
          </motion.div>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-bebas text-white text-6xl md:text-8xl lg:text-9xl tracking-tight leading-none"
            >
              Specifications
            </motion.h2>
          </div>
        </div>

        {/* Hero metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-14">
          {heroMetrics.map((m, i) => (
            <MetricCard key={m.label} metric={m} index={i} inView={inView} />
          ))}
        </div>

        {/* Glass panel with tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(30px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Tab bar */}
          <div
            className="flex border-b border-white/[0.06]"
            style={{ background: "rgba(0,0,0,0.2)" }}
          >
            {specGroups.map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveTab(g.id)}
                className={`relative flex items-center gap-2 px-5 md:px-8 py-4 text-[10px] md:text-xs tracking-[0.25em] uppercase font-medium transition-colors duration-200 ${
                  activeTab === g.id ? "text-brand" : "text-white/30 hover:text-white/60"
                }`}
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={g.icon} />
                </svg>
                <span className="hidden sm:inline">{g.label}</span>

                {activeTab === g.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-brand"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Spec rows */}
          <div className="p-6 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid md:grid-cols-2 gap-x-16"
              >
                {activeGroup.specs.map((spec, i) => (
                  <SpecRow key={spec.key} spec={spec} index={i} inView={true} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Price CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 md:p-10 border border-white/[0.06] relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(232,193,76,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-brand/40 via-brand/10 to-transparent" />

          <div>
            <p className="text-white/30 text-[10px] tracking-[0.35em] uppercase mb-2">Starting Price</p>
            <p className="font-bebas text-white text-5xl md:text-6xl tracking-tight leading-none">
              ₹12.99 <span className="text-brand">Lakh</span>
            </p>
            <p className="text-white/20 text-[10px] tracking-widest mt-1">*Ex-showroom, Delhi</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => openModal("configure")}
              className="relative overflow-hidden group/btn bg-brand text-black text-xs tracking-[0.2em] uppercase font-semibold px-8 py-4 transition-all duration-300"
            >
              <span className="relative z-10">Configure Yours</span>
              <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300" />
            </button>
            <button
              onClick={handleBrochure}
              className="border border-white/15 text-white/70 hover:text-white hover:border-white/40 text-xs tracking-[0.2em] uppercase font-light px-8 py-4 transition-colors duration-300"
              style={{ backdropFilter: "blur(10px)" }}
            >
              Download Brochure
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}