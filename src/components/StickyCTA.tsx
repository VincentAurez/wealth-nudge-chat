import { Calendar } from "lucide-react";

export function StickyCTA() {
  return (
    <div className="fixed bottom-4 inset-x-0 flex justify-center z-40">
      <a
        href="https://calendly.com/votre-conseiller/30min"
        target="_blank" 
        rel="noopener"
        className="px-4 py-3 rounded-full bg-[#d3381c] text-white font-medium shadow-lg flex items-center gap-2 animate-pulse"
      >
        <Calendar className="w-4 h-4" /> Prendre un rendez‑vous gratuit
      </a>
    </div>
  );
}