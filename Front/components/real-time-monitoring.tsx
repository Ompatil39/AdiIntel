"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Zap,
  RefreshCw,
  Bell,
} from "lucide-react";

// Simulated real-time data
const generateRealTimeData = () => {
  const now = new Date();
  const data = [];
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      impressions: Math.floor(Math.random() * 1000) + 500,
      clicks: Math.floor(Math.random() * 50) + 20,
      conversions: Math.floor(Math.random() * 10) + 2,
      spend: Math.floor(Math.random() * 200) + 100,
    });
  }
  return data;
};

const liveAlerts = [
  {
    id: 1,
    type: "critical",
    title: "Budget Overspend Alert",
    message: "Summer Sale campaign exceeded daily budget by 15%",
    time: "2 minutes ago",
    campaign: "Summer Sale 2024",
  },
  {
    id: 2,
    type: "warning",
    title: "CTR Drop Detected",
    message: "Brand Awareness campaign CTR dropped below 2.5%",
    time: "8 minutes ago",
    campaign: "Brand Awareness Q2",
  },
  {
    id: 3,
    type: "success",
    title: "Conversion Spike",
    message: "Product Launch campaign showing 35% increase in conversions",
    time: "15 minutes ago",
    campaign: "Product Launch",
  },
  {
    id: 4,
    type: "info",
    title: "New High-Performing Keyword",
    message: "Keyword 'summer deals' showing exceptional performance",
    time: "23 minutes ago",
    campaign: "Summer Sale 2024",
  },
];

const liveMetrics = [
  { label: "Active Campaigns", value: 12, change: 0, trend: "stable" },
  { label: "Live Impressions", value: 45672, change: 8.2, trend: "up" },
  { label: "Current CTR", value: 3.84, change: -2.1, trend: "down" },
  { label: "Clicks", value: 1247, change: 12.5, trend: "up" },
  { label: "Conversions", value: 23, change: 15.3, trend: "up" },
  { label: "Current CPC", value: 0.89, change: -5.2, trend: "down" },
];

export function RealTimeMonitoring() {
  const [realTimeData, setRealTimeData] = useState(generateRealTimeData());
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const [liveMetricsData, setLiveMetricsData] = useState({
    total_campaigns: 0,
    total_impressions: 0,
    avg_ctr: 0,
    total_clicks: 0,
    avg_conversions: 0,
    total_cpc: 0,
  });

  const fetchLiveMetrics = async () => {
    try {
      await fetch("http://localhost:5000/realTime") // your Flask URL
        .then((res) => res.json())
        .then((data) => {
          setLiveMetricsData(data);
        });
    } catch (error) {
      console.error("Error fetching live metrics:", error);
    }
  };

  useEffect(() => {
    fetchLiveMetrics(); // initial fetch
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchLiveMetrics();
      setRealTimeData(generateRealTimeData()); // optional chart update
      setLastUpdate(new Date());
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const metricsArray = [
    {
      label: "Active Campaigns",
      value: liveMetricsData.total_campaigns,
      trend: "stable",
      change: 0,
    },
    {
      label: "Live Impressions",
      value: liveMetricsData.total_impressions,
      trend: "up",
      change: 0,
    },
    {
      label: "Current CTR",
      value: liveMetricsData.avg_ctr,
      trend: "up",
      change: 0,
    },
    {
      label: "Clicks",
      value: liveMetricsData.total_clicks,
      trend: "up",
      change: 0,
    },
    {
      label: "Conversions",
      value: liveMetricsData.avg_conversions,
      trend: "up",
      change: 0,
    },
    {
      label: "Current CPC",
      value: liveMetricsData.total_cpc,
      trend: "down",
      change: 0,
    },
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "success":
        return <TrendingUp className="h-4 w-4" />;
      case "info":
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return <Activity className="h-3 w-3 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Real-Time Monitoring
          </h1>
          <p className="text-muted-foreground">
            Live campaign performance and alerts
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "bg-green-50 border-green-200" : ""}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`}
            />
            {autoRefresh ? "Auto Refresh On" : "Auto Refresh Off"}
          </Button>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricsArray.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.label}
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.label.includes("CTR") || metric.label.includes("CPC")
                  ? `${metric.value}${metric.label.includes("CTR") ? "%" : ""}`
                  : metric.value.toLocaleString()}
              </div>
              {metric.change !== 0 && (
                <div className="flex items-center text-xs mt-1">
                  {getTrendIcon(metric.trend)}
                  <span
                    className={`ml-1 ${
                      metric.trend === "up"
                        ? "text-green-600"
                        : metric.trend === "down"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {metric.change > 0 ? "+" : ""}
                    {metric.change}% vs last hour
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Live Performance Metrics</span>
            </CardTitle>
            <CardDescription>
              Real-time impressions, clicks, and conversions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={realTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="impressions"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Live Spend Tracking</span>
            </CardTitle>
            <CardDescription>Hourly spend across all campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={realTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="spend"
                  stroke="var(--chart-4)"
                  fill="var(--chart-4)"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Live Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Live Alerts & Notifications</span>
          </CardTitle>
          <CardDescription>
            Real-time alerts and anomaly detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {liveAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border rounded-lg ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm mt-1">{alert.message}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs">
                        <span>{alert.time}</span>
                        <Badge variant="outline" className="text-xs">
                          {alert.campaign}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Immediate actions based on current performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center bg-transparent"
            >
              <AlertTriangle className="h-5 w-5 mb-2" />
              <span className="text-sm">Pause Overspending</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center bg-transparent"
            >
              <TrendingUp className="h-5 w-5 mb-2" />
              <span className="text-sm">Scale Winners</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center bg-transparent"
            >
              <Zap className="h-5 w-5 mb-2" />
              <span className="text-sm">Apply AI Suggestions</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center bg-transparent"
            >
              <Bell className="h-5 w-5 mb-2" />
              <span className="text-sm">Set New Alerts</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
