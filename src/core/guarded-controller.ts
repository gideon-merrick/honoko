import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import type { AppVariables, CurrentUser } from "../types";
import { BaseHonokoController } from "./base-controller";

export abstract class GuardedHonokoController extends BaseHonokoController {
  constructor() {
    super();
    this.router.use("*", this.createAuthMiddleware());
  }

  private createAuthMiddleware() {
    return createMiddleware<{ Variables: AppVariables }>(async (c, next) => {
      const authHeader = c.req.header("Authorization");
      if (!authHeader) return this.fail(c, { auth: ["Authorization header missing"] });
      const token = authHeader.replace("Bearer ", "");
      if (!token) return this.fail(c, { auth: ["Token missing"] });
      try {
        const payload = await verify(token, String(process.env.JWT_SECRET));
        c.set("currentUser", payload as CurrentUser);
        await next();
      } catch {
        return this.fail(c, { auth: ["Invalid or expired token"] });
      }
    });
  }

  protected currentUser(c: Context<{ Variables: AppVariables }>): CurrentUser {
    return c.get("currentUser");
  }
}
