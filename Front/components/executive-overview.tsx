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
  MousePointer,
  Eye,
  Users,
  Chrome,
  Facebook,
  Linkedin,
  Twitter,
  Loader2,
  IndianRupee,
} from "lucide-react";

const kpiData = [
  { name: "Jan", roi: 4.2, ctr: 2.8 },
  { name: "Feb", roi: 4.8, ctr: 3.1 },
  { name: "Mar", roi: 5.2, ctr: 3.4 },
  { name: "Apr", roi: 4.9, ctr: 3.2 },
  { name: "May", roi: 5.8, ctr: 3.7 },
  { name: "Jun", roi: 6.1, ctr: 3.9 },
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
  const [roi, setRoi] = useState<number | null>(null);
  const [conversions, setConversions] = useState<number | null>(null);
  const [campaignScore, setCampaignScore] = useState<number | null>(null);
  const [platformMetrics, setPlatformMetrics] = useState<any[]>([]);
  const [ctr, setCtr] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const FLASK_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchROI = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:5000/getROI");
        const data = await res.json();
        if (typeof data.roi === "number") {
          setRoi(data.roi);
        } else {
          throw new Error("Invalid ROI data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load ROI");
      } finally {
        setLoading(false);
      }
    };

    const fetchCTR = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:5000/getCTR");
        const data = await res.json();
        if (typeof data.ctr === "number") {
          setCtr(data.ctr);
        } else {
          throw new Error("Invalid CTR data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load CTR");
      } finally {
        setLoading(false);
      }
    };

    const fetchConversions = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:5000/getConversions");
        const data = await res.json();
        if (typeof data.total_conversions === "number") {
          setConversions(data.total_conversions);
        } else {
          throw new Error("Invalid conversions data");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load conversions"
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchCampaignScore = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:5000/getCampaignScore");
        const data = await res.json();
        if (typeof data.campaign_score === "number") {
          setCampaignScore(data.campaign_score);
        } else {
          throw new Error("Invalid Campaign Score data");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load Campaign Score"
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchPlatformData = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:5000/getPlatformData");
        const data = await res.json();
        if (Array.isArray(data)) {
          setPlatformMetrics(data);
        } else {
          throw new Error("Invalid platform data");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load platform data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformData();
    fetchCampaignScore();
    fetchConversions();
    fetchROI();
    fetchCTR();
  }, []);

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
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total ROI</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : error ? (
                <span className="text-red-600">{error}</span>
              ) : roi !== null ? (
                `${roi.toFixed(2)}%`
              ) : (
                "No data"
              )}
            </div>

            {!loading && !error && roi !== null && (
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {roi >= 0 ? "+" : "-"}
                {roi.toFixed(1)}% from last month
              </div>
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
            <div className="text-xl sm:text-2xl font-bold">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : error ? (
                <span className="text-red-600">{error}</span>
              ) : ctr !== null ? (
                `${ctr.toFixed(2)}%`
              ) : (
                "No data"
              )}
            </div>

            {!loading && !error && ctr !== null && (
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {ctr >= 0 ? "+" : "-"}
                {ctr.toFixed(1)}% from last month
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conversions Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : error ? (
                <span className="text-red-600">{error}</span>
              ) : conversions !== null ? (
                conversions
              ) : (
                "No data"
              )}
            </div>

            {!loading && !error && conversions !== null && (
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +14.1% from last month
              </div>
            )}
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
            <div className="text-xl sm:text-2xl font-bold">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : error ? (
                <span className="text-red-600">{error}</span>
              ) : campaignScore !== null ? (
                `${campaignScore.toFixed(0)}%`
              ) : (
                "No data"
              )}
            </div>

            {!loading && !error && campaignScore !== null && (
              <Progress value={campaignScore} className="mt-2" />
            )}
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
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="ctr"
                  stroke="var(--chart-2)"
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
            {platformMetrics.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}

            {platformMetrics.map((platform) => {
              const IconComponent =
                platform.platform.toLowerCase() === "google"
                  ? Chrome
                  : platform.platform.toLowerCase() === "facebook"
                  ? Facebook
                  : platform.platform.toLowerCase() === "linkedin"
                  ? Linkedin
                  : platform.platform.toLowerCase() === "twitter"
                  ? Twitter
                  : null;

              return (
                <div
                  key={platform.platform}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border rounded-xl space-y-3 sm:space-y-0 bg-white border-l-4 border-l-current transition-all hover:shadow-md`}
                >
                  <div className="flex items-center space-x-4">
                    {IconComponent && (
                      <div className="p-2 rounded-lg bg-white shadow-sm text-blue-600">
                        <IconComponent className="h-5 w-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-base">
                          {platform.platform}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(
                            "good"
                          )}`}
                        >
                          {/* You can compute performance if you want */}
                          good
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{platform.conversion} conversions</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="flex items-center space-x-1 justify-start sm:justify-end">
                      <p className="font-bold text-lg text-green-600">
                        ₹{platform.cost.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center space-x-1 justify-start sm:justify-end">
                      <MousePointer className="h-3 w-3" />
                      <span>${platform.cpc.toFixed(2)} CPC</span>
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
