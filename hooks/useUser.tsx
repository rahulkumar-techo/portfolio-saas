"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";

export interface UserInfo {
  name?: string;
  title?: string;
  email?: string;
  location?: string;
  github?: string;
  linkedin?: string;
}

const useUser = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/user");
      setUser((res.data?.data ?? null) as UserInfo | null);
    } catch {
      setError("Failed to fetch user info");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (payload: Partial<UserInfo>) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.patch("/user", payload);
      setUser((res.data?.data ?? null) as UserInfo | null);
      return res.data;
    } catch {
      setError("Failed to update user info");
      throw new Error("Failed to update user info");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    fetchUser,
    updateUser,
    setUser,
  };
};

export default useUser;
