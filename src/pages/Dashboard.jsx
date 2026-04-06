import { useMemo } from "react"
import { useFinance } from "../hooks/useFinance"
import SummaryCard from "../components/cards/SummaryCard"
import TransactionTable from "../components/table/TransactionTable"
import Insights from "../components/Insights"
import BalanceChart from "../components/charts/BalanceChart"
import CategoryChart from "../components/charts/CategoryChart"
import { motion } from "framer-motion"
import { Calendar, Activity, Cpu } from "lucide-react"

export default function Dashboard() {
    const { transactions, timeRange, setTimeRange } = useFinance()

    // FILTER TRANSACTIONS
    const filteredTransactions = useMemo(() => {
        const now = new Date("2024-04-01")
        return transactions.filter(t => {
            const tDate = new Date(t.date)
            const diffDays = (now - tDate) / (1000 * 60 * 60 * 24)
            
            if (timeRange === '24H') return diffDays <= 1
            if (timeRange === '7D') return diffDays <= 7
            if (timeRange === '1M') return diffDays <= 30
            if (timeRange === '1Y') return diffDays <= 365
            return true
        })
    }, [transactions, timeRange])

    const totals = useMemo(() => {
        const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
        const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
        return { income, expense, balance: income - expense }
    }, [filteredTransactions])

    const timeOptions = [
        { label: '24H', value: '24H' },
        { label: '7D', value: '7D' },
        { label: '1M', value: '1M' },
        { label: '1Y', value: '1Y' }
    ]

    return (
        <div className="flex flex-col gap-10 w-full max-w-screen-2xl mx-auto pb-24">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 pb-10 border-b border-gray-200 dark:border-white/10">
                
                <div className="flex flex-col gap-6">
                    

                    <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase italic leading-none text-gray-900 dark:text-white">
                       Dashboard
                    </h1>
                </div>

                {/* DATE CARD */}
                <div className="flex items-center gap-6 px-6 py-4 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                    <Calendar size={20} className="text-brand-primary" />
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold uppercase text-gray-600 dark:text-gray-400">
                            Session Date
                        </span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <SummaryCard title="Total Balance" value={totals.balance} type="balance" trend={14.2} />
                <SummaryCard title="Total Income" value={totals.income} type="income" trend={8.9} />
                <SummaryCard title="Total Expenses" value={totals.expense} type="expense" trend={-4.5} />
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LINE CHART */}
                <div className="lg:col-span-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl h-[600px] bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none flex flex-col gap-6"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Balance Overview
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {timeRange} data
                                </p>
                            </div>

                            {/* TIME FILTER */}
                            <div className="flex gap-2 p-1 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                                {timeOptions.map(opt => (
                                    <button 
                                        key={opt.value}
                                        onClick={() => setTimeRange(opt.value)}
                                        className={`px-4 py-2 rounded-md text-xs font-semibold transition ${
                                            timeRange === opt.value
                                                ? "bg-brand-primary text-white"
                                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1">
                            <BalanceChart transactions={filteredTransactions} />
                        </div>
                    </motion.div>
                </div>

                {/* PIE CHART */}
                <div className="lg:col-span-4">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="p-6 rounded-2xl h-[600px] bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none flex flex-col gap-6"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Category Breakdown
                        </h2>

                        <div className="flex-1">
                            <CategoryChart transactions={filteredTransactions} />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* TABLE */}
            <TransactionTable />

            {/* INSIGHTS */}
            <Insights transactions={filteredTransactions} />

            {/* DECORATION */}
            <div className="fixed bottom-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                <Cpu size={500} strokeWidth={1} />
            </div>
        </div>
    )
}