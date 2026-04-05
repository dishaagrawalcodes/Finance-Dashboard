import { motion } from "framer-motion"
import { Shield, Eye, Terminal, Star } from "lucide-react"

export default function UserDropdown({ role, setRole, setIsOpen }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 12 }}
      className="
        absolute right-0 mt-3 w-72 
        bg-white dark:bg-[#0a0a0b]/90
        border border-gray-200 dark:border-white/10
        p-3 rounded-2xl 
        shadow-lg dark:shadow-2xl 
        overflow-hidden z-[9999] 
        backdrop-blur-0 dark:backdrop-blur-xl
        transition-all duration-300
      "
    >

      {/* HEADER */}
      <div className="
        px-4 py-4 mb-3 
        border-b border-gray-200 dark:border-white/10 
        flex items-center justify-between
      ">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {role === "admin" ? "Admin Mode" : "Viewer Mode"}
        </span>

        <Terminal size={14} className="text-gray-400" />
      </div>

      {/* ROLE SWITCH */}
      <div className="flex flex-col gap-2">

        {/* ADMIN */}
        <button 
          onClick={() => { setRole("admin"); setIsOpen(false); }}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border
          ${
            role === "admin"
              ? "bg-brand-primary/10 dark:bg-brand-primary/15 text-brand-primary dark:text-white border-brand-primary/30"
              : "text-gray-700 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5"
          }`}
        >
          <div className={`
            p-2 rounded-lg
            ${role === "admin"
              ? "bg-brand-primary/20 text-brand-primary"
              : "bg-gray-100 dark:bg-white/5 text-gray-500"
            }
          `}>
            <Shield size={16} />
          </div>

          <span className="text-sm font-medium">Admin</span>
        </button>

        {/* VIEWER */}
        <button 
          onClick={() => { setRole("viewer"); setIsOpen(false); }}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border
          ${
            role === "viewer"
              ? "bg-brand-primary/10 dark:bg-brand-primary/15 text-brand-primary dark:text-white border-brand-primary/30"
              : "text-gray-700 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5"
          }`}
        >
          <div className={`
            p-2 rounded-lg
            ${role === "viewer"
              ? "bg-brand-primary/20 text-brand-primary"
              : "bg-gray-100 dark:bg-white/5 text-gray-500"
            }
          `}>
            <Eye size={16} />
          </div>

          <span className="text-sm font-medium">Viewer</span>
        </button>
      </div>

      {/* DECORATION */}
      <div className="absolute right-[-20%] bottom-[-10%] opacity-[0.03] pointer-events-none">
        <Star size={100} strokeWidth={1} />
      </div>
    </motion.div>
  )
}