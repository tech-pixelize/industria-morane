import { useState, useEffect } from 'react'
import { useMovimentacoes } from '../../hooks/useMovimentacoes'
import { useToast } from '../../components/Toast'
import { useConfirm } from '../../components/ConfirmModal'
import { fmtMoney, maskMoney, parseMoney, todayISO } from '../../utils/masks'
import Topbar from '../../components/Topbar'

const MET_LABELS = { pix: 'Pix', dinheiro: 'Dinheiro', cartao: 'Cartão', boleto: 'Boleto', cheque: 'Cheque', outros: 'Outros' }
const MET_CLASSES = { pix: 'pix', dinheiro: 'din', cartao: 'car', boleto: 'bol', cheque: 'che', outros: 'out' }
const metBadgeStyle = { pix: { background: '#dcfce7', color: '#15803d' }, dinheiro: { background: '#fef9c3', color: '#854d0e' }, cartao: { background: '#ede9fe', color: '#6d28d9' }, boleto: { background: '#dbeafe', color: '#1e40af' }, cheque: { background: '#fce7f3', color: '#9d174d' }, outros: { background: '#f3f4f6', color: '#6b7280' } }

function LancarModal({ pessoaId, tipo, onSave, onClose }) {
  const [dir, setDir] = useState('e')
  const [met, setMet] = useState('pix')
  const [val, setVal] = useState('')
  const [data, setData] = useState(todayISO())
  const [desc, setDesc] = useState('')
  const [obs, setObs] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit() {
    const v = parseMoney(val)
    if (!v) return alert('Informe o valor.')
    setSaving(true)
    try {
      await onSave({ dir, met, val: v, data, desc: desc || 'Lançamento manual', obs })
      onClose()
    } finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: 520 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Lançar Pagamento</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-section-title">Tipo de Lançamento</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[['e','⬆ Recebimento (Entrada)'],['s','⬇ Pagamento (Saída)']].map(([d,l]) => (
              <button key={d} onClick={() => setDir(d)} style={{ flex: 1, height: 36, border: `1.5px solid ${dir===d ? (d==='e'?'var(--green)':'var(--red)') : 'var(--border)'}`, borderRadius: 7, background: dir===d ? (d==='e'?'#f0fdf4':'#fef2f2') : '#fafafa', color: dir===d ? (d==='e'?'#15803d':'#dc2626') : 'var(--text-dim)', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all .15s' }}>{l}</button>
            ))}
          </div>

          <div className="form-section-title">Forma de Pagamento</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8, marginBottom: 16 }}>
            {Object.entries(MET_LABELS).map(([k, l]) => (
              <div key={k} onClick={() => setMet(k)} style={{ border: `1.5px solid ${met===k?'var(--blue)':'var(--border)'}`, borderRadius: 8, padding: '10px 6px', cursor: 'pointer', textAlign: 'center', background: met===k?'#eff6ff':'#fafafa', transition: 'all .15s' }}>
                <div style={{ fontSize: 18, marginBottom: 3 }}>{{ pix:'⚡', dinheiro:'💵', cartao:'💳', boleto:'🏦', cheque:'📝', outros:'📎' }[k]}</div>
                <div style={{ fontSize: 10.5, fontWeight: 500, color: met===k?'#1d4ed8':'var(--text-dim)' }}>{l}</div>
              </div>
            ))}
          </div>

          <div className="form-grid cols-3" style={{ marginBottom: 14 }}>
            <div className="form-group">
              <label className="form-label">Valor (R$)</label>
              <input value={val} onChange={e => setVal(maskMoney(e.target.value))} placeholder="0,00" />
            </div>
            <div className="form-group">
              <label className="form-label">Data</label>
              <input type="date" value={data} onChange={e => setData(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Descrição / Referência</label>
              <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Ex: Pedido #045" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Observações</label>
            <textarea value={obs} onChange={e => setObs(e.target.value)} rows={2} placeholder="Informações adicionais..." />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving ? 'Salvando...' : 'Salvar Lançamento'}</button>
        </div>
      </div>
    </div>
  )
}

