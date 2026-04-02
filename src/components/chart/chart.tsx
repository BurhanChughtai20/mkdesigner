"use client"

import { useState, useEffect } from "react"
import {
  LineChart, Line, XAxis, CartesianGrid,
  ResponsiveContainer, Tooltip,
} from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"

// ─── Data ─────────────────────────────────────────────────────────────────
const metrics = [
  { id: "impressions", label: "Impressions", trend: "up"   },
  { id: "clicks",      label: "Clicks",      trend: "up"   },
  { id: "ctr",         label: "CTR",         trend: "down" },
  { id: "conversions", label: "Conversions", trend: "up"   },
  { id: "spend",       label: "Spend",       trend: "up"   },
  { id: "roas",        label: "ROAS",        trend: "up"   },
] as const

type MetricId = typeof metrics[number]["id"]

const chartData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  impressions: Math.floor(Math.random() * 5000) + 500,
  clicks:      Math.floor(Math.random() * 2000) + 200,
  ctr:         Math.floor(Math.random() * 100)  + 10,
  conversions: Math.floor(Math.random() * 1000) + 100,
  spend:       Math.floor(Math.random() * 3000) + 300,
  roas:        Math.floor(Math.random() * 500)  + 50,
}))

// ─── Colors — ONLY green / red, zero purple ───────────────────────────────
const TREND_COLOR = {
  up:   { line: "#22c55e", glow: "#22c55e80", badge: "#22c55e18", border: "#22c55e30", text: "#16a34a" },
  down: { line: "#ef4444", glow: "#ef444480", badge: "#ef444418", border: "#ef444430", text: "#dc2626" },
}

// ─── Theme tokens ──────────────────────────────────────────────────────────
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
    backdropFilter: "blur(24px) saturate(180%)",
    title:         "rgba(255,255,255,0.88)",
    subtitle:      "rgba(255,255,255,0.38)",
    footer:        "rgba(255,255,255,0.45)",
    footerBorder:  "rgba(255,255,255,0.06)",
    gridStroke:    "rgba(255,255,255,0.06)",
    axisColor:     "rgba(255,255,255,0.28)",
    tooltipBg:     "rgba(15,18,30,0.97)",
    tooltipBorder: "rgba(255,255,255,0.10)",
    tooltipText:   "rgba(255,255,255,0.90)",
    selectBg:      "rgba(255,255,255,0.06)",
    selectBorder:  "rgba(255,255,255,0.12)",
    selectText:    "rgba(255,255,255,0.78)",
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
  backdropFilter: "blur(28px) saturate(200%) brightness(1.04)",

  // ✅ ALL TEXT: near-black, high contrast
  title:         "rgba(5,2,20,0.92)",
  subtitle:      "rgba(10,5,30,0.62)",
  footer:        "rgba(10,5,30,0.65)",
  footerBorder:  "rgba(139,120,255,0.10)",
  gridStroke:    "rgba(100,80,200,0.08)",
  axisColor:     "rgba(10,5,30,0.45)",

  tooltipBg:     "rgba(245,243,255,0.98)",
  tooltipBorder: "rgba(139,120,255,0.20)",
  tooltipText:   "rgba(5,2,20,0.92)",

  selectBg:      "rgba(255,255,255,0.55)",
  selectBorder:  "rgba(139,120,255,0.22)",
  selectText:    "rgba(5,2,20,0.85)",
},
}

// ─── Component ─────────────────────────────────────────────────────────────
export function Chart() {
  const [selectedMetric, setSelectedMetric] = useState<MetricId>("impressions")
  const [isDark, setIsDark] = useState(false)

  // Dark mode sync
  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, {
      attributes: true, attributeFilter: ["class"],
    })
    return () => obs.disconnect()
  }, [])

  const t          = isDark ? theme.dark : theme.light
  const activeMeta = metrics.find((m) => m.id === selectedMetric)!
  const colors     = TREND_COLOR[activeMeta.trend]
  const isUp       = activeMeta.trend === "up"

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
        {/* Border ring */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-0"
          style={{ background: t.borderGradient }}
        />

        {/* Glass body — key: flex-col with overflow-hidden so inner flex-1 is stable */}
        <div
          className="relative z-10 h-full rounded-2xl overflow-hidden"
          style={{
            display: "flex",
            flexDirection: "column",
            background: t.bodyBg,
            backdropFilter: t.backdropFilter,
            WebkitBackdropFilter: t.backdropFilter,
            boxShadow: t.boxShadow,
            transition: "background 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          {/* Gloss layers */}
          <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: t.topStreak }} />
          <div className="absolute top-0 left-0 bottom-0 w-px pointer-events-none"
            style={{ background: t.leftStreak }} />
          <div className="absolute top-2 left-3 w-12 h-12 pointer-events-none rounded-full"
            style={{ background: t.cornerGlare, filter: "blur(8px)" }} />

          {/* ── Header — FIXED height so dropdown never causes reflow ── */}
          <div
            className="shrink-0 flex items-center justify-between gap-4 px-5 pt-5 pb-4"
            style={{ minHeight: "64px" }}
          >
            <div className="min-w-0">
              <h3 className="text-sm font-semibold  tracking-wide truncate"
                style={{ color: t.title }}>
                30-Day Performance Trend
              </h3>
              <p className="text-xs mt-0.5" style={{ color: t.subtitle }}>
                Track selected metric over 30 days
              </p>
            </div>

            {/* Select — portal renders outside flex, no reflow */}
            <div className="shrink-0 relative z-20">
              <Select value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as MetricId)}>
                <SelectTrigger
                  className="w-36 h-8 text-xs rounded-lg border"
                  style={{
                    background:     t.selectBg,
                    borderColor:    t.selectBorder,
                    color:          t.selectText,
                    backdropFilter: "blur(8px)",
                    boxShadow:      "none",
                    outline:        "none",
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  // Render in portal by default — prevents layout shift
                  position="popper"
                  sideOffset={6}
                >
                  {metrics.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="text-xs">
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ── Chart — flex-1 with min-h-0 locks its size independent of header ── */}
          <div className="flex-1 min-h-0 px-2 pb-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ left: 0, right: 14, top: 10, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke={t.gridStroke} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: t.axisColor, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background:   t.tooltipBg,
                    border:       `1px solid ${t.tooltipBorder}`,
                    borderRadius: "10px",
                    color:        t.tooltipText,
                    fontSize:     "12px",
                    boxShadow:    "0 8px 24px rgba(0,0,0,0.18)",
                  }}
                  cursor={{ stroke: `${colors.line}35`, strokeWidth: 1 }}
                />
                <Line
                  key={selectedMetric}       // remount on metric change = clean animation
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={colors.line}
                  strokeWidth={2}
                  dot={false}
                  animationDuration={500}
                  style={{ filter: `drop-shadow(0 0 5px ${colors.glow})` }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* ── Footer ── */}
          <div
            className="shrink-0 flex items-center gap-2 px-5 py-3 text-xs border-t"
            style={{ color: t.footer, borderColor: t.footerBorder }}
          >
            {isUp
              ? <TrendingUp  className="h-3.5 w-3.5" style={{ color: colors.line }} />
              : <TrendingDown className="h-3.5 w-3.5" style={{ color: colors.line }} />
            }
            <span>{isUp ? "Trending up" : "Trending down"} this period</span>

            <span
              className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{
                color:      colors.text,
                background: colors.badge,
                border:     `1px solid ${colors.border}`,
              }}
            >
              {activeMeta.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}