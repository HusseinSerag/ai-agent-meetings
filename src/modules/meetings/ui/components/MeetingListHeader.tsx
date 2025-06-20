"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";

import { useState } from "react";

import { DEFAULT_PAGE } from "@/constants";
import { useMeetingsFilters } from "../../hooks/useMeetingsFilters";
import { NewMeetingDialog } from "./NewMeetingDialog";
import { SearchFilter } from "./meetingSearchFilter";
import { StatusFilter } from "./meetingStatusFilter";
import { AgentIdFilter } from "./meetingAgentIdFilter";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function MeetingsListHeader() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useMeetingsFilters();
  const isFiltersOn = !!filters.search || !!filters.status || !!filters.agentId;

  function clearFilters() {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
      agentId: "",
      status: null,
    });
  }
  return (
    <>
      <NewMeetingDialog open={open} onOpenChange={setOpen} />
      <div className="px-4 py-4 md:px-8 flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium">My Meetings</h5>
          <Button className="cursor-pointer" onClick={() => setOpen(true)}>
            <PlusIcon />
            New Meeting
          </Button>
        </div>
        <ScrollArea>
          <div className="flex  gap-y-1  gap-x-2 p-1">
            <SearchFilter />
            <StatusFilter />
            <AgentIdFilter />
            {isFiltersOn && (
              <Button variant={"outline"} size={"sm"} onClick={clearFilters}>
                <XCircleIcon />
                Clear
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}
