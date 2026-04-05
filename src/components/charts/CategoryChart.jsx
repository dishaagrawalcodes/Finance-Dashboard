import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from "recharts"
import { useMemo, useState } from "react"
import { PieChart as PieIcon } from "lucide-react"

const COLORS = ['#4f46e5', '#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#f59e0b']

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />

      {/* Label */}
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        className="text-xs font-semibold fill-gray-600 dark:fill-gray-400"
      >
        {payload.name}
      </text>

      {/* Percentage */}
      <text
        x={cx}
        y={cy + 20}
        textAnchor="middle"
        className="text-xl font-bold fill-gray-900 dark:fill-white"
      >
        {(percent * 100).toFixed(0)}%
      </text>
    </g>
  )
}

export default function CategoryChart({ transactions }) {
  const [activeIndex, setActiveIndex] = useState(0)

  const data = useMemo(() => {
    if (!transactions || transactions.length === 0) return []

    const expenses = transactions.filter(t => t.type === "expense")
    const totals = {}

    expenses.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount
    })

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [transactions])

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 opacity-50">
        <div className="
          p-6 rounded-full 
          bg-gray-100 dark:bg-white/5
          border border-gray-200 dark:border-white/10
        ">
          <PieIcon size={40} className="text-gray-500" />
        </div>
        <p className="text-sm text-gray-500">No category data</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">

      {/* CHART */}
      <ResponsiveContainer width="100%" height="70%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            dataKey="value"
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* LEGEND */}
      <div className="
        flex flex-wrap justify-center gap-6 mt-6 w-full
        border-t border-gray-200 dark:border-white/10
        pt-4
      ">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />

            <span className="text-xs text-gray-600 dark:text-gray-400">
              {entry.name}
            </span>

            <span className="text-xs font-semibold text-gray-800 dark:text-white">
              ₹{entry.value.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}