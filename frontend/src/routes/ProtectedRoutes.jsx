import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children, allowedRoles }) => {
  const user = {
    vaiTro: "ADMIN",
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.vaiTro)) {
    switch (user.vaiTro) {
      case "MEMBER":
        return <Navigate to="/" replace />;
      case "STAFF":
        return <Navigate to="/staff" replace />;
      case "ADMIN":
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};
export default ProtectedRoutes;
