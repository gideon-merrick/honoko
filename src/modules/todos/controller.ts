import { z } from "zod";
import { Controller } from "../../core/controller";
import { TodosService } from "./service";

export class TodosController extends Controller {
  public path = "/todos";
  private todosService = new TodosService();
  private authMiddleware = this.createAuthMiddleware();

  public schemas = {
    create: z.object({
      title: z.string().min(3).max(50),
      completed: z.boolean().optional(),
    }),
    update: z.object({
      title: z.string().min(3).max(50).optional(),
      completed: z.boolean().optional(),
    }),
  };

  public mount() {
    this.router.get("/", this.authMiddleware, async (c) => {
      const currentUser = c.get("user");
      const result = await this.todosService.getAllFromUser(currentUser.id);
      return this.ok(c, result);
    });
    this.router.get("/:id", this.authMiddleware, async (c) => {
      const id = c.req.param("id");
      const currentUser = c.get("user");
      const result = await this.todosService.getOneFromUser(id, currentUser.id);
      return this.ok(c, result);
    });
    this.router.post("/", this.authMiddleware, this.createValidator(this.schemas.create), async (c) => {
      const data = c.req.valid("json");
      const currentUser = c.get("user");
      const result = await this.todosService.makeOne({ ...data, userId: currentUser.id });
      return this.ok(c, result);
    });
    this.router.patch("/:id", this.authMiddleware, this.createValidator(this.schemas.update), async (c) => {
      const id = c.req.param("id");
      const data = c.req.valid("json");
      const currentUser = c.get("user");
      const result = this.todosService.updateOneFromUser(id, currentUser.id, data);
      return this.ok(c, result);
    });
    this.router.delete("/:id", this.authMiddleware, async (c) => {
      const id = c.req.param("id");
      const currentUser = c.get("user");
      const result = this.todosService.deleteOneFromUser(id, currentUser.id);
      return this.ok(c, result);
    });
    this.router.get("/toggle/:id", this.authMiddleware, async (c) => {
      const id = c.req.param("id");
      const currentUser = c.get("user");
      const result = this.todosService.toggleOneFromUser(id, currentUser.id);
      return this.ok(c, result);
    });
  }
}
