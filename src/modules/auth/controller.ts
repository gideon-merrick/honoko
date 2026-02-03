import type { ContentfulStatusCode } from "hono/utils/http-status";
import { AbstractController } from "../../core/controller.js";
import { auth } from "../../lib/auth.js";

export class AuthController extends AbstractController {
  public path = "/auth";

  public mount() {
    this.router.all("/*", async (c) => {
      const response = await auth.handler(c.req.raw);
      if (response.ok) return response;
      if (response.ok) return this.ok(c, { data: response });

      const errorData = await response.json();
      if (errorData.code && errorData.message) {
        return this.fail(c, { root: [errorData.message] }, response.status as ContentfulStatusCode);
      }
    });
  }
}
