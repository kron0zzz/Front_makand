import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

export const Pagination = ({ page, totalPages, onPageChange }) => {
  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Página anterior"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="pagination-info">
        Página <span className="page-number">{page}</span> de{' '}
        <span className="page-number">{totalPages}</span>
      </div>

      <button
        className="pagination-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Página siguiente"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
