import { useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import Dashboard from './pages/Dashboard'; // Dashboard page
import Profile from './pages/Profile'; // Profile page


function App() {
  const editorRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const scrollToTarget = (target: 'editor' | 'settings') => {
    if (target === 'editor') {
      editorRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'settings') {
      settingsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    document.title = 'Note Taking App';
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
