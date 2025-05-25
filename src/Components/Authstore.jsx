import { create } from 'zustand';

const userlogindata = create((set) => ({
showRegister : false ,
forgetPassword : false ,
setForgetPassword : (value) => set({forgetPassword : value }) ,
setShowRegister : (value) => set({showRegister : value})

}))

export default userlogindata;