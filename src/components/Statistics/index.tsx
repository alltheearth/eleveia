import type { StatCardProps } from "./StatCard";
import StatCard from "./StatCard";

interface StatisticsProps {
  statsData: StatCardProps [];
}

const Statistics = ({statsData}: StatisticsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {statsData.map((stat: StatCardProps, index: number) => (
            <StatCard 
                key={index}
                label={stat.label}
                value={stat.value}
                color={stat.color}
                icon={stat.icon}
                description={stat.description}
            />
        ))}
    </div>
  )
}
export default Statistics;