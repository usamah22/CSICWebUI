import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { authApi } from "../services/api";
import { AuthResponse } from "../types";

interface User {
  id: string;
  email: string;
  fullName?: string;
  role: "student" | "staff" | "professional" | "admin";
}

interface DecodedToken {
  sub: string;
  email: string;
  role?: string; // role might be missing
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const decodeToken = (token: string): User => {
    const decoded = jwtDecode<DecodedToken>(token);

    const role =
      decoded.role?.toLowerCase() as User["role"] ?? "student"; // fallback to student if missing

    if (!decoded.role) {
      console.warn("Role is missing in decoded JWT. Defaulting to 'student'.");
    }

    return {
      id: decoded.sub,
      email: decoded.email,
      role,
    };
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userFromToken = decodeToken(token);
      setIsAuthenticated(true);
      setUser(userFromToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem("token", response.token);

      const userFromToken = decodeToken(response.token);
      setIsAuthenticated(true);
      setUser(userFromToken);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await authApi.signup({ name, email, password });
      localStorage.setItem("token", response.token);

      const userFromToken = decodeToken(response.token);
      setIsAuthenticated(true);
      setUser({
        ...userFromToken,
        fullName: name,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signup,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
