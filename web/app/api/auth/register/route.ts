import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { db, users } from "@/db/schema";
import { registerSchema } from "@/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName } = await registerSchema.parseAsync(body);

    const existingUser = await db.query.users.findFirst({
      where: (usersTable) => eq(usersTable.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 },
      );
    }

    const passwordHash = await argon2.hash(password);

    await db.insert(users).values({
      email,
      fullName,
      passwordHash,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid registration data" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Failed to create account" },
      { status: 500 },
    );
  }
}
