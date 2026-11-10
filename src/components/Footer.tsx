import { useUI } from "../context/UIContext";

const footerLinks: Record<string, { label: string; action: "book" | "scroll" | "toast"; target?: string }[]> = {
  "Thar": [
    { label: "Thar 3-Door", action: "toast" },
    { label: "Thar Roxx", action: "scroll", target: "#features" },
    { label: "Thar.E (EV)", action: "toast" },
    { label: "Heritage Edition", action: "toast" },
  ],
  "Explore": [
    { label: "Features", action: "scroll", target: "#features" },
    { label: "Specifications", action: "scroll", target: "#specs" },
    { label: "Gallery", action: "scroll", target: "#gallery" },
    { label: "Colors", action: "toast" },
  ],
  "Company": [
    { label: "About Mahindra", action: "toast" },
    { label: "Press", action: "toast" },
    { label: "Careers", action: "toast" },
    { label: "Investors", action: "toast" },
  ],
  "Support": [
    { label: "Dealers", action: "toast" },
    { label: "Test Drive", action: "book" },
    { label: "Service", action: "toast" },
    { label: "Contact Us", action: "toast" },
  ],
};

export default function Footer() {
  const { openModal, showToast } = useUI();

  function handleClick(e: React.MouseEvent, item: { label: string; action: string; target?: string }) {
    e.preventDefault();
    if (item.action === "book") {
      openModal("book");
    } else if (item.action === "scroll" && item.target) {
      document.querySelector(item.target)?.scrollIntoView({ behavior: "smooth" });
    } else {
      showToast(`${item.label} — coming soon!`, "info");
    }
  }

  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10 px-8 md:px-16 lg:px-24">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 mb-16">
        {Object.entries(footerLinks).map(([category, items]) => (
          <div key={category}>
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-5 font-light">{category}</p>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.label}>
                  <a
                    href="#"
                    onClick={(e) => handleClick(e, item)}
                    className="text-white/60 hover:text-white text-sm font-light transition-colors duration-200 relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-brand group-hover:w-full transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-bebas text-white/30 hover:text-brand text-2xl tracking-[0.3em] transition-colors"
        >
          THAR
        </button>
        <p className="text-white/20 text-xs font-light">
          © 2025 Mahindra & Mahindra Ltd. All rights reserved.
        </p>
        <div className="flex gap-6">
          {["Privacy", "Terms", "Cookies"].map((item) => (
            <a
              key={item}
              href="#"
              onClick={(e) => { e.preventDefault(); showToast(`${item} Policy — coming soon!`, "info"); }}
              className="text-white/30 hover:text-white/60 text-xs transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}