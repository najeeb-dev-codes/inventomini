const Pagination = ({ page, total, perPage, onChange }) => {
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null

  const pages = []
  for (let i = 1; i <= totalPages; i++) pages.push(i)

  // Show at most 5 page buttons around current
  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  )

  const btnStyle = (active) => ({
    width: 32, height: 32,
    borderRadius: 7,
    border: active ? 'none' : '1.5px solid var(--border)',
    background: active ? 'var(--accent)' : 'var(--card)',
    color: active ? '#fff' : 'var(--text)',
    fontWeight: active ? 700 : 500,
    fontSize: 13,
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', padding: '14px 16px 8px', flexWrap: 'wrap' }}>
      {/* Prev */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        style={{ ...btnStyle(false), opacity: page === 1 ? 0.35 : 1, fontSize: 16 }}
      >‹</button>

      {visible.map((p, i) => {
        const prev = visible[i - 1]
        return (
          <span key={p} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {prev && p - prev > 1 && (
              <span style={{ color: 'var(--muted)', fontSize: 13, padding: '0 2px' }}>…</span>
            )}
            <button onClick={() => onChange(p)} style={btnStyle(p === page)}>{p}</button>
          </span>
        )
      })}

      {/* Next */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        style={{ ...btnStyle(false), opacity: page === totalPages ? 0.35 : 1, fontSize: 16 }}
      >›</button>

      <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 6 }}>
        {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
      </span>
    </div>
  )
}

export default Pagination
