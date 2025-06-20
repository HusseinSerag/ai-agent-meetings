"use client";

import { ErrorState } from "@/components/Error";
import { LoadingState } from "@/components/Loading";
import { useTRPC } from "@/trpc/client";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useMeetingsFilters } from "../../hooks/useMeetingsFilters";
import { useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { columns } from "../components/Column";
import { EmptyState } from "@/components/Empty";
import { DataPagination } from "@/modules/agents/ui/components/DataPagination";
import { DEFAULT_PAGE } from "@/constants";

export function MeetingsView() {
  const [filters, setFilters] = useMeetingsFilters();
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({
      ...filters,
    })
  );
  const queryClient = useQueryClient();
  if (filters.page - 1 > 0) {
    queryClient.prefetchQuery(
      trpc.meetings.getMany.queryOptions({
        ...filters,
        page: filters.page - 1,
      })
    );
  }
  if (filters.page + 1 <= data.totalPages) {
    queryClient.prefetchQuery(
      trpc.meetings.getMany.queryOptions({
        ...filters,
        page: filters.page + 1,
      })
    );
  }
  useEffect(
    function () {
      if (data.hasMeetings) {
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
          title="Create your first meeting."
          description="Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with participants in real time."
        />
      )}
    </div>
  );
}

export function MeetingsLoading() {
  return (
    <LoadingState
      title="Loading Meetings"
      description="Please wait a few seconds"
    />
  );
}
export function MeetingsError() {
  return (
    <ErrorState
      title="Error loading Meetings"
      description="Something went wrong!"
    />
  );
}
