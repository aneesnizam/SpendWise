import React from 'react';
import { Navigate } from 'react-router-dom';
import userlogindata from "./Authstore";



const PrivateRoute = ({ children }) => {
    const { user } = userlogindata();
    return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
