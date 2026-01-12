import { App } from "./core/app";
import { AuthController } from "./modules/auth/controller";
import { TodosController } from "./modules/todos/controller";

const app = new App([
  new TodosController(), // todos
  new AuthController(), // auth
]);

app.listen(3000);
