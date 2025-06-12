import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const token = localStorage.getItem("auth_token");

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      if (!token) return null;

      try {
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("auth_token");
          }
          return null;
        }

        return response.json();
      } catch (error) {
        console.error("Auth check failed:", error);
        return null;
      }
    },
    retry: false,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isAuthenticated = !!token && (!!user || isLoading);

  const logout = () => {
    localStorage.removeItem("auth_token");
    window.location.href = "/";
  };

  return {
    user,
    isLoading: token ? isLoading : false,
    isAuthenticated,
    logout,
  };
}