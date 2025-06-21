import { botttsNeutral, initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

interface Props {
  seed: string;

  variant: "botttsNeutral" | "initials";
}
export function generateAvatarUri({ seed, variant }: Props) {
  const avatar =
    variant === "botttsNeutral"
      ? createAvatar(botttsNeutral, {
          seed,
        })
      : createAvatar(initials, {
          seed,
          fontWeight: 500,
          fontSize: 42,
        });

  return avatar.toDataUri();
}
