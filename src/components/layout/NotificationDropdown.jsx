import { motion } from "framer-motion"
import { Bell, ShieldAlert, CheckCircle2, ChevronRight, Inbox } from "lucide-react"

export default function NotificationDropdown({ notifications, clearNotifications }) {
  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.95 }}
      className="
        absolute right-0 mt-3 w-[380px]
        bg-white dark:bg-[#0a0a0b]/90
        border border-gray-200 dark:border-white/10
        rounded-2xl overflow-hidden
        shadow-lg dark:shadow-2xl
        backdrop-blur-0 dark:backdrop-blur-xl
        z-[9999]
      "
    >

      {/* HEADER */}
      <div className="
        p-5 flex items-center justify-between
        border-b border-gray-200 dark:border-white/10
      ">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
            <Bell size={16} />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Notifications
            </p>
            <p className="text-xs text-gray-500">
              {unreadCount} unread
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button 
            onClick={clearNotifications}
            className="text-xs text-brand-primary hover:underline"
          >
            Mark all
          </button>
        )}
      </div>

      {/* LIST */}
      <div className="max-h-[320px] overflow-y-auto">

        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-white/10">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className="
                  p-4 flex gap-3 cursor-pointer
                  hover:bg-gray-100 dark:hover:bg-white/5
                  transition
                "
              >

                {/* ICON */}
                <div className={`
                  p-2 rounded-lg
                  ${n.type === "warning"
                    ? "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                    : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                  }
                `}>
                  {n.type === "warning"
                    ? <ShieldAlert size={16} />
                    : <CheckCircle2 size={16} />
                  }
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className={`text-sm font-semibold 
                      ${n.unread 
                        ? "text-gray-900 dark:text-white" 
                        : "text-gray-500"
                      }`}>
                      {n.title}
                    </p>

                    <span className="text-xs text-gray-400">
                      {n.time}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    {n.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500 flex flex-col items-center gap-3">
            <Inbox size={40} />
            <p>No notifications</p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="
        p-4 border-t 
        border-gray-200 dark:border-white/10
        text-center
      ">
        <button className="
          text-xs text-gray-600 dark:text-gray-400
          hover:text-gray-900 dark:hover:text-white
          flex items-center justify-center gap-1 mx-auto
        ">
          View all <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  )
}