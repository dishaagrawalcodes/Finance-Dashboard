import { useState } from "react"
import { useFinance } from "../../hooks/useFinance"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Bell, ChevronDown, User, Command } from "lucide-react"
import NotificationDropdown from "./NotificationDropdown"
import UserDropdown from "./UserDropdown"

export default function Header() {
  const { 
    role, setRole, searchTerm, setSearchTerm, 
    notifications, clearNotifications,
  } = useFinance()
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotifyMenuOpen, setIsNotifyMenuOpen] = useState(false)

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="
      sticky top-0 z-[100] w-full h-20 
      bg-white/70 dark:bg-[#030303]/70 
      border-b border-gray-200 dark:border-white/10 
      px-6 sm:px-10 flex items-center justify-between 
      backdrop-blur-md
    ">

      {/* SEARCH */}
      <div className="flex-1 max-w-xl relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        
        <input 
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-full pl-10 pr-12 py-2.5 rounded-lg
            bg-gray-100 dark:bg-white/5
            border border-gray-200 dark:border-white/10
            text-gray-900 dark:text-white
            placeholder-gray-500
            outline-none
            focus:ring-2 focus:ring-brand-primary/40
          "
        />

        <div className="
          absolute right-3 top-1/2 -translate-y-1/2
          text-xs text-gray-400 flex items-center gap-1
        ">
          <Command size={12} />
          K
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 ml-6 relative">

        {/* NOTIFICATIONS */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsNotifyMenuOpen(!isNotifyMenuOpen)
              setIsUserMenuOpen(false)
            }}
            className="
              p-2.5 rounded-lg
              bg-gray-100 dark:bg-white/5
              border border-gray-200 dark:border-white/10
              text-gray-600 dark:text-gray-400
              hover:bg-gray-200 dark:hover:bg-white/10
              transition-all
            "
          >
            <Bell size={18} />
            
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-primary rounded-full"></span>
            )}
          </button>

          <AnimatePresence>
            {isNotifyMenuOpen && (
              <NotificationDropdown 
                notifications={notifications}
                clearNotifications={() => {
                  clearNotifications()
                  setIsNotifyMenuOpen(false)
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* USER */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen)
              setIsNotifyMenuOpen(false)
            }}
            className="
              flex items-center gap-3 px-3 py-1.5 rounded-lg
              hover:bg-gray-100 dark:hover:bg-white/10
              border border-gray-200 dark:border-white/10
              transition-all
            "
          >
            <div className="
              w-8 h-8 rounded-lg 
              bg-brand-primary text-white 
              flex items-center justify-center
            ">
              <User size={16} />
            </div>

            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {role === "admin" ? "Admin" : "Viewer"}
              </span>
              <span className="text-xs text-gray-500">Active</span>
            </div>

            <ChevronDown 
              size={14} 
              className={`text-gray-400 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} 
            />
          </button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <UserDropdown 
                role={role} 
                setRole={setRole} 
                setIsOpen={setIsUserMenuOpen} 
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}