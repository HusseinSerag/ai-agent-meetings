import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";

import { cn } from "@/lib/utils";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { generateAvatarUri } from "@/lib/avatar";

interface GeneratedAvatarProps {
  seed: string;
  className?: string;
  variant: "botttsNeutral" | "initials";
}

export function GeneratedAvatar({
  seed,
  variant,
  className,
}: GeneratedAvatarProps) {
  const avatarUri = generateAvatarUri({ seed, variant });

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatarUri} alt="avatar" />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
