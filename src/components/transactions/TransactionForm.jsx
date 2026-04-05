import { useState, useContext, useEffect } from "react"
import { FinanceContext } from "../../context/FinanceContext"
import { ShieldCheck } from "lucide-react"

export default function TransactionForm({ editData, onSave }) {
  const { addTransaction, updateTransaction } = useContext(FinanceContext)

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "",
    type: "expense",
    amount: "",
    description: ""
  })

  useEffect(() => {
    if (editData) setForm(editData)
  }, [editData])

  const handleSubmit = (e) => {
    e.preventDefault()
    const tx = { ...form, amount: parseFloat(form.amount) }
    editData ? updateTransaction(tx) : addTransaction(tx)
    onSave()
  }

  const categories = [
    "Salary","Food","Transport","Shopping","Rent",
    "Entertainment","Utilities","Freelance","Investment","Health","Gift"
  ]

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-xl mx-auto p-8 rounded-2xl
        bg-white dark:bg-[#111827]
        border border-gray-200 dark:border-white/10
        shadow-sm dark:shadow-none
        flex flex-col gap-6
      "
    >

      {/* TITLE */}
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        {editData ? "Edit Transaction" : "Add Transaction"}
      </h2>

      {/* DATE */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600 dark:text-gray-400">Date</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="
            p-3 rounded-lg
            bg-gray-50 dark:bg-white/5
            border border-gray-200 dark:border-white/10
            text-gray-900 dark:text-white
          "
        />
      </div>

      {/* TYPE */}
      <div className="flex gap-2">
        {["income", "expense"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setForm({ ...form, type: t })}
            className={`
              flex-1 p-3 rounded-lg border transition
              ${
                form.type === t
                  ? "bg-brand-primary/10 text-brand-primary border-brand-primary/30"
                  : "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10"
              }
            `}
          >
            {t}
          </button>
        ))}
      </div>

      {/* CATEGORY */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600 dark:text-gray-400">Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="
            p-3 rounded-lg
            bg-gray-50 dark:bg-white/5
            border border-gray-200 dark:border-white/10
            text-gray-900 dark:text-white
          "
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* AMOUNT */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600 dark:text-gray-400">Amount</label>
        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="
            p-3 rounded-lg
            bg-gray-50 dark:bg-white/5
            border border-gray-200 dark:border-white/10
            text-gray-900 dark:text-white
          "
        />
      </div>

      {/* DESCRIPTION */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600 dark:text-gray-400">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="
            p-3 rounded-lg
            bg-gray-50 dark:bg-white/5
            border border-gray-200 dark:border-white/10
            text-gray-900 dark:text-white
          "
        />
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        className="
          mt-4 p-3 rounded-lg
          bg-brand-primary text-white
          hover:bg-brand-primary/90
          flex items-center justify-center gap-2
        "
      >
        <ShieldCheck size={18} />
        {editData ? "Update" : "Add"}
      </button>
    </form>
  )
}