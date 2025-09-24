"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bot,
  TrendingUp,
  DollarSign,
  Target,
  Lightbulb,
  ChevronRight,
  X,
} from "lucide-react";

export function AIActionPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const [aiInsights, setAiInsights] = useState<any[]>([]);

  // Sample campaign data directly inside the component
  const campaigns = [
    {
      Campaign_Name: "Campaign_8",
      Location: "Mumbai",
      Device: "Desktop",
      Keyword: "travel",
      Ad_Date: "2024-06-23",
      Impressions: 2661,
      Clicks: 282.24,
      Conversion_Rate: 0.1615,
      Leads: 81.12,
      Conversions: 49.08,
      Sale_Amount: 14191.8,
      Cost: 445.33,
    },
    {
      Campaign_Name: "Campaign_11",
      Location: "Bengaluru",
      Device: "Desktop",
      Keyword: "software",
      Ad_Date: "2024-09-12",
      Impressions: 7830,
      Clicks: 800.61,
      Conversion_Rate: 0.167,
      Leads: 219.75,
      Conversions: 132.8,
      Sale_Amount: 34624.0,
      Cost: 1300.43,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "optimization":
        return <TrendingUp className="h-4 w-4" />;
      case "creative":
        return <Lightbulb className="h-4 w-4" />;
      case "targeting":
        return <Target className="h-4 w-4" />;
      case "bidding":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  // Generate insights dynamically from sample data
  useEffect(() => {
    if (!campaigns || campaigns.length === 0) return;

    const enriched = campaigns.map((c) => ({
      ...c,
      CTR: c.Clicks / c.Impressions,
      ROAS: c.Sale_Amount / c.Cost,
      CPC: c.Cost / c.Clicks,
    }));

    const insights: any[] = [];

    // Budget Reallocation
    const sortedByROAS = [...enriched].sort((a, b) => b.ROAS - a.ROAS);
    if (sortedByROAS.length >= 2) {
      const low = sortedByROAS[sortedByROAS.length - 1];
      const high = sortedByROAS[0];
      insights.push({
        id: 1,
        type: "optimization",
        priority: "high",
        title: "Budget Reallocation Opportunity",
        description: `Move $${Math.round(low.Cost)} from underperforming ${
          low.Campaign_Name
        } to high-ROAS ${high.Campaign_Name} campaign`,
        impact: `+${Math.round((high.ROAS - low.ROAS) * 100)}% conversions`,
        confidence: 92,
      });
    }

    // Creative Refresh
    enriched.forEach((c, i) => {
      if (c.CTR < 0.1) {
        insights.push({
          id: 2 + i,
          type: "creative",
          priority: "medium",
          title: "Creative Refresh Needed",
          description: `${c.Campaign_Name} has low CTR (${(c.CTR * 100).toFixed(
            1
          )}%). Consider refreshing creatives.`,
          impact: `+15% CTR`,
          confidence: 87,
        });
      }
    });

    // Audience Expansion
    enriched.forEach((c, i) => {
      if (c.ROAS > 2) {
        insights.push({
          id: 20 + i,
          type: "targeting",
          priority: "high",
          title: "Audience Expansion Opportunity",
          description: `Similar audiences to ${c.Campaign_Name} may yield high ROAS.`,
          impact: `+34% reach`,
          confidence: 89,
        });
      }
    });

    // Bid Strategy Optimization
    enriched.forEach((c, i) => {
      if (c.ROAS < 2) {
        insights.push({
          id: 50 + i,
          type: "bidding",
          priority: "low",
          title: "Bid Strategy Optimization",
          description: `Consider switching bidding strategy for ${c.Campaign_Name} to improve cost efficiency.`,
          impact: `-12% CPC`,
          confidence: 78,
        });
      }
    });

    setAiInsights(insights);
  }, []);

  if (collapsed) {
    return (
      <div className="w-12 bg-card border-l border-border p-2 hidden lg:block">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(false)}
          className="w-full h-10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-72 sm:w-80 bg-card border-l border-border flex flex-col h-full">
      <div className="p-3 sm:p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <h2 className="font-semibold text-sm sm:text-base">
              AI Action Plan
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setCollapsed(true)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          AI-powered insights and recommendations
        </p>
      </div>

      <ScrollArea className="flex-1 h-0">
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          <div>
            <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">
              AI Insights
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {aiInsights.map((insight) => (
                <Card key={insight.id} className="p-2 sm:p-3">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="mt-0.5 flex-shrink-0">
                      {getTypeIcon(insight.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1">
                        <h4 className="font-medium text-xs sm:text-sm leading-tight">
                          {insight.title}
                        </h4>
                        <Badge
                          className={`text-xs ${getPriorityColor(
                            insight.priority
                          )} flex-shrink-0`}
                        >
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                        {insight.description}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-green-600 font-medium">
                          {insight.impact}
                        </span>
                        <span className="text-muted-foreground">
                          {insight.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
