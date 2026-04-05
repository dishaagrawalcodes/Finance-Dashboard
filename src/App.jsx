import { useFinance } from "./hooks/useFinance"
import Layout from "./components/layout/Layout"
import Dashboard from "./pages/Dashboard"
import TransactionTable from "./components/table/TransactionTable"
import Insights from "./components/Insights"
import { motion, AnimatePresence } from "framer-motion"
import { Radio, CreditCard, ShieldCheck, User, Moon, Sun, Bell, Lock, Globe } from "lucide-react"
import { Zap } from "lucide-react";
import { useState, useEffect } from "react"

/* ---------------- SETTINGS ---------------- */
const SettingsView = () => {
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  )

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pt-10">

      <div className="border-b border-gray-200 dark:border-white/10 pb-6">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Settings
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* THEME */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">Theme</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-14 h-7 rounded-full flex items-center px-1 transition ${
                darkMode ? "bg-brand-primary justify-end" : "bg-gray-300"
              }`}
            >
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                {darkMode ? <Moon size={12}/> : <Sun size={12}/>}
              </div>
            </button>
          </div>
        </div>

        {/* SECURITY */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">Security</span>
          <ShieldCheck className="text-brand-primary"/>
        </div>

      </div>

      {/* INFO */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 grid sm:grid-cols-2 gap-4">
        {[
          { label: 'Name', value: 'Disha Agrawal', icon: <User size={14}/> },
          { label: 'Email', value: 'disha@finance.io', icon: <Globe size={14}/> },
          { label: 'Role', value: 'Admin', icon: <Lock size={14}/> },
          { label: 'Notifications', value: 'Enabled', icon: <Bell size={14}/> }
        ].map(item => (
          <div key={item.label} className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{item.label}</span>
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
              {item.icon}
              {item.value}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

/* ---------------- EQUITY ---------------- */
const EquityView = () => (
  <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pt-10">

    <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
      Equity
    </h2>

    <div className="grid md:grid-cols-2 gap-6">

      <div className="p-8 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 flex flex-col items-center">
        <CreditCard size={40} className="text-brand-primary mb-4"/>
        <span className="text-lg font-medium text-gray-900 dark:text-white">Assets</span>
      </div>

      <div className="p-8 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 flex flex-col items-center">
        <Zap size={40} className="text-yellow-500 mb-4"/>
        <span className="text-lg font-medium text-gray-900 dark:text-white">Growth</span>
      </div>

    </div>

  </div>
)

/* ---------------- STREAM ---------------- */
const StreamView = () => {
  const { transactions } = useFinance()

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pt-10">

      <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
        Activity
      </h2>

      {transactions.slice(0, 8).map(tx => (
        <div key={tx.id} className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 flex justify-between items-center">
          
          <div className="flex gap-4 items-center">
            <Radio className={tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'} />
            <div>
              <p className="text-gray-900 dark:text-white">{tx.category}</p>
              <p className="text-xs text-gray-500">{tx.date}</p>
            </div>
          </div>

          <span className={tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}>
            {tx.type === 'income' ? '+' : '-'}₹{tx.amount}
          </span>

        </div>
      ))}

    </div>
  )
}

/* ---------------- MAIN APP ---------------- */
export default function App() {
  const { currentView } = useFinance()

  const renderView = () => {
    switch (currentView) {
      case "Dashboard": return <Dashboard />
      case "Registry": return <TransactionTable />
      case "Insights": return <Insights />
      case "Settings": return <SettingsView />
      case "Equity": return <EquityView />
      case "Stream": return <StreamView />
      default: return <Dashboard />
    }
  }

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  )
}