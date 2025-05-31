import { Navigate } from "react-router-dom";
import useStore from "./Authstore";

const GuestRoute = ({ children }) => {
  const user = useStore((state) => state.user);

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default GuestRoute;
