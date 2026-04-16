import { useState } from 'react'
import { usePessoas } from './hooks/usePessoas'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Cadastros from './pages/Cadastros'
import Placeholder from './pages/Placeholder'

const PAGES = {
  dashboard:      { component: 'Dashboard' },
  clientes:       { component: 'Cadastros', tab: 'clientes' },
  fornecedores:   { component: 'Cadastros', tab: 'fornecedores' },
  orcamentos:     { component: 'Placeholder', parent: 'Comercial', title: 'Orçamentos' },
  pedidos:        { component: 'Placeholder', parent: 'Comercial', title: 'Pedidos' },
  carregamentos:  { component: 'Placeholder', parent: 'Comercial', title: 'Carregamentos' },
  financeiro:     { component: 'Placeholder', parent: 'Financeiro', title: 'Financeiro' },
  funcionarios:   { component: 'Placeholder', parent: 'Financeiro', title: 'Funcionários' },
  'estoque-toras':{ component: 'Placeholder', parent: 'Operacional', title: 'Estoque de Toras' },
  producao:       { component: 'Placeholder', parent: 'Operacional', title: 'Produção / Serraria' },
  'madeira-serrada':{ component: 'Placeholder', parent: 'Operacional', title: 'Madeira Serrada' },
  subprodutos:    { component: 'Placeholder', parent: 'Operacional', title: 'Subprodutos' },
  relatorios:     { component: 'Placeholder', parent: 'Análise', title: 'Relatórios' },
  simulacoes:     { component: 'Placeholder', parent: 'Análise', title: 'Simulações de Lucro' },
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const { lista: clientes } = usePessoas('cliente')
  const { lista: fornecedores } = usePessoas('fornecedor')

  function navigate(page) {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  const page = PAGES[currentPage] || PAGES.dashboard

  return (
    <>
      <Sidebar
        currentPage={currentPage}
        badges={{ clientes: 0, pedidos: 0, orcamentos: 0, carregamentos: 0 }}
        onNavigate={navigate}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {page.component === 'Dashboard' && (
          <Dashboard
            clientes={clientes}
            fornecedores={fornecedores}
            pedidos={[]}
            orcamentos={[]}
            onNavigate={navigate}
          />
        )}
        {page.component === 'Cadastros' && (
          <Cadastros
            tab={page.tab}
            onChangeTab={tab => setCurrentPage(tab)}
          />
        )}
        {page.component === 'Placeholder' && (
          <Placeholder parent={page.parent} title={page.title} />
        )}
      </div>
    </>
  )
}
