import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

export const validationSchema = toTypedSchema(
  z.object({
    email: z.string({ required_error: "Email is required" }).email({
      message: "Please enter valid e-mail address",
    }),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required"),
  })
);
