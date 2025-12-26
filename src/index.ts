import { serve } from "bun";
import { Hono } from "hono";

const app = new Hono();

serve({
  port: 3000,
  fetch: app.fetch,
});
