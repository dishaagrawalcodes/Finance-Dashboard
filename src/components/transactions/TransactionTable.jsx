import { useState, useContext } from "react"
import { FinanceContext } from "../../context/FinanceContext"
import { 
  Search, Edit2, Trash2, Plus, ChevronDown, ChevronUp,
  FileSpreadsheet, SearchSlash, ArrowRightCircle, SlidersHorizontal
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import TransactionForm from "./TransactionForm"

export default function TransactionTable() {
    
    const { 
        transactions, role, deleteTransaction, 
        searchTerm, setSearchTerm, 
        filterType, setFilterType,
        sortBy, setSortBy 
    } = useContext(FinanceContext)
    
    const [editTx, setEditTx] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [sortOrder, setSortOrder] = useState('desc')

    const filtered = transactions
        .filter(t => (filterType === 'all' || t.type === filterType) && 
            (t.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
             t.description.toLowerCase().includes(searchTerm.toLowerCase())))
        .sort((a, b) => {
            const factor = sortOrder === 'asc' ? 1 : -1
            if (sortBy === 'date') return (new Date(a.date) - new Date(b.date)) * factor
            if (sortBy === 'amount') return (a.amount - b.amount) * factor
            return 0
        })

    const handleSort = (key) => {
        if (sortBy === key) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        else { setSortBy(key); setSortOrder('desc') }
    }

    const exportToCSV = () => {
        const headers = ["Date,Category,Type,Amount,Description\n"]
        const rows = filtered.map(t => `${t.date},${t.category},${t.type},${t.amount},${t.description}\n`)
        const blob = new Blob([...headers, ...rows], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `finance_export_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-8 p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none"
        >

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row justify-between gap-6">

                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Transaction Ledger
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {filtered.length} records
                    </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">

                    {/* SEARCH */}
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* FILTER */}
                    <select 
                        value={filterType} 
                        onChange={e => setFilterType(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-400"
                    >
                        <option value="all">All</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>

                    {/* EXPORT */}
                    <button 
                        onClick={exportToCSV}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"
                    >
                        <FileSpreadsheet size={18} />
                    </button>

                    {/* ADD */}
                    {role === 'admin' && (
                        <button 
                            onClick={() => { setEditTx(null); setIsFormOpen(true) }}
                            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90"
                        >
                            Add
                        </button>
                    )}
                </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0a0a0b]">
                <table className="w-full text-sm">
                    <thead className="border-b border-gray-200 dark:border-white/10">
                        <tr>
                            {["date","category","type","amount"].map(col => (
                                <th key={col} onClick={() => handleSort(col)} className="p-4 text-left text-gray-600 dark:text-gray-400 cursor-pointer">
                                    {col}
                                </th>
                            ))}
                            {role === 'admin' && <th className="p-4 text-center">Actions</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map(t => (
                            <tr key={t.id} className="border-b border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5">
                                <td className="p-4">{t.date}</td>
                                <td className="p-4">{t.category}</td>
                                <td className="p-4">
                                    <span className={`
                                        px-2 py-1 rounded text-xs
                                        ${t.type === "income"
                                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                            : "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                                        }
                                    `}>
                                        {t.type}
                                    </span>
                                </td>
                                <td className="p-4 font-semibold">
                                    {t.type === "income" ? "+" : "-"}₹{t.amount}
                                </td>

                                {role === 'admin' && (
                                    <td className="p-4 flex gap-2 justify-center">
                                        <button onClick={() => { setEditTx(t); setIsFormOpen(true) }} className="p-2 bg-gray-100 dark:bg-white/5 rounded">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => deleteTransaction(t.id)} className="p-2 bg-gray-100 dark:bg-white/5 rounded">
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="p-10 text-center text-gray-500">
                        <SearchSlash size={32} />
                        <p>No data found</p>
                    </div>
                )}
            </div>

            {/* MODAL */}
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <div className="relative w-full max-w-xl">
                            <button 
                                onClick={() => setIsFormOpen(false)} 
                                className="absolute -top-10 right-0 text-white"
                            >
                                Close
                            </button>
                            <TransactionForm editData={editTx} onSave={() => setIsFormOpen(false)} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    )
}