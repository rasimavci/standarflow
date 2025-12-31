"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { initializeLocalStorage } from "@/utils/initializeData";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "founder" | "investor" | "admin";
  // Investor-specific fields
  firm?: string;
  investmentRange?: string;
  // Founder-specific fields
  company?: string;
  stage?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Initialize localStorage with mock data and load user on mount
  useEffect(() => {
    initializeLocalStorage();
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - check localStorage for user data
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    // Check if admin
    if (email === "admin@standardflow.ai") {
      const adminUser: User = {
        id: "admin",
        name: "Admin",
        email: "admin@standardflow.ai",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
        role: "admin"
      };
      setUser(adminUser);
      localStorage.setItem("user", JSON.stringify(adminUser));
      return;
    }
    
    // Check founders first
    const founders = JSON.parse(localStorage.getItem("founders") || "[]");
    const founder = founders.find((f: any) => f.email === email);
    
    if (founder) {
      const mockUser: User = {
        id: founder.id,
        name: founder.founderName,
        email: founder.email,
        avatar: founder.avatar,
        role: "founder",
        company: founder.company,
        stage: founder.stage
      };
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      return;
    }
    
    // Check investors
    const investors = JSON.parse(localStorage.getItem("investors") || "[]");
    const investor = investors.find((i: any) => i.email === email);
    
    if (investor) {
      const mockUser: User = {
        id: investor.id,
        name: investor.name,
        email: investor.email,
        avatar: investor.avatar,
        role: "investor",
        firm: investor.firm,
        investmentRange: investor.investmentRange
      };
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      return;
    }
    
    // If no match found, create a generic user
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split("@")[0],
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      role: "founder"
    };
    
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const signup = async (name: string, email: string, password: string) => {
    // Mock signup - accept any credentials
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      role: "founder"
    };
    
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAdmin: user?.role === "admin", login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
