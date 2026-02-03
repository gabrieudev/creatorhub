"use client";

import { PrivateRoutes } from "@/providers/private-routes";
import Header from "@/components/header/header";
import { Footer } from "@/components/footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <PrivateRoutes>
        <div className="grid grid-rows-[auto_1fr]">
          <Header />
          {children}
          <Footer />
        </div>
      </PrivateRoutes>
    </QueryClientProvider>
  );
}
