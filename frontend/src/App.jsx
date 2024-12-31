import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/dashboard" element={<Login />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
