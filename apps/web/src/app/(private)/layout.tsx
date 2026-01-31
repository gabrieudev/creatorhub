"use client";

import { AuthGuard } from "@/components/auth-guard";
import Header from "@/components/header";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="grid grid-rows-[auto_1fr]">
        <Header />
        {children}
      </div>
    </AuthGuard>
  );
}
