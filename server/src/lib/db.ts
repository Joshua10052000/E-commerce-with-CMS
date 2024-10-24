import { PrismaClient } from "@prisma/client";
import env from "./env.js";

const db = globalThis.prismaGlobal ?? new PrismaClient();

if (env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = db;
}

export default db;
