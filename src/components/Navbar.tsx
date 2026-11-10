import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "../context/UIContext";

const links = [
  { label: "Models", href: "#features" },
  { label: "Features", href: "#features" },
  { label: "Specs", href: "#specs" },
  { label: "Gallery", href: "#gallery" },
  { label: "Dealers", href: null },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openModal, showToast } = useUI();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLink(e: React.MouseEvent<HTMLAnchorElement>, href: string | null) {
    e.preventDefault();
    setMenuOpen(false);
    if (!href) {
      showToast("Dealer locator coming soon!", "info");
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-5 transition-all duration-500 ${
          scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
        }`}
      >
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="font-bebas text-white text-3xl tracking-[0.2em] hover:text-brand transition-colors duration-300"
        >
          THAR
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href ?? "#"}
              onClick={(e) => handleLink(e, link.href)}
              className="text-white/60 hover:text-white text-xs tracking-[0.2em] uppercase transition-colors duration-300 font-light relative group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-brand group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => openModal("login")}
            className="text-white/60 hover:text-white text-xs tracking-[0.2em] uppercase transition-colors duration-300 font-light"
          >
            Login
          </button>
          <button
            onClick={() => openModal("book")}
            className="bg-brand text-black text-xs tracking-[0.2em] uppercase font-semibold px-5 py-2.5 hover:bg-white transition-colors duration-300"
          >
            Book Now
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }} className="block w-6 h-[1px] bg-white origin-center" />
          <motion.span animate={{ opacity: menuOpen ? 0 : 1 }} className="block w-6 h-[1px] bg-white" />
          <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }} className="block w-6 h-[1px] bg-white origin-center" />
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center gap-8"
          >
            {links.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href ?? "#"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={(e) => handleLink(e, link.href)}
                className="font-bebas text-white text-5xl tracking-widest hover:text-brand transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: links.length * 0.07 }}
              onClick={() => { setMenuOpen(false); openModal("book"); }}
              className="bg-brand text-black text-sm tracking-[0.2em] uppercase font-semibold px-8 py-3 mt-4 hover:bg-white transition-colors"
            >
              Book Now
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}