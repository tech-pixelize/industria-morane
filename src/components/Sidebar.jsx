import { useState } from 'react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦', section: null },
  { section: 'Cadastros' },
  {
    id: 'cadastros', label: 'Clientes e Fornec.', icon: '👥',
    sub: [
      { id: 'clientes', label: 'Clientes' },
      { id: 'fornecedores', label: 'Fornecedores' },
    ]
  },
  { section: 'Comercial' },
  { id: 'orcamentos', label: 'Orçamentos', icon: '📋' },
  { id: 'pedidos', label: 'Pedidos', icon: '🛒', badge: 'pedidos' },
  { id: 'carregamentos', label: 'Carregamentos', icon: '🚚' },
  { section: 'Financeiro' },
  { id: 'financeiro', label: 'Financeiro', icon: '💰' },
  { id: 'funcionarios', label: 'Funcionários', icon: '👤' },
  { section: 'Operacional' },
  { id: 'estoque-toras', label: 'Estoque de Toras', icon: '🪵' },
  { id: 'producao', label: 'Produção / Serraria', icon: '⚙️' },
  { id: 'madeira-serrada', label: 'Madeira Serrada', icon: '📦' },
  { id: 'subprodutos', label: 'Subprodutos', icon: '♻️' },
  { section: 'Análise' },
  { id: 'relatorios', label: 'Relatórios', icon: '📊' },
  { id: 'simulacoes', label: 'Simulações de Lucro', icon: '🧮' },
]

