import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useApp } from "../context/useApp";
export default function SummaryCards() {
  const { transactions } = useApp();

  const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card 
        title="Current Balance" 
        value={balance} 
        icon={<Wallet className="text-indigo-600" />} 
        color="bg-indigo-50" 
      />
      <Card 
        title="Total Income" 
        value={income} 
        icon={<TrendingUp className="text-emerald-600" />} 
        color="bg-emerald-50" 
      />
      <Card 
        title="Total Expenses" 
        value={expense} 
        icon={<TrendingDown className="text-rose-600" />} 
        color="bg-rose-50" 
      />
    </div>
  );
}

function Card({ title, value, icon, color }) {
  return (
    <div className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            ₹{value.toLocaleString('en-IN')}
          </h2>
        </div>
        <div className={`p-3 rounded-2xl ${color} transition-colors`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs font-medium text-slate-400">
        <span className="text-emerald-500 mr-1">↑ 12%</span> vs last month
      </div>
    </div>
  );
}