"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Search, Settings, Menu, X, AlertCircle, CheckCircle, Clock } from "lucide-react"

interface HeaderProps {
  onMenuClick: () => void
  sidebarCollapsed: boolean
}

const notifications = [
  {
    id: 1,
    type: "alert",
    title: "Budget Alert",
    message: "Google Ads campaign is 85% through daily budget",
    time: "5 min ago",
    read: false,
    icon: AlertCircle,
    color: "text-red-500",
  },
  {
    id: 2,
    type: "success",
    title: "Campaign Optimized",
    message: "Summer Sale campaign performance improved by 23%",
    time: "1 hour ago",
    read: false,
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    id: 3,
    type: "info",
    title: "Weekly Report Ready",
    message: "Your marketing performance report is available",
    time: "2 hours ago",
    read: true,
    icon: Clock,
    color: "text-blue-500",
  },
]

export function Header({ onMenuClick, sidebarCollapsed }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="h-16 lg:h-19 border-b border-border bg-card px-3 sm:px-4 lg:px-6 flex items-center justify-between relative">
      <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden text-muted-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative flex-1 max-w-xs sm:max-w-sm lg:max-w-md shadow-[0_1px_3px_rgba(0,0,0,0.02),0_0_0_1px_rgba(27,31,35,0.15)] rounded-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search..." className="pl-10 w-full text-sm" />
        </div>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                {unreadCount}
              </Badge>
            )}
          </Button>

          {showNotifications && (
            <Card className="absolute right-0 top-12 w-80 z-50 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Notifications</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotifications(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => {
                    const IconComponent = notification.icon;
                    return (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-border hover:bg-muted/50 cursor-pointer ${
                          !notification.read ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <IconComponent
                            className={`h-4 w-4 mt-0.5 ${notification.color}`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Button variant="ghost" size="sm" className="hidden md:flex">
          <Settings className="h-4 w-4" />
        </Button>

        <div
          className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 text-lg sm:text-xl 
                hover:bg-primary/20 transition duration-200"
        >
          <svg
            className="w-6 h-6 text-primary"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
      </div>
    </header>
  );
}
