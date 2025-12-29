import type { JWTPayload } from "hono/utils/jwt/types";
import type { User } from "./generated/prisma/client";

export type UserPayload = JWTPayload & User;

export type AppVariables = {
  user: UserPayload;
};
