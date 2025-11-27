import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import supabase from './supabaseClient';

// pages/components
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import Dashboard from './components/dashboard.jsx';
import ChildRecord from './components/child-record.jsx';
import Reports from './components/reports.jsx';
import './App.css';

function AuthLoader({ children, onAuthChange }) {
  // small container to keep one auth subscription for the app
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      onAuthChange(session?.user ?? null);
    });
    return () => {
      // cleanup for different SDK shapes
      sub?.subscription?.unsubscribe?.();
      if (sub?.unsubscribe) sub.unsubscribe();
    };
  }, [onAuthChange]);

  return children;
}

function RequireAuth({ children }) {
  const [status, setStatus] = useState({ checking: true, user: null });

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser()
      .then(({ data }) => { if (!mounted) return; setStatus({ checking: false, user: data?.user ?? null }); })
      .catch(() => { if (!mounted) return; setStatus({ checking: false, user: null }); });
    return () => { mounted = false; };
  }, []);

  if (status.checking) return null; // or return a loader UI
  return status.user ? children : <Navigate to="/login" replace />;
}

function RedirectIfAuth({ children }) {
  const [status, setStatus] = useState({ checking: true, user: null });

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser()
      .then(({ data }) => { if (!mounted) return; setStatus({ checking: false, user: data?.user ?? null }); })
      .catch(() => { if (!mounted) return; setStatus({ checking: false, user: null }); });
    return () => { mounted = false; };
  }, []);

  if (status.checking) return null;
  return status.user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <BrowserRouter>
      <AuthLoader onAuthChange={setCurrentUser}>
        <Routes>
          <Route
            path="/login"
            element={
              <RedirectIfAuth>
                <Login />
              </RedirectIfAuth>
            }
          />

          <Route
            path="/signup"
            element={
              <RedirectIfAuth>
                <SignUp />
              </RedirectIfAuth>
            }
          />

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />

          <Route
            path="/child-records"
            element={
              <RequireAuth>
                <ChildRecord />
              </RequireAuth>
            }
          />

          <Route
            path="/reports"
            element={
              <RequireAuth>
                <Reports />
              </RequireAuth>
            }
          />

          {/* default route */}
          <Route
            path="/"
            element={currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
          />

          {/* catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthLoader>
    </BrowserRouter>
  );
}
