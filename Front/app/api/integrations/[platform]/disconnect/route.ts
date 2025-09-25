import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { platform: string } }) {
    const backend = process.env.BACKEND_BASE_URL;
    if (!backend) {
        return new NextResponse("Server not configured. Set BACKEND_BASE_URL.", { status: 500 });
    }
    const platform = params.platform;
    try {
        const res = await fetch(`${backend}/integrations/${platform}/disconnect`, { method: "POST" });
        const text = await res.text();
        if (!res.ok) {
            return new NextResponse(text || "Failed to disconnect.", { status: res.status });
        }
        return new NextResponse(text || "{\"ok\":true}", { status: 200, headers: { "content-type": "application/json" } });
    } catch (e: any) {
        return new NextResponse(e?.message ?? "Upstream error.", { status: 502 });
    }
}


