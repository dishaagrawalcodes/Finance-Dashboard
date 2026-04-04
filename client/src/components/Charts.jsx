import { useApp } from "../context/useApp";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"];

export default function Charts() {
  const { transactions } = useApp();

  const trendData = transactions.map((t) => ({
    date: t.date,
    amount: t.amount,
  }));

  const categoryMap = {};
  transactions.forEach((t) => {
    if (t.type === "expense") {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    }
  });

  const pieData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 📈 Line Chart Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800 text-lg">Cash Flow Trend</h3>
          <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-semibold">LAST 30 DAYS</span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#6366f1" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🥧 Pie Chart Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 text-lg mb-6">Expense Allocation</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={70} // Creates the 'Donut' look
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}