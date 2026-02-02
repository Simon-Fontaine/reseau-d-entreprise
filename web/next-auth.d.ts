import { InferSelectModel } from "drizzle-orm";
import { users } from "@/db/schema";

declare module "next-auth" {
  type User = Omit<InferSelectModel<typeof users>, "passwordHash">;

  interface Session {
    user: User;
  }
}
