"use server";

import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { auth } from "@/auth";
import { db, users } from "@/db/schema";
import {
  updatePasswordSchema,
  updateProfileSchema,
} from "@/validations/account";

export type ProfileActionState = {
  success?: boolean;
  message?: string;
  errors?: {
    fullName?: string[];
  };
};

export type PasswordActionState = {
  success?: boolean;
  message?: string;
  errors?: {
    currentPassword?: string[];
    newPassword?: string[];
    confirmNewPassword?: string[];
  };
};

export async function updateProfile(
  _prevState: ProfileActionState | null,
  formData: FormData | z.infer<typeof updateProfileSchema>,
): Promise<ProfileActionState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const rawData =
      formData instanceof FormData ? Object.fromEntries(formData) : formData;

    const validatedFields = updateProfileSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid fields",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { fullName } = validatedFields.data;

    await db
      .update(users)
      .set({ fullName })
      .where(eq(users.id, session.user.id));

    revalidatePath("/dashboard/settings");
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function updatePassword(
  _prevState: PasswordActionState | null,
  formData: FormData | z.infer<typeof updatePasswordSchema>,
): Promise<PasswordActionState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const rawData =
      formData instanceof FormData ? Object.fromEntries(formData) : formData;

    const validatedFields = updatePasswordSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid fields",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { currentPassword, newPassword } = validatedFields.data;

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const passwordsMatch = await argon2.verify(
      user.passwordHash,
      currentPassword,
    );

    if (!passwordsMatch) {
      return {
        success: false,
        message: "Incorrect current password",
        errors: {
          currentPassword: ["Incorrect password"],
        },
      };
    }

    const newPasswordHash = await argon2.hash(newPassword);

    await db
      .update(users)
      .set({ passwordHash: newPasswordHash })
      .where(eq(users.id, session.user.id));

    revalidatePath("/dashboard/settings");
    return { success: true, message: "Password updated successfully" };
  } catch (error) {
    console.error("Password update error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
