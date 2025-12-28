import type { JWTPayload } from "hono/utils/jwt/types";

export type AppVariables = {
  user: JWTPayload;
};
