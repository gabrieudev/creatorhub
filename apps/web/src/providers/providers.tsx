"use client";

import { SessionProvider } from "./auth-provider";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "../components/ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster richColors />
      </ThemeProvider>
    </SessionProvider>
  );
}
