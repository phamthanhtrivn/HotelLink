/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { authService } from "@/services/authService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        navigate("/forgot-password");
        return;
      }

      try {
        const res = await authService.validateResetPasswordToken(token);

        if (!res.success) {
          toast.error(res.message);
          navigate("/forgot-password");
        }
      } catch (error) {
        navigate("/forgot-password");
        console.log(error);
      }
    };

    validateToken();
  }, [token]);

  const handleResetPassword = async () => {
    const newErrors = {
      newPassword: "",
      confirmPassword: "",
    };

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu không trùng khớp!";
    }

    setErrors(newErrors);

    if (newErrors.confirmPassword) {
      confirmPasswordRef.current.focus();
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.resetPassword(token, newPassword);

      if (res.success) {
        toast.success(res.message);
        navigate("/login");
      } else {
        const newErrors = { newPassword: "", confirmPassword: "" };

        if (res.data.newPassword) {
          newErrors.newPassword = res.data.newPassword;
        }

        setErrors(newErrors);

        if (newErrors.newPassword) {
          newPasswordRef.current.focus();
          return;
        }
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#e2ecf7] to-[#f9fafc]">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-(--color-primary) mb-6">
          Đặt lại mật khẩu
        </h2>

        {/* New Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-xl focus-visible:ring-(--color-primary) pr-10"
              ref={newPasswordRef}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Xác nhận mật khẩu <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-xl focus-visible:ring-(--color-primary) pr-10"
              ref={confirmPasswordRef}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <Button
          onClick={handleResetPassword}
          disabled={isLoading}
          className={`w-full bg-(--color-primary) font-semibold rounded-xl shadow-md transition-colors duration-300 hover:bg-[#2a4b70] flex items-center justify-center gap-2 ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Đang xử lý...
            </>
          ) : (
            "Đặt lại mật khẩu"
          )}
        </Button>

        <p className="text-sm text-center text-gray-500 mt-4">
          Quay lại{" "}
          <Link
            to="/login"
            className="font-medium text-blue-500 hover:underline"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
