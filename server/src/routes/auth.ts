import { TRPCError } from "@trpc/server";
import db from "../lib/db.js";
import { procedure, router } from "../lib/trpc.js";
import { zodSchema } from "../lib/zod.js";
import * as bcrypt from "bcrypt";

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

    const { confirmPassword: _, ...value } = input;

    await db.user.create({ data: { ...value, password: hashedPassword } });

    return { message: "You have successfully created an account." };
  }),
});

export default authRouter;
