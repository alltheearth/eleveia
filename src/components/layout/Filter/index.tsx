import { Plus, Search } from "lucide-react"
import type { ChangeEvent } from "react"

const Filter = () => {
    return (
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 w-full relative">
                          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                          <input
                            type="text"
                            placeholder="Buscar por nome, email ou telefone..."
                            // value={busca}
                            // onChange={(e: ChangeEvent<HTMLInputElement>) => setBusca(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                          />
                        </div>
        
                        <select
                        //   value={filtroStatus}
                        //   onChange={(e: ChangeEvent<HTMLSelectElement>) => setFiltroStatus(e.target.value as any)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                        >
                          <option value="todos">Todos os Status</option>
                          <option value="ativo">Ativo</option>
                          <option value="inativo">Inativo</option>
                        </select>
        
                        <button
                        //   onClick={() => setMostrarFormulario(!mostrarFormulario)}
                          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                          <Plus size={20} />
                          Novo Contato
                        </button>
                      </div>
                    </div>
    )
}

export default Filter 