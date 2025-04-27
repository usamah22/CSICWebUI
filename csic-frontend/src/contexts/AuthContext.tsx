import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { authApi } from "../services/api";

interface User {
  id: string;
  email: string;
  fullName?: string;
  role: "Student" | "Staff" | "Professional" | "Admin"; // Changed to match backend enum case
}

interface DecodedToken {
  sub: string;
  email: string;
  role?: string;
  // Add the Microsoft claims format
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  exp?: number;
  jti?: string;
  [key: string]: any; // To allow for other properties
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const decodeToken = (token: string): User => {
    const decoded = jwtDecode<DecodedToken>(token);

    const roleValue =
      decoded.role ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      decoded.roleKey;

    // If role is present, use it (matching backend case)
    let role: User["role"] = "Student"; // Default

    if (roleValue) {
      // Match the exact case from the backend enum
      if (roleValue === "Admin") {
        role = "Admin";
      } else if (roleValue === "Staff") {
        role = "Staff";
      } else if (roleValue === "Professional") {
        role = "Professional";
      } else if (roleValue === "Student") {
        role = "Student";
      }
    }

    console.log("Extracted role value:", roleValue);
    console.log("Mapped role:", role);
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

  const signup = async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    try {
      const response = await authApi.signup(data);
      localStorage.setItem("token", response.token);
  
      const userFromToken = decodeToken(response.token);
      setIsAuthenticated(true);
      setUser({
        ...userFromToken,
        fullName: `${data.firstName} ${data.lastName}`,
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
