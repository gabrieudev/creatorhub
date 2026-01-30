"use client";

import { SessionProvider } from "./session-provider";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "../components/ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster richColors />
      </ThemeProvider>
    </SessionProvider>
  );
}
