import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import bcrypt from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.hashedPassword) {
            throw new Error(
              "This account was created with OAuth. Please login with GitHub or Google."
            );
          }

          // In production: email verification is REQUIRED
          // In development: allow login without verification (for testing)
          const isDevelopment = process.env.NODE_ENV === "development";

          if (!isDevelopment && !user.emailVerified) {
            throw new Error(
              "Please verify your email before logging in. Check your inbox for a verification link."
            );
          }

          if (isDevelopment && !user.emailVerified) {
            console.warn(
              `⚠️  Development mode: User ${user.email} logging in without email verification`
            );
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );

          if (!isValid) {
            throw new Error("Invalid password");
          }

          console.log(`✅ User authenticated: ${user.email}`);
          return user;
        } catch (error) {
          console.error("Authorization error:", error.message);
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For credentials provider, always allow if user exists (auth already done in authorize)
      if (account?.provider === "credentials") {
        return true;
      }
      // For OAuth providers
      if (account?.provider === "email") {
        return true;
      }
      return !!user;
    },
    async session({ session, token, user }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
};
