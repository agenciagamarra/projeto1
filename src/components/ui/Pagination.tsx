import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-6">
      <div className="flex w-0 flex-1">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>
      </div>
      
      <div className="hidden md:flex">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
              currentPage === page
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <div className="flex w-0 flex-1 justify-end">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center"
        >
          Próximo
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </nav>
  );
}