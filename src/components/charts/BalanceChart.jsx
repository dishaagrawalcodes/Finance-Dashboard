import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { motion, useInView } from "framer-motion"
import { useRef, useMemo } from "react"
import { Activity } from "lucide-react"

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value

    return (
      <div className="
        p-5 rounded-2xl min-w-[200px]
        bg-white dark:bg-[#0a0a0b]/90
        border border-gray-200 dark:border-white/10
        shadow-lg dark:shadow-2xl
        backdrop-blur-0 dark:backdrop-blur-xl
      ">
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
          {label}
        </p>
        <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
          ₹{val.toLocaleString("en-IN")}
        </p>
      </div>
    )
  }
  return null
}

export default function BalanceChart({ transactions }) {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.1 })

  const data = useMemo(() => {
    if (!transactions || transactions.length === 0) return []

    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    )

    let currentBalance = 0
    const result = sorted.map((t) => {
      currentBalance += t.type === "income" ? t.amount : -t.amount
      return { date: t.date, balance: currentBalance }
    })

    const grouped = result.reduce((acc, curr) => {
      acc[curr.date] = curr.balance
      return acc
    }, {})

    return Object.entries(grouped).map(([date, balance]) => ({
      date,
      balance
    }))
  }, [transactions])

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 opacity-50">
        <div className="
          p-6 rounded-full 
          bg-gray-100 dark:bg-white/5
          border border-gray-200 dark:border-white/10
        ">
          <Activity size={40} className="text-gray-500" />
        </div>
        <p className="text-xs text-gray-500">
          No data available
        </p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
          
          {/* Gradient */}
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Grid */}
          <CartesianGrid 
            strokeDasharray="4 4"
            stroke="rgba(0,0,0,0.05)"
            className="dark:stroke-white/10"
          />

          {/* X Axis */}
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 11 }}
          />

          {/* Y Axis */}
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 11 }}
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          />

          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} />

          {/* Area */}
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#4f46e5"
            strokeWidth={3}
            fill="url(#colorBalance)"
            animationDuration={isInView ? 1200 : 0}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}