"use client";

import { PrivateRoutes } from "@/providers/private-routes";
import Header from "@/components/header";
import { Footer } from "@/components/footer";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoutes>
      <div className="grid grid-rows-[auto_1fr]">
        <Header />
        {children}
        <Footer />
      </div>
    </PrivateRoutes>
  );
}
