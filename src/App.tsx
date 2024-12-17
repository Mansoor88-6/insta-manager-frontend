import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout/Layout";
import AuthLayout from "./components/Layout/AuthLayout";
import Dashboard from "./components/Dashboard/Dashboard";
import Auth from "./pages/Auth";
import InstagramSuccess from './pages/InstagramSuccess'
import InstagramError from './pages/InstagramError'
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/auth" element={<Auth />} />
          </Route>

          {/* Protected routes */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/instagram-success" element={<InstagramSuccess />} />
            <Route path="/instagram-error" element={<InstagramError />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />


          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
