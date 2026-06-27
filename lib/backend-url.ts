import { headers } from "next/headers";

function trimTrailingSlashes(value: string) {
  return value.replace(/\/+$/, "");
}

export async function getBackendBaseUrl() {
  const configuredUrl = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL;

  if (configuredUrl) {
    return trimTrailingSlashes(configuredUrl);
  }

  try {
    const headerStore = await headers();
    const forwardedHost = headerStore.get("x-forwarded-host");
    const host = forwardedHost ?? headerStore.get("host");

    if (host) {
      const forwardedProto = headerStore.get("x-forwarded-proto");
      const protocol = forwardedProto ?? (host.includes("localhost") ? "http" : "https");
      return `${protocol}://${host}/api/backend`;
    }
  } catch {
    // Ignore header lookup failures outside request scope.
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/backend`;
  }

  if (process.env.NODE_ENV !== "production") {
    return "http://127.0.0.1:3000/api/backend";
  }

  throw new Error("BACKEND_URL_MISSING");
}
