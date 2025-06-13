"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSignout } from "@/modules/auth/hooks/useSignout";

export function HomePage() {
  const session = authClient.useSession();
  const signout = useSignout();
  if (!session.data) {
    return <p>Loading</p>;
  }
  return (
    <div className="flex flex-col p-4 gap-y-4">
      <p>Logged in as {session.data?.user.name}</p>
      <Button onClick={signout}>Sign out</Button>
    </div>
  );
}
