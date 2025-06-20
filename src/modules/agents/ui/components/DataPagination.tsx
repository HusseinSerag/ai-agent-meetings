import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  if (totalPages == 0) return null;

  const siblingsCount = 1;
  const pages: number[] = [];

  function addPage(p: number) {
    if (p >= 1 && p <= totalPages && !pages.includes(p)) {
      pages.push(p);
    }
  }

  // Always add first and last page
  addPage(1);
  addPage(totalPages);

  // Add pages around current page
  for (let i = page - siblingsCount; i <= page + siblingsCount; i++) {
    addPage(i);
  }

  pages.sort((a, b) => a - b);

  // To decide where to put ellipsis, we check gaps between pages
  // We'll render a pagination item for each page, plus ellipsis when gap > 1

  const items: (number | "ellipsis")[] = [];
  for (let i = 0; i < pages.length; i++) {
    items.push(pages[i]);

    if (i < pages.length - 1) {
      if (pages[i + 1] - pages[i] > 1) {
        items.push("ellipsis");
      }
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={page <= 1}
            onClick={() => {
              if (page > 1) onPageChange(page - 1);
            }}
          />
        </PaginationItem>

        {items.map((item, idx) => {
          if (item === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return (
            <PaginationItem
              key={item}
              aria-current={page === item ? "page" : undefined}
              onClick={() => onPageChange(item)}
            >
              <PaginationLink isActive={page === item}>{item}</PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            disabled={page >= totalPages}
            onClick={() => {
              if (page < totalPages) onPageChange(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
