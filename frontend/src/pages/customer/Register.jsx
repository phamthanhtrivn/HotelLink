/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import bg01 from "../../assets/Hotel-1.jpg";
import bg02 from "../../assets/Hotel-1.jpg";
import ImgSlider from "@/components/common/customer/ImgSlider";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { authService } from "@/services/authService";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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

  const handleRegister = async () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    };

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu không trùng khớp!";
    }

    setErrors(newErrors);
    if (newErrors.confirmPassword) {
      confirmPasswordRef.current.focus();
      return;
    }

    setIsLoading(true);
    try {
      const registerRequest = {
        fullName: name,
        phone,
        email,
        password,
      };
      const res = await authService.register(registerRequest);
      if (res.success) {
        toast.success(res.message);
        navigate("/login");
      } else {
        const newErrors = {
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        };

        if (res.data.fullName) {
          newErrors.name = res.data.fullName;
        }
        if (res.data.email) {
          newErrors.email = res.data.email;
        }
        if (res.data.phone) {
          newErrors.phone = res.data.phone;
        }
        if (res.data.password) {
          newErrors.password = res.data.password;
        }

        setErrors(newErrors);

        if (newErrors.name) {
          nameRef.current.focus();
          return;
        }
        if (newErrors.phone) {
          phoneRef.current.focus();
          return;
        }
        if (newErrors.email) {
          emailRef.current.focus();
          return;
        }
        if (newErrors.password) {
          passwordRef.current.focus();
          return;
        }
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.message || "Đăng ký thất bại!");
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
      {/* RIGHT REGISTER FORM */}
      <motion.div
        className="relative z-10 flex items-center justify-center w-full px-6 py-10 bg-white shadow-2xl md:w-5/12 lg:w-5/12 xl:w-5/12"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="w-full max-w-sm border border-gray-200 shadow-lg rounded-2xl backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-(--color-primary) tracking-wide">
              Đăng Ký
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Họ và tên */}
            <div className="relative space-y-2 group">
              <Label htmlFor="fullName">
                Họ và tên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Nhập họ và tên của bạn"
                className="focus-visible:ring-(--color-primary) rounded-xl"
                value={name}
                onChange={(e) => setName(e.target.value)}
                ref={nameRef}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="relative space-y-2 group">
              <Label htmlFor="phone">
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Nhập số điện thoại"
                className="focus-visible:ring-(--color-primary) rounded-xl"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                ref={phoneRef}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div className="relative space-y-2 group">
              <Label htmlFor="email">
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

            {/* Mật khẩu */}
            <div className="relative space-y-2 group">
              <Label htmlFor="password">
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
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="relative space-y-2 group">
              <Label htmlFor="confirmPassword">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  className="focus-visible:ring-[var(--color-primary)] rounded-xl pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  ref={confirmPasswordRef}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 flex items-center text-gray-500 right-3 hover:text-gray-700"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Button Register */}
            <Button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full bg-[var(--color-primary)] cursor-pointer font-semibold hover:bg-[#2a4b70] transition-colors duration-300 rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 text-white" />
                  Đang đăng ký...
                </>
              ) : (
                "Đăng Ký"
              )}
            </Button>

            {/* Separator */}
            <div className="flex items-center gap-2 my-2">
              <Separator className="flex-1" />
              <span className="text-sm text-gray-500">hoặc</span>
              <Separator className="flex-1" />
            </div>

            {/* Social Register */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleLoginGG}
                variant="outline"
                className="flex items-center justify-center gap-2 transition border-gray-300 cursor-pointer hover:bg-gray-100 rounded-xl"
              >
                <FcGoogle size={22} />
                <span>Đăng ký bằng Google</span>
              </Button>
            </div>

            {/* Login link */}
            <p className="mt-4 text-sm text-center text-gray-500">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-500 hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
