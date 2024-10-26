import { User } from "@prisma/client";
import "express-session";

declare module "express-session" {
  interface SessionData {
    userId: User["id"];
    user: Omit<User, "password">;
  }
}
