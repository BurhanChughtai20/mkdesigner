import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import * as Icons from "lucide-react"
import sidebarDataJSON from "@/data/data.json"
import type { LucideIcon } from "lucide-react"

function getIcon(iconName: string, fallback: LucideIcon): LucideIcon {
  const Icon = Icons[iconName as keyof typeof Icons] as LucideIcon | undefined
  return Icon || fallback
}

const sidebarData = {
  ...sidebarDataJSON,
  brand: {
    ...sidebarDataJSON.brand,
    icon: getIcon(sidebarDataJSON.brand.icon, Icons.LayoutDashboard),
  },
  groups: sidebarDataJSON.groups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      icon: getIcon(item.icon, Icons.Users),
    })),
  })),
}

// ─── 3D hover classes ─────────────────────────────────────────
const navItemHover = [
  // base — transparent border so layout never shifts
  "border border-transparent rounded-md transition-all duration-150",

  // light mode hover — top/left/right light gray, bottom dark gray, dark shadow
  "hover:border-t-gray-200 hover:border-l-gray-200 hover:border-r-gray-200",
  "hover:border-b-gray-400",
  "hover:shadow-[0_3px_0_rgba(0,0,0,0.18)]",

  // dark mode hover — top/left/right mid gray, bottom near-black, heavier shadow
  "dark:hover:border-t-gray-600 dark:hover:border-l-gray-600 dark:hover:border-r-gray-600",
  "dark:hover:border-b-gray-900",
  "dark:hover:shadow-[0_3px_0_rgba(0,0,0,0.55)]",
].join(" ")

// ─── COMPONENT ────────────────────────────────────────────────
export function AppSidebar() {
  const Brand = sidebarData.brand.icon
  const { open } = useSidebar()

  return (
    <Sidebar collapsible="icon" className="">

      {/* Header */}
      <SidebarHeader className="px-3 py-4 border-b">
        <div className="flex items-center gap-2 overflow-hidden">
          <Brand className="w-5 h-5 text-primary shrink-0" />
          {open && (
            <span className="font-semibold text-base whitespace-nowrap">
              {sidebarData.brand.name}
            </span>
          )}
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {sidebarData.groups.map((group) => (
          <SidebarGroup key={group.id}>
            {open && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild tooltip={item.label}>
                        {/* 3D hover effect lives here */}
                        <a href={item.href} className={`flex items-center gap-2 ${navItemHover}`}>
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-3 py-3 border-t text-xs text-muted-foreground">
        {open ? "AdFlow v1.0 — Campaign Manager" : "v1.0"}
      </SidebarFooter>

    </Sidebar>
  )
};