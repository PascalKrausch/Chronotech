'use server'

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { signIn } from "../auth";

export type FormState = {
  success: boolean;
  error: string | null;
} | void;

export async function registerUser(prevState: FormState, formData: FormData): Promise<FormState> {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Alle Felder ausfüllen

  if (!username || !email || !password) {
    return { success: false, error: "Bitte alle Felder ausfüllen." };;
  }

  // prüfen, ob User schon besteht

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }]
    }
  });

  if (existingUser) {
    return { success: false, error: "Diese E-Mail-Adresse wird bereits verwendet." };
  }

  // Passwort sicher verschlüsseln
  const hashedPassword = await bcrypt.hash(password, 10);

  // User in der PostgreSQL-Datenbank anlegen
  await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role: "USER" 
    }
  });

  await signIn("credentials", {
      email,
      password,
      redirectTo: "/"
  })
}