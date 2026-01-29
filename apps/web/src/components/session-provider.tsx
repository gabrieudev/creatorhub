import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authClient } from "@/lib/auth-client";

type Session = ReturnType<typeof authClient.getSession> | null;
type SessionContextValue = {
  session: Session | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined,
);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await authClient.getSession();
        if (!mounted) return;
        setSession(s ?? null);
      } catch (err) {
        console.error("Erro ao buscar sessão:", err);
        if (mounted) setSession(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const refresh = async () => {
    const s = await authClient.getSession();
    setSession(s ?? null);
  };

  const value = useMemo(
    () => ({ session, isLoading, refresh }),
    [session, isLoading],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
