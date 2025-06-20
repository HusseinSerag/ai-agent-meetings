"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MeetingGetMany, MeetingStatus } from "../../types";
import { GeneratedAvatar } from "@/components/generated-avatar";

import { Badge } from "@/components/ui/badge";

import { format } from "date-fns";
import { ClockFadingIcon, CornerDownRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatDuration,
  getBadge,
  statusColorMap,
  statusIconMap,
} from "../../utils";
export type Meeting = MeetingGetMany[number];

export const columns: ColumnDef<Meeting>[] = [
  {
    accessorKey: "name",
    header: "Agent's Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <span className="font-semibold capitalize">{row.original.name}</span>

        <div className="flex items-center   gap-x-2">
          <div className="flex items-center gap-x-1">
            <CornerDownRightIcon className="size-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
              {row.original.agent.name}
            </span>
          </div>
          <GeneratedAvatar
            variant="botttsNeutral"
            className="size-4"
            seed={row.original.agent.name}
          />
          <span className="text-sm text-muted-foreground">
            {row.original.startedAt
              ? format(row.original.startedAt, "MMM d")
              : ""}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return getBadge(row.original.status as MeetingStatus);
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <Badge
        variant={"outline"}
        className="capitalize [&>svg]:size-4 flex items-center gap-x-2"
      >
        <ClockFadingIcon className="text-blue-700" />
        {row.original.duration
          ? formatDuration(row.original.duration)
          : "no duration"}
      </Badge>
    ),
  },
];
