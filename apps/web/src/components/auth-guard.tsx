"use client";

import { useSession } from "@/providers/session-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/");
    }
  }, [isLoading, session, router]);

  if (isLoading) return null;
  if (!session) return null;

  return <>{children}</>;
}
