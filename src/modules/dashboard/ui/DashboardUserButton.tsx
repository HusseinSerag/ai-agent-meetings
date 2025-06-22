import { GeneratedAvatar } from "@/components/generated-avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useSignout } from "@/modules/auth/hooks/useSignout";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
export function DashboardUserButton() {
  const { data, isPending } = authClient.useSession();
  const logout = useSignout();
  const isMobile = useIsMobile();
  if (isPending || !data?.user) return null;
  const triggerClassName =
    "rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden";
  const triggerContent = (
    <>
      {data.user.image ? (
        <Avatar className="size-9 mr-3">
          <AvatarImage src={data.user.image} />
        </Avatar>
      ) : (
        <GeneratedAvatar
          seed={data.user.name}
          variant="initials"
          className="size-9 mr-3"
        />
      )}
      <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
        <p className="text-sm truncate w-full">{data.user.name}</p>
        <p className="text-xs truncate w-full">{data.user.email}</p>
      </div>
      <ChevronDownIcon className="size-4 shrink-0" />
    </>
  );
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className={triggerClassName}>
          {triggerContent}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{data.user.name}</DrawerTitle>
            <DrawerDescription>{data.user.email}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button
              variant="outline"
              onClick={() => {
                authClient.customer.portal();
              }}
            >
              <CreditCardIcon className="size-4 text-black" />
              Billing
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOutIcon className="size-4 text-black" />
              Log out
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerClassName}>
        {triggerContent}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="font-medium truncate">{data.user.name}</span>
            <span className="text-sm font-normal text-muted-foreground truncate">
              {data.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            authClient.customer.portal();
          }}
          className="flex items-center cursor-pointer justify-between"
        >
          Billing
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={logout}
          className="flex items-center cursor-pointer justify-between"
        >
          Logout
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
