// src/components/Information/index.tsx - ✅ CORRIGIDO
import { useEffect, useState, type ChangeEvent } from 'react';
import { 
  useGetSchoolsQuery, 
  useUpdateSchoolMutation,
  extractErrorMessage
} from '../../services';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';

interface FormData {
  nome_escola: string;
  cnpj: string;
  telefone: string;
  email: string;
  website: string;
  cep: string;
  endereco: string;
  cidade: string;
  estado: string;
  complemento: string;
  sobre: string;
  niveis_ensino: {
    infantil: boolean;
    fundamental: boolean;
    medio: boolean;
  };
}

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export default function Information() {
  // ✅ RTK Query Hooks
  const { data: schoolsData, isLoading, error, refetch } = useGetSchoolsQuery({});
  const [updateSchool, { isLoading: isUpdating }] = useUpdateSchoolMutation();

  // Estados
  const [abaSelecionada, setAbaSelecionada] = useState<string>('dados');
  const [escolaAtualId, setEscolaAtualId] = useState<number | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string>('');
  const [mensagemErro, setMensagemErro] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    nome_escola: '',
    cnpj: '',
    telefone: '',
    email: '',
    website: '',
    cep: '',
    endereco: '',
    cidade: '',
    estado: '',
    complemento: '',
    sobre: '',
    niveis_ensino: {
      infantil: false,
      fundamental: false,
      medio: false,
    }
  });

  // ✅ Carregar dados quando disponível
  useEffect(() => {
    if (schoolsData?.results && schoolsData.results.length > 0) {
      const escola = schoolsData.results[0];
      setEscolaAtualId(escola.id);
      
      setFormData({
        nome_escola: escola.nome_escola || '',
        cnpj: escola.cnpj || '',
        telefone: escola.telefone || '',
        email: escola.email || '',
        website: escola.website || '',
        cep: escola.cep || '',
        endereco: escola.endereco || '',
        cidade: escola.cidade || '',
        estado: escola.estado || '',
        complemento: escola.complemento || '',
        sobre: escola.sobre || '',
        niveis_ensino: {
          infantil: escola.niveis_ensino?.infantil || false,
          fundamental: escola.niveis_ensino?.fundamental || false,
          medio: escola.niveis_ensino?.medio || false,
        }
      });

      console.log('✅ Dados da escola carregados:', escola);
    }
  }, [schoolsData]);

  // Limpar mensagens após 5s
  useEffect(() => {
    if (mensagemSucesso) {
      const timer = setTimeout(() => setMensagemSucesso(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagemSucesso]);

  useEffect(() => {
    if (mensagemErro) {
      const timer = setTimeout(() => setMensagemErro(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagemErro]);

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: keyof FormData['niveis_ensino']): void => {
    setFormData(prev => ({
      ...prev,
      niveis_ensino: {
        ...prev.niveis_ensino,
        [field]: !prev.niveis_ensino[field]
      }
    }));
  };

  // ✅ Salvar usando RTK Query
  const handleSalvarAlteracoes = async (): Promise<void> => {
    if (!escolaAtualId) {
      setMensagemErro('Nenhuma escola selecionada');
      return;
    }

    try {
      // ✅ Campos que podem ser editados por gestores
      const dataToUpdate = {
        telefone: formData.telefone,
        email: formData.email,
        website: formData.website,
        cep: formData.cep,
        endereco: formData.endereco,
        cidade: formData.cidade,
        estado: formData.estado,
        complemento: formData.complemento,
        sobre: formData.sobre,
        niveis_ensino: formData.niveis_ensino,
      };

      await updateSchool({
        id: escolaAtualId,
        data: dataToUpdate
      }).unwrap();

      setMensagemSucesso('✅ Dados salvos com sucesso!');
      setMensagemErro('');
      refetch(); // Atualizar dados
      
    } catch (err: any) {
      const errorMsg = extractErrorMessage(err);
      setMensagemErro(`❌ Erro ao salvar: ${errorMsg}`);
      setMensagemSucesso('');
    }
  };

  // ✅ LOADING
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-semibold">Carregando dados da escola...</p>
        </div>
      </div>
    );
  }

  // ✅ ERROR
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={20} />
            <p className="font-bold">❌ Erro ao carregar dados</p>
          </div>
          <p className="text-sm mt-2">{extractErrorMessage(error)}</p>
          <button 
            onClick={() => refetch()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // ✅ SEM ESCOLA
  if (!schoolsData?.results || schoolsData.results.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg max-w-md text-center">
          <p className="font-bold">⚠️ Nenhuma escola cadastrada</p>
          <p className="text-sm mt-2">Entre em contato com o administrador.</p>
        </div>
      </div>
    );
  }

  const escola = schoolsData.results[0];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Mensagens */}
          {mensagemSucesso && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle size={20} />
              {mensagemSucesso}
            </div>
          )}
          
          {mensagemErro && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              {mensagemErro}
            </div>
          )}

          {/* Abas */}
          <div className="flex gap-2 bg-white p-2 rounded-lg shadow-md flex-wrap">
            <button
              onClick={() => setAbaSelecionada('dados')}
              className={`px-4 py-2 rounded-lg transition font-semibold ${
                abaSelecionada === 'dados'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Dados Básicos
            </button>
          </div>

          {/* DADOS BÁSICOS */}
          {abaSelecionada === 'dados' && (
            <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Dados Básicos</h2>

              {/* Identificação - Campos Protegidos */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Identificação 
                  <span className="text-sm text-gray-500 ml-2">(Somente leitura)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField 
                    label="Nome da Escola" 
                    value={formData.nome_escola}
                    onChange={(e) => handleInputChange('nome_escola', e.target.value)}
                    readOnly
                    disabled
                  />
                  <InputField 
                    label="CNPJ" 
                    value={formData.cnpj}
                    onChange={(e) => handleInputChange('cnpj', e.target.value)}
                    readOnly
                    disabled
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  ℹ️ Apenas administradores podem editar nome e CNPJ
                </p>
              </div>

              {/* Contato - Editável */}
              <div className="pt-6 border-t">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Contato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField 
                    label="Telefone" 
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    placeholder="(11) 98765-4321"
                  />
                  <InputField 
                    label="Email" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contato@escola.com"
                  />
                  <div className="md:col-span-2">
                    <InputField 
                      label="Website" 
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://www.escola.com"
                    />
                  </div>
                </div>
              </div>

              {/* Localização */}
              <div className="pt-6 border-t">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Localização</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField 
                    label="CEP" 
                    value={formData.cep}
                    onChange={(e) => handleInputChange('cep', e.target.value)}
                    placeholder="12345-678"
                  />
                  <InputField 
                    label="Endereço" 
                    value={formData.endereco}
                    onChange={(e) => handleInputChange('endereco', e.target.value)}
                    placeholder="Rua das Flores, 123"
                  />
                  <InputField 
                    label="Cidade" 
                    value={formData.cidade}
                    onChange={(e) => handleInputChange('cidade', e.target.value)}
                    placeholder="São Paulo"
                  />
                  <InputField 
                    label="Estado" 
                    value={formData.estado}
                    onChange={(e) => handleInputChange('estado', e.target.value)}
                    placeholder="SP"
                  />
                  <div className="md:col-span-2">
                    <InputField 
                      label="Complemento" 
                      value={formData.complemento}
                      onChange={(e) => handleInputChange('complemento', e.target.value)}
                      placeholder="Sala 10"
                    />
                  </div>
                </div>
              </div>

              {/* Sobre */}
              <div className="pt-6 border-t">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Sobre a Escola</h3>
                <label className="block text-gray-700 font-semibold mb-2">
                  História, Missão e Valores
                </label>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  rows={4}
                  value={formData.sobre}
                  onChange={(e) => handleInputChange('sobre', e.target.value)}
                  placeholder="Conte a história da sua escola..."
                ></textarea>
              </div>

              {/* Níveis de Ensino */}
              <div className="pt-6 border-t">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Níveis de Ensino</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={formData.niveis_ensino.infantil}
                      onChange={() => handleCheckboxChange('infantil')}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-gray-700 font-medium">Educação Infantil</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={formData.niveis_ensino.fundamental}
                      onChange={() => handleCheckboxChange('fundamental')}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-gray-700 font-medium">Ensino Fundamental</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={formData.niveis_ensino.medio}
                      onChange={() => handleCheckboxChange('medio')}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-gray-700 font-medium">Ensino Médio</span>
                  </label>
                </div>
              </div>

              {/* Botão Salvar */}
              <button 
                onClick={handleSalvarAlteracoes}
                disabled={isUpdating}
                className="mt-6 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function InputField({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  disabled = false,
  readOnly = false
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 ${
          disabled || readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
      />
    </div>
  );
}