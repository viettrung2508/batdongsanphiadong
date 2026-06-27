// eslint-disable-next-line @typescript-eslint/no-require-imports
const backendModule = require("../../backend/dist-cjs/api/index.js") as {
  default?: (request: unknown, response: unknown) => unknown;
};
const backendApp = (backendModule.default ?? backendModule) as (
  request: unknown,
  response: unknown
) => unknown;

type RequestLike = {
  url?: string;
};

type ResponseLike = object;

export default function handler(request: RequestLike, response: ResponseLike) {
  if (request.url) {
    request.url = request.url.replace(/^\/api\/backend(?=\/|$)/, "/api") || "/api";
  }

  return backendApp(request as never, response as never);
}
