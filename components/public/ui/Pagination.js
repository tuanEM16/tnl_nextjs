// components/public/ui/Pagination.js
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-3 mt-16">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-12 h-12 flex items-center justify-center font-black italic border-4 transition-all shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1 ${
            currentPage === page 
              ? "bg-black text-white border-black" 
              : "bg-white text-black border-black hover:bg-orange-50"
          }`}
        >
          {page < 10 ? `0${page}` : page}
        </button>
      ))}
    </div>
  );
}