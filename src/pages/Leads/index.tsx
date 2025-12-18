// src/components/Leads/index.tsx - EXEMPLO DE USO
import { useState } from 'react';
import { 
  useGetLeadsQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useGetLeadStatsQuery,
  extractErrorMessage,
  type Lead
} from '../../services';

export default function LeadsComponent() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  
  // ✅ Buscar leads com filtros
  const { 
    data: leadsData, 
    isLoading, 
    error,
    refetch 
  } = useGetLeadsQuery({
    search,
    status: statusFilter !== 'todos' ? statusFilter : undefined,
  });
  
  // ✅ Buscar estatísticas
  const { data: stats } = useGetLeadStatsQuery();
  
  // ✅ Mutations
  const [createLead, { isLoading: isCreating }] = useCreateLeadMutation();
  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();
  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();
  
  // ✅ Criar lead
  const handleCreateLead = async (data: Partial<Lead>) => {
    try {
      await createLead(data).unwrap();
      console.log('✅ Lead criado!');
      // Cache invalidado automaticamente, lista atualiza sozinha
    } catch (err) {
      console.error('❌ Erro:', extractErrorMessage(err));
    }
  };
  
  // ✅ Atualizar lead
  const handleUpdateLead = async (id: number, data: Partial<Lead>) => {
    try {
      await updateLead({ id, data }).unwrap();
      console.log('✅ Lead atualizado!');
    } catch (err) {
      console.error('❌ Erro:', extractErrorMessage(err));
    }
  };
  
  // ✅ Deletar lead
  const handleDeleteLead = async (id: number) => {
    try {
      await deleteLead(id).unwrap();
      console.log('✅ Lead deletado!');
    } catch (err) {
      console.error('❌ Erro:', extractErrorMessage(err));
    }
  };
  
  if (isLoading) return <div>Carregando leads...</div>;
    if (error) return <div>Erro ao carregar leads: {extractErrorMessage(error)}</div>;
  
  const leads = leadsData?.results || [];
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leads</h1>
      
      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded">
            <p className="text-sm text-blue-700">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <p className="text-sm text-green-700">Novos</p>
            <p className="text-2xl font-bold">{stats.novo}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded">
            <p className="text-sm text-purple-700">Qualificados</p>
            <p className="text-2xl font-bold">{stats.qualificado}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded">
            <p className="text-sm text-yellow-700">Conversão</p>
            <p className="text-2xl font-bold">{stats.conversao}</p>
          </div>
        </div>
      )}
      
      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
        />
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="todos">Todos os Status</option>
          <option value="novo">Novo</option>
          <option value="contato">Em Contato</option>
          <option value="qualificado">Qualificado</option>
          <option value="conversao">Conversão</option>
          <option value="perdido">Perdido</option>
        </select>
        
        <button
          onClick={() => handleCreateLead({
            nome: 'Novo Lead',
            email: 'lead@example.com',
            telefone: '11999990000',
            origem: 'site',
          })}
          disabled={isCreating}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isCreating ? 'Criando...' : 'Novo Lead'}
        </button>
      </div>
      
      {/* Lista de Leads */}
      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Telefone</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b">
                <td className="p-3">{lead.nome}</td>
                <td className="p-3">{lead.email}</td>
                <td className="p-3">{lead.telefone}</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    {lead.status_display}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleUpdateLead(lead.id, { status: 'qualificado' })}
                    disabled={isUpdating}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    Qualificar
                  </button>
                  <button
                    onClick={() => handleDeleteLead(lead.id)}
                    disabled={isDeleting}
                    className="text-red-600 hover:underline"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {leads.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhum lead encontrado
          </div>
        )}
      </div>
    </div>
  );
}