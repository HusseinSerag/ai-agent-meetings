import { Button } from "@/components/ui/button";
interface DataPaginationProps {
  page: number;
  totalPages: number;
  onPageChange(page: number): void;
}
export function DataPagination({
  onPageChange,
  page,
  totalPages,
}: DataPaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          disabled={page <= 1}
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            if (page > 1) onPageChange(page - 1);
          }}
        >
          Previous
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            if (page < totalPages) onPageChange(page + 1);
          }}
          disabled={page == totalPages || totalPages == 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
