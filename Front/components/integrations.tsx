"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckCircle2, CircleDashed, ExternalLink, HelpCircle, Link2, Loader2, PlugZap, ShieldCheck, Unplug } from "lucide-react";

type PlatformId = "google-ads" | "meta-ads" | "linkedin-ads" | "tiktok-ads" | "custom-api";

interface PlatformConfig {
  id: PlatformId;
  name: string;
  description: string;
  oauthDocsUrl: string;
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: "google-ads",
    name: "Google Ads",
    description: "Connect your Google Ads account to sync campaigns, cost, and conversions.",
    oauthDocsUrl: "https://developers.google.com/google-ads/api/docs/oauth/overview",
  },
  {
    id: "meta-ads",
    name: "Meta Ads",
    description: "Connect Facebook/Instagram Ads for spend, impressions, clicks, and results.",
    oauthDocsUrl: "https://developers.facebook.com/docs/facebook-login/",
  },
  {
    id: "linkedin-ads",
    name: "LinkedIn Ads",
    description: "Pull LinkedIn campaign performance to power dashboards and insights.",
    oauthDocsUrl: "https://learn.microsoft.com/linkedin/shared/authentication/client-credentials-flow",
  },
  {
    id: "tiktok-ads",
    name: "TikTok Ads",
    description: "Bring in TikTok Ads metrics and creatives for unified reporting.",
    oauthDocsUrl: "https://ads.tiktok.com/marketing_api/docs?id=1701890979375106",
  },
  {
    id: "custom-api",
    name: "Custom API",
    description: "Bring your own API (OAuth, API key, token, or basic auth).",
    oauthDocsUrl: "#",
  }
];

type ConnectionStatus = "disconnected" | "pending" | "connected";

interface IntegrationState {
  status: ConnectionStatus;
  apiKey?: string;
  config?: { [key: string]: string };
}
// Frontend-only demo: persist lightweight connection state per platform in localStorage
const STORAGE_KEY = "adintelli.integrations";
const DEFAULT_STATES: Record<PlatformId, IntegrationState> = {
  "google-ads": { status: "disconnected" },
  "meta-ads": { status: "disconnected" },
  "linkedin-ads": { status: "disconnected" },
  "tiktok-ads": { status: "disconnected" },
  "custom-api": { status: "disconnected" },
};
function loadStatesFromStorage(): Record<PlatformId, IntegrationState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function saveStatesToStorage(states: Record<PlatformId, IntegrationState>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
  } catch {}
}

