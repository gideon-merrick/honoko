import { Honoko } from "./core/honoko";
import { AuthController } from "./modules/auth/controller";
import { TodosController } from "./modules/todos/controller";

const app = new Honoko([
  new TodosController(), // todos
  new AuthController(), // auth
]);

app.listen(3000);
