/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import bg01 from "../assets/Hotel-1.jpg";
import bg02 from "../assets/Hotel-2.png";
import ImgSlider from "@/components/common/customer/ImgSlider";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { authService } from "@/services/authService";
import { baseUrl } from "@/constants/constants";

const ForgotPassword = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleForgotPassword = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await authService.forgotPassword(email);
      if (res.success) {
        toast.success(res.message);
      } else {
        let newError = "";
        if (res.data.email) {
          newError = res.data.email;
        }

        setError(newError);
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        "Đã có lỗi xảy ra khi gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginGG = () => {
    window.location.href = `${baseUrl}/oauth2/authorization/google`;
  };

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "STAFF") {
        navigate("/staff");
      } else {
        navigate("/");
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-linear-to-br from-[#e2ecf7] to-[#f9fafc] overflow-hidden">
      {/* LEFT IMAGE */}
      <motion.div
        className="relative hidden w-7/12 md:block"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <ImgSlider images={[bg01, bg02]} interval={4000} />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black/20"></div>
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <h1 className="text-4xl font-bold leading-tight drop-shadow-lg">
            Chào mừng trở lại
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Kết nối và trải nghiệm dịch vụ của chúng tôi ngay hôm nay!
          </p>
        </div>
      </motion.div>
      {/* RIGHT FORM */}
      <motion.div
        className="relative z-10 flex items-center justify-center w-full px-6 py-10 bg-white shadow-2xl md:w-5/12 lg:w-5/12 xl:w-5/12"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="w-full max-w-sm border border-gray-200 shadow-lg rounded-2xl backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-(--color-primary) tracking-wide">
              Quên mật khẩu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email */}
            <div className="relative space-y-2 group">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 group-focus-within:text-(--color-primary) transition-colors"
              >
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email của bạn"
                className="focus-visible:ring-(--color-primary) rounded-xl"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            {/* Button */}
            <Button
              onClick={handleForgotPassword}
              disabled={isLoading}
              className={`w-full bg-(--color-primary) font-semibold rounded-xl shadow-md transition-colors duration-300 hover:bg-[#2a4b70] flex items-center justify-center gap-2 cursor-pointer ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Đang gửi...
                </>
              ) : (
                "Gửi liên kết khôi phục"
              )}
            </Button>

            {/* Separator */}
            <div className="flex items-center gap-2 my-2">
              <Separator className="flex-1" />
              <span className="text-sm text-gray-500">hoặc</span>
              <Separator className="flex-1" />
            </div>

            {/* Social Login */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleLoginGG}
                variant="outline"
                className="flex items-center justify-center gap-2 transition border-gray-300 cursor-pointer hover:bg-gray-100 rounded-xl"
              >
                <FcGoogle size={22} />
                <span>Đăng nhập bằng Google</span>
              </Button>
            </div>

            {/* Back to Login */}
            <div className="flex flex-col gap-1 mt-4 text-sm text-center text-gray-500">
              <p>
                Quay lại{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-500 hover:underline"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
