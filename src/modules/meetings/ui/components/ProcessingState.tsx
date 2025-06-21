import { EmptyState } from "@/components/Empty";

export function ProcessingState() {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        description="We are currently processing your meeting"
        title="Meeting completed"
        image="/processing.svg"
      />
    </div>
  );
}
