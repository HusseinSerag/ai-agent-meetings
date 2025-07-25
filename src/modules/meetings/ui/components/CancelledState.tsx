import { EmptyState } from "@/components/Empty";

export function CancelledState() {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        description="This meeting was cancelled"
        title="Meeting cancelled"
        image="/cancelled.svg"
      />
    </div>
  );
}
