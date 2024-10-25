import { ROLE } from "@prisma/client";
import { initTRPC, TRPCError } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

const { router, procedure } = initTRPC
  .context<Awaited<typeof createContext>>()
  .create();

function createContext({ req, res }: CreateExpressContextOptions) {
  return { req, res };
}

const privateProcedure = procedure.use(async ({ next, ctx }) => {
  if (!ctx.req.session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Signing in is required.",
    });
  }

  return next({
    ctx: { user: ctx.req.session.user, role: ctx.req.session.user.role },
  });
});

const adminProcedure = privateProcedure.use(async ({ next, ctx }) => {
  if (ctx.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin route only." });
  }

  return next({ ctx: { role: ROLE.ADMIN } });
});

export { router, procedure, privateProcedure, adminProcedure, createContext };
