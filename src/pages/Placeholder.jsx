import Topbar from '../components/Topbar'

export default function Placeholder({ parent, title }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Topbar parent={parent} current={title} />
      <div className="content">
        <div className="card" style={{ padding: 60, textAlign: 'center', color: 'var(--text-faint)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚧</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-dim)' }}>{title}</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Este módulo será construído na próxima etapa</div>
        </div>
      </div>
    </div>
  )
}
