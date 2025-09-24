"use client";

import { useState } from "react";
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

const aiInsights = [
  {
    id: 1,
    type: "optimization",
    priority: "high",
    title: "Budget Reallocation Opportunity",
    description:
      "Move $2,000 from underperforming Product Launch to high-ROAS Summer Sale campaign",
    impact: "+23% conversions",
    confidence: 92,
  },
  {
    id: 2,
    type: "creative",
    priority: "medium",
    title: "Creative Refresh Needed",
    description:
      "Brand Awareness carousel showing creative fatigue. CTR declined 18% over 2 weeks",
    impact: "+15% CTR",
    confidence: 87,
  },
  {
    id: 3,
    type: "targeting",
    priority: "high",
    title: "Audience Expansion Opportunity",
    description:
      "Similar audiences to your best converters show 4.2x ROAS potential",
    impact: "+34% reach",
    confidence: 89,
  },
  {
    id: 4,
    type: "bidding",
    priority: "low",
    title: "Bid Strategy Optimization",
    description:
      "Switch to Target ROAS bidding for better cost efficiency on Google Ads",
    impact: "-12% CPC",
    confidence: 78,
  },
];

const quickActions = [
  { icon: TrendingUp, label: "Scale Top Performers", count: 3 },
  { icon: DollarSign, label: "Optimize Budgets", count: 5 },
  { icon: Target, label: "Refine Targeting", count: 2 },
  { icon: Lightbulb, label: "Creative Suggestions", count: 7 },
];

export function AIActionPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const [flaskReply, setFlaskReply] = useState<string>("");
  const [loading, setLoading] = useState(false);

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

  const handleConversation = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Hello from frontend" }),
      });
      const data = await response.json();
      setFlaskReply(data.reply);
    } catch (err) {
      console.error("Error talking to Flask:", err);
      setFlaskReply("❌ Failed to reach Flask API");
    } finally {
      setLoading(false);
    }
  };

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
          {/* <div>
            <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-14 sm:h-16 flex flex-col items-center justify-center relative bg-transparent text-xs"
                  >
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4 mb-1" />
                    <span className="text-xs text-center leading-tight">
                      {action.label}
                    </span>
                    {action.count > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {action.count}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          </div> */}

          {/* <Separator /> */}

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

          <Separator />

          <div>
            <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">
              Today's Summary
            </h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Spend</span>
                <span className="font-medium">$3,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conversions</span>
                <span className="font-medium">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg. ROAS</span>
                <span className="font-medium text-green-600">4.2x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Alerts</span>
                <span className="font-medium text-yellow-600">3</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">
              Ask AI Assistant
            </h3>
            <Button
              variant="outline"
              className="w-full text-xs sm:text-sm bg-transparent"
              onClick={handleConversation}
              disabled={loading}
            >
              <Bot className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              {loading ? "Thinking..." : "Start Conversation"}
            </Button>

            {flaskReply && (
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                {flaskReply}
              </p>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
