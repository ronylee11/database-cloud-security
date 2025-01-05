import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import Dashboard from './pages/Dashboard'
import TermsAndConditions from './pages/TermsAndConditions'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from './utils/protectedroute'; // Import ProtectedRoute

function App() {

  return (
    <div className="bg-slate-900 text-slate-300">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/t&c" element={<TermsAndConditions />}/>
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
