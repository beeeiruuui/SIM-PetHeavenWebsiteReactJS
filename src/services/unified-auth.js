import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

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
      id: Date.now(),
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

  const updateProfile = (updatedData) => {
    if (!user) return { success: false, message: 'Not logged in.' };
    
    const updatedUser = {
      ...user,
      name: updatedData.name || user.name,
      phone: updatedData.phone || user.phone,
      address: updatedData.address || user.address
    };
    
    setUser(updatedUser);
    localStorage.setItem('petHeaven_user', JSON.stringify(updatedUser));
    
    // Also update in users list
    setUsers(prev => prev.map(u => 
      u.email === user.email ? { ...u, ...updatedData } : u
    ));
    
    return { success: true, message: 'Profile updated successfully!' };
  };

  const deleteAccount = (email) => {
    // Remove user from users list
    setUsers(prev => prev.filter(u => u.email !== email));
    
    // Log out if deleting own account
    if (user && user.email === email) {
      logout();
    }
    
    return { success: true, message: 'Account deleted successfully.' };
  };

  const value = {
    isLoggedIn,
    user,
    login,
    logout,
    register,
    isAdmin,
    updateProfile,
    deleteAccount,
    users // For admin dashboard to view users
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
