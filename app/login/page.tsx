'use client'; // Muss client component sein wegen useState

import { useState } from "react";
import { signIn } from "next-auth/react"; // client seitiges signIn
import Button from "../components/ui/Button";

export default function LoginPage() {
  // State für die Fehlermeldung
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, 
        callbackUrl: "/"
      });

      if (result?.error) {
        // Falls Anmeldetaten falsch, kommt die Fehlermeldung
        setErrorMessage("E-Mail oder Passwort sind falsch");
      } else if (result?.url) {
        // Falls richtig, return zu Home
        window.location.href = result.url;
      }
    } catch (error) {
      setErrorMessage("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setIsLoading(false);
    }
  };

  return ( 
    <div className="max-w-md mx-auto mt-16 p-8 bg-stone-200 border border-blue-200 rounded-lg shadow-sm text-stone-800">
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm text-center font-medium animate-fade-in">
          {errorMessage}
        </div>
      )}

      <form 
        onSubmit={handleSubmit} // Nutze onSubmit statt action
        className="flex flex-col gap-[15px]"
      >
        <input 
          name="email" 
          type="email" 
          placeholder="E-Mail-Adresse" 
          autoComplete="off" 
          required
          className="p-2 bg-white text-black rounded-lg border border-stone-300" 
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Passwort" 
          required
          className="p-2 bg-white text-black rounded-lg border border-stone-300" 
        />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Wird eingeloggt..." : "Einloggen"}
        </Button>
      </form>
    </div>
  );
}