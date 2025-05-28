import { create } from "zustand";

const userlogindata = create((set) => {
  const userData = JSON.parse(localStorage.getItem("user"));
  return {
    showRegister: false,
    forgetPassword: false,
    setForgetPassword: (value) => set({ forgetPassword: value }),
    setShowRegister: (value) => set({ showRegister: value }),
    user: userData || null,
    setUser: (value) => {
      set({ user: value });
      localStorage.setItem("user", JSON.stringify(value));
    },
  };
});

export default userlogindata;
