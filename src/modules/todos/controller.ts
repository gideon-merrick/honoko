import { z } from "zod";
import { Controller } from "../../core/controller";
import { TodosService } from "./service";

export class TodosController extends Controller {
  public path = "/todos";
  private service = new TodosService();
  private middleware = this.createAuthMiddleware();

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
    this.router.get("/", this.middleware, async (c) => {
      const currentUser = c.get("user");
      const result = await this.service.getAllFromUser(currentUser.id);
      return this.ok(c, result);
    });
    this.router.get("/:id", this.middleware, async (c) => {
      const id = c.req.param("id");
      const currentUser = c.get("user");
      const result = await this.service.getOneFromUser(id, currentUser.id);
      return this.ok(c, result);
    });
    this.router.post("/", this.middleware, this.createValidator(this.schemas.create), async (c) => {
      const data = c.req.valid("json");
      const currentUser = c.get("user");
      const result = await this.service.makeOne({ ...data, userId: currentUser.id });
      return this.ok(c, result);
    });
    this.router.patch("/:id", this.middleware, this.createValidator(this.schemas.update), async (c) => {
      const id = c.req.param("id");
      const data = c.req.valid("json");
      const currentUser = c.get("user");
      const result = this.service.updateOneFromUser(id, currentUser.id, data);
      return this.ok(c, result);
    });
    this.router.delete("/:id", this.middleware, async (c) => {
      const id = c.req.param("id");
      const currentUser = c.get("user");
      const result = this.service.deleteOneFromUser(id, currentUser.id);
      return this.ok(c, result);
    });
    this.router.get("/toggle/:id", this.middleware, async (c) => {
      const id = c.req.param("id");
      const currentUser = c.get("user");
      const result = this.service.toggleOneFromUser(id, currentUser.id);
      return this.ok(c, result);
    });
  }
}
