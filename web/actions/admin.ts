"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { courses, db, themes, users } from "@/db/schema";
import {
  createThemeSchema,
  deleteCourseSchema,
  deleteThemeSchema,
  deleteUserSchema,
  updateThemeSchema,
  updateUserSchema,
} from "@/validations/admin";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  const admin = await db.query.users.findFirst({
    where: and(eq(users.id, session.user.id), eq(users.role, "admin")),
  });
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return admin;
}

export type ActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

function parseFormData(formData: FormData) {
  return Object.fromEntries(formData);
}

// ============== User Management ==============

export async function updateUser(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const admin = await requireAdmin();
    const rawData = parseFormData(formData);
    const validated = updateUserSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Invalid fields",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { userId, email, role } = validated.data;

    // Prevent admin from changing their own role
    if (userId === admin.id) {
      return {
        success: false,
        message: "You cannot modify your own account",
      };
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!existingUser) {
      return { success: false, message: "User not found" };
    }

    // Check if email is already taken by another user
    if (email !== existingUser.email) {
      const emailTaken = await db.query.users.findFirst({
        where: and(eq(users.email, email), ne(users.id, userId)),
      });

      if (emailTaken) {
        return {
          success: false,
          message: "This email is already in use by another user",
        };
      }
    }

    await db.update(users).set({ email, role }).where(eq(users.id, userId));

    revalidatePath("/dashboard/admin/users");
    return { success: true, message: "User updated successfully" };
  } catch (error) {
    console.error("Update user error:", error);
    return { success: false, message: "Unable to update user" };
  }
}

export async function deleteUser(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const admin = await requireAdmin();
    const rawData = parseFormData(formData);
    const validated = deleteUserSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Invalid fields",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { userId } = validated.data;

    // Prevent admin from deleting themselves
    if (userId === admin.id) {
      return {
        success: false,
        message: "You cannot delete your own account",
      };
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!existingUser) {
      return { success: false, message: "User not found" };
    }

    await db.delete(users).where(eq(users.id, userId));

    revalidatePath("/dashboard/admin/users");
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Delete user error:", error);
    return { success: false, message: "Unable to delete user" };
  }
}

// ============== Theme Management ==============

export async function createTheme(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdmin();
    const rawData = parseFormData(formData);
    const validated = createThemeSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Invalid fields",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { name, emoji } = validated.data;

    // Check if theme with same name exists
    const existingTheme = await db.query.themes.findFirst({
      where: eq(themes.name, name),
    });

    if (existingTheme) {
      return {
        success: false,
        message: "A theme with this name already exists",
      };
    }

    await db.insert(themes).values({
      name,
      emoji: emoji || null,
    });

    revalidatePath("/dashboard/admin/themes");
    return { success: true, message: "Theme created successfully" };
  } catch (error) {
    console.error("Create theme error:", error);
    return { success: false, message: "Unable to create theme" };
  }
}

export async function updateTheme(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdmin();
    const rawData = parseFormData(formData);
    const validated = updateThemeSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Invalid fields",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { themeId, name, emoji } = validated.data;

    const existingTheme = await db.query.themes.findFirst({
      where: eq(themes.id, themeId),
    });

    if (!existingTheme) {
      return { success: false, message: "Theme not found" };
    }

    // Check if another theme with same name exists
    const duplicateTheme = await db.query.themes.findFirst({
      where: and(eq(themes.name, name), ne(themes.id, themeId)),
    });

    if (duplicateTheme) {
      return {
        success: false,
        message: "A theme with this name already exists",
      };
    }

    await db
      .update(themes)
      .set({
        name,
        emoji: emoji || null,
      })
      .where(eq(themes.id, themeId));

    revalidatePath("/dashboard/admin/themes");
    return { success: true, message: "Theme updated successfully" };
  } catch (error) {
    console.error("Update theme error:", error);
    return { success: false, message: "Unable to update theme" };
  }
}

export async function deleteTheme(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdmin();
    const rawData = parseFormData(formData);
    const validated = deleteThemeSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Invalid fields",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { themeId } = validated.data;

    const existingTheme = await db.query.themes.findFirst({
      where: eq(themes.id, themeId),
    });

    if (!existingTheme) {
      return { success: false, message: "Theme not found" };
    }

    // Check if any courses are using this theme
    const coursesUsingTheme = await db.query.courses.findFirst({
      where: eq(courses.themeId, themeId),
    });

    if (coursesUsingTheme) {
      return {
        success: false,
        message: "Cannot delete theme that is being used by courses",
      };
    }

    await db.delete(themes).where(eq(themes.id, themeId));

    revalidatePath("/dashboard/admin/themes");
    return { success: true, message: "Theme deleted successfully" };
  } catch (error) {
    console.error("Delete theme error:", error);
    return { success: false, message: "Unable to delete theme" };
  }
}

// ============== Course Management ==============

export async function deleteCourse(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdmin();
    const rawData = parseFormData(formData);
    const validated = deleteCourseSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Invalid fields",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { courseId } = validated.data;

    const existingCourse = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });

    if (!existingCourse) {
      return { success: false, message: "Course not found" };
    }

    await db.delete(courses).where(eq(courses.id, courseId));

    revalidatePath("/dashboard/admin/courses");
    return { success: true, message: "Course deleted successfully" };
  } catch (error) {
    console.error("Delete course error:", error);
    return { success: false, message: "Unable to delete course" };
  }
}
