import * as argon2 from "argon2";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { authConfig } from "@/auth.config";
import { db } from "@/db/schema";
import { loginSchema } from "@/validations/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as typeof session.user;
      }

      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, _request) {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials);

          const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email),
          });

          if (!user) {
            return null;
          }

          const passwordsMatch = await argon2.verify(
            user.passwordHash,
            password,
          );

          if (passwordsMatch) {
            const { passwordHash, ...userWithoutPassword } = user;
            return {
              ...userWithoutPassword,
              emailVerified: null,
            };
          }

          return null;
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
        }

        return null;
      },
    }),
  ],
});
