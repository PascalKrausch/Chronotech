"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { signIn } from "../auth";

export type FormState = {
  success: boolean;
  error: string | null;
} | void;

export async function registerUser(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!username || !email || !password) {
    return { success: false, error: "Bitte alle Felder ausfüllen." };
  }

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return {
      success: false,
      error: "Diese E-Mail-Adresse wird bereits verwendet.",
    };
  }

  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) {
    return {
      success: false,
      error: "Dieser Benutzername ist bereits vergeben.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role: "USER",
    },
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/",
  });
}
