import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const AdminPagination = ({ currentPage, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => canGoPrevious && onChange(currentPage - 1)}
            className={`hover:cursor-pointer transition-opacity ${
              !canGoPrevious
                ? "opacity-50 pointer-events-none"
                : "hover:opacity-80"
            }`}
          />
        </PaginationItem>

        <span className="mx-3 font-medium">
          {currentPage + 1} / {totalPages}
        </span>

        <PaginationItem>
          <PaginationNext
            onClick={() => canGoNext && onChange(currentPage + 1)}
            className={`hover:cursor-pointer transition-opacity ${
              !canGoNext
                ? "opacity-50 pointer-events-none"
                : "hover:opacity-80"
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default AdminPagination;
