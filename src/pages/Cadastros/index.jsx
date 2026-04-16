import { useState, useMemo } from 'react'
import { usePessoas } from '../../hooks/usePessoas'
import { useToast } from '../../components/Toast'
import { useConfirm } from '../../components/ConfirmModal'
import { fmtMoney } from '../../utils/masks'
import Topbar from '../../components/Topbar'
import PessoaForm from './PessoaForm'
import PessoaDetalhe from './PessoaDetalhe'

const ESTADOS_LABELS = { ativo: 'Ativo', inativo: 'Inativo' }

function StatusTag({ status, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <span
        className={`badge badge-${status}`}
        style={{ cursor: 'pointer' }}
        onClick={e => { e.stopPropagation(); setOpen(o => !o) }}
      >
        {ESTADOS_LABELS[status] || status}
      </span>
      {open && (
        <div className="dropdown-menu" style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4 }}>
          {['ativo','inativo'].map(s => (
            <div key={s} className="dropdown-item" onClick={e => { e.stopPropagation(); onChange(s); setOpen(false) }}>
              {ESTADOS_LABELS[s]}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Cadastros({ tab: initialTab = 'clientes', onChangeTab }) {
  const [tab, setTab] = useState(initialTab)
  const tipo = tab === 'clientes' ? 'cliente' : 'fornecedor'

  const { lista, loading, salvar, excluir, atualizarSaldo } = usePessoas(tipo)
  const toast = useToast()
  const confirm = useConfirm()

  const [search, setSearch] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [detalhe, setDetalhe] = useState(null)
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const filtered = useMemo(() => {
    let d = lista
    if (filtro === 'ativos') d = d.filter(r => r.status === 'ativo')
    if (filtro === 'inativos') d = d.filter(r => r.status === 'inativo')
    if (search) {
      const q = search.toLowerCase()
      d = d.filter(r =>
        r.nome?.toLowerCase().includes(q) ||
        r.doc?.includes(q) ||
        r.cidade?.toLowerCase().includes(q) ||
        r.tel?.includes(q)
      )
    }
    return d
  }, [lista, filtro, search])

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const stats = useMemo(() => ({
    total: lista.length,
    ativos: lista.filter(r => r.status === 'ativo').length,
    inadim: lista.filter(r => (r.saldo || 0) < 0).length,
    receber: lista.filter(r => (r.saldo || 0) > 0).reduce((a, r) => a + r.saldo, 0),
    pagar: lista.filter(r => (r.saldo || 0) < 0).reduce((a, r) => a + Math.abs(r.saldo), 0),
  }), [lista])

  async function handleSave(dados) {
    try {
      await salvar({ ...dados, tipo: dados.tipoPessoa === 'Pessoa Jurídica' ? 'PJ' : 'PF', saldo: editItem?.saldo || 0 })
      toast(editItem ? 'Cadastro atualizado!' : `${tipo === 'cliente' ? 'Cliente' : 'Fornecedor'} salvo!`, 'success')
    } catch (e) {
      toast('Erro ao salvar: ' + e.message, 'error')
      throw e
    }
  }

  async function handleDelete(item) {
    const ok = await confirm({ title: 'Excluir cadastro', msg: `Deseja excluir ${item.nome}? Esta ação não pode ser desfeita.`, icon: '🗑️', okLabel: 'Excluir', danger: true })
    if (!ok) return
    try {
      await excluir(item._id)
      toast('Cadastro excluído.', 'success')
    } catch (e) {
      toast('Erro: ' + e.message, 'error')
    }
  }

  async function handleStatus(item, novoStatus) {
    try {
      await salvar({ ...item, status: novoStatus })
    } catch (e) {
      toast('Erro: ' + e.message, 'error')
    }
  }

  function changeTab(t) {
    setTab(t)
    setSearch('')
    setFiltro('todos')
    setPage(1)
    onChangeTab?.(t)
  }

  if (detalhe) {
    return (
      <PessoaDetalhe
        pessoa={detalhe}
        tipo={tipo}
        onVoltar={() => setDetalhe(null)}
        onEdit={() => { setEditItem(detalhe); setFormOpen(true) }}
        onSaldoChange={(delta) => atualizarSaldo(detalhe._id, delta)}
      />
    )
  }

  const isCliente = tab === 'clientes'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
      <Topbar
        parent="Cadastros"
        current={isCliente ? 'Clientes' : 'Fornecedores'}
        actions={
          <button className="btn btn-primary" onClick={() => { setEditItem(null); setFormOpen(true) }}>
            + {isCliente ? 'Novo Cliente' : 'Novo Fornecedor'}
          </button>
        }
      />

      <div className="content">
        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-label">{isCliente ? 'Total Clientes' : 'Total Fornecedores'}</div>
            <div className="stat-value text-blue">{stats.total}</div>
          </div>
          {isCliente ? (
            <>
              <div className="stat-item">
                <div className="stat-label">Inadimplentes</div>
                <div className="stat-value text-red">{stats.inadim}</div>
                <div className="stat-sub">{stats.inadim > 0 ? 'em atraso' : 'nenhum'}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Saldo a Receber</div>
                <div className="stat-value text-amber">{fmtMoney(stats.receber)}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Ativos</div>
                <div className="stat-value text-green">{stats.ativos}</div>
                <div className="stat-sub">de {stats.total}</div>
              </div>
            </>
          ) : (
            <>
              <div className="stat-item">
                <div className="stat-label">Com Saldo Aberto</div>
                <div className="stat-value text-red">{stats.inadim}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Saldo a Pagar</div>
                <div className="stat-value text-amber">{fmtMoney(stats.pagar)}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Ativos</div>
                <div className="stat-value text-green">{stats.ativos}</div>
                <div className="stat-sub">de {stats.total}</div>
              </div>
            </>
          )}
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <button className={`tab-btn ${tab === 'clientes' ? 'active' : ''}`} onClick={() => changeTab('clientes')}>
            Clientes <span className="tab-count">{tab === 'clientes' ? filtered.length : ''}</span>
          </button>
          <button className={`tab-btn ${tab === 'fornecedores' ? 'active' : ''}`} onClick={() => changeTab('fornecedores')}>
            Fornecedores <span className="tab-count">{tab === 'fornecedores' ? filtered.length : ''}</span>
          </button>
          <div className="toolbar-divider" />
          <div className="search-wrap">
            <span className="search-icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Buscar por nome, CPF/CNPJ, cidade..."
            />
          </div>
          <button className={`filter-btn ${filtro === 'todos' ? 'active' : ''}`} onClick={() => { setFiltro('todos'); setPage(1) }}>Todos</button>
          <button className={`filter-btn ${filtro === 'ativos' ? 'active' : ''}`} onClick={() => { setFiltro('ativos'); setPage(1) }}>Ativos</button>
          <button className={`filter-btn ${filtro === 'inativos' ? 'active' : ''}`} onClick={() => { setFiltro('inativos'); setPage(1) }}>Inativos</button>
          <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={() => { setEditItem(null); setFormOpen(true) }}>
            + {isCliente ? 'Novo Cliente' : 'Novo Fornecedor'}
          </button>
        </div>

        {/* Table */}
        <div className="card table-wrap">
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-faint)' }}>Carregando...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nome / Razão Social</th>
                  <th>CNPJ / CPF</th>
                  <th>Cidade</th>
                  <th>Contato</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-faint)' }}>
                    {lista.length === 0 ? `Nenhum ${isCliente ? 'cliente' : 'fornecedor'} cadastrado ainda.` : 'Nenhum resultado encontrado.'}
                  </td></tr>
                ) : paginated.map(r => (
                  <tr key={r._id} onClick={() => setDetalhe(r)}>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{r.nome}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 1 }}>{r.tipo === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}</div>
                    </td>
                    <td className="muted">{r.doc || '—'}</td>
                    <td className="muted">{r.cidade ? `${r.cidade}${r.estado ? ' / ' + r.estado : ''}` : '—'}</td>
                    <td className="muted">{r.tel || '—'}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <StatusTag status={r.status || 'ativo'} onChange={s => handleStatus(r, s)} />
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="row-actions">
                        <button className="row-btn" title="Editar" onClick={() => { setEditItem(r); setFormOpen(true) }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button className="row-btn danger" title="Excluir" onClick={() => handleDelete(r)}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="pagination">
            <span className="pagination-info">
              {filtered.length === 0 ? 'Nenhum registro' : `Exibindo ${Math.min((page-1)*PER_PAGE+1, filtered.length)}–${Math.min(page*PER_PAGE, filtered.length)} de ${filtered.length} registros`}
            </span>
            <div className="page-btns">
              <button className="page-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
                <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages || totalPages === 0}>›</button>
            </div>
          </div>
        </div>
      </div>

      {formOpen && (
        <PessoaForm
          tipo={tipo}
          inicial={editItem || undefined}
          onSave={handleSave}
          onClose={() => { setFormOpen(false); setEditItem(null) }}
        />
      )}
    </div>
  )
}
