interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onChange }: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onChange(page)}
          className={`rounded-full px-3 py-1 transition ${
            page === currentPage ? "bg-primary text-black" : "border border-slate-800"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
