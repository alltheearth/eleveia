// src/pages/Dashboard/index.tsx - ✅ DASHBOARD COMPLETO
import { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Phone,
  Mail,
  Calendar,
  FileText,
  RefreshCw
} from 'lucide-react';

// Componentes
import PageModel from '../../components/layout/PageModel';
import { StatCard, MessageAlert, LoadingState, Badge } from '../../components/common';

// Hooks e Services
import { useCurrentSchool } from '../../hooks/useCurrentSchool';
import {
  useGetLeadStatsQuery,
  useGetContactStatsQuery,
  useGetTicketStatsQuery,
  useGetRecentLeadsQuery,
  useGetRecentTicketsQuery,
  type Lead,
  type Ticket
} from '../../services';

// ============================================
// INTERFACES
// ============================================

interface DashboardStats {
  totalInteracoes: number;
  interacoesHoje: number;
  leadsCapturados: number;
  ticketsAbertos: number;
  tempoMedioResposta: string;
  taxaSatisfacao: number;
  statusAgente: 'online' | 'offline' | 'ocupado';
}

interface RecentActivity {
  id: string;
  tipo: 'lead' | 'ticket' | 'mensagem' | 'contato';
  titulo: string;
  descricao: string;
  timestamp: string;
  status?: string;
}

export default function Dashboard() {
  // ============================================
  // HOOKS
  // ============================================
  
  const { currentSchool, isLoading: schoolsLoading } = useCurrentSchool();
  
  // Stats de diferentes módulos
  const { data: leadStats, isLoading: leadsLoading, refetch: refetchLeads } = useGetLeadStatsQuery();
  const { data: contactStats, isLoading: contactsLoading, refetch: refetchContacts } = useGetContactStatsQuery();
  const { data: ticketStats, isLoading: ticketsLoading, refetch: refetchTickets } = useGetTicketStatsQuery();
  
  // Dados recentes
  const { data: recentLeads, refetch: refetchRecentLeads } = useGetRecentLeadsQuery(5);
  const { data: recentTickets, refetch: refetchRecentTickets } = useGetRecentTicketsQuery(5);

  // ============================================
  // ESTADOS
  // ============================================
  
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalInteracoes: 0,
    interacoesHoje: 0,
    leadsCapturados: 0,
    ticketsAbertos: 0,
    tempoMedioResposta: '0min',
    taxaSatisfacao: 0,
    statusAgente: 'online',
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date>(new Date());

  // ============================================
  // EFFECTS
  // ============================================
  
  // Atualizar stats quando dados mudarem
  useEffect(() => {
    if (leadStats && contactStats && ticketStats) {
      setDashboardStats({
        totalInteracoes: contactStats.total + leadStats.total,
        interacoesHoje: leadStats.novos_hoje + contactStats.novos_hoje,
        leadsCapturados: leadStats.total,
        ticketsAbertos: ticketStats.open + ticketStats.in_progress,
        tempoMedioResposta: '5min', // Pode vir do backend
        taxaSatisfacao: 92, // Pode vir do backend
        statusAgente: 'online',
      });
    }
  }, [leadStats, contactStats, ticketStats]);

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  // ============================================
  // HANDLERS
  // ============================================
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchLeads(),
        refetchContacts(),
        refetchTickets(),
        refetchRecentLeads(),
        refetchRecentTickets(),
      ]);
      setUltimaAtualizacao(new Date());
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatarDataRelativa = (data: string): string => {
    const agora = new Date();
    const dataObj = new Date(data);
    const diffMs = agora.getTime() - dataObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins}min atrás`;
    
    const diffHoras = Math.floor(diffMins / 60);
    if (diffHoras < 24) return `${diffHoras}h atrás`;
    
    const diffDias = Math.floor(diffHoras / 24);
    return `${diffDias}d atrás`;
  };

  const formatarHora = (data: Date): string => {
    return data.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // ============================================
  // LOADING STATE
  // ============================================
  
  if (schoolsLoading || leadsLoading || contactsLoading || ticketsLoading) {
    return (
      <LoadingState 
        message="Carregando dashboard..."
        icon={<Activity size={48} className="text-blue-600" />}
      />
    );
  }

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <PageModel>
      {/* Header com status do agente */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard - {currentSchool?.nome_escola}</h1>
            <p className="text-blue-100">Visão geral das suas operações em tempo real</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Status do Agente */}
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                dashboardStats.statusAgente === 'online' ? 'bg-green-400 animate-pulse' :
                dashboardStats.statusAgente === 'ocupado' ? 'bg-yellow-400' :
                'bg-red-400'
              }`}></div>
              <span className="font-semibold">
                Agente {dashboardStats.statusAgente === 'online' ? 'Online' : 
                        dashboardStats.statusAgente === 'ocupado' ? 'Ocupado' : 'Offline'}
              </span>
            </div>

            {/* Botão de Refresh */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
              Atualizar
            </button>
          </div>
        </div>
      </div>

      {/* Última atualização */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock size={16} />
        <span>Última atualização: {formatarHora(ultimaAtualizacao)}</span>
      </div>

      {/* Grid de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total de Interações"
          value={dashboardStats.totalInteracoes}
          color="blue"
          icon={<MessageSquare size={24} />}
          description="Leads + Contatos"
        />
        
        <StatCard
          label="Interações Hoje"
          value={dashboardStats.interacoesHoje}
          color="green"
          icon={<TrendingUp size={24} />}
          description="Novos hoje"
        />
        
        <StatCard
          label="Leads Capturados"
          value={dashboardStats.leadsCapturados}
          color="purple"
          icon={<Users size={24} />}
          description="Total de leads"
        />
        
        <StatCard
          label="Tickets Abertos"
          value={dashboardStats.ticketsAbertos}
          color="orange"
          icon={<AlertCircle size={24} />}
          description="Aguardando resposta"
        />
      </div>

      {/* Grid de Métricas Secundárias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Tempo de Resposta</h3>
            <Clock className="text-blue-600" size={24} />
          </div>
          <p className="text-4xl font-bold text-blue-600">{dashboardStats.tempoMedioResposta}</p>
          <p className="text-sm text-gray-600 mt-2">Média de resposta</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Taxa de Satisfação</h3>
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <p className="text-4xl font-bold text-green-600">{dashboardStats.taxaSatisfacao}%</p>
          <p className="text-sm text-gray-600 mt-2">Clientes satisfeitos</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Taxa de Conversão</h3>
            <TrendingUp className="text-purple-600" size={24} />
          </div>
          <p className="text-4xl font-bold text-purple-600">
            {leadStats?.taxa_conversao || 0}%
          </p>
          <p className="text-sm text-gray-600 mt-2">Leads convertidos</p>
        </div>
      </div>

      {/* Grid com Leads e Tickets Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Leads Recentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="text-blue-600" size={24} />
              Leads Recentes
            </h2>
            <Badge variant="blue">{recentLeads?.length || 0}</Badge>
          </div>

          <div className="space-y-3">
            {recentLeads && recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users size={20} className="text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-semibold text-gray-900 truncate">{lead.nome}</p>
                      <Badge 
                        variant={
                          lead.status === 'novo' ? 'blue' :
                          lead.status === 'contato' ? 'yellow' :
                          lead.status === 'qualificado' ? 'purple' :
                          lead.status === 'conversao' ? 'green' :
                          'red'
                        }
                        size="sm"
                      >
                        {lead.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Mail size={14} />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} />
                      <span>{lead.telefone}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        {formatarDataRelativa(lead.criado_em)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users size={48} className="mx-auto mb-2 text-gray-300" />
                <p>Nenhum lead recente</p>
              </div>
            )}
          </div>
        </div>

        {/* Tickets Recentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <AlertCircle className="text-orange-600" size={24} />
              Tickets Recentes
            </h2>
            <Badge variant="orange">{recentTickets?.length || 0}</Badge>
          </div>

          <div className="space-y-3">
            {recentTickets && recentTickets.length > 0 ? (
              recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    ticket.priority === 'urgent' ? 'bg-red-100' :
                    ticket.priority === 'high' ? 'bg-orange-100' :
                    'bg-blue-100'
                  }`}>
                    <AlertCircle size={20} className={
                      ticket.priority === 'urgent' ? 'text-red-600' :
                      ticket.priority === 'high' ? 'text-orange-600' :
                      'text-blue-600'
                    } />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-semibold text-gray-900 truncate">{ticket.title}</p>
                      <Badge 
                        variant={
                          ticket.status === 'open' ? 'blue' :
                          ticket.status === 'in_progress' ? 'yellow' :
                          ticket.status === 'resolved' ? 'green' :
                          'gray'
                        }
                        size="sm"
                      >
                        {ticket.status_display}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate mb-1">
                      {ticket.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>#{ticket.id}</span>
                      <span>{formatarDataRelativa(ticket.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle size={48} className="mx-auto mb-2 text-gray-300" />
                <p>Nenhum ticket recente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estatísticas Detalhadas por Status */}
      {leadStats && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="text-blue-600" size={24} />
            Distribuição de Leads por Status
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{leadStats.novo}</p>
              <p className="text-sm text-gray-600 mt-1">Novos</p>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-3xl font-bold text-yellow-600">{leadStats.contato}</p>
              <p className="text-sm text-gray-600 mt-1">Em Contato</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{leadStats.qualificado}</p>
              <p className="text-sm text-gray-600 mt-1">Qualificados</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{leadStats.conversao}</p>
              <p className="text-sm text-gray-600 mt-1">Conversão</p>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">{leadStats.perdido}</p>
              <p className="text-sm text-gray-600 mt-1">Perdidos</p>
            </div>
          </div>
        </div>
      )}

      {/* Ações Rápidas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center gap-3 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md">
            <Users size={20} />
            <span>Novo Lead</span>
          </button>
          
          <button className="flex items-center justify-center gap-3 bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition font-semibold shadow-md">
            <Phone size={20} />
            <span>Novo Contato</span>
          </button>
          
          <button className="flex items-center justify-center gap-3 bg-orange-600 text-white py-4 px-6 rounded-lg hover:bg-orange-700 transition font-semibold shadow-md">
            <AlertCircle size={20} />
            <span>Novo Ticket</span>
          </button>
          
          <button className="flex items-center justify-center gap-3 bg-purple-600 text-white py-4 px-6 rounded-lg hover:bg-purple-700 transition font-semibold shadow-md">
            <FileText size={20} />
            <span>Relatórios</span>
          </button>
        </div>
      </div>
    </PageModel>
  );
}