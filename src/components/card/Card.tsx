"use client";

import * as Icons from "lucide-react";
import cardsDataJSON from "@/data/kpi.json";
import { useRef, useState, useEffect } from "react";

type CardData = {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: keyof typeof Icons;
  description: string;
};

const cards: CardData[] = (cardsDataJSON.cardsDataJSON as CardData[]).map((card) => ({
  ...card,
  trend: card.trend === "up" ? "up" : "down",
  icon: card.icon as keyof typeof Icons,
}));

const theme = {
  dark: {
    borderGradient:
      "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 35%, transparent 100%)",
    bodyBg:
      "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 55%, rgba(0,0,0,0.22) 100%)",
    boxShadow: `
      0 0 0 1px rgba(255,255,255,0.07),
      0 2px 6px rgba(0,0,0,0.35),
      0 14px 40px rgba(0,0,0,0.55),
      0 32px 64px rgba(0,0,0,0.28),
      inset 0 1px 0 rgba(255,255,255,0.16),
      inset 1px 0 0 rgba(255,255,255,0.07)
    `,
    topStreak:
      "linear-gradient(90deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.10) 45%, transparent 100%)",
    leftStreak:
      "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
    cornerGlare:
      "radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 70%)",
    label:   "rgba(255,255,255,0.50)",
    value:   "rgba(255,255,255,0.93)",
    desc:    "rgba(255,255,255,0.32)",
    upColor: "#86efac",
    upBg:    "rgba(134,239,172,0.10)",
    downColor: "#fca5a5",
    downBg:  "rgba(252,165,165,0.10)",
    upBorderTop:   "rgba(134,239,172,0.55)",
    downBorderTop: "rgba(252,165,165,0.55)",
    arrowBg:    "rgba(0,0,0,0.50)",
    arrowHover: "rgba(0,0,0,0.80)",
    arrowIcon:  "#e2e8f0",
  },

 light: {
  borderGradient:
    "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(220,215,255,0.6) 40%, rgba(180,170,240,0.15) 100%)",
  bodyBg:
    "linear-gradient(160deg, rgba(255,255,255,0.62) 0%, rgba(238,236,255,0.55) 50%, rgba(210,205,255,0.35) 100%)",
  boxShadow: `
    0 0 0 1px rgba(139,120,255,0.18),
    0 1px 2px rgba(100,80,200,0.10),
    0 4px 12px rgba(100,80,200,0.14),
    0 16px 40px rgba(80,60,180,0.16),
    0 32px 56px rgba(60,40,160,0.08),
    inset 0 1.5px 0 rgba(255,255,255,1),
    inset 1px 0 0 rgba(255,255,255,0.85)
  `,
  topStreak:
    "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.70) 40%, transparent 100%)",
  leftStreak:
    "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.30) 55%, transparent 100%)",
  cornerGlare:
    "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.4) 40%, transparent 70%)",

  label:         "rgba(10,5,30,0.75)",
  value:         "rgba(5,2,20,0.95)",
  desc:          "rgba(10,5,30,0.55)",

  upColor:       "#15803d",
  upBg:          "rgba(21,128,61,0.10)",
  downColor:     "#b91c1c",
  downBg:        "rgba(185,28,28,0.09)",

  upBorderTop:   "rgba(21,128,61,0.55)",
  downBorderTop: "rgba(185,28,28,0.50)",

  arrowBg:    "rgba(255,255,255,0.82)",
  arrowHover: "rgba(255,255,255,1)",
  arrowIcon:  "#0a0520",
},
};

