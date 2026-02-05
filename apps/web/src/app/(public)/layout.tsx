"use client";

import { PublicRoutes } from "@/providers/public-routes";
import { Toaster } from "sonner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicRoutes>
      <Toaster />
      <div className="grid grid-rows-[auto_1fr]">{children}</div>
    </PublicRoutes>
  );
}
