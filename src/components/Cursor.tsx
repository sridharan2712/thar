import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(
        !!(target.closest("a") || target.closest("button"))
      );
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <>
      {/* Outer ring */}
      <motion.div
        animate={{
          x: pos.x - 20,
          y: pos.y - 20,
          scale: isHovering ? 1.8 : 1,
          opacity: isHovering ? 0.4 : 0.6,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25, mass: 0.5 }}
        className="fixed top-0 left-0 w-10 h-10 border border-brand/60 rounded-full pointer-events-none z-[200] mix-blend-difference"
      />
      {/* Inner dot */}
      <motion.div
        animate={{ x: pos.x - 3, y: pos.y - 3, scale: isHovering ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-brand rounded-full pointer-events-none z-[200]"
      />
    </>
  );
}