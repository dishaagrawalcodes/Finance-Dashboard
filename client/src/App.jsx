import Navbar from "./components/Navbar";
import SummaryCards from "./components/SummaryCards";
import Charts from "./components/Charts";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        
        {/* Summary Cards */}
        <SummaryCards />

        {/* Charts */}
        <Charts />

      </div>
    </div>
  );
}

export default App;