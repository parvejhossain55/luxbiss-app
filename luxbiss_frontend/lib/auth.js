import { api } from "./api";

/**
 * Authentication Module (/auth)
 */

export const authService = {
  // 1. Register
  async register(userData) {
    const res = await api.post("/auth/register", userData);
    return res.data;
  },

  // 1.5. Confirm Registration (OTP)
  async confirmRegistration(email, otp) {
    const res = await api.post("/auth/register/confirm", { email, otp });
    if (res.data.success) {
      this._handleAuthResponse(res.data.data);
    }
    return res.data;
  },

  // 2. Login
  async login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    if (res.data.success) {
      this._handleAuthResponse(res.data.data);
    }
    return res.data;
  },

  // 3. Google OAuth Login
  async googleLogin(token) {
    const res = await api.post("/auth/google", { token });
    if (res.data.success) {
      this._handleAuthResponse(res.data.data);
    }
    return res.data;
  },

  // 4. Token Refresh (Usually handled by api.js interceptor)
  async refresh() {
    const res = await api.post("/auth/refresh", {});
    return res.data;
  },

  // 5. Password Recovery Workflow
  async forgotPassword(email) {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  },

  async verifyOtp(email, otp) {
    const res = await api.post("/auth/verify-otp", { email, otp });
    return res.data;
  },

  async resetPassword(email, otp, newPassword, confirmPassword) {
    const res = await api.post("/auth/reset-password", {
      email,
      otp,
      password: newPassword,
      confirm_password: confirmPassword
    });
    return res.data;
  },

  // Logout helper
  async logout() {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    }
  },

  // Internal helper to store session
  _handleAuthResponse(data) {
    if (!data || !data.user) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  }
};