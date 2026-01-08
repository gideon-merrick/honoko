import { z } from "zod";
import { AbstractController } from "../../core/controller";
import type { CurrentUser } from "../../types";
import { AuthService } from "./service";

export class AuthController extends AbstractController {
  public path = "/auth";
  private service = new AuthService();
  private middleware = this.createAuthMiddleware();

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
    // POST /auth/login -> login route
    this.router.post("/login", this.validateUsing(this.schemas.login), async (c) => {
      const { email, password } = c.req.valid("json"); // get the request body
      const user = await this.service.getWithEmail(email); // find the corresponding user
      if (!user) return this.fail(c, { email: ["User not found"] }); // throw if user is not found
      const isValid = await Bun.password.verify(password, user.password); // check password
      if (!isValid) return this.fail(c, { password: ["Incorrect password"] }); // throw if password is incorrect
      // generate the token for the logged in user
      const token = await this.generateToken<CurrentUser>({
        id: user.id,
        username: user.username,
        email: user.email,
      });
      return this.ok(c, { token }); // return the token
    });
    // POST /auth/register -> register route
    this.router.post("/register", this.validateUsing(this.schemas.register), async (c) => {
      const { username, email, password } = c.req.valid("json"); // get the request body
      const existingUser = await this.service.getWithEmail(email); // look if email is already taken
      if (existingUser) return this.fail(c, { email: ["Email already in use"] }); // throw if email is taken
      const hashedPassword = await Bun.password.hash(password); // hash the password
      const user = await this.service.makeOne({ username, email, password: hashedPassword }); // create the user
      // generate the token for the new user
      const token = await this.generateToken<CurrentUser>({
        id: user.id,
        email: user.email,
        username: user.username,
      });
      return this.ok(c, { token });
    });
    // GET /auth/me -> fetch current user information
    this.router.get("/me", this.middleware, async (c) => {
      const currentUser = c.get("currentUser"); // get the current user from the context
      return this.ok(c, currentUser); // return the current user
    });
  }
}
