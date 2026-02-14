import { z } from "zod";
import { zValidator as honoZValidator } from "@hono/zod-validator";
import { auth } from "../config/auth";

export const zValidator = honoZValidator;
export const validator = honoZValidator;

export type AppEnv = {
  Variables: {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  };
};
