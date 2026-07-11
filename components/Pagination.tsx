'use client'

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderTop: '1px solid #E5E7EB',
      }}
    >
      <span style={{ fontSize: '13px', color: '#585F6C' }}>
        Menampilkan {totalItems} data
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          style={{
            padding: '6px 10px',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            backgroundColor: currentPage === 1 ? '#F9FAFB' : '#FFFFFF',
            color: currentPage === 1 ? '#D1D5DB' : '#585F6C',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            lineHeight: 1,
          }}
        >
          ‹ Prev
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} style={{ padding: '0 4px', color: '#9CA3AF', fontSize: '13px' }}>
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: p === currentPage ? 'none' : '1px solid #E5E7EB',
                backgroundColor: p === currentPage ? '#B45309' : '#FFFFFF',
                color: p === currentPage ? '#FFFFFF' : '#585F6C',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: p === currentPage ? 600 : 400,
              }}
            >
              {p}
            </button>
          )
        )}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          style={{
            padding: '6px 10px',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            backgroundColor: currentPage === totalPages ? '#F9FAFB' : '#FFFFFF',
            color: currentPage === totalPages ? '#D1D5DB' : '#585F6C',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            lineHeight: 1,
          }}
        >
          Next ›
        </button>
      </div>
    </div>
  )
}
