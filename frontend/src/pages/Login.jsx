/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import bg01 from "../assets/Hotel-1.jpg";
import bg02 from "../assets/Hotel-2.png";
import ImgSlider from "@/components/common/customer/ImgSlider";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "@/context/AuthContext";
import { authService } from "@/services/authService";

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

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

  const handleLogin = async () => {
    setIsLoading(true);
    setErrors({ email: "", password: "" });

    try {
      const loginRequest = {
        email,
        password,
      };
      const res = await authService.login(loginRequest);

      if (res.success) {
        toast.success(res.message);

        login(res.data.token);

        if (res.data.role === "ADMIN") {
          navigate("/admin");
        } else if (res.data.role === "STAFF") {
          navigate("/staff");
        } else {
          navigate("/");
        }
      } else if (!res.success && res.data) {
        const newErrors = { email: "", password: "" };
        if (res.data.email) {
          newErrors.email = res.data.email;
        }
        if (res.data.password) {
          newErrors.password = res.data.password;
        }

        setErrors(newErrors);

        if (newErrors.email) {
          emailRef.current.focus();
          return;
        }

        if (newErrors.password) {
          passwordRef.current.focus();
          return;
        }
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginGG = () => {
    window.location.href = `${
      import.meta.env.VITE_BASE_API_URL
    }/oauth2/authorization/google`;
  };

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

      {/* RIGHT LOGIN FORM */}
      <motion.div
        className="relative z-10 flex items-center justify-center w-full px-6 py-10 bg-white shadow-2xl md:w-5/12 lg:w-5/12 xl:w-5/12"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="w-full max-w-sm border border-gray-200 shadow-lg rounded-2xl backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-(--color-primary) tracking-wide">
              Đăng Nhập
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ref={emailRef}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative space-y-2 group">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 group-focus-within:text-(--color-primary) transition-colors"
              >
                Mật khẩu <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  className="focus-visible:ring-(--color-primary) rounded-xl pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  ref={passwordRef}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 flex items-center text-gray-500 right-3 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Button Login */}
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className={`w-full bg-(--color-primary) font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer
    ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#2a4b70]"}`}
            >
              {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
              {isLoading ? "Đang tải..." : "Đăng Nhập"}
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

            {/* Register + Forgot password links */}
            <div className="flex flex-col gap-1 mt-4 text-sm text-center text-gray-500">
              <p>
                Bạn chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-500 hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
              <p>
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-500 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
