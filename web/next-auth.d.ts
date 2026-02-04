import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    fullName: string;
    role: "student" | "tutor" | "admin" | null;
    bio: string | null;
    emailVerified?: Date | null;
  }

  interface Session extends DefaultSession {
    user: User;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string | null;
    email?: string;
    fullName?: string;
    role?: "student" | "tutor" | "admin" | null;
    bio?: string | null;
    lastDbCheck?: number;
    error?: string;
  }
}
