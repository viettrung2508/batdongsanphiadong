import { NextRequest, NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-session";

function getBackendBaseUrl() {
  const value = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!value) {
    throw new Error("BACKEND_URL_MISSING");
  }

  return value.replace(/\/+$/, "");
}

async function proxyRequest(request: NextRequest, params: Promise<{ path: string[] }>) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  }

  const { path } = await params;
  const targetUrl = `${getBackendBaseUrl()}/api/${path.join("/")}${request.nextUrl.search}`;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const cookie = request.headers.get("cookie");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  if (cookie) {
    headers.set("cookie", cookie);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store"
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const response = await fetch(targetUrl, init);
  const hasNoBodyStatus = response.status === 204 || response.status === 205 || response.status === 304;
  const responseText = hasNoBodyStatus ? null : await response.text();
  const proxyResponse = new NextResponse(responseText, {
    status: response.status
  });

  const responseContentType = response.headers.get("content-type");
  if (responseContentType) {
    proxyResponse.headers.set("content-type", responseContentType);
  }

  return proxyResponse;
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context.params);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context.params);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context.params);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context.params);
}
