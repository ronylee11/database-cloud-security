import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import Dashboard from './pages/Dashboard'
import TermsAndConditions from './pages/TermsAndConditions'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from './utils/protectedroute'; // Import ProtectedRoute
import { Flex, Heading } from "@chakra-ui/react";
import { DarkModeToggler } from './components/ui/toggler';

function App() {

  return (
    <Flex
        alignItems="center"
        justifyContent="center"
        flexDir="column"
        minHeight="100vh"
        minWidth="100vw"
    >
    <Flex alignItems="center" justifyContent="center">
    <Heading mt={0} p={5}>MoneyTiger</Heading>
    <DarkModeToggler mt={0} />
    </Flex>
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
    </Flex>
  )
}

export default App
