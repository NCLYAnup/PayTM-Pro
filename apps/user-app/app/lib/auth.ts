import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import { z } from "zod";

const CredentialsSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        phone: { label: "Phone number", type: "text", placeholder: "1231231231" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        // Validate credentials using Zod
        const validationResult = CredentialsSchema.safeParse(credentials);
        if (!validationResult.success) {
          const errorMessage = validationResult.error.errors[0]?.message ?? "Invalid input";
          throw new Error(errorMessage);
        }

        // Hash password for comparison
        const hashedPassword = await bcrypt.hash(credentials.password, 10);

        // Find user by phone number
        const existingUser = await db.user.findFirst({
          where: {
            number: credentials.phone
          }
        });

        if (existingUser) {
          // Compare hashed password
          const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              email: existingUser.number
            };
          }
          throw new Error('Invalid phone number or password');
        }

        try {
          // Create new user if not exists
          const user = await db.user.create({
            data: {
              number: credentials.phone,
              password: hashedPassword
            }
          });

          // Create initial balance for user
          const randomBalance = Math.random() * 10000;
          await db.balance.create({
            data: {
              userId: user.id,
              amount: randomBalance * 100,
              locked: 0
            }
          });

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.number
          };
        } catch (e) {
          console.error(e);
          throw new Error("Failed to create user");
        }
      },
    })
  ],
  secret: process.env.JWT_SECRET || "secret",
  pages: {
    error: '/auth/error', // Custom error page route
  },
  callbacks: {
    async session({ token, session }: any) {
      if (token) {
        session.user.id = token.sub;
      }
      return session;
    }
  }
};
