"use client";

import { authClient } from "@/lib/auth-client";
import type { Prettify } from "better-auth";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

type InferSession<T> = T extends () => Promise<infer R>
  ? R extends { data?: infer D }
    ? D
    : never
  : never;

type RawSession = InferSession<typeof authClient.getSession>;
type Session = NonNullable<RawSession>;

type SessionContextValue = {
  session: Session | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (body: Prettify<Session["user"]>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined,
);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSession = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await authClient.getSession();

      if (error) {
        console.error("Erro ao buscar sessão:", error);
        setSession(null);
        return;
      }

      setSession(data ?? null);
    } catch (err) {
      console.error("Erro inesperado ao buscar sessão:", err);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const signOut = async () => {
    try {
      await authClient.signOut();
      setSession(null);
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (body: any) => {
    setIsLoading(true);
    try {
      await authClient.signUp.email(body);
      await loadSession();
      toast.success("Cadastro realizado com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authClient.signIn.email({ email, password });
      await loadSession();
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      session,
      isLoading,
      refresh: loadSession,
      signOut,
      signUp,
      signIn,
    }),
    [session, isLoading],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx)
    throw new Error("useSession precisa ser usado dentro de SessionProvider");
  return ctx;
}
