import type { app } from "../app.js";
import type { auth } from "./auth.js";

export type AppType = typeof app;

export type AppVariables = {
  Variables: {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  };
};
