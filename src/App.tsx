import { UIProvider } from "./context/UIContext";
import Toasts from "./components/Toasts";
import BookModal from "./components/BookModal";
import LoginModal from "./components/LoginModal";
import ConfigureModal from "./components/ConfigureModal";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MarqueeBanner from "./components/MarqueeBanner";
import Features from "./components/Features";
import TharSeen from "./components/TharSeen";
import Specs from "./components/Specs";
import Footer from "./components/Footer";

function AppInner() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <MarqueeBanner />
        <Features />
        <TharSeen />
        <Specs />
      </main>
      <Footer />
      {/* Global UI layers */}
      <BookModal />
      <LoginModal />
      <ConfigureModal />
      <Toasts />
    </div>
  );
}

export default function App() {
  return (
    <UIProvider>
      <AppInner />
    </UIProvider>
  );
}