export function Integrations() {
  const [states, setStates] = useState<Record<PlatformId, IntegrationState>>(DEFAULT_STATES);
  const [instructionOpen, setInstructionOpen] = useState<PlatformId | null>(null);
  const [connectOpen, setConnectOpen] = useState<PlatformId | null>(null);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [redirectUri, setRedirectUri] = useState("http://localhost:3000/integrations/callback");
  const [scopes, setScopes] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKeyLocal, setApiKeyLocal] = useState("");
  const [bearerToken, setBearerToken] = useState("");
  const [basicUser, setBasicUser] = useState("");
  const [basicPass, setBasicPass] = useState("");

  useEffect(() => {
    const saved = loadStatesFromStorage();
    if (saved) setStates({ ...DEFAULT_STATES, ...saved });
  }, []);

  const setAndPersist = (updater: (prev: Record<PlatformId, IntegrationState>) => Record<PlatformId, IntegrationState>) => {
    setStates((prev) => {
      const next = updater(prev);
      saveStatesToStorage(next);
      return next;
    });
  };

  const handleConnect = (platformId: PlatformId) => {
    setConnectOpen(platformId);
    const existing = states[platformId]?.config || {};
    setClientId(existing.clientId || "");
    setClientSecret(existing.clientSecret || "");
    setRedirectUri(existing.redirectUri || `http://localhost:3000/integrations/callback/${platformId}`);
    setScopes(existing.scopes || "");
    setBaseUrl(existing.baseUrl || "");
    setApiKeyLocal(existing.apiKey || states[platformId]?.apiKey || "");
    setBearerToken(existing.bearerToken || "");
    setBasicUser(existing.basicUser || "");
    setBasicPass(existing.basicPass || "");
  };

  const handleDisconnect = (platformId: PlatformId) => {
    setAndPersist((prev) => ({ ...prev, [platformId]: { status: "disconnected" } }));
  };

  const renderStatus = (state: IntegrationState) => {
    switch (state.status) {
      case "connected":
        return (
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <Badge className="bg-green-600">Connected</Badge>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <Badge className="bg-blue-600">Awaiting Approval</Badge>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <CircleDashed className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary">Not Connected</Badge>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Integrations</h1>
          <p className="text-sm text-muted-foreground">Connect your ad platforms to power unified dashboards.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {PLATFORMS.map((p) => {
          const s: IntegrationState = states[p.id] ?? { status: "disconnected" };
          return (
            <Card key={p.id} className="border bg-card">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">{p.name}</CardTitle>
                    <CardDescription>{p.description}</CardDescription>
                  </div>
                  {renderStatus(s)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {s.status !== "connected" ? (
                    <Button size="sm" onClick={() => handleConnect(p.id)}>
                      <PlugZap className="h-4 w-4 mr-2" /> Connect
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => handleDisconnect(p.id)}>
                      <Unplug className="h-4 w-4 mr-2" /> Disconnect
                    </Button>
                  )}

                  <Dialog open={instructionOpen === p.id} onOpenChange={(open) => setInstructionOpen(open ? p.id : null)}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <HelpCircle className="h-4 w-4 mr-2" /> How to connect
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Manual approval or enterprise setup</DialogTitle>
                        <DialogDescription>
                          Some accounts require admin approval. Follow these steps carefully.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 text-sm">
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Click Connect to open the platform consent window.</li>
                          <li>Sign in with the correct business account and accept requested permissions.</li>
                          <li>If prompted for admin approval, share this app ID with your admin and request approval.</li>
                          <li>After approval, return here and click Connect again if needed.</li>
                        </ol>
                        <Separator />
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          <a className="text-primary underline" href={p.oauthDocsUrl} target="_blank" rel="noreferrer">
                            View {p.name} OAuth instructions
                          </a>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" onClick={() => setInstructionOpen(null)}>Close</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={connectOpen === p.id} onOpenChange={(open) => setConnectOpen(open ? p.id : null)}>
                    <DialogContent className="max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Connect {p.name}</DialogTitle>
                        <DialogDescription>
                          Frontend-only demo. Choose a method below and follow the steps.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 text-sm">
                        <div className="space-y-2">
                          <div className="font-medium">Method A: OAuth (recommended)</div>
                          <ol className="list-decimal list-inside space-y-1">
                            <li>Create an app on the {p.name} developer portal.</li>
                            <li>Add redirect URI:
                              <div className="mt-1 rounded border bg-muted px-2 py-1 text-xs select-all">http://localhost:3000/integrations/callback/{p.id}</div>
                            </li>
                            <li>Grant scopes/permissions required for reading campaigns and metrics.</li>
                            <li>Save Client ID and Client Secret safely.</li>
                            <li>In a real backend, you'd exchange the code for tokens and store securely.</li>
                          </ol>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            <Input placeholder="Client ID" value={clientId} onChange={(e) => setClientId(e.target.value)} />
                            <Input placeholder="Client Secret" value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} />
                            <Input placeholder="Redirect URI" value={redirectUri} onChange={(e) => setRedirectUri(e.target.value)} className="sm:col-span-2" />
                            <Input placeholder="Scopes (space-separated)" value={scopes} onChange={(e) => setScopes(e.target.value)} className="sm:col-span-2" />
                          </div>
                          <div className="mt-2">
                            <div className="text-xs text-muted-foreground mb-1">Example authorization URL</div>
                            <div className="rounded border bg-muted px-2 py-1 text-xs break-all">
                              https://auth.example.com/authorize?response_type=code&client_id={clientId || 'YOUR_CLIENT_ID'}&redirect_uri={encodeURIComponent(redirectUri)}&scope={encodeURIComponent(scopes)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <ExternalLink className="h-4 w-4" />
                            <a className="text-primary underline" href={p.oauthDocsUrl} target="_blank" rel="noreferrer">Read {p.name} OAuth docs</a>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <div className="font-medium">Method B: API Key / Token / Basic</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Input placeholder="Base URL (https://api.example.com)" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} className="sm:col-span-2" />
                            <Input placeholder="API Key (optional)" value={apiKeyLocal} onChange={(e) => setApiKeyLocal(e.target.value)} />
                            <Input placeholder="Bearer Token (optional)" value={bearerToken} onChange={(e) => setBearerToken(e.target.value)} />
                            <Input placeholder="Basic Username (optional)" value={basicUser} onChange={(e) => setBasicUser(e.target.value)} />
                            <Input placeholder="Basic Password (optional)" type="password" value={basicPass} onChange={(e) => setBasicPass(e.target.value)} />
                          </div>
                          <div className="mt-2">
                            <div className="text-xs text-muted-foreground mb-1">cURL preview</div>
                            <div className="rounded border bg-muted px-2 py-1 text-xs break-all">
                              {`curl -X GET ${baseUrl || 'https://api.example.com/v1/campaigns'} `}
                              {apiKeyLocal ? `-H "X-API-Key: ${apiKeyLocal}" ` : ''}
                              {bearerToken ? `-H "Authorization: Bearer ${bearerToken}" ` : ''}
                              {(basicUser || basicPass) ? `-u ${basicUser}:${basicPass}` : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setAndPersist((prev) => ({
                              ...prev,
                              [p.id]: {
                                status: "connected",
                                apiKey: apiKeyLocal,
                                config: {
                                  clientId,
                                  clientSecret,
                                  redirectUri,
                                  scopes,
                                  baseUrl,
                                  apiKey: apiKeyLocal,
                                  bearerToken,
                                  basicUser,
                                  basicPass,
                                },
                              },
                            }));
                            setConnectOpen(null);
                          }}
                        >
                          Save & Mark Connected
                        </Button>
                        <Button onClick={() => setConnectOpen(null)}>Close</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default Integrations;


