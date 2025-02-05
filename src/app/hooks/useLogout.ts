
import { useState } from "react";

export function useLogout() {
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout");
      if (res.ok) {
        window.location.href = "/signin"; 
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
}
