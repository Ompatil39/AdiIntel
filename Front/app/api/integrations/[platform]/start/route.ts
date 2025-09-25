import { NextRequest, NextResponse } from "next/server";

// This route proxies to backend to initiate OAuth for a given platform.
// Expected backend env: BACKEND_BASE_URL, e.g., http://localhost:8000

export async function POST(req: NextRequest, { params }: { params: { platform: string } }) {
    const backend = process.env.BACKEND_BASE_URL;
    if (!backend) {
        return new NextResponse("Server not configured. Set BACKEND_BASE_URL.", { status: 500 });
    }
    const platform = params.platform;
    try {
        const res = await fetch(`${backend}/integrations/${platform}/start`, {
            method: "POST",
            headers: { "content-type": "application/json" },
        });
        const text = await res.text();
        if (!res.ok) {
            return new NextResponse(text || "Failed to initiate OAuth.", { status: res.status });
        }
        // Expect JSON { url: string }
        return NextResponse.json(JSON.parse(text));
    } catch (e: any) {
        return new NextResponse(e?.message ?? "Upstream error.", { status: 502 });
    }
}


