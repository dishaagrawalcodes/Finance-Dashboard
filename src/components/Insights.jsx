import { useFinance } from "../hooks/useFinance"
import { PieChart, BarChart3, LineChart, Cpu, ShieldAlert, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useMemo } from "react"

export default function Insights({ transactions: externalTransactions }) {
    const { transactions: contextTransactions } = useFinance()
    const transactions = externalTransactions || contextTransactions
    
    const stats = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense')
        const income = transactions.filter(t => t.type === 'income')
        
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
        const totalIncome = income.reduce((sum, t) => sum + t.amount, 0)
        
        const categoryTotals = {}
        expenses.forEach(e => {
            categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount
        })
        
        const highestCategory = Object.entries(categoryTotals).sort((a,b) => b[1] - a[1])[0]
        const avgTransaction = transactions.length > 0 
            ? (transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length).toFixed(0) 
            : 0
        const savingsRate = totalIncome > 0 
            ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) 
            : 0

        return {
            totalIncome,
            totalExpenses,
            highestCategory,
            avgTransaction,
            savingsRate,
            isDeficit: totalExpenses > totalIncome
        }
    }, [transactions])

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="
                flex flex-col gap-8 p-6 rounded-2xl
                bg-white dark:bg-[#111827]
                border border-gray-200 dark:border-white/10
                shadow-sm dark:shadow-none
            "
        >
            {/* HEADER */}
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-white/10 pb-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Insights
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Financial summary
                    </p>
                </div>
                <Cpu size={20} className="text-brand-primary" />
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                {/* HIGHEST CATEGORY */}
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex gap-4">
                    <PieChart className="text-rose-500" />
                    <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Top Category</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {stats.highestCategory ? stats.highestCategory[0] : "N/A"}
                        </p>
                    </div>
                </div>

                {/* AVG */}
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex gap-4">
                    <BarChart3 className="text-blue-500" />
                    <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Avg Transaction</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            ₹{stats.avgTransaction}
                        </p>
                    </div>
                </div>

                {/* SAVINGS */}
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex gap-4">
                    <LineChart className="text-indigo-500" />
                    <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Savings Rate</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {stats.savingsRate}%
                        </p>
                    </div>
                </div>

                {/* STATUS */}
                <div className={`p-4 rounded-xl border flex gap-4 ${
                    stats.isDeficit
                        ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                        : "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                }`}>
                    {stats.isDeficit ? <ShieldAlert /> : <Zap />}
                    <div>
                        <p className="text-xs">Status</p>
                        <p className="font-semibold">
                            {stats.isDeficit ? "Deficit" : "Healthy"}
                        </p>
                    </div>
                </div>

            </div>
        </motion.div>
    )
}