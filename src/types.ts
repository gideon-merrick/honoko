import type { JWTPayload } from "hono/utils/jwt/types";

export type CurrentUser = JWTPayload & {
  id: string;
  username: string;
  email: string;
};

export type AppVariables = {
  currentUser: CurrentUser;
};
