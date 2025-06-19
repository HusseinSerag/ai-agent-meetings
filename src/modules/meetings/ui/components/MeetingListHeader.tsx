"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";

import { useState } from "react";

import { DEFAULT_PAGE } from "@/constants";
import { useMeetingsFilters } from "../../hooks/useMeetingsFilters";
import { NewMeetingDialog } from "./NewMeetingDialog";

export function MeetingsListHeader() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useMeetingsFilters();
  const isFiltersOn = !!filters.search;

  function clearFilters() {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
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
        <div className="flex items-center gap-x-2 p-1">
          {isFiltersOn && (
            <Button variant={"outline"} size={"sm"} onClick={clearFilters}>
              <XCircleIcon />
              Clear
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
