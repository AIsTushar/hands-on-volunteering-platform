import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;

const API_URL = "http://localhost:5000/api/auth";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isCheckingAuth: true,

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/signup`, {
        name,
        email,
        password,
      });

      set({
        user: response.data.user,
        isLoading: false,
        isAuthenticated: true,
      });
      toast.success("Account created successfully", { duration: 5000 });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error while signing up!!",
      });

      toast.error("Error while signing up!! Please try again", {
        duration: 5000,
      });

      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error while logging in!!",
      });
      toast.error(error.response?.data?.message || "Error while logging in!!", {
        duration: 5000,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const response = await axios.get(`${API_URL}/check-auth`);

      set({
        isAuthenticated: true,
        user: response.data.user,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ isCheckingAuth: false });
      throw error;
    }
  },

  getUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/profile`);
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error while logging in!!",
      });
      throw error;
    }
  },
}));
