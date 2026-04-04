import { useApp } from "../context/useApp";
import { UserCircle, ShieldCheck, Eye } from "lucide-react"; // npm install lucide-react

export default function Navbar() {
  const { role, setRole } = useApp();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <div className="w-5 h-5 bg-white rounded-sm rotate-45" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            Fin<span className="text-indigo-600">Flow</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex items-center">
             {role === 'admin' ? <ShieldCheck className="absolute left-3 w-4 h-4 text-indigo-500" /> : <Eye className="absolute left-3 w-4 h-4 text-slate-400" />}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 text-sm font-medium rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer transition-all hover:bg-slate-100"
            >
              <option value="viewer">Viewer Mode</option>
              <option value="admin">Admin Access</option>
            </select>
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-sm" />
        </div>
      </div>
    </nav>
  );
}