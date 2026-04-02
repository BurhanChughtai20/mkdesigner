
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { FileText, Menu } from "lucide-react";
import { CardsData } from "./components/card/Card";
import { Chart } from "./components/chart/chart";
import { TrafficByWebsite } from "./components/TrafficByWebsite";
import { useEffect, useState } from "react";
import Table from "./components/table/page";

const headerTriggerClasses =
  "p-2 rounded-md bg-white/20 dark:bg-black/40 backdrop-blur-xl hover:bg-white/30 dark:hover:bg-black/50 transition-colors";
const mdTriggerClasses =
  "p-2 rounded-md bg-white/20 dark:bg-black/40 backdrop-blur-xl hover:bg-white/30 dark:hover:bg-black/50 transition-colors";

const btnTheme = {
  dark: {
    borderGradient:
      "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 35%, transparent 100%)",
    bodyBg:
      "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 55%, rgba(0,0,0,0.22) 100%)",
    boxShadow: `
      0 0 0 1px rgba(255,255,255,0.07),
      0 2px 6px rgba(0,0,0,0.35),
      0 8px 24px rgba(0,0,0,0.40),
      inset 0 1px 0 rgba(255,255,255,0.16),
      inset 1px 0 0 rgba(255,255,255,0.07)
    `,
    boxShadowHover: `
      0 0 0 1px rgba(255,255,255,0.12),
      0 4px 12px rgba(0,0,0,0.45),
      0 16px 40px rgba(0,0,0,0.50),
      inset 0 1px 0 rgba(255,255,255,0.22),
      inset 1px 0 0 rgba(255,255,255,0.10)
    `,
    topStreak:
      "linear-gradient(90deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.10) 45%, transparent 100%)",
    cornerGlare:
      "radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 70%)",
    backdropFilter: "blur(24px) saturate(180%)",
    text: "rgba(255,255,255,0.85)",
    icon: "rgba(255,255,255,0.65)",
  },
  light: {
    borderGradient:
      "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(220,215,255,0.65) 40%, rgba(180,170,240,0.18) 100%)",
    bodyBg:
      "linear-gradient(160deg, rgba(255,255,255,0.60) 0%, rgba(238,236,255,0.58) 50%, rgba(210,205,255,0.38) 100%)",
    boxShadow: `
      0 0 0 1px rgba(139,120,255,0.18),
      0 2px 6px rgba(100,80,200,0.12),
      0 8px 24px rgba(80,60,180,0.16),
      inset 0 1.5px 0 rgba(255,255,255,1),
      inset 1px 0 0 rgba(255,255,255,0.85)
    `,
    boxShadowHover: `
      0 0 0 1px rgba(139,120,255,0.28),
      0 4px 12px rgba(100,80,200,0.20),
      0 16px 36px rgba(80,60,180,0.22),
      inset 0 1.5px 0 rgba(255,255,255,1),
      inset 1px 0 0 rgba(255,255,255,0.90)
    `,
    topStreak:
      "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.70) 40%, transparent 100%)",
    cornerGlare:
      "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 35%, transparent 70%)",
    backdropFilter: "blur(28px) saturate(200%) brightness(1.04)",
    text: "rgba(5,2,20,0.88)",
    icon: "rgba(10,5,30,0.60)",
  },
};

function GlassButton({
  isDark,
  onClick,
}: {
  isDark: boolean;
  onClick?: () => void;
}) {
  const t = isDark ? btnTheme.dark : btnTheme.light;
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ perspective: "800px" }}>
      <div
        className="relative rounded-xl p-px overflow-hidden cursor-pointer select-none"
        style={{
          transform: hovered
            ? "rotateX(0deg) rotateY(0deg) translateY(-2px)"
            : "rotateX(1.5deg) rotateY(-1deg)",
          transformStyle: "preserve-3d",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
      >
        <div
          className="absolute inset-0 rounded-xl pointer-events-none z-0"
          style={{ background: t.borderGradient }}
        />

        <div
          className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{
            background: t.bodyBg,
            backdropFilter: t.backdropFilter,
            WebkitBackdropFilter: t.backdropFilter,
            boxShadow: hovered ? t.boxShadowHover : t.boxShadow,
            transition: "background 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none rounded-t-xl"
            style={{ background: t.topStreak }}
          />

          <div
            className="absolute top-1 left-2 w-8 h-8 pointer-events-none rounded-full"
            style={{ background: t.cornerGlare, filter: "blur(6px)" }}
          />

          <FileText
            className="w-4 h-4 shrink-0 relative z-10"
            style={{
              color: t.icon,
              filter: isDark
                ? "drop-shadow(0 0 4px rgba(255,255,255,0.2))"
                : "drop-shadow(0 0 4px rgba(100,80,200,0.25))",
            }}
          />

          <span
            className="text-sm font-semibold tracking-wide relative z-10"
            style={{ color: t.text }}
          >
            View All
          </span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="flex flex-col flex-1 min-h-screen w-full bg-[url('/your-background.jpg')] bg-cover bg-center">
        <header className="flex items-center justify-between px-4 py-3 bg-white/10 dark:bg-black/20 backdrop-blur-xl border-b md:hidden">
          <SidebarTrigger className={headerTriggerClasses}>
            <Menu className="w-4 h-4" />
          </SidebarTrigger>
          <span className="font-semibold text-sm tracking-tight">AdFlow</span>
          <div className="w-9" />
        </header>

        <div className="hidden md:flex items-center px-3 py-2 border-b">
          <SidebarTrigger className={mdTriggerClasses} />
        </div>

        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center justify-between w-full mb-6">
            <h2 className="shrink-0 text-base md:text-xl xl:text-2xl font-semibold tracking-tight">
              Overview
            </h2>

            <GlassButton
              isDark={isDark}
              onClick={() => console.log("View All")}
            />
          </div>

          <CardsData />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-stretch">
            <Chart />
            <TrafficByWebsite />
          </div>

          <Table/>
        </main>
      </div>
    </SidebarProvider>
  );
}
