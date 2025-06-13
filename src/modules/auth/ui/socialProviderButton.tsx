import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { BetterAuthOptions } from "better-auth";
import { ReactNode } from "react";

interface Props {
  isPending: boolean;
  provider: Parameters<typeof authClient.signIn.social>[0]["provider"];
  icon: ReactNode;
  name: string;
  onRequest(): void;
  onResponse(data: ReturnType<typeof authClient.signIn.email>): void;
}

export function SocialProviderButton({
  provider,
  isPending,
  icon,
  name,
  onRequest,
  onResponse,
}: Props) {
  return (
    <Button
      variant={"outline"}
      type="button"
      className="w-full flex items-center justify-center"
      disabled={isPending}
      onClick={async () => {
        onRequest();
        const data = await authClient.signIn.social({
          provider,
        });

        onResponse(data);
      }}
    >
      {icon} {name}
    </Button>
  );
}
