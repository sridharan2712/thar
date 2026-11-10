import { useUI } from "../context/UIContext";
import { TharCinematicHero } from "./ui/cinematic-landing-hero";

export default function Hero() {
  const { openModal } = useUI();

  return (
    <TharCinematicHero
      onBookTestDrive={() => openModal("book")}
      onConfigure={() => openModal("configure")}
    />
  );
}