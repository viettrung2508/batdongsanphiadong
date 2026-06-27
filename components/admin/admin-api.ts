export const adminApiBaseUrl = "/api/admin-backend";

export async function fetchAdminApi(input: string, init?: RequestInit) {
  const normalizedPath = input === "/api" ? "" : input.replace(/^\/api(?=\/|$)/, "");
  const proxyPath = normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;

  return fetch(`/api/admin-backend${proxyPath}`, {
    credentials: "include",
    ...init,
    headers: {
      ...(init?.headers ?? {})
    }
  });
}
