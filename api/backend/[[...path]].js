const backendModule = require("../../backend/dist-cjs/api/index.js");
const backendApp = backendModule.default ?? backendModule;

module.exports = function handler(request, response) {
  if (request.url) {
    request.url = request.url.replace(/^\/api\/backend(?=\/|$)/, "/api") || "/api";
  }

  return backendApp(request, response);
};
