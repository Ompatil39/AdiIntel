"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Loader2,
} from "lucide-react";

export function PredictiveInsights() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const campaignOptions = [
    "Campaign_12",
    "Campaign_15",
    "Campaign_27",
    "Campaign_5",
    "Campaign_33",
    "Campaign_41",
    "Campaign_8",
    "Campaign_19",
    "Campaign_22",
    "Campaign_3",
  ];
  const [selectedCampaign, setSelectedCampaign] = useState<string>(
    campaignOptions[0]
  );
  const [predicting, setPredicting] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<Record<string, any> | null>(
    null
  );
  const [predictionError, setPredictionError] = useState<string | null>(null);

  const FLASK_BASE_URL = "http://localhost:5000";

  const formatCurrencyINR = (value: number = 0) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

  const SAMPLE_CAMPAIGNS: any[] = [
    { Campaign_Name: "Campaign_12", Spend: 2451, Revenue: 2600 },
    { Campaign_Name: "Campaign_15", Spend: 500, Revenue: 500 },
    { Campaign_Name: "Campaign_27", Spend: 1780, Revenue: 1780 },
    { Campaign_Name: "Campaign_5", Spend: 4350, Revenue: 4500 },
    { Campaign_Name: "Campaign_33", Spend: 951, Revenue: 900 },
    { Campaign_Name: "Campaign_41", Spend: 3200, Revenue: 3350 },
    { Campaign_Name: "Campaign_8", Spend: 2750, Revenue: 2700 },
    { Campaign_Name: "Campaign_19", Spend: 2150, Revenue: 2200 },
    { Campaign_Name: "Campaign_22", Spend: 1200, Revenue: 1150 },
    { Campaign_Name: "Campaign_3", Spend: 650, Revenue: 680 },
  ].map((c) => ({
    ...c,
    Profitable: c.Revenue >= c.Spend ? "Yes" : "No",
    Status: c.Revenue >= c.Spend ? "Active" : "Paused",
    Bidding_Strategy: "Maximize clicks",
    CPC: c.Spend ? Math.max(1, (c.Spend / 100) % 100) : 0,
    Conversions: Math.max(1, Math.round((c.Revenue / Math.max(1, c.Spend)) * 10)),
    Recommendation:
      c.Revenue > c.Spend
        ? "Increase budget"
        : c.Revenue < c.Spend
        ? "Optimize targeting"
        : "Maintain",
  }));

  useEffect(() => {
    setData(SAMPLE_CAMPAIGNS);
    setLoading(false);
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(
      (item) =>
        item.Campaign_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Bidding_Strategy?.toLowerCase().includes(
          searchTerm.toLowerCase()
        ) ||
        item.Recommendation?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "ended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProfitabilityColor = (profitable: boolean) => {
    return profitable
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getProfitabilityIcon = (profitable: boolean) => {
    return profitable ? (
      <TrendingUp className="h-3 w-3" />
    ) : (
      <TrendingDown className="h-3 w-3" />
    );
  };

  const renderPredictionValue = (key: string, value: any) => {
    const normalizedKey = key.toLowerCase();
    const stringValue = String(value);

    if (normalizedKey === "performance alerts") {
      const isNormal = String(value).toLowerCase() === "normal";
      return (
        <span
          className={
            isNormal
              ? "inline-block rounded-md border border-green-200 bg-green-50 text-green-800 px-2 py-1 text-sm"
              : "inline-block rounded-md border border-red-200 bg-red-50 text-red-800 px-2 py-1 text-sm"
          }
        >
          {stringValue}
        </span>
      );
    }

    if (normalizedKey === "audience expansion") {
      const isYes = String(value).toLowerCase() === "yes";
      return (
        <span
          className={
            isYes
              ? "inline-block rounded-md border border-green-200 bg-green-50 text-green-800 px-2 py-1 text-sm"
              : "inline-block rounded-md border border-red-200 bg-red-50 text-red-800 px-2 py-1 text-sm"
          }
        >
          {stringValue}
        </span>
      );
    }

    if (normalizedKey === "budget recommendation") {
      const lower = String(value).toLowerCase();
      const isIncrease = lower.includes("increase");
      const isDecrease = lower.includes("decrease");
      const classes = isIncrease
        ? "inline-block rounded-md border border-green-200 bg-green-50 text-green-800 px-2 py-1 text-sm"
        : isDecrease
        ? "inline-block rounded-md border border-red-200 bg-red-50 text-red-800 px-2 py-1 text-sm"
        : "inline-block rounded-md border border-gray-200 bg-gray-50 text-gray-800 px-2 py-1 text-sm";
      return <span className={classes}>{stringValue}</span>;
    }

    // Default render
    return typeof value === "number" ? value.toFixed(2) : stringValue;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Predictive Insights
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          AI-powered campaign predictions and optimization recommendations
        </p>
      </div>

      {/* Campaign Analysis (Prediction) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaign Analysis</CardTitle>
          <CardDescription>
            Select a campaign and run a quick prediction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Select Campaign
              </label>
              <Select
                value={selectedCampaign}
                onValueChange={setSelectedCampaign}
              >
                <SelectTrigger className="min-w-[220px] sm:w-64">
                  <SelectValue placeholder="Choose a campaign" />
                </SelectTrigger>
                <SelectContent>
                  {campaignOptions.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button
                onClick={async () => {
                  setPrediction(null);
                  setPredictionError(null);
                  setPredicting(true);
                  try {
                    const res = await fetch(`${FLASK_BASE_URL}/predict`, {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({ campaign_name: selectedCampaign }),
                    });
                    const text = await res.text();
                    if (!res.ok) {
                      throw new Error(text || "Prediction failed");
                    }
                    const json = JSON.parse(text);
                    setPrediction(json);
                  } catch (e: any) {
                    setPredictionError(
                      e?.message ?? "Prediction request failed"
                    );
                  } finally {
                    setPredicting(false);
                  }
                }}
                disabled={predicting}
              >
                {predicting ? (
                  <span className="inline-flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />{" "}
                    Predicting...
                  </span>
                ) : (
                  <span className="inline-flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" /> Predict
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* prediction result now shown in Campaign Performance Data section */}
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaign Performance Data</CardTitle>
          {/* <CardDescription>
            {filteredData.length} campaign{filteredData.length !== 1 ? "s" : ""}{" "}
            found
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          {predictionError && (
            <div className="mb-3 text-sm text-red-600">{predictionError}</div>
          )}
          {prediction && (
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Prediction Result</div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="h-12">
                      <TableHead className="font-semibold text-base px-4 py-3">
                        Metric
                      </TableHead>
                      <TableHead className="font-semibold text-base px-4 py-3">
                        Value
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(prediction).map(([k, v]) => (
                      <TableRow key={k} className="hover:bg-muted/50 h-12">
                        <TableCell className="font-medium text-base px-4 py-3">
                          {k}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-base">
                          {renderPredictionValue(k, v)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          {/* {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading predictive insights...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="h-12">
                    <TableHead className="font-semibold text-base px-4 py-3">
                      Campaign Name
                    </TableHead>
                      <TableHead className="font-semibold text-base px-4 py-3">
                        Spend (₹)
                      </TableHead>
                    <TableHead className="font-semibold text-base px-4 py-3">
                      Status
                    </TableHead>
                      <TableHead className="font-semibold text-base px-4 py-3">
                        CPC (₹)
                      </TableHead>
                    <TableHead className="font-semibold text-base px-4 py-3">
                      Bidding Strategy
                    </TableHead>
                    <TableHead className="font-semibold text-base px-4 py-3">
                      Conversions
                    </TableHead>
                      <TableHead className="font-semibold text-base px-4 py-3">
                        Revenue (₹)
                      </TableHead>
                    <TableHead className="font-semibold text-base px-4 py-3">
                      Profitable
                    </TableHead>
                    <TableHead className="font-semibold text-base px-4 py-3">
                      Recommendation
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((campaign, index) => (
                    <TableRow key={index} className="hover:bg-muted/50 h-12">
                      <TableCell className="font-medium text-base px-4 py-3">
                        {campaign.Campaign_Name}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-base">₹{formatCurrencyINR(campaign.Spend)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          className={`${getStatusColor(
                            campaign.Status
                          )} text-sm px-2 py-1`}
                        >
                          {campaign.Status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="font-medium text-base">₹{campaign.CPC?.toFixed(2)}</span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-base">
                          {campaign.Bidding_Strategy}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="font-medium text-base">
                          {campaign.Conversions}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-base">₹{formatCurrencyINR(campaign.Revenue)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          className={`${getProfitabilityColor(
                            campaign.Profitable === "Yes" ||
                              campaign.Profitable === true
                          )} text-sm px-2 py-1`}
                        >
                          <div className="flex items-center space-x-1">
                            {getProfitabilityIcon(
                              campaign.Profitable === "Yes" ||
                                campaign.Profitable === true
                            )}
                            <span>
                              {campaign.Profitable === "Yes" ||
                              campaign.Profitable === true
                                ? "Yes"
                                : "No"}
                            </span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="max-w-sm">
                          <p className="text-base text-muted-foreground">
                            {campaign.Recommendation}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )} */}

          {!loading && !error && filteredData.length === 0 && (
            <div className="text-center py-8">
              {/* <p className="text-muted-foreground">
                No campaigns found matching your search criteria.
              </p> */}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredData.length} filtered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Profitable Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {
                data.filter(
                  (c) => c.Profitable === "Yes" || c.Profitable === true
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {data.length > 0
                ? (
                    (data.filter(
                      (c) => c.Profitable === "Yes" || c.Profitable === true
                    ).length /
                      data.length) *
                    100
                  ).toFixed(1)
                : 0}
              % success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
                data.reduce((sum, c) => sum + (c.Spend || 0), 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
                data.reduce((sum, c) => sum + (c.Revenue || 0), 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">Generated revenue</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
