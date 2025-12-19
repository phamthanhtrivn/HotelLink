import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  const role = user?.role || "GUEST";

  if (role === "GUEST" && !allowedRoles.includes("GUEST")) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    switch (role) {
      case "MEMBER":
        return <Navigate to="/" replace />;
      case "STAFF":
        return <Navigate to="/staff" replace />;
      case "ADMIN":
        return <Navigate to="/admin" replace />;
    }
  }

  return children;
};
export default ProtectedRoutes;