export default function Sidebar({ currentPage, badges = {}, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false)
  const [expanded, setExpanded] = useState({ cadastros: true })
  const [userMenu, setUserMenu] = useState(false)

  function toggleExpand(id) {
    setExpanded(p => ({ ...p, [id]: !p[id] }))
  }

  function nav(id) {
    onNavigate(id)
  }

  const isActive = (id) => {
    if (id === 'cadastros') return currentPage === 'clientes' || currentPage === 'fornecedores'
    return currentPage === id
  }

  return (
    <aside style={{
      width: collapsed ? 'var(--sb-mini)' : 'var(--sb-w)',
      minWidth: collapsed ? 'var(--sb-mini)' : 'var(--sb-w)',
      background: 'var(--sb-bg)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      transition: 'width var(--ease), min-width var(--ease)',
      overflow: 'hidden',
      flexShrink: 0,
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Brand */}
      <div style={{ padding: '0 10px 0 12px', borderBottom: '1px solid var(--sb-border)', display: 'flex', alignItems: 'center', gap: 10, height: 56, overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1c2e0f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 3c0 0 4 4.5 4 9s-4 9-4 9-4-4.5-4-9 4-9 4-9z" fill="#84cc16" opacity=".7"/>
            <circle cx="12" cy="12" r="2.5" fill="#84cc16"/>
          </svg>
        </div>
        {!collapsed && (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--sb-hi)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Morane Madeiras</div>
            <div style={{ fontSize: 11, color: 'var(--sb-text)', marginTop: 1 }}>morane.ind.br</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{ width: 22, height: 22, background: 'var(--sb-active)', border: '1px solid var(--sb-border)', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sb-text)', fontSize: 12, flexShrink: 0, transition: 'background var(--ease)' }}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '4px 0 8px', scrollbarWidth: 'none' }}>
        {NAV.map((item, idx) => {
          if (item.section) {
            return collapsed ? (
              <div key={idx} style={{ height: 6 }} />
            ) : (
              <div key={idx} style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#353535', padding: '12px 14px 4px' }}>
                {item.section}
              </div>
            )
          }

          if (item.sub) {
            const open = expanded[item.id]
            const active = isActive(item.id)
            return (
              <div key={item.id}>
                <div
                  onClick={() => { toggleExpand(item.id); if (collapsed) setCollapsed(false) }}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: collapsed ? '8px 0' : '7px 10px 7px 12px',
                    margin: collapsed ? '1px 0' : '1px 6px',
                    borderRadius: 7, cursor: 'pointer',
                    color: active ? 'var(--sb-hi)' : 'var(--sb-text)',
                    background: active ? 'var(--sb-active)' : 'transparent',
                    transition: 'background var(--ease), color var(--ease)',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    width: collapsed ? 'var(--sb-mini)' : undefined,
                  }}
                  onMouseEnter={e => !active && (e.currentTarget.style.background = 'var(--sb-hover)')}
                  onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: 14, flexShrink: 0, color: active ? 'var(--sb-icon-hi)' : collapsed ? '#aaa' : 'var(--sb-icon)' }}>{item.icon}</span>
                  {!collapsed && <span style={{ flex: 1, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>}
                  {!collapsed && <span style={{ fontSize: 10, color: 'var(--sb-icon)', transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'none' }}>›</span>}
                </div>
                {!collapsed && open && (
                  <div style={{ overflow: 'hidden' }}>
                    {item.sub.map(s => (
                      <div
                        key={s.id}
                        onClick={() => nav(s.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '6px 12px 6px 42px', margin: '0 6px',
                          borderRadius: 6, fontSize: 12.5, cursor: 'pointer',
                          color: currentPage === s.id ? 'var(--sb-hi)' : 'var(--sb-text)',
                          background: currentPage === s.id ? 'var(--sb-active)' : 'transparent',
                          fontWeight: currentPage === s.id ? 500 : 400,
                          transition: 'background var(--ease), color var(--ease)',
                        }}
                        onMouseEnter={e => currentPage !== s.id && (e.currentTarget.style.background = 'var(--sb-hover)')}
                        onMouseLeave={e => currentPage !== s.id && (e.currentTarget.style.background = 'transparent')}
                      >
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: currentPage === s.id ? '#888' : 'var(--sb-border)', flexShrink: 0 }} />
                        {s.label}
                        {badges[s.id] > 0 && (
                          <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 20, background: 'var(--red)', color: '#fff' }}>
                            {badges[s.id]}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          const active = isActive(item.id)
          return (
            <div
              key={item.id}
              onClick={() => nav(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '8px 0' : '7px 10px 7px 12px',
                margin: collapsed ? '1px 0' : '1px 6px',
                width: collapsed ? 'var(--sb-mini)' : undefined,
                borderRadius: 7, cursor: 'pointer',
                color: active ? 'var(--sb-hi)' : 'var(--sb-text)',
                background: active ? 'var(--sb-active)' : 'transparent',
                transition: 'background var(--ease), color var(--ease)',
                justifyContent: collapsed ? 'center' : 'flex-start',
                position: 'relative',
              }}
              onMouseEnter={e => !active && (e.currentTarget.style.background = 'var(--sb-hover)')}
              onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontSize: 14, flexShrink: 0, color: active ? 'var(--sb-icon-hi)' : collapsed ? '#aaa' : 'var(--sb-icon)' }}>{item.icon}</span>
              {!collapsed && <span style={{ flex: 1, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>}
              {!collapsed && badges[item.id] > 0 && (
                <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 20, background: 'var(--red)', color: '#fff' }}>
                  {badges[item.id]}
                </span>
              )}
            </div>
          )
        })}

        {/* Sep */}
        <div style={{ height: 1, background: 'var(--sb-border)', margin: '6px 12px' }} />
      </nav>

      {/* Footer */}
      <div style={{ flexShrink: 0, borderTop: '1px solid var(--sb-border)', padding: '4px 6px 8px', position: 'relative' }}>
        {userMenu && (
          <div style={{ position: 'absolute', bottom: 'calc(100% + 4px)', left: 8, right: 8, minWidth: 200, background: '#1e1e1e', border: '1px solid var(--sb-border)', borderRadius: 9, overflow: 'hidden', zIndex: 50, boxShadow: '0 8px 32px rgba(0,0,0,.5)' }}>
            <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid var(--sb-border)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--sb-hi)' }}>Administrador</div>
              <div style={{ fontSize: 11, color: 'var(--sb-text)', marginTop: 2 }}>admin@morane.ind.br</div>
            </div>
            {[
              { label: 'Meu Perfil', icon: '👤' },
              { label: 'Configurações', icon: '⚙️' },
              { label: 'Gerenciar Usuários', icon: '👥' },
            ].map(it => (
              <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', fontSize: 13, color: 'var(--sb-text)', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--sb-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span>{it.icon}</span>{it.label}
              </div>
            ))}
            <div style={{ height: 1, background: 'var(--sb-border)', margin: '3px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', fontSize: 13, color: '#f87171', cursor: 'pointer' }}>
              <span>🚪</span>Sair
            </div>
          </div>
        )}
        <div
          onClick={() => setUserMenu(m => !m)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '8px 0' : '8px 6px 8px 8px', borderRadius: 7, cursor: 'pointer', transition: 'background var(--ease)', justifyContent: collapsed ? 'center' : 'flex-start', width: collapsed ? 'var(--sb-mini)' : undefined }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--sb-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1a3a1a,#2d5a1b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>A</div>
          {!collapsed && (
            <>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--sb-hi)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Administrador</div>
                <div style={{ fontSize: 11, color: 'var(--sb-text)', marginTop: 1 }}>admin@morane.ind.br</div>
              </div>
              <span style={{ color: 'var(--sb-icon)', fontSize: 10 }}>⌃</span>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
