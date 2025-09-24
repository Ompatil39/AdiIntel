"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  MousePointer,
  Eye,
  Users,
  Chrome,
  Facebook,
  Linkedin,
  Twitter,
  Loader2,
} from "lucide-react";

const kpiData = [
  { name: "Jan", roi: 4.2, ctr: 2.8, conversions: 145 },
  { name: "Feb", roi: 4.8, ctr: 3.1, conversions: 167 },
  { name: "Mar", roi: 5.2, ctr: 3.4, conversions: 189 },
  { name: "Apr", roi: 4.9, ctr: 3.2, conversions: 201 },
  { name: "May", roi: 5.8, ctr: 3.7, conversions: 234 },
  { name: "Jun", roi: 6.1, ctr: 3.9, conversions: 267 },
];

const campaignPerformance = [
  { name: "Search Ads", value: 35, color: "var(--chart-1)" },
  { name: "Display", value: 25, color: "var(--chart-2)" },
  { name: "Social", value: 20, color: "var(--chart-3)" },
  { name: "Video", value: 15, color: "var(--chart-4)" },
  { name: "Email", value: 5, color: "var(--chart-5)" },
];

const platformData = [
  {
    platform: "Google Ads",
    spend: 12500,
    conversions: 234,
    cpc: 2.45,
    icon: Chrome,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    performance: "excellent",
  },
  {
    platform: "Facebook",
    spend: 8900,
    conversions: 189,
    cpc: 1.89,
    icon: Facebook,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    performance: "good",
  },
  {
    platform: "LinkedIn",
    spend: 5600,
    conversions: 67,
    cpc: 4.12,
    icon: Linkedin,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    performance: "average",
  },
  {
    platform: "Twitter",
    spend: 3200,
    conversions: 45,
    cpc: 2.78,
    icon: Twitter,
    color: "text-sky-500",
    bgColor: "bg-sky-50",
    performance: "good",
  },
];

export function ExecutiveOverview() {
  const [roi, setROI] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const FLASK_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts

    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Trigger data fetch from Postman API
        console.log("🚀 Starting data fetch...");
        const dataResponse = await fetch(`${FLASK_BASE_URL}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!dataResponse.ok) {
          throw new Error(`Data fetch failed: ${dataResponse.status}`);
        }

        const dataResult = await dataResponse.json();
        console.log("✅ Data fetch initiated:", dataResult);

        // Step 2: Wait for data insertion to complete
        console.log("⏳ Waiting for data insertion...");
        await new Promise(resolve => setTimeout(resolve, 0)); // Wait 5 seconds

        // Step 3: Calculate ROI
        console.log("💰 Calculating ROI...");
        const roiResponse = await fetch(`${FLASK_BASE_URL}/calcROI`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!roiResponse.ok) {
          throw new Error(`ROI calculation failed: ${roiResponse.status}`);
        }

        const roiResult = await roiResponse.json();
        console.log("📊 ROI result:", roiResult);

        if (isMounted) {
          if (roiResult.status === "success" && typeof roiResult.roi === "number") {
            setROI(roiResult.roi);
          } else {
            throw new Error(roiResult.message || "Invalid ROI response");
          }
        }

      } catch (err) {
        console.error("❌ Error:", err);
        if (isMounted) {
          setError(`${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - runs only once on mount

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "excellent":
        return "text-green-600 bg-green-50";
      case "good":
        return "text-blue-600 bg-blue-50";
      case "average":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Executive Overview
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Your marketing performance at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {/* Total ROI Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total ROI</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
  <div className="text-xl sm:text-2xl font-bold">
    {loading ? (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    ) : error ? (
      <span className="text-red-600">Error</span>
    ) : roi !== null ? (
      `${roi.toFixed(2)}%`
    ) : (
      "No data"
    )}
  </div>

  {!loading && !error && roi !== null && (
    <div className="flex items-center text-xs text-green-600">
      <TrendingUp className="h-3 w-3 mr-1" />
      {roi >= 0 ? "+" : "-"}
      {roi.toFixed(1)}% from last month
    </div>
  )}

  {error && (
    <p className="text-xs text-red-600 mt-1">{error}</p>
  )}
</CardContent>

        </Card>

        {/* Click-Through Rate Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Click-Through Rate
            </CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">3.9%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5.4% from last month
            </div>
          </CardContent>
        </Card>

        {/* Conversions Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">267</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +14.1% from last month
            </div>
          </CardContent>
        </Card>

        {/* Campaign Score Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Campaign Score
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">87%</div>
            <Progress value={87} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>
              Monthly ROI and conversion trends over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={kpiData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="roi"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Campaign Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Distribution</CardTitle>
            <CardDescription>
              Performance breakdown by campaign type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={campaignPerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {campaignPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Platform Performance
          </CardTitle>
          <CardDescription className="text-sm">
            Spend and conversions by advertising platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {platformData.map((platform, index) => {
              const IconComponent = platform.icon;
              return (
                <div
                  key={platform.platform}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border rounded-xl space-y-3 sm:space-y-0 ${platform.bgColor} border-l-4 border-l-current transition-all hover:shadow-md`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-lg bg-white shadow-sm ${platform.color}`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-base">
                          {platform.platform}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(
                            platform.performance
                          )}`}
                        >
                          {platform.performance}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{platform.conversions} conversions</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="flex items-center space-x-1 justify-start sm:justify-end">
                      {/* <IndianRupee className="h-4 w-4 text-green-600" /> */}
                      <p className="font-bold text-lg text-green-600">
                        ₹{platform.spend.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center space-x-1 justify-start sm:justify-end">
                      <MousePointer className="h-3 w-3" />
                      <span>${platform.cpc} CPC</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}