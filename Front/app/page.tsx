"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ExecutiveOverview } from "@/components/executive-overview"
import { CampaignManagement } from "@/components/campaign-management"
import { BudgetOptimization } from "@/components/budget-optimization"
import { CreativeInsights } from "@/components/creative-insights"
import { RealTimeMonitoring } from "@/components/real-time-monitoring"
import { AIActionPanel } from "@/components/ai-action-panel"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("executive-overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case "executive-overview":
        return <ExecutiveOverview />
      case "campaign-management":
        return <CampaignManagement />
      case "budget-optimization":
        return <BudgetOptimization />
      case "creative-insights":
        return <CreativeInsights />
      case "real-time-monitoring":
        return <RealTimeMonitoring />
      default:
        return <ExecutiveOverview />
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        } ml-0`}
      >
        <Header onMenuClick={() => setMobileSidebarOpen(true)} sidebarCollapsed={sidebarCollapsed} />

        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto min-w-0">{renderContent()}</main>

          <div className="hidden lg:block">
            <AIActionPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
