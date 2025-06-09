// Components/Authstore.js
import { create } from "zustand";
import api from "../utilities/axios";
import { toast } from "react-toastify";

const getInitialToken = () => {
  try {
    return JSON.parse(localStorage.getItem("token"));
  } catch {
    return null;
  }
};

const getInitialUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

const userlogindata = create((set) => ({
  friends: null,
  pendingRequests: null,
  token: getInitialToken(),
  user: getInitialUser(),
  inbox: null,
  viewProfile: false,
  currentView: "home",
  showMenu: false,
  showRegister: false,
  forgetPassword: false,
  searchdate: false,

  fetchFriendsData: async () => {
    try {
      const res = await api.get("/api/friend/me");
      set({
        pendingRequests: res.data.friendRequests,
        friends: res.data.friends,
      });
    } catch (err) {
      toast.error("Failed to load friend data");
    }
  },

  setToken: (token) => {
    localStorage.setItem("token", JSON.stringify(token));
    set({ token });
  },

  setInbox: async () => {
    try {
      const res = await api.get("/api/friend/inbox/get");
      set({ inbox: res.data.inbox });
    } catch (err) {
      console.error("Inbox fetch failed:", err.message);
    }
  },

  setUser: (value) => {
    localStorage.setItem("user", JSON.stringify(value));
    set({ user: value });
  },

  logoutUser: async () => {
    set({ user: null });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ token: null });

    try {
      const res = await api.post("/api/auth/logout");
      toast.success(res.data?.message || "Logged out");
    } catch (err) {
      toast.error("Something went wrong during logout");
    }
  },

  setViewProfile: (value) => set({ viewProfile: value }),
  setCurrentView: (value) => set({ currentView: value }),
  setShowMenu: (value) => set({ showMenu: value }),
  setShowRegister: (value) => set({ showRegister: value }),
  setForgetPassword: (value) => set({ forgetPassword: value }),
  setSearchdate: (value) => set({ searchdate: value }),
}));

export default userlogindata;
export const store = userlogindata;
