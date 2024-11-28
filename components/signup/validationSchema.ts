import { z } from "zod";

export const validationSchema = toTypedSchema(
  z
    .object({
      firstName: z.string({ required_error: "First Name is required" }),
      lastName: z.string({ required_error: "Last Name is required" }),
      email: z.string({ required_error: "Email is required" }).email({
        message: "Please enter valid e-mail address",
      }),
      password: z
        .string({ required_error: "Password is required" })
        .min(1, "Password is required"),
      retypePassword: z
        .string({ required_error: "Retype Password is required" })
        .min(1, "Retype Password is required"),
    })
    .superRefine((data, ctx) => {
      const { password, retypePassword } = data;
      if (password !== retypePassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords must match",
          path: ["retypePassword"],
        });
      }
    })
);