export function CardsData() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth]   = useState(0);
  const [isDark, setIsDark]         = useState(false);

  // Sync with Tailwind dark class
  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Carousel width on mobile
  useEffect(() => {
    const onResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      setCardWidth(w < 768 ? w - 16 : 0);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scroll = (dir: "left" | "right") => {
    containerRef.current?.scrollBy({
      left: dir === "left" ? -(cardWidth + 16) : cardWidth + 16,
      behavior: "smooth",
    });
  };

  const t = isDark ? theme.dark : theme.light;

  return (
    <div className="relative w-full">

      {/* Mobile carousel arrows */}
      <div className="md:hidden">
        {(["left", "right"] as const).map((dir) => (
          <button
            key={dir}
            onClick={() => scroll(dir)}
            className="absolute top-1/2 -translate-y-1/2 z-10 p-2 rounded-full shadow-md"
            style={{ [dir]: 0, background: t.arrowBg, transition: "background 0.2s" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = t.arrowHover)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = t.arrowBg)
            }
          >
            {dir === "left"
              ? <Icons.ChevronLeft  className="w-5 h-5" style={{ color: t.arrowIcon }} />
              : <Icons.ChevronRight className="w-5 h-5" style={{ color: t.arrowIcon }} />
            }
          </button>
        ))}
      </div>

      {/* Cards grid / carousel */}
      <div
        ref={containerRef}
        className={`gap-4 ${
          cardWidth > 0
            ? "flex overflow-x-auto scroll-smooth scrollbar-hide"
            : "grid md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3"
        }`}
      >
        {cards.map((card) => {
          const Icon     = Icons[card.icon] as React.FC<React.SVGProps<SVGSVGElement>>;
          const isUp     = card.trend === "up";
          const topColor = isUp ? t.upBorderTop : t.downBorderTop;

          return (
            <div
              key={card.id}
              style={{
                perspective: "1000px",
                ...(cardWidth > 0 ? { width: cardWidth, flexShrink: 0 } : {}),
              }}
            >
              <div
                className="relative rounded-xl p-px overflow-hidden h-36 sm:h-40"
                style={{
                  transform: "rotateX(2deg) rotateY(-1.2deg)",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.35s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "rotateX(0deg) rotateY(0deg) translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "rotateX(2deg) rotateY(-1.2deg)";
                }}
              >

                {/* 1 — Gradient border ring */}
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none z-0"
                  style={{ background: t.borderGradient }}
                />

                {/* 2 — Frosted glass body */}
                <div
                  className="relative z-10 h-full rounded-xl overflow-hidden flex flex-col justify-between p-4"
                  style={{
                    background: t.bodyBg,
                    backdropFilter: "blur(28px) saturate(200%) brightness(1.04)",
                    WebkitBackdropFilter: "blur(28px) saturate(200%) brightness(1.04)",
                    boxShadow: t.boxShadow,
                    borderTop: `3px solid ${topColor}`,
                    transition: "background 0.3s ease, box-shadow 0.3s ease",
                  }}
                >

                  {/* Top gloss streak */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                    style={{ background: t.topStreak }}
                  />
                  {/* Left gloss streak */}
                  <div
                    className="absolute top-0 left-0 bottom-0 w-px pointer-events-none"
                    style={{ background: t.leftStreak }}
                  />
                  {/* Corner glare blob */}
                  <div
                    className="absolute top-1 left-2 w-10 h-10 pointer-events-none rounded-full"
                    style={{ background: t.cornerGlare, filter: "blur(7px)" }}
                  />

                  {/* Label + Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: t.label }}>
                      {card.label}
                    </span>
                    <Icon className="w-5 h-5" style={{ color: t.label }} />
                  </div>

                  {/* Value + badge + description */}
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="text-lg md:text-xl font-semibold tracking-tight"
                      style={{ color: t.value }}
                    >
                      {card.value}
                    </span>
                    <span
                      className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md w-fit"
                      style={{
                        color:      isUp ? t.upColor   : t.downColor,
                        background: isUp ? t.upBg      : t.downBg,
                      }}
                    >
                      {isUp ? "▲" : "▼"} {card.change}
                    </span>
                    <span className="text-xs" style={{ color: t.desc }}>
                      {card.description}
                    </span>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}