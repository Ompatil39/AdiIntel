"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Target,
  ChevronLeft,
  ChevronRight,
  X,
  IndianRupee,
  Activity,
  LogOut,
  Brain,
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const menuItems = [
  { id: "executive-overview", label: "Executive Overview", icon: BarChart3 },
  { id: "campaign-management", label: "Campaign Management", icon: Target },
  {
    id: "budget-optimization",
    label: "Budget Optimization",
    icon: IndianRupee,
  },
  { id: "real-time-monitoring", label: "Real-Time Monitoring", icon: Activity },
  { id: "predictive-insights", label: "Predictive Insights", icon: Brain },
  { id: "integrations", label: "Integrations", icon: Brain },
];

export function Sidebar({
  activeSection,
  setActiveSection,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const handleMenuItemClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
      }
    } catch {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50 flex flex-col",
          "hidden lg:flex",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="h-16 lg:h-19 flex items-center justify-between p-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-base">
                  AI
                </span>
              </div>
              <span className="font-bold text-lg text-sidebar-foreground">
                AdIntelli
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:bg-[#9ca3af]"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left",
                  collapsed ? "px-2" : "px-3",
                  isActive
                    ? "bg-[#1d4ed8] text-white"
                    : "text-sidebar-foreground hover:bg-[#d2d3d5] hover:text-black"
                )}
                onClick={() => handleMenuItemClick(item.id)}
              >
                <Icon className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Button>
            );
          })}
        </nav>

        {/* Logout Button (Desktop) */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full justify-start text-left text-[#ef4444]",
              collapsed ? "px-2" : "px-3",
              "hover:bg-[#fee2e2] hover:text-[#991b1b]"
            )}
          >
            <LogOut className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
            {!collapsed && <span className="text-sm">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-transform duration-300 z-50 flex flex-col",
          "lg:hidden w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                AI
              </span>
            </div>
            <span className="font-bold text-sidebar-foreground">AdIntelli</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileOpen(false)}
            className="text-sidebar-foreground hover:bg-[#9ca3afd6]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left px-3",
                  isActive
                    ? "bg-[#1d4ed8] text-white"
                    : "text-sidebar-foreground hover:bg-[#9ca3afbb] hover:text-black"
                )}
                onClick={() => handleMenuItemClick(item.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                <span className="text-sm">{item.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Logout Button (Mobile) */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-left text-[#ef4444] hover:bg-[#fee2e2] hover:text-[#991b1b]"
          >
            <LogOut className="h-4 w-4 mr-3" />
            <span className="text-sm">Logout</span>
          </Button>
        </div>
      </div>
    </>
  );
}
