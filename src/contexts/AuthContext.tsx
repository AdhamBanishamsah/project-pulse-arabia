
import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  approved: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // This is a mock implementation for the frontend only
    setIsLoading(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock users for demonstration
      const adminUser = {
        id: "1",
        name: "مدير النظام",
        email: "admin@viken.com",
        role: "admin" as const,
        approved: true
      };
      
      const employeeUser = {
        id: "2",
        name: "موظف",
        email: "employee@viken.com",
        role: "employee" as const,
        approved: true
      };
      
      // Check credentials (for demo purposes)
      let loggedInUser = null;
      if (email === adminUser.email && password === "password") {
        loggedInUser = adminUser;
      } else if (email === employeeUser.email && password === "password") {
        loggedInUser = employeeUser;
      } else {
        throw new Error("بيانات الدخول غير صحيحة");
      }
      
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration - in a real app this would call an API
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: "employee" as const,
        approved: false // New users need admin approval
      };
      
      // Normally we would not login the user immediately after registration
      // especially if approval is required, but for demo purposes:
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAdmin,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
