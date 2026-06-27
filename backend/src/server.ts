import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Backend CMS is running on http://localhost:${env.PORT}`);
});
