import z from "zod";
import { Controller } from "../../core/controller";
import { AuthService } from "./service";

export class AuthController extends Controller {
  public path = "/auth";
  private service = new AuthService();
  private authMiddleware = this.createAuthMiddleware();

  public schemas = {
    login: z.object({
      email: z.email(),
      password: z.string().min(8),
    }),
    register: z.object({
      username: z.string().min(3).max(16),
      email: z.email(),
      password: z.string().min(8),
    }),
  };

  public mount() {
    this.router.post("/login", this.createValidator(this.schemas.login), async (c) => {
      const { email, password } = c.req.valid("json");
      const user = await this.service.getWithEmail(email);
      if (!user) return this.fail(c, { email: ["User with email not found"] });
      const isValidPassword = await Bun.password.verify(password, user.password);
      if (!isValidPassword) return this.fail(c, { password: ["Incorrect password"] });
      const token = await this.generateToken({
        userId: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      });
      return this.ok(c, {
        token,
        user: { id: user.id, email: user.email },
      });
    });
    this.router.post("/register", this.createValidator(this.schemas.register), async (c) => {
      const { username, email, password } = c.req.valid("json");
      const existingUser = await this.service.getWithEmail(email);
      if (existingUser) return this.fail(c, { email: ["Email already in use"] });
      const hashedPassword = await Bun.password.hash(password);
      const user = await this.service.makeOne({ username, email, password: hashedPassword });
      const token = await this.generateToken({
        userId: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      });
      return this.ok(c, {
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
    });
    this.router.get("/me", this.authMiddleware, async (c) => {
      const user = c.get("user");
      return this.ok(c, user);
    });
  }
}
