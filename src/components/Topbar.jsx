export default function Topbar({ parent, current, actions }) {
  return (
    <div className="topbar">
      <div className="breadcrumb">
        {parent && <><span className="bc-parent">{parent}</span><span className="bc-sep">›</span></>}
        <span className="bc-current">{current}</span>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ position: 'relative' }}>
          <button className="btn" style={{ width: 32, padding: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          <span style={{ position: 'absolute', top: 5, right: 5, width: 6, height: 6, background: 'var(--red)', borderRadius: '50%', border: '1.5px solid #fff' }} />
        </div>
        {actions}
      </div>
    </div>
  )
}
