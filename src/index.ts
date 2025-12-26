import { serve } from "bun";
import { Hono } from "hono";
import { controllers } from "./modules";

function main() {
  const app = new Hono();

  controllers.forEach((controller) => {
    app.route(controller.path, controller.routes);
  });

  serve({
    port: 3000,
    fetch: app.fetch,
  });
}
main();
