"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const env_js_1 = require("./config/env.js");
const app = (0, app_js_1.createApp)();
app.listen(env_js_1.env.PORT, () => {
    console.log(`Backend CMS is running on http://localhost:${env_js_1.env.PORT}`);
});
