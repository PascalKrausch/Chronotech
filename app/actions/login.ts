'use server'

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return new Error("Fehlende Eingaben");
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    return new Error("E-mail nicht gefunden");
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return new Error("Falsches Passwort");
  }
  redirect("/");
}