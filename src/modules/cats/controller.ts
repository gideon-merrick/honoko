import { z } from "zod";
import { AbstractController } from "../../core/controller";
import { CatsService } from "./service";

export class CatsController extends AbstractController {
  public path = "/cats";
  private service = new CatsService();

  public schemas = {
    create: z.object({
      name: z.string(),
      age: z.number().positive().max(30),
    }),
    update: z.object({
      name: z.string().optional(),
      age: z.number().positive().max(30).optional(),
    }),
  };

  public mount() {
    this.router.get("/", async (c) => {
      const result = await this.service.getAll();
      return this.ok(c, result);
    });
    this.router.get("/:id", async (c) => {
      const id = c.req.param("id");
      const result = await this.service.getOne(id);
      return this.ok(c, result);
    });
    this.router.post("/", this.validateUsing(this.schemas.create), async (c) => {
      const data = c.req.valid("json");
      const result = await this.service.makeOne(data);
      return this.ok(c, result);
    });
    this.router.patch("/:id", this.validateUsing(this.schemas.update), async (c) => {
      const id = c.req.param("id");
      const data = c.req.valid("json");
      const result = await this.service.updateOne(id, data);
      return this.ok(c, result);
    });
    this.router.delete("/:id", async (c) => {
      const id = c.req.param("id");
      const result = await this.service.deleteOne(id);
      return this.ok(c, result);
    });
  }
}
