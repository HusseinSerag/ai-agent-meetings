"use client";

import { ErrorState } from "@/components/Error";
import { LoadingState } from "@/components/Loading";

import { useTRPC } from "@/trpc/client";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../../../../components/DataTable";
import { columns } from "../components/Column";
import { EmptyState } from "@/components/Empty";
import { useAgentFilters } from "../../hooks/useAgentsFilters";
import { DataPagination } from "../components/DataPagination";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDialogOpener } from "@/components/context/SharedDialogOpenerProvider";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DEFAULT_PAGE } from "@/constants";

export function AgentsView() {
  const trpc = useTRPC();
  const [filters, setFilters] = useAgentFilters();
  const { toggleIsCreateAgentOpen: setOpen } = useDialogOpener();
  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
    })
  );
  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(
    function () {
      if (data.hasAgents) {
        if (data.items.length === 0) {
          if (filters.page != DEFAULT_PAGE) {
            setFilters({ page: DEFAULT_PAGE });
          }
        } else {
          if (filters.page <= 0) {
            setFilters({ page: DEFAULT_PAGE });
          } else if (filters.page > data.totalPages) {
            setFilters({ page: data.totalPages });
          }
        }
      }
    },
    [filters.page, data.totalPages, data.hasAgents]
  );
  if (filters.page - 1 > 0) {
    queryClient.prefetchQuery(
      trpc.agents.getMany.queryOptions({
        ...filters,
        page: filters.page - 1,
      })
    );
  }
  if (filters.page + 1 <= data.totalPages) {
    queryClient.prefetchQuery(
      trpc.agents.getMany.queryOptions({
        ...filters,
        page: filters.page + 1,
      })
    );
  }

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable
        columns={columns}
        data={data.items}
        onRowClick={({ id }) => {
          router.push(`/agents/${id}`);
        }}
      />
      <DataPagination
        page={filters.page}
        totalPages={data.items.length == 0 ? 0 : data.totalPages}
        onPageChange={(page: number) => setFilters({ page })}
      />
      {!data.hasAgents && (
        <EmptyState
          title="Create your first agent."
          description="Create an agent to join your meetings, each agent will follow your instructions and can interact with participants in the call"
        />
      )}
      {data.items.length == 0 && data.hasAgents && (
        <>
          <EmptyState
            title="Can't find your wanted agent?"
            description="Create an agent to join your meetings, each agent will follow your instructions and can interact with participants in the call"
          />
          <div className="flex items-center justify-center">
            <Button className="cursor-pointer " onClick={() => setOpen(true)}>
              <PlusIcon />
              New Agent
            </Button>
          </div>
        </>
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
