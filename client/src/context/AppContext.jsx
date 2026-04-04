import { useState, useEffect, createContext } from "react"; // 1. Added createContext
import { mockTransactions } from "../data/mockData";

// 2. Create and export the Context right here
export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : mockTransactions;
  });

  const [role, setRole] = useState("viewer");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (tx) => {
    setTransactions([...transactions, { ...tx, id: Date.now() }]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        role,
        setRole,
        search,
        setSearch,
        addTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}