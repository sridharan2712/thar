import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "../context/UIContext";

export default function LoginModal() {
  const { modal, closeModal, showToast } = useUI();
  const open = modal === "login";

  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  function handleClose() {
    closeModal();
    setTimeout(() => {
      setEmail(""); setPassword(""); setName("");
      setTab("login");
    }, 400);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
    setLoading(false);
    handleClose();
    if (tab === "login") {
      showToast(`Welcome back! Logged in as ${email}`, "success");
    } else {
      showToast(`Account created! Welcome to THAR, ${name.split(" ")[0]}`, "success");
    }
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
              className="relative w-full max-w-md bg-[#0f0f0f] border border-white/10 p-8 md:p-10 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                className="absolute top-5 right-5 text-white/30 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <p className="text-brand text-[10px] tracking-[0.4em] uppercase mb-2 font-light">Mahindra Thar</p>
              <h2 className="font-bebas text-white text-4xl tracking-wide mb-6">
                {tab === "login" ? "Welcome Back" : "Join the Legend"}
              </h2>

              {/* Tabs */}
              <div className="flex border-b border-white/10 mb-8">
                {(["login", "register"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`text-xs tracking-[0.2em] uppercase pb-3 mr-8 border-b-2 transition-colors duration-200 ${
                      tab === t ? "border-brand text-white" : "border-transparent text-white/30 hover:text-white/60"
                    }`}
                  >
                    {t === "login" ? "Sign In" : "Register"}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.form
                  key={tab}
                  initial={{ opacity: 0, x: tab === "login" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {tab === "register" && (
                    <div>
                      <label className="block text-white/40 text-[10px] tracking-[0.2em] uppercase mb-2">Full Name</label>
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Rahul Sharma"
                        className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-brand/50 transition-colors"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-white/40 text-[10px] tracking-[0.2em] uppercase mb-2">Email</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-brand/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-white/40 text-[10px] tracking-[0.2em] uppercase mb-2">Password</label>
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-brand/50 transition-colors"
                    />
                  </div>

                  {tab === "login" && (
                    <button type="button" className="text-brand/70 hover:text-brand text-xs tracking-wide transition-colors">
                      Forgot password?
                    </button>
                  )}

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
                        {tab === "login" ? "Signing in..." : "Creating account..."}
                      </>
                    ) : (
                      tab === "login" ? "Sign In" : "Create Account"
                    )}
                  </button>
                </motion.form>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}