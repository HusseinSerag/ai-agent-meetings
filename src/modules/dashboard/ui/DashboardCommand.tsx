import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import {
  CommandResponsiveDialog,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { MeetingStatus } from "@/modules/meetings/types";
import { getBadge } from "@/modules/meetings/utils";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

interface DashboardCommandProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export function DashboardCommand({ open, setOpen }: DashboardCommandProps) {
  const [value, setValue] = useState("");
  const trpc = useTRPC();
  const { data, isPending } = useQuery(
    trpc.dashboard.getData.queryOptions({
      search: value,
    })
  );
  const router = useRouter();
  return (
    <CommandResponsiveDialog
      shouldFilter={false}
      open={open}
      onOpenChange={setOpen}
    >
      <CommandInput
        value={value}
        onValueChange={setValue}
        placeholder="Find a meeting or agent"
      />
      {!data ? null : (
        <CommandList>
          {data.data.map((option) => (
            <CommandItem className="cursor-pointer" key={option.id}>
              <div
                className="flex w-full justify-between items-center"
                onClick={() => {
                  if (option.type === "Agent") {
                    router.push(`/agents/${option.id}`);
                  } else {
                    router.push(`/meetings/${option.id}`);
                  }
                  setOpen(false);
                }}
              >
                {option.type === "Agent" ? (
                  <div className="flex gap-x-2 min-w-0 items-center">
                    <GeneratedAvatar
                      seed={option.name}
                      variant="botttsNeutral"
                    />
                    <span className="text-sm font-medium">{option.name}</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2  gap-x-2">
                    <div className="truncate w-[150px] font-medium text-sm">
                      {option.name}
                    </div>
                    <span>{getBadge(option.status as MeetingStatus)}</span>
                  </div>
                )}

                <Badge
                  className={cn(
                    "font-semibold ",
                    option.type === "Agent" &&
                      "bg-blue-100 text-blue-700 border border-blue-300",
                    option.type === "Meeting" &&
                      "bg-red-100 text-red-700 border border-red-300"
                  )}
                  variant={"outline"}
                >
                  {option.type.toLowerCase()}
                </Badge>
              </div>
            </CommandItem>
          ))}
        </CommandList>
      )}
      {isPending && value && (
        <div className="py-4 px-2 flex items-center justify-center font-medium text-sm">
          Searching for '{value}' meeting or agent
        </div>
      )}
      {((!isPending && !data) || data?.data.length == 0) && (
        <CommandEmpty>
          <div className="text-sm font-medium">
            No meetings or agents exist!
          </div>
        </CommandEmpty>
      )}
    </CommandResponsiveDialog>
  );
}
