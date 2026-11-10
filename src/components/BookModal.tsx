import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "../context/UIContext";

const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Chandigarh"];
const variants = ["Thar LX Petrol AT", "Thar LX Diesel MT", "Thar LX Diesel AT", "Thar MX Petrol MT", "Thar MX Diesel MT"];

export default function BookModal() {
  const { modal, closeModal, showToast } = useUI();
  const open = modal === "book";

  const [form, setForm] = useState({ name: "", phone: "", city: "", variant: "", date: "" });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setStep("success");
  }

  function handleClose() {
    closeModal();
    setTimeout(() => {
      setStep("form");
      setForm({ name: "", phone: "", city: "", variant: "", date: "" });
    }, 400);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed inset-0 z-[160] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-lg bg-[#0f0f0f] border border-white/10 p-8 md:p-10 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute top-5 right-5 text-white/30 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <AnimatePresence mode="wait">
                {step === "form" ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p className="text-brand text-[10px] tracking-[0.4em] uppercase mb-2 font-light">Mahindra Thar</p>
                    <h2 className="font-bebas text-white text-4xl tracking-wide mb-8">Book a Test Drive</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/40 text-[10px] tracking-[0.2em] uppercase mb-2">Full Name</label>
                          <input
                            required
                            value={form.name}
                            onChange={(e) => set("name", e.target.value)}
                            placeholder="Rahul Sharma"
                            className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-brand/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-white/40 text-[10px] tracking-[0.2em] uppercase mb-2">Phone</label>
                          <input
                            required
                            value={form.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-brand/50 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/40 text-[10px] tracking-[0.2em] uppercase mb-2">Preferred Variant</label>
                        <select
                          required
                          value={form.variant}
                          onChange={(e) => set("variant", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-brand/50 transition-colors appearance-none"
                        >
                          <option value="" disabled className="bg-black">Select a variant</option>
                          {variants.map((v) => <option key={v} value={v} className="bg-black">{v}</option>)}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/40 text-[10px] tracking-[0.2em] uppercase mb-2">City</label>
                          <select
                            required
                            value={form.city}
                            onChange={(e) => set("city", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-brand/50 transition-colors appearance-none"
                          >
                            <option value="" disabled className="bg-black">Select city</option>
                            {cities.map((c) => <option key={c} value={c} className="bg-black">{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-white/40 text-[10px] tracking-[0.2em] uppercase mb-2">Preferred Date</label>
                          <input
                            type="date"
                            required
                            value={form.date}
                            onChange={(e) => set("date", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-brand/50 transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand text-black font-semibold text-xs tracking-[0.2em] uppercase py-4 hover:bg-white transition-colors duration-300 disabled:opacity-60 flex items-center justify-center gap-3"
                      >
                        {loading ? (
                          <>
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              className="block w-4 h-4 border-2 border-black/40 border-t-black rounded-full"
                            />
                            Booking...
                          </>
                        ) : (
                          "Confirm Test Drive"
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-8 gap-5"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-16 h-16 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center"
                    >
                      <svg className="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <div>
                      <h3 className="font-bebas text-white text-4xl tracking-wide">Test Drive Booked!</h3>
                      <p className="text-white/50 text-sm mt-2 font-light">
                        Hey {form.name || "there"}! Our team in {form.city} will call you within 24 hours to confirm your slot.
                      </p>
                    </div>
                    <p className="text-brand text-xs tracking-widest uppercase">{form.variant}</p>
                    <button
                      onClick={handleClose}
                      className="bg-brand text-black text-xs tracking-[0.2em] uppercase font-semibold px-8 py-3 hover:bg-white transition-colors mt-2"
                    >
                      Done
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}