import { TicketIcon, User } from "lucide-react";
import StatCard from "../layout/StatCard";
import Filter from "../layout/Filter";
import Table from "../layout/Table";

const Tickets = () => {
    return (
        <main>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard color="yellow" icon={<TicketIcon />} label="Abertos" value={1} key={0}/>
            <StatCard color="yellow" icon={<TicketIcon />} label="Pendentes" value={1} key={0}/>
            <StatCard color="yellow" icon={<TicketIcon />} label="Fechados" value={1} key={0}/>
            <StatCard color="yellow" icon={<TicketIcon />} label="Atrasados" value={1} key={0}/>
       </div>
       <Filter />
       <Table columns={[{name: "id", type: "text"}]} query="texto" filterStatus="" icon={<User />} filteredData={[{id: 1, nome: "Lucas", sobrenome: "Pires"}]}/>
        </main>
    )
}

export default Tickets;
