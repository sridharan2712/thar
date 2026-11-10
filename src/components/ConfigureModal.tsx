import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "../context/UIContext";

const colors = [
  { name: "Stealth Black", hex: "#1a1a1a", price: 0 },
  { name: "Rocky Beige", hex: "#c4a882", price: 0 },
  { name: "Everest White", hex: "#f0f0ec", price: 0 },
  { name: "Nebula Blue", hex: "#2d4a6e", price: 15000 },
  { name: "Crimson Red", hex: "#8b1a1a", price: 15000 },
  { name: "Olive Drab", hex: "#5c6b3a", price: 20000 },
];

const variants = [
  { name: "MX 5-Door", engine: "1.5L Diesel", price: 1299000, tag: "Base" },
  { name: "LX 5-Door Petrol AT", engine: "2.0L Petrol Turbo", price: 1699000, tag: "Popular" },
  { name: "LX 5-Door Diesel MT", engine: "2.2L Diesel", price: 1599000, tag: "" },
  { name: "LX 5-Door Diesel AT", engine: "2.2L Diesel Auto", price: 1799000, tag: "Premium" },
];

const addons = [
  { id: "sunroof", label: "Panoramic Sunroof", price: 45000 },
  { id: "sound", label: "Harman Kardon Sound", price: 35000 },
  { id: "orvm", label: "ORVM with Turn Indicators", price: 8000 },
  { id: "camera", label: "360° Surround Camera", price: 22000 },
];

function fmt(n: number) {
  return "₹" + (n / 100000).toFixed(2) + " L";
}

export default function ConfigureModal() {
  const { modal, closeModal, showToast } = useUI();
  const open = modal === "configure";

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function toggleAddon(id: string) {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }

  const total =
    variants[selectedVariant].price +
    colors[selectedColor].price +
    selectedAddons.reduce((sum, id) => {
      const a = addons.find((x) => x.id === id);
      return sum + (a?.price ?? 0);
    }, 0);

  async function handleOrder() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    closeModal();
    showToast(`Your ${variants[selectedVariant].name} in ${colors[selectedColor].name} is reserved!`, "success");
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed inset-0 z-[160] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-2xl bg-[#0f0f0f] border border-white/10 p-8 pointer-events-auto max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-5 right-5 text-white/30 hover:text-white transition-colors z-10"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <p className="text-brand text-[10px] tracking-[0.4em] uppercase mb-2 font-light">Build Yours</p>
              <h2 className="font-bebas text-white text-4xl tracking-wide mb-8">Configure Your Thar</h2>

              {/* Variant */}
              <div className="mb-8">
                <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-4">Select Variant</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {variants.map((v, i) => (
                    <button
                      key={v.name}
                      onClick={() => setSelectedVariant(i)}
                      className={`text-left p-4 border transition-all duration-200 relative ${
                        selectedVariant === i
                          ? "border-brand/60 bg-brand/5"
                          : "border-white/8 hover:border-white/20"
                      }`}
                    >
                      {v.tag && (
                        <span className="absolute top-3 right-3 bg-brand text-black text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5">
                          {v.tag}
                        </span>
                      )}
                      <p className="text-white text-sm font-medium">{v.name}</p>
                      <p className="text-white/40 text-xs mt-0.5">{v.engine}</p>
                      <p className="text-brand text-sm font-semibold mt-2">{fmt(v.price)}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="mb-8">
                <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-4">
                  Colour — <span className="text-white/70">{colors[selectedColor].name}</span>
                  {colors[selectedColor].price > 0 && (
                    <span className="text-brand ml-2">+₹{colors[selectedColor].price.toLocaleString()}</span>
                  )}
                </p>
                <div className="flex gap-3 flex-wrap">
                  {colors.map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(i)}
                      title={c.name}
                      className={`w-9 h-9 rounded-full border-2 transition-all duration-200 ${
                        selectedColor === i ? "border-brand scale-110" : "border-white/10 hover:border-white/30"
                      }`}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div className="mb-8">
                <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-4">Accessories & Add-ons</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addons.map((a) => {
                    const checked = selectedAddons.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        onClick={() => toggleAddon(a.id)}
                        className={`flex items-center justify-between p-4 border text-left transition-all duration-200 ${
                          checked ? "border-brand/60 bg-brand/5" : "border-white/8 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-4 h-4 border flex items-center justify-center shrink-0 ${checked ? "border-brand bg-brand" : "border-white/20"}`}>
                            {checked && (
                              <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </span>
                          <span className="text-white/80 text-sm">{a.label}</span>
                        </div>
                        <span className="text-white/40 text-xs">+₹{a.price.toLocaleString()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary & CTA */}
              <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-white/40 text-xs tracking-widest uppercase">Estimated Price</p>
                  <p className="font-bebas text-white text-4xl tracking-tight mt-0.5">{fmt(total)}</p>
                  <p className="text-white/20 text-[10px] mt-0.5">*Ex-showroom + selected options</p>
                </div>
                <button
                  onClick={handleOrder}
                  disabled={loading}
                  className="bg-brand text-black font-semibold text-xs tracking-[0.2em] uppercase px-8 py-4 hover:bg-white transition-colors duration-300 disabled:opacity-60 flex items-center gap-3 shrink-0"
                >
                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="block w-4 h-4 border-2 border-black/40 border-t-black rounded-full"
                      />
                      Reserving...
                    </>
                  ) : (
                    "Reserve Now"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}