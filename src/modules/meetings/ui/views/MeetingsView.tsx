"use client";

import { ErrorState } from "@/components/Error";
import { LoadingState } from "@/components/Loading";
import { useTRPC } from "@/trpc/client";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useMeetingsFilters } from "../../hooks/useMeetingsFilters";
import { useEffect } from "react";

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
    <div>
      {data.items.map((s) => (
        <div key={s.id}>{s.name}</div>
      ))}
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
