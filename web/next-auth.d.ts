import type { DefaultSession } from "next-auth";
import { InferSelectModel } from "drizzle-orm";
import { users } from "@/db/schema";

declare module "next-auth" {
  interface User
    extends Omit<InferSelectModel<typeof users>, "passwordHash" | "id"> {
    id: string;
    emailVerified?: Date | null;
  }

  interface Session extends DefaultSession {
    user: User;
  }
}

declare module "next-auth/jwt" {
  import type { User } from "next-auth";

  interface JWT {
    user?: User;
  }
}
