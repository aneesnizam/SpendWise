import { create } from "zustand";
import api from "../utilities/axios";
import { toast } from "react-toastify";
const userlogindata = create((set) => {
  const userData = JSON.parse(localStorage.getItem("user")) || null;
  return {
    viewProfile: false,
    setViewProfile: (value) => set({ viewProfile: value }),
    currentView: "home",
    setCurrentView: (value) => set({ currentView: value }),
    showMenu: false,
    setShowMenu: (value) => set({ showMenu: value }),
    showRegister: false,
    forgetPassword: false,
    searchdate: false,
    setSearchdate: (value) => set({ searchdate: value }),

    setForgetPassword: (value) => set({ forgetPassword: value }),
    setShowRegister: (value) => set({ showRegister: value }),
    user: userData || null,

    setUser: (value) => {
      set({ user: value });
      localStorage.setItem("user", JSON.stringify(value));
    },
    logoutUser: () => {
      set({ user: null });
      localStorage.removeItem("user");
      try {
        api.post("api/auth/logout").then((res) => {
          toast.success(res.message);
        });
      } catch (err) {
        toast.error("something went wrong");
      }
    },
  };
});

export default userlogindata;
