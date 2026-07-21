import "./Pagination.css";

export default function Pagination({
    page,
    totalPages,
    total,
    onPageChange
}) {

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="pagination">

            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
            >
                Anterior
            </button>

            <span>
                Página {page} de {totalPages}
            </span>

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
            >
                Siguiente
            </button>

            <span className="pagination-total">
                {total} registros
            </span>

        </div>
    );
}