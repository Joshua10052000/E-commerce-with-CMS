import { PrismaClient, ROLE } from "@prisma/client";

declare global {
  var prismaGlobal: PrismaClient | undefined | null;
}

declare module "express-session" {
  interface SessionData {
    userId: string;
    userRole: ROLE;
  }
}
