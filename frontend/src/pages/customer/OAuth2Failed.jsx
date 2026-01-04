import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ShieldX } from "lucide-react";

const OAuth2Failed = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const errorMessage = params.get("message") || "OAuth2 unknown error";

  useEffect(() => {
    toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.");
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-slate-100">
      <div className="max-w-md w-full p-8 rounded-2xl shadow-xl bg-white text-center space-y-6 animate-in fade-in zoom-in">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100">
          <ShieldX className="w-8 h-8 text-red-600" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900">
          Đăng nhập thất bại
        </h2>

        {/* Message */}
        <p className="text-gray-600 leading-relaxed">
          {errorMessage ||
            "Không thể xác thực tài khoản Google. Vui lòng thử lại hoặc chọn cách đăng nhập khác."}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <Button
            onClick={() => navigate(-2)}
            variant="outline"
            className="w-full py-3"
          >
            Thử lại
          </Button>

          <Button
            onClick={() => navigate("/", { replace: true })}
            className="w-full py-3 bg-(--color-primary) hover:bg-[#2a4b70] text-white"
          >
            Về trang chủ
          </Button>
        </div>

        {/* Footer hint */}
        <p className="text-xs text-gray-400">
          Nếu lỗi tiếp tục xảy ra, vui lòng liên hệ bộ phận hỗ trợ.
        </p>
      </div>
    </div>
  );
};

export default OAuth2Failed;
