"use client"

import {
  Eye, MousePointerClick, Percent,
  ShoppingCart, DollarSign, TrendingUp,
} from "lucide-react"
import { useEffect, useState } from "react"

const iconMap: Record<string, React.ElementType> = {
  Eye, MousePointerClick, Percent, ShoppingCart, DollarSign, TrendingUp,
}

const cardsDataJSON = [
  { id: "impressions", label: "Impressions", value: "4,280,000", change: "+12.4%", trend: "up",   icon: "Eye",               percent: 95, color: "#818cf8" },
  { id: "clicks",      label: "Clicks",      value: "187,340",   change: "+8.1%",  trend: "up",   icon: "MousePointerClick", percent: 78, color: "#a5b4fc" },
  { id: "ctr",         label: "CTR",         value: "4.38%",     change: "-0.6%",  trend: "down", icon: "Percent",           percent: 45, color: "#6366f1" },
  { id: "conversions", label: "Conversions", value: "9,821",     change: "+19.3%", trend: "up",   icon: "ShoppingCart",      percent: 62, color: "#8b5cf6" },
  { id: "spend",       label: "Spend",       value: "$48,200",   change: "+5.2%",  trend: "up",   icon: "DollarSign",        percent: 55, color: "#a78bfa" },
  { id: "roas",        label: "ROAS",        value: "6.2x",      change: "+1.4x",  trend: "up",   icon: "TrendingUp",        percent: 88, color: "#7c3aed" },
]

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
    title:   "rgba(255,255,255,0.86)",
    label:   "rgba(255,255,255,0.50)",
    trackBg: "rgba(255,255,255,0.07)",
    upColor:   "#86efac",
    upBg:      "rgba(134,239,172,0.10)",
    downColor: "#fca5a5",
    downBg:    "rgba(252,165,165,0.10)",
    iconOpacity: "18",
    iconBorder:  "30",
    iconGlow:    "20",
    barGlow:     "90",
    backdropFilter: "blur(24px) saturate(180%)",
  },

 light: {
  borderGradient:
    "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(220,215,255,0.65) 40%, rgba(180,170,240,0.18) 100%)",
  bodyBg:
    "linear-gradient(160deg, rgba(255,255,255,0.60) 0%, rgba(238,236,255,0.58) 50%, rgba(210,205,255,0.38) 100%)",
  boxShadow: `
    0 0 0 1px rgba(139,120,255,0.18),
    0 1px 2px rgba(100,80,200,0.10),
    0 4px 14px rgba(100,80,200,0.15),
    0 18px 40px rgba(80,60,180,0.17),
    0 32px 56px rgba(60,40,160,0.08),
    inset 0 1.5px 0 rgba(255,255,255,1),
    inset 1px 0 0 rgba(255,255,255,0.85)
  `,
  topStreak:
    "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.70) 40%, transparent 100%)",
  leftStreak:
    "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.30) 55%, transparent 100%)",
  cornerGlare:
    "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 35%, transparent 70%)",

  // ✅ ALL TEXT: near-black, high contrast
  title:   "rgba(5,2,20,0.92)",
  label:   "rgba(10,5,30,0.72)",
  trackBg: "rgba(100,80,200,0.09)",

  upColor:   "#15803d",
  upBg:      "rgba(21,128,61,0.10)",
  downColor: "#b91c1c",
  downBg:    "rgba(185,28,28,0.09)",

  iconOpacity: "16",
  iconBorder:  "2a",
  iconGlow:    "1a",
  barGlow:     "70",
  backdropFilter: "blur(28px) saturate(200%) brightness(1.04)",
},
}

export function TrafficByWebsite() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"))
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  const t = isDark ? theme.dark : theme.light

  return (
    <div style={{ perspective: "1000px" }} className="h-full">
      <div
        className="relative h-full rounded-2xl p-px overflow-hidden"
        style={{
          transform: "rotateX(2deg) rotateY(-1.2deg)",
          transformStyle: "preserve-3d",
          transition: "transform 0.35s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform =
            "rotateX(0deg) rotateY(0deg) translateY(-4px)"
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform =
            "rotateX(2deg) rotateY(-1.2deg)"
        }}
      >
        {/* Gradient border ring */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-0"
          style={{ background: t.borderGradient }}
        />

        {/* Frosted glass body */}
        <div
          className="relative z-10 h-full rounded-2xl overflow-hidden"
          style={{
            background: t.bodyBg,
            backdropFilter: t.backdropFilter,
            WebkitBackdropFilter: t.backdropFilter,
            boxShadow: t.boxShadow,
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
            className="absolute top-2 left-3 w-10 h-10 pointer-events-none rounded-full"
            style={{ background: t.cornerGlare, filter: "blur(7px)" }}
          />

          {/* Title */}
          <div className="px-5 pt-5 pb-3">
            <h3
              className="text-sm font-semibold tracking-wide"
              style={{ color: t.title }}
            >
              Traffic by Website
            </h3>
          </div>

          {/* Metric rows */}
          <div className="px-5 pb-5 space-y-[14px]">
            {cardsDataJSON.map((item) => {
              const Icon = iconMap[item.icon] ?? TrendingUp
              const isUp = item.trend === "up"

              return (
                <div key={item.id} className="flex items-center gap-3">

                  {/* Icon badge */}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: `${item.color}${t.iconOpacity}`,
                      border: `1px solid ${item.color}${t.iconBorder}`,
                      boxShadow: `0 2px 8px ${item.color}${t.iconGlow}`,
                    }}
                  >
                    <Icon size={13} style={{ color: item.color }} />
                  </div>

                  {/* Label */}
                  <span
                    className="text-xs flex-1 leading-none"
                    style={{ color: t.label }}
                  >
                    {item.label}
                  </span>

                  {/* Change badge */}
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0"
                    style={{
                      color:      isUp ? t.upColor : t.downColor,
                      background: isUp ? t.upBg    : t.downBg,
                    }}
                  >
                    {isUp ? "▲" : "▼"} {item.change}
                  </span>

                  {/* Mini progress bar */}
                  <div
                    className="w-16 h-[3px] rounded-full overflow-hidden shrink-0"
                    style={{ background: t.trackBg }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percent}%`,
                        backgroundColor: item.color,
                        boxShadow: `0 0 8px ${item.color}${t.barGlow}`,
                        transition: "width 0.8s ease",
                      }}
                    />
                  </div>

                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}