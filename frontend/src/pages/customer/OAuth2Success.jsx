/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const OAuth2Success = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      setToken(token);
      navigate("/");
      toast.success("Đăng nhập thành công!");
    }
  }, [token]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <Loader2 className="w-16 h-16 text-[#1E2A38] animate-spin" />
    </div>
  );
};

export default OAuth2Success;
