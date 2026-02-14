import { serve } from "@hono/node-server";
import { app } from "./app.js";

serve({
  fetch: app.fetch,
  hostname: "0.0.0.0",
  port: 3000,
});
