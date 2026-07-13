import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { Shield, LayoutDashboard, AlertCircle, Settings } from "lucide-react"

import Dashboard from "./pages/Dashboard"
import Incidents from "./pages/Incidents"
import Investigation from "./pages/Investigation"

function Layout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b flex items-center gap-2 text-primary font-bold text-lg">
          <Shield className="w-6 h-6" />
          AttackChain AI
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-700">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link to="/incidents" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-700">
            <AlertCircle className="w-4 h-4" />
            Incidents
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-400 cursor-not-allowed">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b h-14 flex items-center px-6">
          <h1 className="text-sm font-medium text-slate-500">Security Operations Center</h1>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/incidents/:id" element={<Investigation />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
