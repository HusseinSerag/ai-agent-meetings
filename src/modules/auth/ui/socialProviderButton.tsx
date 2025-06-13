import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { BetterAuthOptions } from "better-auth";
import { ReactNode } from "react";

interface Props {
  isPending: boolean;
  provider: Parameters<typeof authClient.signIn.social>[0]["provider"];
  icon: ReactNode;
  name: string;
  onSocial(
    provider: Parameters<typeof authClient.signIn.social>[0]["provider"]
  ): void;
}

export function SocialProviderButton({
  provider,
  isPending,
  icon,
  name,
  onSocial,
}: Props) {
  return (
    <Button
      variant={"outline"}
      type="button"
      className="w-full flex items-center justify-center cursor-pointer"
      disabled={isPending}
      onClick={() => {
        onSocial(provider);
      }}
    >
      {icon} {name}
    </Button>
  );
}
