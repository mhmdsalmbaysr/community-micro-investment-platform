'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AuthCtx = createContext(null);
const InvCtx = createContext(null);
const ToastCtx = createContext(null);

const AUTH_KEY = 'cmip_auth';
const INV_KEY = 'cmip_demo_investments';

export default function Providers({ children }) {
  // Auth
  const [user, setUser] = useState(null);
  // Investments
  const [investments, setInvestments] = useState([]);
  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      const a = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
      if (a) setUser(a);
      setInvestments(JSON.parse(localStorage.getItem(INV_KEY) || '[]'));
    } catch {}
  }, []);

  const login = useCallback((u) => {
    setUser(u);
    localStorage.setItem(AUTH_KEY, JSON.stringify(u));
  }, []);
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  const invest = useCallback((inv) => {
    setInvestments((prev) => {
      const next = [...prev, { ...inv, id: 'inv_' + Date.now(), date: new Date().toISOString() }];
      localStorage.setItem(INV_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      <InvCtx.Provider value={{ investments, invest }}>
        <ToastCtx.Provider value={{ notify }}>
          {children}
          {toast && (
            <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-toast">
              <div className={`rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lift ${toast.type === 'success' ? 'bg-growth' : 'bg-ink'}`}>
                {toast.message}
              </div>
            </div>
          )}
        </ToastCtx.Provider>
      </InvCtx.Provider>
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
export const useInvestments = () => useContext(InvCtx);
export const useToast = () => useContext(ToastCtx);
