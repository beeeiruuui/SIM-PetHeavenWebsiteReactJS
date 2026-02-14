import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Simulated user database (in real app, this would be backend API)
const DEMO_USERS = [
  { email: 'admin@petheaven.org.sg', password: 'admin123', name: 'Admin', role: 'admin' },
  { email: 'user@example.com', password: 'user123', name: 'John Doe', role: 'user' }
];

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(DEMO_USERS);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('petHeaven_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (email, password, role = 'user') => {
    const foundUser = users.find(
      u => u.email === email && u.password === password && u.role === role
    );
    
    if (foundUser) {
      const userData = { ...foundUser, password: undefined };
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('petHeaven_user', JSON.stringify(userData));
      return { success: true, message: 'Login successful!' };
    }
    return { success: false, message: 'Invalid email, password, or account type.' };
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('petHeaven_user');
  };

  const register = (userData, role = 'user') => {
    // Check if email already exists
    const exists = users.find(u => u.email === userData.email);
    if (exists) {
      return { success: false, message: 'Email already registered.' };
    }

    const newUser = {
      ...userData,
      role,
      memberSince: new Date().getFullYear().toString()
    };
    
    setUsers([...users, newUser]);
    
    const safeUser = { ...newUser, password: undefined };
    setUser(safeUser);
    setIsLoggedIn(true);
    localStorage.setItem('petHeaven_user', JSON.stringify(safeUser));
    
    return { success: true, message: 'Registration successful!' };
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    isLoggedIn,
    user,
    login,
    logout,
    register,
    isAdmin,
    users // For admin dashboard to view users
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
