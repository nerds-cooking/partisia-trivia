import axios from "@/lib/axios";
import { createContext, ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import { usePartisia } from "../partisia/usePartisia";

interface User {
  address: string;
  [key: string]: unknown; // Add other user fields as needed
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  authenticating: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);

  const { sdk } = usePartisia();

  const isAuthenticated = !!user;

  const fetchMe = async () => {
    try {
      const res = await axios.get("/api/auth/me");
      return res.data;
    } catch (err) {
      console.error("Error fetching user:", err);
      throw err;
    }
  };

  // Fetch user session on mount
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const res = await fetchMe();
        setUser(res);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const fetchAuthMessage = async (pubKey: string) => {
    try {
      const res = await axios.get<{ message: string }>("/api/auth/nonce", {
        params: { pub: pubKey },
      });
      return res.data.message;
    } catch (err) {
      console.error("Error fetching nonce:", err);
      throw err;
    }
  };

  // Login with address + signature
  const login = async () => {
    try {
      setAuthenticating(true);
      if (!sdk) {
        throw new Error("Partisia SDK not initialized");
      }

      if (!sdk.isConnected) {
        throw new Error("Partisia SDK not connected");
      }

      const account = sdk.connection.account;

      const message = await fetchAuthMessage(account.pub);

      const signature = await sdk.signMessage({
        payload: message,
        payloadType: "utf8",
        dontBroadcast: true,
      });

      if (!account.address || !signature) {
        throw new Error("Invalid account address or signature");
      }

      await axios.post("/api/auth/login", {
        address: account.address,
        signature: signature.signature,
      });

      // Fetch user session after successful login
      const res = await fetchMe();
      setUser(res);
      toast.success("Login successful!");
    } catch (err) {
      toast.error("Login failed. Please try again.");
      throw err;
    } finally {
      setAuthenticating(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");

      setUser(null);
      toast.success("Logout successful!");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        authenticating,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
