import { useState, useEffect } from 'react'
import { maskCPF, maskCNPJ, maskPhone, maskCEP } from '../../utils/masks'

const UFS = ['PR','SC','SP','RS','MG','RJ','GO','MS','MT','BA','CE','PE','PA','AM','MA','ES','RN','AL','SE','PI','RO','AC','AP','RR','TO','DF','PB']

const EMPTY = {
  tipoPessoa: 'Pessoa Física', status: 'ativo', nome: '', doc: '', ie: '',
  tel: '', email: '', rua: '', bairro: '', cep: '', cidade: '', estado: '', obs: ''
}

export default function PessoaForm({ tipo, inicial, onSave, onClose }) {
  const [form, setForm] = useState({ ...EMPTY, ...inicial })
  const [saving, setSaving] = useState(false)

  const isPJ = form.tipoPessoa === 'Pessoa Jurídica'
  const title = inicial?._id
    ? `Editar ${tipo === 'cliente' ? 'Cliente' : 'Fornecedor'}`
    : `Novo ${tipo === 'cliente' ? 'Cliente' : 'Fornecedor'}`

  function set(field, value) {
    setForm(p => ({ ...p, [field]: value }))
  }

  function handleDoc(v) {
    set('doc', isPJ ? maskCNPJ(v) : maskCPF(v))
  }

  async function submit() {
    if (!form.nome.trim()) return alert('Informe o nome ou razão social.')
    setSaving(true)
    try {
      await onSave(form)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {/* Identificação */}
          <div className="form-section-title">Identificação</div>
          <div className="form-grid cols-4" style={{ marginBottom: 14 }}>
            <div className="form-group">
              <label className="form-label">Tipo de Pessoa</label>
              <select value={form.tipoPessoa} onChange={e => { set('tipoPessoa', e.target.value); set('doc', '') }}>
                <option>Pessoa Física</option>
                <option>Pessoa Jurídica</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">{isPJ ? 'Razão Social' : 'Nome Completo'}</label>
              <input value={form.nome} onChange={e => set('nome', e.target.value)} placeholder={isPJ ? 'Razão social' : 'Nome completo'} />
            </div>
          </div>
          <div className="form-grid cols-4" style={{ marginBottom: 14 }}>
            <div className="form-group">
              <label className="form-label">{isPJ ? 'CNPJ' : 'CPF'}</label>
              <input value={form.doc} onChange={e => handleDoc(e.target.value)} placeholder={isPJ ? '00.000.000/0000-00' : '000.000.000-00'} maxLength={isPJ ? 18 : 14} />
            </div>
            {isPJ && (
              <div className="form-group">
                <label className="form-label">Inscrição Estadual</label>
                <input value={form.ie} onChange={e => set('ie', e.target.value)} placeholder="000.000.000.000" />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Telefone</label>
              <input value={form.tel} onChange={e => set('tel', maskPhone(e.target.value))} placeholder="(00) 00000-0000" maxLength={15} />
            </div>
            <div className="form-group" style={{ gridColumn: isPJ ? undefined : 'span 2' }}>
              <label className="form-label">E-mail</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@exemplo.com.br" />
            </div>
          </div>

          {/* Endereço */}
          <div className="form-section-title">Endereço</div>
          <div className="form-grid cols-4" style={{ marginBottom: 14 }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Rua e Número</label>
              <input value={form.rua} onChange={e => set('rua', e.target.value)} placeholder="Ex: Rua das Araucárias, 142" />
            </div>
            <div className="form-group">
              <label className="form-label">Bairro</label>
              <input value={form.bairro} onChange={e => set('bairro', e.target.value)} placeholder="Bairro" />
            </div>
            <div className="form-group">
              <label className="form-label">CEP</label>
              <input value={form.cep} onChange={e => set('cep', maskCEP(e.target.value))} placeholder="00000-000" maxLength={9} />
            </div>
          </div>
          <div className="form-grid cols-4" style={{ marginBottom: 14 }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Cidade</label>
              <input value={form.cidade} onChange={e => set('cidade', e.target.value)} placeholder="Cidade" />
            </div>
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select value={form.estado} onChange={e => set('estado', e.target.value)}>
                <option value="">UF</option>
                {UFS.map(uf => <option key={uf}>{uf}</option>)}
              </select>
            </div>
          </div>

          {/* Obs */}
          <div className="form-section-title">Observações</div>
          <div className="form-group">
            <textarea value={form.obs} onChange={e => set('obs', e.target.value)} rows={3} placeholder="Informações adicionais sobre este cadastro..." />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={submit} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}
