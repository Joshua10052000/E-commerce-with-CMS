import * as bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import db from "../lib/db.js";
import { procedure, router } from "../lib/trpc.js";
import { zodSchema } from "../lib/zod.js";
import { create } from "../lib/session.js";

const privateProcedure = procedure.use(async ({ next, ctx }) => {
  const { session } = ctx.req;

  if (!session.userId || !session.userRole) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Signing in is required.",
    });
  }

  return next();
});

const authRouter = router({
  signUp: procedure.input(zodSchema.auth.signUp).mutation(async ({ input }) => {
    const foundUser = await db.user.findUnique({
      where: { email: input.email },
    });

    if (foundUser) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const { confirmPassword: _, ...data } = input;

    await db.user.create({ data: { ...data, password: hashedPassword } });

    return { message: "You have successfully created an account." };
  }),
  signIn: procedure
    .input(zodSchema.auth.signIn)
    .mutation(async ({ input, ctx }) => {
      const foundUser = await db.user.findUnique({
        where: { email: input.email },
      });

      if (!foundUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Email is not yet registered.",
        });
      }

      if (!foundUser.password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sign in using your email you used originally.",
        });
      }

      const matchedPassword = await bcrypt.compare(
        input.password,
        foundUser.password
      );

      if (!matchedPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials.",
        });
      }

      await create(
        ctx.req.sessionID,
        foundUser.id,
        new Date(new Date().getDate() - 7)
      );

      ctx.req.session.userId = foundUser.id;
      ctx.req.session.userRole = foundUser.role;

      return { session: ctx.req.session };
    }),
});

export { privateProcedure };
export default authRouter;
