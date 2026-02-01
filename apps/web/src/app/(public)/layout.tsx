"use client";

import { PublicRoutes } from "@/providers/public-routes";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicRoutes>
      <div className="grid grid-rows-[auto_1fr]">{children}</div>
    </PublicRoutes>
  );
}
