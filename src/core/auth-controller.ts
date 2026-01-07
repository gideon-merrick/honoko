import { sign } from "hono/jwt";
import { BaseHonokoController } from "./base-controller";

export abstract class AuthHonokoController extends BaseHonokoController {
  protected async generateToken<T>(payload: T) {
    return await sign(
      { ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
      String(process.env.JWT_SECRET),
    );
  }
}
