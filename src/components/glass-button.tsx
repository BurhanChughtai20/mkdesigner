"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

const themes = {
  dark: {
    bg: "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.22) 100%)",
    shadow: "0 2px 6px rgba(0,0,0,0.35)",
    text: "rgba(255,255,255,0.85)",
    icon: "rgba(255,255,255,0.65)",
  },
  light: {
    bg: "linear-gradient(160deg, rgba(255,255,255,0.6) 0%, rgba(238,236,255,0.58) 50%)",
    shadow: "0 2px 6px rgba(100,80,200,0.12)",
    text: "rgba(5,2,20,0.88)",
    icon: "rgba(10,5,30,0.6)",
  },
};

export function GlassButton({ isDark, onClick }: { isDark: boolean; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const t = isDark ? themes.dark : themes.light;

  return (
    <div
      className="relative rounded-xl p-px cursor-pointer select-none"
      style={{
        transform: hovered ? "translateY(-2px)" : "translateY(0px)",
        transition: "transform 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div
        className="relative flex items-center gap-2 px-4 py-2 rounded-xl"
        style={{
          background: t.bg,
          boxShadow: t.shadow,
          color: t.text,
        }}
      >
        <FileText className="w-4 h-4" style={{ color: t.icon }} />
        <span className="text-sm font-semibold">Campaign Form</span>
      </div>
    </div>
  );
}