import { serve } from "bun";
import { App } from "./core/app";
import { CatsController } from "./modules/cats/controller";

const app = new App([
  new CatsController(), // everything cat-related!
]);

serve({
  port: 3000,
  fetch: app.instance.fetch,
});
