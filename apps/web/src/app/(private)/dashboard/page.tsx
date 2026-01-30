"use client";

import { useSession } from "@/providers/session-provider";

export default function DashboardPage() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
    </div>
  );
}
