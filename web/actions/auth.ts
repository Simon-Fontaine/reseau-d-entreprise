"use server";

import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { ARGON2_OPTIONS } from "@/auth";
import { db, users } from "@/db/schema";
import { registerSchema } from "@/validations/auth";

export type ActionState = {
  success?: boolean;
  message?: string;
  errors?: {
    [K in keyof z.infer<typeof registerSchema>]?: string[];
  };
};

export async function registerAction(
  _prevState: ActionState | null,
  formData: FormData | z.infer<typeof registerSchema>,
): Promise<ActionState> {
  try {
    const rawData =
      formData instanceof FormData ? Object.fromEntries(formData) : formData;

    const validatedFields = registerSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid fields",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { email, password, fullName } = validatedFields.data;

    const existingUser = await db.query.users.findFirst({
      where: (usersTable) => eq(usersTable.email, email),
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email already in use",
      };
    }

    const passwordHash = await argon2.hash(password, ARGON2_OPTIONS);

    await db.insert(users).values({
      email,
      fullName,
      passwordHash,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
