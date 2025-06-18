"use client";

import { authClient } from "@/lib/auth-client";
import { useSignout } from "./auth/hooks/useSignout";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export function HomeView() {
  const signout = useSignout();
  const trpc = useTRPC();

  const { data: session } = authClient.useSession();
  if (!session) {
    return <p>loading...</p>;
  }
  return (
    <div className="flex flex-col gap-y-4">
      <p>Logged in as {session.user.name}</p>

      <Button onClick={signout}>signout</Button>
    </div>
  );
}
