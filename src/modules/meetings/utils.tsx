import { MeetingStatus } from "./types";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  LoaderIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import humanizeDuration from "humanize-duration";
import { cn } from "@/lib/utils";
export function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ["h", "m", "s"],
  });
}

export const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
};
export const statusColorMap = {
  upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
  active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
  cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
  processing: "bg-gray-300/20 text-gray-800 border-gray-800/5",
};
export function getBadge(status: MeetingStatus) {
  const Icon = statusIconMap[status];
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize [&>svg]:size-4 text-muted-foreground",
        statusColorMap[status]
      )}
    >
      <Icon className={cn(status === "processing" && "animate-spin")} />
      {status}
    </Badge>
  );
}
