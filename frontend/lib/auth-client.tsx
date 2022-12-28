"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "types";
import { fetchAPI } from "@/lib/utils";

interface AuthContextInterface {
  login(email: string, password: string): Promise<User>;
  register(email: string, password: string, fullName: string): Promise<User>;
  logout(): Promise<boolean>;
  getSession(): Promise<User>;
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("Auth context is not inside provider.");
  }

  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    getSession().catch((err) => console.error("Error getting user session", err));
  }, []);

  async function getSession(): Promise<User> {
    return fetchAPI("/auth/session")
      .then((res) => res.json())
      .then((res) => {
        if (res && res.success === true) {
          const user = res.response as User;
          setUser(user);
          return user;
        }

        setUser(null);
        return null;
      })
      .catch((err) => {
        console.error(err);
        setUser(null);
        return null;
      });
  }

  async function login(email: string, password: string): Promise<User> {
    const form = new FormData();
    form.append("email", email);
    form.append("password", password);

    return fetchAPI("/auth/login", {
      method: "POST",
      body: form,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.success === true) {
          const user = res.response as User;
          setUser(user);
          return user;
        }

        setUser(null);
        return null;
      })
      .catch((err) => {
        console.error(err);
        setUser(null);
        return null;
      });
  }

  async function register(email: string, password: string, fullName: string): Promise<User> {
    const form = new FormData();
    form.append("email", email);
    form.append("password", password);
    form.append("fullName", fullName);

    return fetchAPI("/auth/register", {
      method: "POST",
      body: form,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.success === true) {
          const user = res.response as User;
          setUser(user);
          return user;
        }

        setUser(null);
        return null;
      })
      .catch((err) => {
        console.error(err);
        setUser(null);
        return null;
      });
  }

  async function logout(): Promise<boolean> {
    return fetchAPI("/auth/logout", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.success === true) {
          setUser(null);
          return true;
        }

        return false;
      })
      .catch((err) => {
        console.error(err);
        setUser(null);
        return false;
      });
  }

  const value: AuthContextInterface = {
    login: login,
    register: register,
    logout: logout,
    getSession: getSession,
    user: user,
    setUser: setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
