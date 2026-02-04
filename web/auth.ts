import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { authConfig } from "@/auth.config";
import { db, users } from "@/db/schema";
import { loginSchema } from "@/validations/auth";

export const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

const DUMMY_PASSWORD_HASH =
  "$argon2id$v=19$m=19456,t=2,p=1$dGhpc2lzYWR1bW15c2FsdA$dGhpc2lzYWR1bW15aGFzaHRoaXNpc2FkdW1teWhhc2g";

const SESSION_MAX_AGE = 30 * 24 * 60 * 60;
const SESSION_UPDATE_AGE = 24 * 60 * 60;
const DB_REVALIDATION_INTERVAL = 5 * 60;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
    updateAge: SESSION_UPDATE_AGE,
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.fullName = user.fullName;
        token.role = user.role;
        token.bio = user.bio;
        token.lastDbCheck = Date.now();
      }

      const lastCheck = token.lastDbCheck ?? 0;
      const shouldRevalidate =
        token.id &&
        (Date.now() - lastCheck > DB_REVALIDATION_INTERVAL * 1000 ||
          trigger === "update");

      if (shouldRevalidate && typeof token.id === "string") {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, token.id),
          columns: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            bio: true,
          },
        });

        if (!dbUser) {
          return { ...token, id: null, error: "UserNotFound" };
        }

        token.id = dbUser.id;
        token.email = dbUser.email;
        token.fullName = dbUser.fullName;
        token.role = dbUser.role;
        token.bio = dbUser.bio;
        token.lastDbCheck = Date.now();
      }

      return token;
    },
    async session({ session, token }) {
      if (token.error === "UserNotFound" || !token.id) {
        return {
          ...session,
          user: undefined as unknown as typeof session.user,
          error: "UserNotFound",
        };
      }

      session.user = {
        id: token.id as string,
        email: token.email as string,
        fullName: token.fullName as string,
        role: token.role as "student" | "tutor" | "admin" | null,
        bio: token.bio as string | null,
        emailVerified: null,
      };

      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials);

          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          const hashToVerify = user?.passwordHash ?? DUMMY_PASSWORD_HASH;

          let passwordsMatch = false;
          try {
            passwordsMatch = await argon2.verify(hashToVerify, password);
          } catch {
            passwordsMatch = false;
          }

          if (!user || !passwordsMatch) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            bio: user.bio,
            emailVerified: null,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
});
