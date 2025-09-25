"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Bot,
  TrendingUp,
  IndianRupee,
  Target,
  Lightbulb,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AIActionPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [botOpen, setBotOpen] = useState(false);
  const [messages, setMessages] = useState<
    { id: string; role: "user" | "assistant"; content: string }[]
  >([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I’m your AdIntelli AI assistant. Ask me about campaign performance, budget shifts, or optimization ideas.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

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
        return <IndianRupee className="h-4 w-4" />;
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

  useEffect(() => {
    if (!botOpen) return;
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [botOpen, messages.length]);

  const openBot = () => {
    setBotOpen(true);
  };

  const closeBot = () => {
    setBotOpen(false);
  };

  const clearConversation = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi! I’m your AdIntelli AI assistant. Ask me about campaign performance, budget shifts, or optimization ideas.",
      },
    ]);
  };

  const sendMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isSending) return;
    const userMsg = {
      id: `${Date.now()}-user`,
      role: "user" as const,
      content: trimmed,
    };
    setMessages((m) => [...m, userMsg]);
    setInputValue("");
    setIsSending(true);

    // API call to Flask /chat
    const res = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: trimmed }),
    });
    const data = await res.json();
    const assistantText = data.reply;

    const botMsg = {
      id: `${Date.now()}-bot`,
      role: "assistant" as const,
      content: assistantText,
    };
    setMessages((m) => [...m, botMsg]);

    setIsSending(false);
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  if (collapsed) {
    return (
      // MODIFIED: Added flex utilities to position buttons at top and bottom
      <div className="w-12 bg-card border-l border-border p-2 hidden lg:flex flex-col justify-between h-full">
        {/* Button to expand the panel (top) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(false)}
          className="w-full h-10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* ADDED: AI Conversation button in collapsed state (bottom) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={openBot}
          className="w-full h-10 bg-[var(--primary-100)] text-[var(--primary-700)]"
        >
          <Bot className="h-4 w-4" />
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

      {/* AI Conversation Button (Expanded View) */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={openBot}
          className={cn(
            "w-full justify-start text-left bg-[var(--primary-100)] text-[var(--primary-700)]"
            // Note: `collapsed`-related classes are not needed here but are harmless
          )}
        >
          <Bot className={cn("h-4 w-4", "mr-3")} />
          <span>AI Conversation</span>
        </Button>
      </div>

      {/* AI Bot Popup */}
      <Dialog open={botOpen} onOpenChange={(o) => (o ? openBot() : closeBot())}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" /> AI Conversation
            </DialogTitle>
            <DialogDescription className="text-xs">
              Ask about performance, budgets, keywords, creatives, or targets.
            </DialogDescription>
          </DialogHeader>

          <div className="px-4 pb-4">
            <div className="mb-2 flex items-center justify-end">
              <Button variant="ghost" size="sm" onClick={clearConversation}>
                Clear conversation
              </Button>
            </div>
            <div
              ref={scrollRef}
              className="h-80 sm:h-96 overflow-y-auto rounded-md border bg-card p-3"
            >
              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex w-full",
                      m.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-md px-3 py-2 text-sm shadow-sm",
                        m.role === "user"
                          ? "bg-[var(--primary-100)] text-[var(--primary-700)]"
                          : "bg-secondary text-foreground border"
                      )}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-secondary border text-muted-foreground max-w-[85%] rounded-md px-3 py-2 text-sm shadow-sm">
                      Thinking…
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Input
                placeholder="Type your question…"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={isSending || inputValue.trim().length === 0}
              >
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
