const Table = ({ headers, rows, empty = 'No data found' }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
      <thead>
        <tr style={{ borderBottom: '2px solid var(--border)' }}>
          {headers.map((h) => (
            <th
              key={h}
              style={{
                padding: '10px 14px', textAlign: 'left',
                fontWeight: 700, fontSize: 12,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                color: 'var(--muted)', whiteSpace: 'nowrap',
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td
              colSpan={headers.length}
              style={{ padding: '40px 14px', textAlign: 'center', color: 'var(--muted)' }}
            >
              {empty}
            </td>
          </tr>
        ) : (
          rows.map((row, i) => (
            <tr
              key={i}
              style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '11px 14px', color: 'var(--text)', verticalAlign: 'middle' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)

export default Table
