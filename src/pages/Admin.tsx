import { useState, useEffect } from 'react';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminPanel } from '@/components/AdminPanel';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticated = sessionStorage.getItem('admin_authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  return isAuthenticated ? (
    <AdminPanel onLogout={() => setIsAuthenticated(false)} />
  ) : (
    <AdminLogin onLogin={() => setIsAuthenticated(true)} />
  );
};

export default Admin;
