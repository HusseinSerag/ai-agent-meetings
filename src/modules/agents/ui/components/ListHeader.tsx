"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewAgentDialog } from "./NewAgentDialog";
import { useState } from "react";
import { useAgentFilters } from "../../hooks/useAgentsFilters";
import { SearchFilter } from "./agentSearchFilters";
import { DEFAULT_PAGE } from "@/constants";

export function AgentsListHeader() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useAgentFilters();
  const isFiltersOn = !!filters.search;

  function clearFilters() {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
    });
  }
  return (
    <>
      <NewAgentDialog open={open} onOpenChange={(o) => setOpen(o)} />
      <div className="px-4 py-4 md:px-8 flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium">My Agents</h5>
          <Button className="cursor-pointer" onClick={() => setOpen(true)}>
            <PlusIcon />
            New Agent
          </Button>
        </div>
        <div className="flex items-center gap-x-2 p-1">
          <SearchFilter />
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
