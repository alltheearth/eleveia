import { Mail, Phone, Edit2, Trash2, UsersIcon } from "lucide-react";

type Columns = {
    name: string;
    type: string
}

type Data = {
   
}

interface TableProps {
    columns: Columns [];
    filteredData: Data [];
    query: string;
    filterStatus: string;
    icon: React.ReactNode;
}

  // Formatar data
  const formatarData = (data: string): string => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };


const formatarDataHora = (data: string): string => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};


export default function Table ({columns, filteredData, query, filterStatus, icon}: TableProps) {

    return (
                    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100 border-b-2 border-gray-300">
                            <th className="p-3 text-left font-bold text-gray-900">#</th>
                            {columns.map(item => <th className="p-3 text-left font-bold text-gray-900">{item.name}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredData.length > 0 ? (
                            filteredData.map((data: Data) => (
                            //   <tr key={data.id} className="border-b hover:bg-gray-50 transition">
                            //     <td className="p-3 text-gray-900 font-semibold">{data.id}</td>
                            //     <td className="p-3 text-gray-900 font-medium">{data.nome}</td>
                            //     <td className="p-3 text-gray-700">
                            //       <div className="flex items-center gap-2">
                            //         <Mail size={16} className="text-gray-400" />
                            //         {data.email || '-'}
                            //       </div>
                            //     </td>
                            //     <td className="p-3 text-gray-700">
                            //       <div className="flex items-center gap-2">
                            //         <Phone size={16} className="text-gray-400" />
                            //         {data.telefone}
                            //       </div>
                            //     </td>
                            //     <td className="p-3">
                            //       <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            //         data.status === 'ativo' 
                            //           ? 'bg-green-100 text-green-700' 
                            //           : 'bg-gray-100 text-gray-700'
                            //       }`}>
                            //         {data.status === 'ativo' ? '✅ Ativo' : '⛔ Inativo'}
                            //       </span>
                            //     </td>
                            //     <td className="p-3">
                            //       <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                            //         {data.origem}
                            //       </span>
                            //     </td>
                            //     <td className="p-3 text-gray-700 text-sm">
                            //       {data.ultima_interacao ? formatarDataHora(data.ultima_interacao) : '-'}
                            //     </td>
                            //     <td className="p-3 text-gray-700 text-sm">{formatarData(data.criado_em)}</td>
                            //     <td className="p-3 flex gap-2">
                            //       <button
                            //         // onClick={() => iniciarEdicao(contato)}
                            //         className="text-blue-600 hover:text-blue-800 hover:underline font-semibold text-sm"
                            //       >
                            //         <Edit2 size={18} />
                            //       </button>
                            //       <button
                            //         // onClick={() => confirmarDelecao(contato.id)}
                            //         // disabled={isDeleting}
                            //         className="text-red-600 hover:text-red-800 hover:underline disabled:opacity-50"
                            //       >
                            //         <Trash2 size={18} />
                            //       </button>
                            //     </td>
                            //   </tr>
                             <tr key={data.id} className="border-b hover:bg-gray-50 transition">
                                {Object.keys(data).map((key: string)=> {

                                    switch(key){
                                        case 'primary-key':
                                            return <td className="p-3 text-gray-900 font-semibold">{data[`${key}`]}</td>
                                        case 'text':
                                            return <td className="p-3 text-gray-900 font-medium">{data[`${key}`]}</td>
                                        case 'phone-number':
                                          return <td className="p-3 text-gray-700">
                                   <div className="flex items-center gap-2">
                                     <Phone size={16} className="text-gray-400" />
                                     {data[`${key}`]}
                                   </div>
                                </td>
                                        case: 'status':
                                        retutn  <td className="p-3">
                                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    data.status === 'ativo' 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {data.status === 'ativo' ? '✅ Ativo' : '⛔ Inativo'}
                                  </span>
                                </td>

                                    }
                                } )}
                             </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={9} className="p-8 text-center text-gray-500">
                                <UsersIcon className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                                <p className="font-semibold">Nenhum contato encontrado</p>
                                <p className="text-sm">
                                  {query  || filterStatus !== 'todos'
                                    ? 'Tente ajustar os filtros de busca'
                                    : 'Adicione o primeiro contato'}
                                </p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
    )
}