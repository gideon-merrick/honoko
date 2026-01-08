import { z } from "zod";
import { AbstractController } from "../../core/controller";
import { TodosService } from "./service";

export class TodosController extends AbstractController {
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
      const result = await this.service.getAllFromUser(this.currentUser(c).id);
      return this.ok(c, result);
    });
    this.router.get("/:id", this.middleware, async (c) => {
      const id = c.req.param("id");
      const result = await this.service.getOneFromUser(id, this.currentUser(c).id);
      return this.ok(c, result);
    });
    this.router.post("/", this.middleware, this.validateUsing(this.schemas.create), async (c) => {
      const data = c.req.valid("json");
      const result = await this.service.makeOne({ ...data, userId: this.currentUser(c).id });
      return this.ok(c, result);
    });
    this.router.patch("/:id", this.middleware, this.validateUsing(this.schemas.update), async (c) => {
      const id = c.req.param("id");
      const data = c.req.valid("json");
      const result = this.service.updateOneFromUser(id, this.currentUser(c).id, data);
      return this.ok(c, result);
    });
    this.router.delete("/:id", this.middleware, async (c) => {
      const id = c.req.param("id");
      const result = this.service.deleteOneFromUser(id, this.currentUser(c).id);
      return this.ok(c, result);
    });
    this.router.get("/toggle/:id", this.middleware, async (c) => {
      const id = c.req.param("id");
      const result = this.service.toggleOneFromUser(id, this.currentUser(c).id);
      return this.ok(c, result);
    });
  }
}
