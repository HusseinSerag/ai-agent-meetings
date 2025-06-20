import { CommandSelect } from "@/components/CommandSelect";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useMeetingsFilters } from "../../hooks/useMeetingsFilters";
import { DEFAULT_PAGE } from "@/constants";

export function AgentIdFilter() {
  const [agentSearch, setAgentSearch] = useState("");
  const [filters, setFilters] = useMeetingsFilters();
  const trpc = useTRPC();
  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    })
  );
  return (
    <CommandSelect
      className="h-9"
      error={agents.error?.message}
      isLoadingOptions={agents.isPending}
      options={(agents.data?.items ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className="flex items-center gap-x-2">
            <GeneratedAvatar
              seed={agent.name}
              variant="botttsNeutral"
              className="size-4"
            />
            <span>{agent.name}</span>
          </div>
        ),
      }))}
      onSelect={(value) => {
        setFilters({
          agentId: value,
        });
      }}
      onSearch={setAgentSearch}
      value={filters.agentId ?? ""}
      placeholder="Agent"
    />
  );
}
