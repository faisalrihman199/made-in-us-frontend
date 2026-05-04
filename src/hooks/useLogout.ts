import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

export const useLogout = () => {
  const { checkAuth } = useAuth();

  const logout = async () => {
    try {
      await authService.logout();
      await checkAuth(); // Refresh auth state
      toast({
        title: "Logged out",
        description: "You have been logged out successfully."
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again."
      });
    }
  };

  return { logout };
};
