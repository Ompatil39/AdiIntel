"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const campaignData = [
  {
    id: 1,
    name: "Summer Sale 2024",
    budget: 5000,
    spent: 3200,
    impressions: 125000,
    clicks: 4800,
    conversions: 89,
    ctr: 3.84,
    cpc: 0.67,
    roas: 4.2,
  },
  {
    id: 2,
    name: "Brand Awareness Q2",
    budget: 8000,
    spent: 6100,
    impressions: 280000,
    clicks: 8400,
    conversions: 156,
    ctr: 3.0,
    cpc: 0.73,
    roas: 3.8,
  },
  {
    id: 3,
    name: "Product Launch",
    budget: 3000,
    spent: 2800,
    impressions: 95000,
    clicks: 2850,
    conversions: 67,
    ctr: 3.0,
    cpc: 0.98,
    roas: 2.9,
  },
];

const trendData = [
  { date: "Mon", impressions: 18000, clicks: 540, conversions: 12 },
  { date: "Tue", impressions: 22000, clicks: 660, conversions: 15 },
  { date: "Wed", impressions: 19000, clicks: 570, conversions: 11 },
  { date: "Thu", impressions: 25000, clicks: 750, conversions: 18 },
  { date: "Fri", impressions: 28000, clicks: 840, conversions: 21 },
  { date: "Sat", impressions: 15000, clicks: 450, conversions: 9 },
  { date: "Sun", impressions: 12000, clicks: 360, conversions: 7 },
];

const demographicData = [
  { age: "18-24", impressions: 45000, conversions: 23 },
  { age: "25-34", impressions: 89000, conversions: 67 },
  { age: "35-44", impressions: 67000, conversions: 45 },
  { age: "45-54", impressions: 34000, conversions: 19 },
  { age: "55+", impressions: 23000, conversions: 12 },
];

export function CampaignManagement() {
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);

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
        <Button>Create Campaign</Button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <Input placeholder="Search campaigns..." className="max-w-sm" />
      </div>

      {/* Campaign List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>
            Manage your current advertising campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaignData.map((campaign) => (
              <div
                key={campaign.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedCampaign === campaign.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedCampaign(campaign.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium">{campaign.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          ${campaign.spent.toLocaleString()} / $
                          {campaign.budget.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

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
                      <p className="font-medium">${campaign.cpc}</p>
                      <p className="text-muted-foreground">CPC</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{campaign.roas}x</p>
                      <p className="text-muted-foreground">ROAS</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2"></div>
                </div>
              </div>
            ))}
          </div>
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
            <CardTitle>Audience Demographics</CardTitle>
            <CardDescription>Performance by age group</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demographicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="impressions" fill="var(--chart-1)" />
                <Bar dataKey="conversions" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Anomaly Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span>Performance Alerts</span>
          </CardTitle>
          <CardDescription>
            AI-detected anomalies and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingDown className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">
                    CTR Drop Detected
                  </p>
                  <p className="text-sm text-yellow-600">
                    Summer Sale 2024 campaign CTR dropped 15% in the last 2 days
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Investigate
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">
                    Conversion Rate Spike
                  </p>
                  <p className="text-sm text-green-600">
                    Brand Awareness Q2 showing 23% increase in conversions
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Scale Up
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
