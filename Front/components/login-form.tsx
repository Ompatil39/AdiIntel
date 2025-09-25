"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login verification (skip OTP)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Login attempt:", { clientName, email, password });

    // Hardcoded login acceptance; redirect to dashboard (Executive Overview default)
    router.push("/");

    setIsLoading(false);
  };

  return (
    <Card className="w-full shadow-xl border border-border/40 bg-card/60 backdrop-blur-md">
      <CardHeader className="space-y-3 pb-6">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-base">AI</span>
          </div>
          <div className="text-xl font-semibold tracking-tight">AdIntelli</div>
        </div>
        <CardTitle className="text-2xl font-semibold text-center">Welcome back</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Sign in to continue to your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-sm font-medium">
              Client Name
            </Label>
            <Input
              id="clientName"
              type="text"
              placeholder="Enter your client name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="h-11 focus-visible:ring-2 focus-visible:ring-primary/80"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 focus-visible:ring-2 focus-visible:ring-primary/80"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <a href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 h-11 focus-visible:ring-2 focus-visible:ring-primary/80"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-11 text-sm font-medium bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default LoginForm;


