"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
  Play,
  Pause,
  Edit,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";

type Campaign = {
  campaign_name: string;
  cost: number;
  sale_amount: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  roas: number;
};

type TrendData = {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
};

type DeviceData = {
  device: string;
  impressions: number;
  conversions: number;
};

type KpiData = {
  name: string;
  roi: number;
  ctr: number;
};

type CampaignPerformance = {
  name: string;
  value: number;
  color: string;
};

const FLASK_BASE_URL = "http://127.0.0.1:5000";

export function CampaignManagement() {
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [kpiData, setKpiData] = useState<KpiData[]>([]);
  const [campaignPerformance, setCampaignPerformance] = useState<CampaignPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch campaigns
        const campaignsRes = await fetch(`${FLASK_BASE_URL}/getAllCampaigns`);
        const campaignsData: Campaign[] = await campaignsRes.json();
        setCampaigns(campaignsData);

        // Fetch weekly trends
        const trendsRes = await fetch(`${FLASK_BASE_URL}/getWeeklyTrends`);
        const trendsData: TrendData[] = await trendsRes.json();
        setTrendData(trendsData);

        // Fetch device demographics
        const deviceRes = await fetch(`${FLASK_BASE_URL}/getDeviceDemographics`);
        const deviceData: DeviceData[] = await deviceRes.json();
        setDeviceData(deviceData);

        // Fetch KPI data
        const kpiRes = await fetch(`${FLASK_BASE_URL}/getKpiData`);
        const kpiData: KpiData[] = await kpiRes.json();
        setKpiData(kpiData);

        // Fetch campaign performance
        const performanceRes = await fetch(`${FLASK_BASE_URL}/getCampaignPerformance`);
        const performanceData: CampaignPerformance[] = await performanceRes.json();
        setCampaignPerformance(performanceData);

      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading campaign data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Campaign Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and optimize your advertising campaigns
          </p>
        </div>
      </div>

      {/* Campaign List */}
      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
          <CardDescription>
            Manage your current advertising campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {(showAll ? campaigns : campaigns.slice(0, 3)).map((campaign) => (
                <motion.div
                  key={campaign.campaign_name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
                >
                  {/* Left Section */}
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium">{campaign.campaign_name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          ${campaign.cost.toLocaleString()} / $
                          {campaign.sale_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Section */}
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="font-medium">
                        {campaign.impressions.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground">Impressions</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">
                        {campaign.clicks.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground">Clicks</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{campaign.conversions}</p>
                      <p className="text-muted-foreground">Conversions</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{campaign.ctr}%</p>
                      <p className="text-muted-foreground">CTR</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">${campaign.cpc.toFixed(2)}</p>
                      <p className="text-muted-foreground">CPC</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{campaign.roas.toFixed(1)}x</p>
                      <p className="text-muted-foreground">ROAS</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* View More / View Less Button */}
          {campaigns.length > 3 && (
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={() => setShowAll(!showAll)}>
                {showAll ? "View Less" : "View More"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance Trends</CardTitle>
            <CardDescription>
              Impressions, clicks, and conversions over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
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
            <CardTitle>Device Demographics</CardTitle>
            <CardDescription>Performance by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deviceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="device" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="impressions" fill="var(--chart-1)" />
                <Bar dataKey="conversions" fill="var(--chart-2)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}