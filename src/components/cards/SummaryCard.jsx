import { motion, animate } from "framer-motion"
import { useEffect, useRef } from "react"
import { 
  Wallet, ArrowUpRight, ArrowDownRight, 
  LayoutGrid, CreditCard, PiggyBank 
} from "lucide-react"

const AnimatedNumber = ({ value }) => {
  const ref = useRef(null)
  const prevValue = useRef(0)

  useEffect(() => {
    const controls = animate(prevValue.current, value, {
      duration: 1.2,
      ease: [0.33, 1, 0.68, 1],
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = `₹${Math.floor(latest).toLocaleString("en-IN")}`
        }
      }
    })
    prevValue.current = value
    return () => controls.stop()
  }, [value])

  return <span ref={ref} className="tabular-nums">₹0</span>
}

export default function SummaryCard({ title, value, type, trend }) {

  const styleConfig = {
    balance: { 
      icon: <Wallet size={20} />, 
      color: "bg-emerald-500",
      label: "TOTAL BALANCE"
    },
    income: { 
      icon: <CreditCard size={20} />, 
      color: "bg-rose-500",
      label: "MONTHLY INCOME"
    },
    expense: { 
      icon: <LayoutGrid size={20} />, 
      color: "bg-blue-500",
      label: "MONTHLY EXPENSES"
    },
    savings: { 
      icon: <PiggyBank size={20} />, 
      color: "bg-purple-600",
      label: "NET SAVINGS"
    }
  }

  const currentStyle = styleConfig[type] || styleConfig.balance
  const isPositive = trend >= 0

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="
        p-6 rounded-2xl min-h-[180px] flex flex-col justify-between 
        transition-all duration-300
        
        bg-gray-50 dark:bg-[#111827]/60
        border border-gray-200 dark:border-white/[0.05]
        shadow-sm dark:shadow-none
        
        hover:bg-gray-100 dark:hover:bg-[#111827]/80
        hover:border-gray-300 dark:hover:border-white/[0.1]
      "
    >

      {/* Top Row */}
      <div className="flex justify-between items-start">
        
        {/* Icon */}
        <div className={`${currentStyle.color} p-3 rounded-xl text-white shadow-md`}>
          {currentStyle.icon}
        </div>

        {/* Trend */}
        <div className={`
          flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold
          ${isPositive 
            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            : "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
          }
        `}>
          {isPositive 
            ? <ArrowUpRight size={12} strokeWidth={3} /> 
            : <ArrowDownRight size={12} strokeWidth={3} />
          }
          <span>{isPositive ? "+" : ""}{trend}%</span>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="mt-4">
        <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          <AnimatedNumber value={value} />
        </div>

        <div className="text-[11px] font-semibold mt-1 tracking-wider uppercase 
          text-gray-600 dark:text-gray-400">
          {currentStyle.label || title}
        </div>
      </div>
    </motion.div>
  )
}