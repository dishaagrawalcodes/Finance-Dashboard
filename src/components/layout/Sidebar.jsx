import { useState } from "react"
import { useFinance } from "../../hooks/useFinance"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, ArrowLeftRight, LineChart, Settings,
  ChevronLeft, ChevronRight, Target, Layers, X, CreditCard, Radio
} from "lucide-react"

export default function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen: setIsCollapsed, currentView, setCurrentView } = useFinance()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Registry", icon: <ArrowLeftRight size={20} /> },
    { name: "Insights", icon: <LineChart size={20} /> },
    { name: "Equity", icon: <CreditCard size={20} /> },
    { name: "Stream", icon: <Radio size={20} /> },
    { name: "Settings", icon: <Settings size={20} />, bottom: true }
  ]

  const handleNav = (item) => {
    setCurrentView(item.name)
    setIsMobileOpen(false)
  }

  return (
    <>
      {/* MOBILE BUTTON */}
      <div 
        className="lg:hidden fixed bottom-6 right-6 z-[1000] p-5 bg-brand-primary text-white rounded-2xl shadow-lg cursor-pointer"
        onClick={() => setIsMobileOpen(true)}
      >
        <Layers size={24} />
      </div>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed inset-0 z-[2000] p-8 flex flex-col gap-10
            bg-white dark:bg-dark-950"
          >
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-xl
              bg-gray-100 dark:bg-white/5
              border border-gray-200 dark:border-white/10"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mt-10">
              <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center text-white">
                <Target size={22} />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                FinanceOS
              </span>
            </div>

            <nav className="flex flex-col gap-2">
              {menuItems.map(item => (
                <button
                  key={item.name}
                  onClick={() => handleNav(item)}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all
                  ${currentView === item.name
                    ? "bg-brand-primary/10 text-brand-primary"
                    : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
                >
                  {item.icon}
                  <span className="font-semibold">{item.name}</span>
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <motion.aside
        layout
        className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0
        bg-white dark:bg-[#070708]
        border-r border-gray-200 dark:border-white/10
        transition-all duration-300
        ${isSidebarOpen ? "w-72" : "w-20"}`}
      >
        {/* LOGO */}
        <div className="p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white">
            <Target size={20} />
          </div>
          {isSidebarOpen && (
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              FinanceOS
            </span>
          )}
        </div>

        {/* MENU */}
        <div className="flex-1 px-3 flex flex-col gap-2">
          {menuItems.filter(i => !i.bottom).map(item => (
            <button
              key={item.name}
              onClick={() => handleNav(item)}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all
              ${currentView === item.name
                ? "bg-brand-primary/10 text-brand-primary"
                : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
            >
              {item.icon}
              {isSidebarOpen && <span>{item.name}</span>}
            </button>
          ))}
        </div>

        {/* BOTTOM */}
        <div className="p-3 border-t border-gray-200 dark:border-white/10">
          {menuItems.filter(i => i.bottom).map(item => (
            <button
              key={item.name}
              onClick={() => handleNav(item)}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all w-full
              ${currentView === item.name
                ? "bg-brand-primary/10 text-brand-primary"
                : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
            >
              {item.icon}
              {isSidebarOpen && <span>{item.name}</span>}
            </button>
          ))}

          <button
            onClick={() => setIsCollapsed(!isSidebarOpen)}
            className="mt-4 w-full p-3 rounded-lg
            bg-gray-100 dark:bg-white/5
            border border-gray-200 dark:border-white/10
            flex items-center justify-center"
          >
            {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </motion.aside>
    </>
  )
}