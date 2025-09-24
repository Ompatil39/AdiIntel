"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { ImageIcon, Video, FileText, MousePointer, TrendingUp, AlertTriangle, CheckCircle, Star } from "lucide-react"

const creativeData = [
  {
    id: 1,
    name: "Summer Sale Hero Banner",
    type: "image",
    format: "1200x628",
    performance: 87,
    ctr: 4.2,
    conversions: 156,
    impressions: 45000,
    issues: ["Low contrast text", "CTA too small"],
    suggestions: ["Increase font size", "Use brighter CTA color"],
    status: "needs-attention",
  },
  {
    id: 2,
    name: "Product Demo Video",
    type: "video",
    format: "16:9",
    performance: 92,
    ctr: 5.8,
    conversions: 234,
    impressions: 67000,
    issues: [],
    suggestions: ["Consider shorter version for mobile"],
    status: "excellent",
  },
  {
    id: 3,
    name: "Brand Story Carousel",
    type: "carousel",
    format: "1080x1080",
    performance: 76,
    ctr: 3.1,
    conversions: 89,
    impressions: 32000,
    issues: ["Text readability on mobile", "Inconsistent branding"],
    suggestions: ["Simplify text", "Use brand colors consistently"],
    status: "needs-improvement",
  },
  {
    id: 4,
    name: "Holiday Promotion Ad",
    type: "image",
    format: "1080x1350",
    performance: 94,
    ctr: 6.2,
    conversions: 312,
    impressions: 78000,
    issues: [],
    suggestions: ["Scale this creative to other campaigns"],
    status: "excellent",
  },
]

const performanceData = [
  { creative: "Hero Banner", week1: 3.2, week2: 3.8, week3: 4.1, week4: 4.2 },
  { creative: "Demo Video", week1: 5.1, week2: 5.4, week3: 5.6, week4: 5.8 },
  { creative: "Carousel", week1: 3.5, week2: 3.2, week3: 3.0, week4: 3.1 },
  { creative: "Holiday Ad", week1: 5.8, week2: 6.0, week3: 6.1, week4: 6.2 },
]

const creativeAnalysis = [
  { subject: "Visual Appeal", current: 85, benchmark: 78 },
  { subject: "Brand Consistency", current: 92, benchmark: 85 },
  { subject: "Message Clarity", current: 78, benchmark: 82 },
  { subject: "CTA Effectiveness", current: 88, benchmark: 75 },
  { subject: "Mobile Optimization", current: 74, benchmark: 80 },
  { subject: "Emotional Impact", current: 91, benchmark: 77 },
]

const formatData = [
  { format: "Square (1:1)", performance: 78, usage: 35 },
  { format: "Landscape (16:9)", performance: 85, usage: 28 },
  { format: "Portrait (4:5)", performance: 82, usage: 22 },
  { format: "Story (9:16)", performance: 88, usage: 15 },
]

export function CreativeInsights() {
  const [selectedTab, setSelectedTab] = useState("overview")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800 border-green-200"
      case "needs-attention":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "needs-improvement":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="h-4 w-4" />
      case "needs-attention":
        return <AlertTriangle className="h-4 w-4" />
      case "needs-improvement":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "carousel":
        return <FileText className="h-4 w-4" />
      default:
        return <ImageIcon className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Creative Insights</h1>
        <p className="text-muted-foreground">AI-powered analysis of your ad creatives and performance optimization</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Creative Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Creatives</CardTitle>
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+3 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-green-600">+5% vs last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best CTR</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6.2%</div>
                <p className="text-sm text-muted-foreground">Holiday Promotion Ad</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-yellow-600">3 high priority</p>
              </CardContent>
            </Card>
          </div>

          {/* Creative List */}
          <Card>
            <CardHeader>
              <CardTitle>Creative Performance</CardTitle>
              <CardDescription>Performance scores and optimization opportunities for your ad creatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {creativeData.map((creative) => (
                  <div key={creative.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(creative.type)}
                        <div>
                          <h3 className="font-medium">{creative.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {creative.format} • {creative.type}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(creative.status)}>
                        {getStatusIcon(creative.status)}
                        <span className="ml-1 capitalize">{creative.status.replace("-", " ")}</span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{creative.performance}%</p>
                        <p className="text-sm text-muted-foreground">Performance Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{creative.ctr}%</p>
                        <p className="text-sm text-muted-foreground">CTR</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{creative.conversions}</p>
                        <p className="text-sm text-muted-foreground">Conversions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{creative.impressions.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Impressions</p>
                      </div>
                    </div>

                    <Progress value={creative.performance} className="mb-3" />

                    {creative.issues.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-red-600 mb-1">Issues Found:</p>
                        <ul className="text-sm text-red-600 list-disc list-inside">
                          {creative.issues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {creative.suggestions.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-blue-600 mb-1">AI Suggestions:</p>
                        <ul className="text-sm text-blue-600 list-disc list-inside">
                          {creative.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Creative
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Duplicate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Creative Performance Trends</CardTitle>
                <CardDescription>CTR trends over the last 4 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="creative" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="week1" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                    <Line type="monotone" dataKey="week2" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                    <Line type="monotone" dataKey="week3" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                    <Line type="monotone" dataKey="week4" stroke="hsl(var(--chart-4))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Format Performance</CardTitle>
                <CardDescription>Performance and usage by creative format</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formatData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="format" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="performance" fill="hsl(var(--chart-1))" />
                    <Bar dataKey="usage" fill="hsl(var(--chart-2))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Creative Analysis Radar</CardTitle>
              <CardDescription>Your creative performance vs industry benchmarks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={creativeAnalysis}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Your Performance"
                    dataKey="current"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Industry Benchmark"
                    dataKey="benchmark"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span>High Priority Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900">Scale Holiday Promotion Ad</h4>
                    <p className="text-sm text-green-700 mt-1">
                      This creative has the highest CTR (6.2%) and conversion rate. Recommend increasing budget
                      allocation by 40% and testing similar creative variations.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Apply Recommendation
                    </Button>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-900">Fix Summer Sale Banner Issues</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Low contrast text and small CTA are hurting performance. Fixing these issues could improve CTR by
                      an estimated 15-20%.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Edit Creative
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900">Create Mobile-Optimized Versions</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      74% mobile optimization score is below benchmark. Create mobile-specific versions of
                      top-performing creatives for better engagement.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Start Creation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
