import z from "zod";
import { Controller } from "../../core/controller";

export class AuthController extends Controller {
  public path = "/auth";
  private authMiddleware = this.createAuthMiddleware();

  public schemas = {
    login: z.object({
      email: z.email(),
      password: z.string().min(8),
    }),
  };

  public mount() {
    this.router.post("/login", this.createValidator(this.schemas.login), async (c) => {
      const { email, password } = c.req.valid("json");
      if (email === "test@example.com" && password === "password123") {
        const token = await this.generateToken({
          userId: "123",
          email: email,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
        });
        return this.ok(c, { token, user: { id: "123", email } });
      }
      return this.fail(c, { login: ["Invalid email or password"] });
    });
    this.router.get("/me", this.authMiddleware, async (c) => {
      const user = c.get("user");
      return this.ok(c, user);
    });
  }
}
