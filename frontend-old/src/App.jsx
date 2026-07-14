import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingLayout from "./layouts/LandingLayout"
import DashboardLayout from "./layouts/DashboardLayout"
import LandingPage from "./pages/LandingPage"
import UnifiedDashboard from "./pages/UnifiedDashboard"
import TransitionLoader from "./components/common/TransitionLoader"

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route 
          path="/" 
          element={
            <LandingLayout>
              <LandingPage />
            </LandingLayout>
          } 
        />

        {/* Transition Loader */}
        <Route path="/transition" element={<TransitionLoader />} />

        {/* Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <DashboardLayout>
              <UnifiedDashboard />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/dashboard/incidents/:id" 
          element={
            <DashboardLayout>
              <UnifiedDashboard />
            </DashboardLayout>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
