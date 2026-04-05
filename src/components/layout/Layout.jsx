import Sidebar from "./Sidebar"
import Header from "./Header"
import { motion, AnimatePresence } from "framer-motion"
import { useFinance } from "../../hooks/useFinance"

export default function Layout({ children }) {
  const { isSidebarOpen } = useFinance()

  return (
    <div className="
      flex min-h-screen 
      bg-white text-gray-900 
      dark:bg-[#030303] dark:text-gray-200 
      selection:bg-brand-primary/30 
      overflow-x-hidden 
      transition-colors duration-500
    ">
      
      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="
          absolute top-0 right-0 w-[1000px] h-[1000px]
          bg-brand-primary/10 dark:bg-brand-primary/5
          blur-[120px] rounded-full opacity-30 dark:opacity-50
        " />
        <div className="
          absolute bottom-0 left-0 w-[800px] h-[800px]
          bg-indigo-400/10 dark:bg-indigo-500/5
          blur-[100px] rounded-full opacity-20 dark:opacity-30
        " />
      </div>

      {/* SIDEBAR */}
      <Sidebar />
      
      {/* MAIN */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ease-in-out ${
          isSidebarOpen ? "lg:ml-72" : "lg:ml-24"
        }`}
      >
        <Header />
        
        <main className="flex-1 w-full p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-screen-2xl mx-auto flex flex-col gap-8">
            <AnimatePresence mode="wait">
              <motion.div 
                key="page"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full flex-1"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="
          w-full max-w-screen-2xl mx-auto px-6 py-10 mt-10
          border-t border-gray-200 dark:border-white/10
          flex flex-col sm:flex-row justify-between items-center gap-4
        ">
          <span className="text-xs text-gray-500">
            Finance • Enterprise Kernel v8.1
          </span>

          <div className="flex gap-6 text-xs text-gray-500">
            {["Security", "Protocols", "Privacy", "Status"].map((l) => (
              <span 
                key={l} 
                className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors"
              >
                {l}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}