"use client";

import { Footer } from "@/components/footer";
import Header from "@/components/header/header";
import { PrivateRoutes } from "@/providers/private-routes";
import { ThemeProvider } from "@/providers/theme-provider";
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="grid grid-rows-[auto_1fr]">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </PrivateRoutes>
    </QueryClientProvider>
  );
}