export default function PessoaDetalhe({ pessoa, tipo, onVoltar, onEdit, onSaldoChange }) {
  const [tabAtiva, setTabAtiva] = useState('dados')
  const [lancarOpen, setLancarOpen] = useState(false)
  const { movs, loading: movLoading, carregar, lancar, excluir, totalEntradas, totalSaidas, saldo } = useMovimentacoes()
  const toast = useToast()
  const confirm = useConfirm()

  useEffect(() => {
    if (pessoa?._id) carregar(tipo, pessoa._id)
  }, [pessoa?._id, tipo])

  const initials = pessoa.nome?.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase().slice(0,2) || '?'

  async function handleLancar(mov) {
    try {
      await lancar(tipo, pessoa._id, mov)
      const delta = mov.dir === 'e' ? mov.val : -mov.val
      onSaldoChange(delta)
      toast('Lançamento salvo!', 'success')
    } catch (e) {
      toast('Erro: ' + e.message, 'error')
      throw e
    }
  }

  async function handleExcluirMov(mov) {
    const ok = await confirm({ title: 'Excluir Lançamento', msg: 'Deseja excluir este lançamento? O saldo será revertido.', icon: '🗑️', okLabel: 'Excluir', danger: true })
    if (!ok) return
    try {
      await excluir(tipo, pessoa._id, mov._id)
      const delta = mov.dir === 'e' ? -mov.val : mov.val
      onSaldoChange(delta)
      toast('Lançamento excluído.', 'success')
    } catch (e) {
      toast('Erro: ' + e.message, 'error')
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
      <Topbar
        parent={`Cadastros › ${tipo === 'cliente' ? 'Clientes' : 'Fornecedores'}`}
        current={pessoa.nome}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" onClick={onVoltar}>← Voltar</button>
            <button className="btn" onClick={onEdit}>✎ Editar</button>
            <button className="btn">📄 PDF Histórico</button>
            <button className="btn">🧾 Gerar Recibo</button>
            <button className="btn btn-primary" onClick={() => setLancarOpen(true)}>+ Lançar Pagamento</button>
          </div>
        }
      />

      <div className="content">
        {/* Header */}
        <div className="detail-header" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className={`detail-avatar ${tipo === 'cliente' ? 'avatar-cli' : 'avatar-for'}`}>{initials}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.3px' }}>{pessoa.nome}</div>
              <div style={{ fontSize: 13, color: 'var(--text-faint)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>{pessoa.tipo === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'} • {pessoa.doc}</span>
                <span className={`badge badge-${pessoa.status || 'ativo'}`}>{pessoa.status === 'inativo' ? 'Inativo' : 'Ativo'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          {[['dados','📋 Dados Cadastrais'],['mov','💰 Movimentações Financeiras'],['docs','📁 Documentos']].map(([id,label]) => (
            <button key={id} className={`detail-tab ${tabAtiva === id ? 'active' : ''}`} onClick={() => setTabAtiva(id)}>{label}</button>
          ))}
        </div>

        <div className="detail-tab-content">
          {/* DADOS */}
          {tabAtiva === 'dados' && (
            <>
              <div className="info-grid">
                {[
                  ['Telefone', pessoa.tel],
                  ['E-mail', pessoa.email],
                  ['Cidade', pessoa.cidade ? `${pessoa.cidade}${pessoa.estado ? ' / ' + pessoa.estado : ''}` : '—'],
                  ['Endereço', pessoa.rua || '—'],
                  ['Bairro', pessoa.bairro || '—'],
                  ['CEP', pessoa.cep || '—'],
                  ...(pessoa.tipo === 'PJ' ? [['CNPJ', pessoa.doc], ['Inscrição Estadual', pessoa.ie || '—']] : [['CPF', pessoa.doc]])
                ].map(([label, value]) => (
                  <div key={label} className="info-item">
                    <div className="info-label">{label}</div>
                    <div className="info-value">{value || '—'}</div>
                  </div>
                ))}
              </div>
              {pessoa.obs && (
                <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
                  <div className="info-label" style={{ marginBottom: 6 }}>Observações</div>
                  <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6 }}>{pessoa.obs}</div>
                </div>
              )}
            </>
          )}

          {/* MOVIMENTAÇÕES */}
          {tabAtiva === 'mov' && (
            <>
              {movLoading ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-faint)' }}>Carregando...</div>
              ) : movs.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-faint)' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>💳</div>
                  Nenhuma movimentação registrada.<br />
                  <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setLancarOpen(true)}>+ Lançar primeiro pagamento</button>
                </div>
              ) : (
                <>
                  <div className="mov-list">
                    {movs.map(m => (
                      <div key={m._id} className="mov-item">
                        <div className={`mov-icon ${m.dir === 'e' ? 'entrada' : 'saida'}`} style={{ fontSize: 12 }}>
                          {m.dir === 'e' ? '⬆' : '⬇'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="mov-desc">{m.desc}</div>
                          <div className="mov-meta">
                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '1px 6px', borderRadius: 8, fontSize: 10.5, fontWeight: 500, ...metBadgeStyle[m.met] }}>{MET_LABELS[m.met] || m.met}</span>
                            <span>{m.data}</span>
                          </div>
                        </div>
                        <div className="mov-val">{m.dir === 'e' ? '+' : '-'} {fmtMoney(m.val)}</div>
                        <button className="row-btn danger" style={{ opacity: 1, marginLeft: 8 }} title="Excluir" onClick={() => handleExcluirMov(m)}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="saldo-box">
                    {[
                      { sign: '+', cls: 'sign-pos', label: 'Total Entradas', val: totalEntradas, color: 'var(--green)' },
                      { sign: '−', cls: 'sign-neg', label: 'Total Saídas',   val: totalSaidas,  color: 'var(--red)' },
                      { sign: '=', cls: 'sign-eq',  label: 'Saldo Atual',    val: saldo,        color: saldo > 0 ? 'var(--green)' : saldo < 0 ? 'var(--red)' : 'var(--text-faint)' },
                    ].map(row => (
                      <div key={row.label} className="saldo-row">
                        <div className="saldo-lbl">
                          <span className={`saldo-sign ${row.cls}`}>{row.sign}</span>
                          {row.label}
                        </div>
                        <div className="saldo-num" style={{ color: row.color }}>{fmtMoney(row.val)}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* DOCUMENTOS */}
          {tabAtiva === 'docs' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { icon: '📄', title: 'Histórico de Pagamentos (PDF)', desc: 'Todas as movimentações em ordem cronológica' },
                { icon: '🧾', title: 'Recibo de Pagamento', desc: 'Gerar recibo do último pagamento' },
                { icon: '📊', title: 'Extrato de Conta', desc: 'Resumo financeiro do período' },
                { icon: '📝', title: 'Ficha Cadastral', desc: 'Dados completos para impressão' },
              ].map(d => (
                <div key={d.title} style={{ border: '1px solid var(--border)', borderRadius: 9, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'all .15s', background: '#fafafa' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.background = '#eff6ff' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = '#fafafa' }}
                  onClick={() => toast('PDF será gerado no sistema completo', 'default')}
                >
                  <span style={{ fontSize: 24 }}>{d.icon}</span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{d.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {lancarOpen && (
        <LancarModal tipo={tipo} pessoaId={pessoa._id} onSave={handleLancar} onClose={() => setLancarOpen(false)} />
      )}
    </div>
  )
}
