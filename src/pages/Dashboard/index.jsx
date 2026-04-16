import { useMemo } from 'react'
import { fmtMoney } from '../../utils/masks'

export default function Dashboard({ clientes, fornecedores, pedidos, orcamentos, onNavigate }) {
  const stats = useMemo(() => ({
    pedidosPend: pedidos.filter(p => p.statusE === 'pend').length,
    pedidosProd: pedidos.filter(p => p.statusE === 'prod').length,
    orcPend: orcamentos.filter(o => o.status === 'pend').length,
    aReceber: clientes.filter(c => c.saldo > 0).reduce((a, c) => a + (c.saldo || 0), 0),
  }), [clientes, pedidos, orcamentos])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="content">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px' }}>{greeting}! 👋</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-faint)', marginTop: 4 }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Pedidos Pendentes', value: stats.pedidosPend, color: 'var(--red)', sub: 'aguardando produção', page: 'pedidos' },
          { label: 'Em Produção', value: stats.pedidosProd, color: 'var(--blue)', sub: 'na serraria agora', page: 'pedidos' },
          { label: 'Orçamentos Abertos', value: stats.orcPend, color: 'var(--amber)', sub: 'aguardando aprovação', page: 'orcamentos' },
          { label: 'A Receber', value: fmtMoney(stats.aReceber), color: 'var(--green)', sub: 'saldo total clientes', page: 'clientes' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 18px', cursor: 'pointer' }} onClick={() => onNavigate(s.page)}>
            <div style={{ fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--text)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color, letterSpacing: '-1px' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Lists */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Pedidos recentes */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Pedidos Recentes</div>
            <button className="btn" style={{ height: 28, fontSize: 12 }} onClick={() => onNavigate('pedidos')}>Ver todos</button>
          </div>
          {pedidos.length === 0
            ? <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-faint)', fontSize: 13 }}>Nenhum pedido cadastrado</div>
            : pedidos.slice(0, 5).map(p => (
              <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{p.id}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>{p.clienteNome}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{fmtMoney(p.total)}</div>
                  <span className={`badge badge-${p.statusE}`} style={{ marginTop: 2 }}>
                    {{ pend: 'Pendente', prod: 'Em Produção', entrega: 'Pend. Entrega', entreg: 'Entregue' }[p.statusE]}
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* Orçamentos pendentes */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Orçamentos Pendentes</div>
            <button className="btn" style={{ height: 28, fontSize: 12 }} onClick={() => onNavigate('orcamentos')}>Ver todos</button>
          </div>
          {orcamentos.filter(o => o.status === 'pend').length === 0
            ? <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-faint)', fontSize: 13 }}>Nenhum orçamento pendente ✓</div>
            : orcamentos.filter(o => o.status === 'pend').slice(0, 5).map(o => (
              <div key={o._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{o.id} — {o.clienteNome}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>Válido até {o.validade}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{fmtMoney(o.total)}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
