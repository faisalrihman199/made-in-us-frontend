/**
 * Authentication Service
 * Handles all auth API calls (signup, login, logout, Google auth)
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role?: string;
}

export interface AuthResponse {
  user: User;
}

export interface SignupPayload {
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface GoogleLoginPayload {
  idToken: string;
}

class AuthService {
  /**
   * Sign up a new user
   */
  async signup(payload: SignupPayload): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const errorCode = body?.error || "unknown_error";
      
      if (errorCode === "email_in_use") {
        throw new Error("This email is already registered. Please log in or use a different email.");
      }
      if (errorCode === "invalid_body") {
        const details = body?.details;
        if (details?.fieldErrors?.confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        if (details?.fieldErrors?.password) {
          throw new Error("Password must be at least 8 characters long.");
        }
        throw new Error("Please check your inputs and try again.");
      }
      throw new Error("Signup failed. Please try again.");
    }

    return res.json();
  }

  /**
   * Log in with email and password
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const errorCode = body?.error || "unknown_error";
      
      if (errorCode === "invalid_credentials") {
        throw new Error("Invalid email or password. Please try again.");
      }
      if (errorCode === "invalid_body") {
        throw new Error("Please provide a valid email and password.");
      }
      throw new Error("Login failed. Please try again.");
    }

    return res.json();
  }

  /**
   * Log in with Google OAuth
   */
  async loginWithGoogle(payload: GoogleLoginPayload): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const errorCode = body?.error || "unknown_error";
      
      if (errorCode === "google_not_configured") {
        throw new Error("Google login is not configured. Please try email login.");
      }
      if (errorCode === "invalid_google_token") {
        throw new Error("Invalid Google token. Please try again.");
      }
      throw new Error("Google login failed. Please try again.");
    }

    return res.json();
  }

  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  /**
   * Get the current authenticated user
   */
  async getMe(): Promise<User | null> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        credentials: "include"
      });

      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch user");
      }

      const data = await res.json();
      return data.user;
    } catch (error) {
      console.error("Get me error:", error);
      return null;
    }
  }
}

export const authService = new AuthService();
