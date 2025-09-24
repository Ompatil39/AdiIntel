"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { DollarSign, TrendingUp, AlertCircle, Target, Zap } from "lucide-react"

const budgetData = [
  { campaign: "Summer Sale 2024", allocated: 5000, spent: 3200, remaining: 1800, performance: 4.2, status: "optimal" },
  {
    campaign: "Brand Awareness Q2",
    allocated: 8000,
    spent: 6100,
    remaining: 1900,
    performance: 3.8,
    status: "underspend",
  },
  { campaign: "Product Launch", allocated: 3000, spent: 2800, remaining: 200, performance: 2.9, status: "overspend" },
  {
    campaign: "Retargeting Campaign",
    allocated: 2500,
    spent: 1200,
    remaining: 1300,
    performance: 5.1,
    status: "optimal",
  },
]

const forecastData = [
  { month: "Jul", current: 28000, optimized: 32000, roi: 4.2 },
  { month: "Aug", current: 30000, optimized: 36000, roi: 4.5 },
  { month: "Sep", current: 32000, optimized: 39000, roi: 4.8 },
  { month: "Oct", current: 35000, optimized: 43000, roi: 5.1 },
  { month: "Nov", current: 40000, optimized: 48000, roi: 5.3 },
  { month: "Dec", current: 45000, optimized: 54000, roi: 5.6 },
]

const allocationData = [
  { platform: "Google Ads", current: 45, recommended: 52, performance: 4.8 },
  { platform: "Facebook", current: 30, recommended: 28, performance: 3.9 },
  { platform: "LinkedIn", current: 15, recommended: 12, performance: 3.2 },
  { platform: "Twitter", current: 10, recommended: 8, performance: 2.8 },
]

export function BudgetOptimization() {
  const [budgetSlider, setBudgetSlider] = useState([75000])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-green-100 text-green-800 border-green-200"
      case "underspend":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "overspend":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "optimal":
        return <Target className="h-4 w-4" />
      case "underspend":
        return <TrendingUp className="h-4 w-4" />
      case "overspend":
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Budget Optimization</h1>
        <p className="text-muted-foreground">AI-powered budget allocation and spending recommendations</p>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$18,500</div>
            <p className="text-xs text-muted-foreground">Monthly allocation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$13,300</div>
            <p className="text-xs text-muted-foreground">71.9% of budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,200</div>
            <p className="text-xs text-muted-foreground">28.1% remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. ROAS</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.0x</div>
            <p className="text-xs text-green-600">+12% vs target</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Budget Status</CardTitle>
          <CardDescription>Current spending and performance by campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgetData.map((campaign, index) => (
              <div key={campaign.campaign} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium">{campaign.campaign}</h3>
                    <Badge className={getStatusColor(campaign.status)}>
                      {getStatusIcon(campaign.status)}
                      <span className="ml-1 capitalize">{campaign.status}</span>
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${campaign.spent.toLocaleString()} / ${campaign.allocated.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">{campaign.performance}x ROAS</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget Utilization</span>
                    <span>{Math.round((campaign.spent / campaign.allocated) * 100)}%</span>
                  </div>
                  <Progress value={(campaign.spent / campaign.allocated) * 100} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>AI Budget Recommendations</span>
          </CardTitle>
          <CardDescription>Optimize your budget allocation for better performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Increase Brand Awareness Q2 Budget</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    This campaign is underspending with high ROAS potential. Recommend increasing budget by $2,000 for
                    23% more conversions.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Apply Recommendation
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Pause Product Launch Campaign</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Low ROAS (2.9x) and high spend rate. Consider pausing and reallocating $1,500 to better performing
                    campaigns.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Review Campaign
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ROI Forecast</CardTitle>
            <CardDescription>Projected ROI with current vs optimized budget allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="current"
                  stackId="1"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="optimized"
                  stackId="2"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Budget Allocation</CardTitle>
            <CardDescription>Current vs recommended budget distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={allocationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="current" fill="hsl(var(--chart-1))" />
                <Bar dataKey="recommended" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Budget Simulator */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Simulator</CardTitle>
          <CardDescription>Adjust total budget to see projected impact on performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium">Monthly Budget: ${budgetSlider[0].toLocaleString()}</label>
              <Slider
                value={budgetSlider}
                onValueChange={setBudgetSlider}
                max={100000}
                min={10000}
                step={5000}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Projected Conversions</p>
                <p className="text-2xl font-bold">{Math.round(budgetSlider[0] * 0.012)}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Estimated ROAS</p>
                <p className="text-2xl font-bold">{(4.2 + (budgetSlider[0] - 75000) * 0.00001).toFixed(1)}x</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Revenue Impact</p>
                <p className="text-2xl font-bold">${Math.round(budgetSlider[0] * 4.2).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
