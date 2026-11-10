import { motion } from "framer-motion";

const row1 = ["Born Unstoppable", "4×4 All Terrain", "2.0L mStallion Turbo", "130 BHP", "5★ GNCAP", "226mm Ground Clearance", "800mm Wading Depth", "Shift-on-Fly 4WD"];
const row2 = ["Thar Roxx Edition", "300 Nm Torque", "Ladder Frame Chassis", "Coil Spring Suspension", "360° Camera", "Harman Kardon", "AdrenoX Connect", "ADAS Suite"];

function MarqueeRow({ items, direction = 1, duration = 28 }: { items: string[]; direction?: 1 | -1; duration?: number }) {
  const repeated = [...items, ...items, ...items];
  return (
    <div className="flex overflow-hidden relative">
      <motion.div
        animate={{ x: direction === 1 ? ["0%", "-33.33%"] : ["-33.33%", "0%"] }}
        transition={{ repeat: Infinity, duration, ease: "linear" }}
        className="flex items-center gap-0 shrink-0 whitespace-nowrap"
      >
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase px-5 md:px-7 font-medium">
              {item}
            </span>
            <span className="opacity-30 text-[8px]">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function MarqueeBanner() {
  return (
    <div
      className="relative overflow-hidden py-5 border-y"
      style={{
        background: "linear-gradient(135deg, rgba(232,193,76,0.08) 0%, rgba(232,193,76,0.04) 50%, rgba(232,193,76,0.08) 100%)",
        borderColor: "rgba(232,193,76,0.15)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #0a0a0a, transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #0a0a0a, transparent)" }} />

      <div className="flex flex-col gap-2">
        <div className="text-brand/80">
          <MarqueeRow items={row1} direction={1} duration={30} />
        </div>
        <div className="text-white/30">
          <MarqueeRow items={row2} direction={-1} duration={25} />
        </div>
      </div>
    </div>
  );
}