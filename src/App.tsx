"use client";

import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { FileText, Menu, Sun, Moon } from "lucide-react";
import { CardsData } from "./components/card/Card";
import { Chart } from "./components/chart/chart";
import { TrafficByWebsite } from "./components/TrafficByWebsite";
import Table from "./components/table/page";
import CampaignFormDialog from "./components/campaign/CampaignFormDialog";

// Trigger classes
const headerTriggerClasses =
  "p-2 rounded-md bg-white/20 dark:bg-black/40 backdrop-blur-xl hover:bg-white/30 dark:hover:bg-black/50 transition-colors";
const mdTriggerClasses =
  "p-2 rounded-md bg-white/20 dark:bg-black/40 backdrop-blur-xl hover:bg-white/30 dark:hover:bg-black/50 transition-colors";

// Glassy button styles
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

// GlassButton component (already in your code)
function GlassButton({ isDark, onClick }: { isDark: boolean; onClick?: () => void }) {
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
// ThemeToggle component
function ThemeToggle() {
  // Initialize state directly based on document class
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  const [hovered, setHovered] = useState(false);

  // Optional: observe changes if something else toggles dark mode outside this component
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(document.documentElement.classList.contains("dark")); // read DOM directly
  };

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
      onClick={toggleTheme}
    >
      <div
        className="flex items-center justify-center w-10 h-10 rounded-xl"
        style={{
          background: t.bg,
          boxShadow: t.shadow,
          color: t.icon,
        }}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [isFormOpen, setFormOpen] = useState(false);

  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="flex flex-col flex-1 min-h-screen w-full bg-[url('/your-background.jpg')] bg-cover bg-center">
        <header className="flex items-center justify-between px-4 py-3 bg-white/10 dark:bg-black/20 backdrop-blur-xl border-b md:hidden">
          <SidebarTrigger className={headerTriggerClasses}>
            <Menu className="w-4 h-4" />
          </SidebarTrigger>
          <span className="font-semibold text-sm tracking-tight">AdFlow</span>
          <ThemeToggle />
        </header>

        <div className="hidden md:flex items-center px-3 py-2 border-b justify-between">
          <SidebarTrigger className={mdTriggerClasses} />
          <ThemeToggle />
        </div>

        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center justify-between w-full mb-6">
            <h2 className="shrink-0 text-base md:text-xl xl:text-2xl font-semibold tracking-tight">
              Overview
            </h2>

            <GlassButton onClick={() => setFormOpen(true)} isDark={document.documentElement.classList.contains("dark")} />
          </div>

          <CardsData />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-stretch">
            <Chart />
            <TrafficByWebsite />
          </div>

          <Table />
        </main>

        <CampaignFormDialog
          isOpen={isFormOpen}
          onClose={() => setFormOpen(false)}
        />
      </div>
    </SidebarProvider>
  );
}