import { z } from "zod";

const zodSchema = {
  auth: {
    signUp: z
      .object({
        firstName: z.string().min(1, { message: "First name is required." }),
        middleName: z.string().optional(),
        lastName: z.string().min(1, { message: "Last name is required." }),
        email: z
          .string()
          .min(1, { message: "Email is required." })
          .email({ message: "Invalid email." }),
        password: z.string().min(1, { message: "Password is required." }),
        confirmPassword: z
          .string()
          .min(1, { message: "Confirm your password." }),
      })
      .refine((input) => input.password === input.confirmPassword, {
        message: "Password does not matched.",
        path: ["confirmPassword"],
      }),
    signIn: z.object({
      email: z
        .string()
        .min(1, { message: "Email is required." })
        .email({ message: "Invalid email." }),
      password: z.string().min(1, { message: "Password is required." }),
    }),
  },
};

export { zodSchema };
