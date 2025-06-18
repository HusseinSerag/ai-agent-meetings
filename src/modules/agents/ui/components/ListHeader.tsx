"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewAgentDialog } from "./NewAgentDialog";
import { useState } from "react";

export function AgentsListHeader() {
  const [open, setOpen] = useState(false);
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
      </div>
    </>
  );
}
