import { serve } from "bun";
import { App } from "./core/app";
import { AuthController } from "./modules/auth/controller";
import { TodosController } from "./modules/todos/controller";

const app = new App([
  new TodosController(), // todos
  new AuthController(), // auth
]);

serve({
  port: 3000,
  fetch: app.instance.fetch,
});
