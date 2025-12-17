interface StatCardProps {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

export default function StatCard({ label, value, color, icon }: StatCardProps) {
  return (
    <div className={`${color} p-4 rounded-lg shadow-md`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold opacity-80">{label}</p>
        {icon}
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}