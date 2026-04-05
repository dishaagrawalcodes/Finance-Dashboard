import { useState, useMemo } from "react"
import { useFinance } from "../../hooks/useFinance"
import { 
  Edit2, Trash2, ChevronDown, ChevronLeft, ChevronRight,
  FileSpreadsheet, SearchSlash, ArrowRightCircle, Filter,
  ArrowDownIcon, ArrowUpIcon, History
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import TransactionForm from "../forms/TransactionForm"

export default function TransactionTable() {

  const { 
    transactions, role, deleteTransaction, 
    searchTerm, setSearchTerm, 
    filterType, setFilterType,
    sortBy, setSortBy,
    sortOrder, setSortOrder
  } = useFinance()
  
  const [editTx, setEditTx] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const filtered = useMemo(() => {
    return transactions
      .filter(t =>
        (filterType === 'all' || t.type === filterType) &&
        (t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
         t.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        const factor = sortOrder === 'asc' ? 1 : -1
        if (sortBy === 'date') return (new Date(a.date) - new Date(b.date)) * factor
        if (sortBy === 'amount') return (a.amount - b.amount) * factor
        return 0
      })
  }, [transactions, searchTerm, filterType, sortBy, sortOrder])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filtered.slice(start, start + itemsPerPage)
  }, [filtered, currentPage])

  const handleSort = (key) => {
    if (sortBy === key) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    else { setSortBy(key); setSortOrder('desc') }
    setCurrentPage(1)
  }

  const exportToCSV = () => {
    if (!filtered.length) return
    const headers = ["Date,Category,Type,Amount,Description\n"]
    const rows = filtered.map(t =>
      `${t.date},${t.category},${t.type},${t.amount},${t.description}\n`
    )
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ledger_export_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none flex flex-col gap-6"
    >

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Transaction Ledger
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filtered.length} records
          </p>
        </div>

        <div className="flex gap-2">

          {/* FILTER */}
          <select 
            value={filterType}
            onChange={e => { setFilterType(e.target.value); setCurrentPage(1) }}
            className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-400"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* EXPORT */}
          <button onClick={exportToCSV} className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
            <FileSpreadsheet size={16} />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0a0a0b]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10">
              {["date","category","type","amount"].map(col => (
                <th key={col} onClick={() => handleSort(col)} className="p-3 text-left cursor-pointer text-gray-600 dark:text-gray-400">
                  {col}
                </th>
              ))}
              {role === 'admin' && <th className="p-3 text-center">Actions</th>}
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {paginatedItems.map((t) => (
                <motion.tr key={t.id} layout className="border-b border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5">
                  
                  <td className="p-3">{t.date}</td>
                  <td className="p-3">{t.category}</td>

                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      t.type === "income"
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                    }`}>
                      {t.type}
                    </span>
                  </td>

                  <td className="p-3 font-semibold">
                    {t.type === "income" ? "+" : "-"}₹{t.amount}
                  </td>

                  {role === 'admin' && (
                    <td className="p-3 flex justify-center gap-2">
                      <button onClick={() => { setEditTx(t); setIsFormOpen(true) }} className="p-2 bg-gray-100 dark:bg-white/5 rounded">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => deleteTransaction(t.id)} className="p-2 bg-gray-100 dark:bg-white/5 rounded">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}

                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            <SearchSlash size={32} />
            <p>No transactions found</p>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p-1))}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="w-full max-w-xl">
              <TransactionForm editData={editTx} onSave={() => setIsFormOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}