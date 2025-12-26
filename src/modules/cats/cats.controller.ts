import { AbstractController } from "../../core/controller";
import { createCatSchema, updateCatSchema } from "./cats.schema";
import { CatsService } from "./cats.service";

export class CatsController extends AbstractController {
  public service = new CatsService();
  public path = "/cats";

  setupRoutes() {
    this.routes.get("/", async (c) => {
      const result = await this.service.getAllCats();
      return c.json({ result }, { status: 200 });
    });
    this.routes.get("/:id", async (c) => {
      const id = c.req.param("id");
      const result = await this.service.getOneCat(id);
      if (!result) return this.err(c, "Cat not found");
      return this.ok(c, result);
    });
    this.routes.delete("/:id", async (c) => {
      const id = c.req.param("id");
      const result = await this.service.deleteCat(id);
      if (!result) return this.err(c, "Cat not found");
      return this.ok(c, result);
    });
    this.routes.post("/", this.validator(createCatSchema), async (c) => {
      const valid = c.req.valid("json");
      const result = await this.service.createCat(valid);
      if (!result) return this.err(c, "Unable to create cat");
      return this.ok(c, result, 201);
    });
    this.routes.patch("/:id", this.validator(updateCatSchema), async (c) => {
      const id = c.req.param("id");
      const valid = c.req.valid("json");
      const result = await this.service.updateCat(id, valid);
      if (!result) return this.err(c, "Unable to update cat");
      return this.ok(c, result);
    });
  }
}
