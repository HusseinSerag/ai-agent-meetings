"use client";

import { ErrorState } from "@/components/Error";
import { LoadingState } from "@/components/Loading";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../components/DataTable";
import { columns } from "../components/Column";
import { EmptyState } from "@/components/Empty";
import { useAgentFilters } from "../../hooks/useAgentsFilters";
import { DataPagination } from "../components/DataPagination";
import { useEffect } from "react";

export function AgentsView() {
  const trpc = useTRPC();
  const [filters, setFilters] = useAgentFilters();
  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
    })
  );
  useEffect(
    function () {
      if (filters.page <= 0) {
        setFilters({ page: 0 });
      } else if (filters.page > data.totalPages) {
        setFilters({ page: data.totalPages });
      }
    },
    [filters.page, data.totalPages]
  );
  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable columns={columns} data={data.items} />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page: number) => setFilters({ page })}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first agent."
          description="Create an agent to join your meetings, each agent will follow your instructions and can interact with participants in the call"
        />
      )}
    </div>
  );
}

export function AgentsLoading() {
  return (
    <LoadingState
      title="Loading Agents"
      description="Please wait a few seconds"
    />
  );
}
export function AgentsError() {
  return (
    <ErrorState
      title="Error loading agents"
      description="Something went wrong!"
    />
  );
}
