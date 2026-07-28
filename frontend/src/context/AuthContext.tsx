"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  role: "admin" | "faculty" | "student";
  avatar_url?: string;
  student_profile?: any;
  faculty_profile?: any;
}

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  demoLogin: (role: "admin" | "faculty" | "student") => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  loading: true,
  login: async () => false,
  demoLogin: async () => false,
  logout: () => {},
  refreshUser: async () => {},
});

export const API_BASE = "http://localhost:8000/api";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("kite_token");
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Auth me check failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      if (!res.ok) {
        return false;
      }
      const data = await res.json();
      setToken(data.access_token);
      localStorage.setItem("kite_token", data.access_token);
      await fetchUser(data.access_token);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const demoLogin = async (role: "admin" | "faculty" | "student"): Promise<boolean> => {
    let email = "admin@kite.ac.in";
    let pass = "admin123";

    if (role === "faculty") {
      email = "faculty1@kite.ac.in";
      pass = "faculty123";
    } else if (role === "student") {
      email = "23aia09anushwathi@soi.kgkite.ac.in";
      pass = "student123";
    }

    return await login(email, pass);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("kite_token");
  };

  const refreshUser = async () => {
    if (token) {
      await fetchUser(token);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, demoLogin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
