import { initTRPC } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

const { router, procedure } = initTRPC
  .context<Awaited<typeof createContext>>()
  .create();

function createContext({ req, res }: CreateExpressContextOptions) {
  return { req, res };
}

export { router, procedure, createContext };
