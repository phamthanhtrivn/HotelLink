/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { User, Phone, Mail, Award, Info, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "@/context/AuthContext";
import { customerService } from "@/services/customerService";
import { Label } from "@/components/ui/Label";
import { Link } from "react-router-dom";

const AccountInfo = () => {
  const { user } = useContext(AuthContext);
  const [loading, setIsLoading] = useState(false);
  const [acc, setAcc] = useState(user);
  const [updateInfoData, setUpdateInfoData] = useState({
    fullName: acc?.fullName || "",
    phone: acc?.phone || "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
  });
  const fullNameRef = useRef();
  const phoneRef = useRef();

  const handleFetchUser = async () => {
    try {
      const res = await customerService.getCustomerById(user.userId);
      if (res.success) {
        setAcc(res.data);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Lấy thông tin người dùng thất bại!");
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const customerData = {
        id: acc.userId,
        fullName: updateInfoData.fullName,
        phone: updateInfoData.phone,
      };
      const res = await customerService.updateInfo(customerData);
      if (res.success) {
        toast.success(res.message);
        setAcc(res.data);
      } else {
        const newErrors = {
          fullName: "",
          phone: "",
        };

        if (res.data.fullName) {
          newErrors.fullName = res.data.fullName;
        }
        if (res.data.phone) {
          newErrors.phone = res.data.phone;
        }

        setErrors(newErrors);

        if (newErrors.fullName) {
          fullNameRef.current.focus();
          return;
        }
        if (newErrors.phone) {
          phoneRef.current.focus();
          return;
        }
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Cập nhật thông tin thất bại!");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchUser();
  }, []);

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 pt-10 md:pt-16 pb-16 md:pb-20">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200 mx-4 md:mx-0">
        {/* Header */}
        <div className="bg-(--color-primary) px-6 md:px-10 py-6 md:py-8 border-b">
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            Thông tin cá nhân
          </h2>
          <p className="text-gray-300 text-sm md:text-base mt-2">
            Cập nhật và quản lý thông tin tài khoản của bạn
          </p>
        </div>

        {/* Form */}
        <div className="px-6 md:px-10 py-8 md:py-12">
          <div className="space-y-6 md:space-y-8">
            {/* Họ tên */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm md:text-base font-semibold text-(--color-primary)">
                <User size={18} className="text-(--color-background)" />
                Họ và Tên <span className="text-red-500">*</span>
              </Label>
              <Input
                value={updateInfoData.fullName}
                onChange={(e) =>
                  setUpdateInfoData({
                    ...updateInfoData,
                    fullName: e.target.value,
                  })
                }
                ref={fullNameRef}
                className="w-full px-4 md:px-5 py-3 rounded-xl border border-gray-300
              focus:border-(--color-background)
              focus:ring-2 focus:ring-background/40"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm md:text-base font-semibold text-(--color-primary)">
                <Phone size={18} className="text-(--color-background)" />
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <Input
                value={updateInfoData.phone}
                onChange={(e) =>
                  setUpdateInfoData({
                    ...updateInfoData,
                    phone: e.target.value,
                  })
                }
                ref={phoneRef}
                className="w-full px-4 md:px-5 py-3 rounded-xl border border-gray-300
              focus:border-(--color-background)
              focus:ring-2 focus:ring-background/40"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm md:text-base font-semibold text-(--color-primary)">
                <Mail size={18} className="text-(--color-background)" />
                Email
              </Label>
              <p className="w-full px-4 md:px-5 py-3 rounded-xl bg-gray-50 text-gray-700 text-sm md:text-base">
                {acc?.email}
              </p>
            </div>

            {/* Điểm tích lũy */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-primary/5 px-4 md:px-6 py-4 rounded-xl">
              <div className="flex items-center gap-2">
                <Award size={22} className="text-(--color-background)" />
                <span className="text-(--color-primary) font-semibold text-base md:text-lg">
                  Điểm tích lũy:
                </span>
              </div>
              <span className="text-(--color-background) font-bold text-lg md:text-xl">
                {acc?.points}
              </span>
              <span className="text-gray-600 text-sm md:text-base">điểm</span>
            </div>

            {/* Note chính sách điểm */}
            <div className="bg-background/10 border-l-4 border-(--color-background) px-4 py-3 rounded-md">
              <div className="flex items-start gap-3">
                <Info
                  size={22}
                  className="text-(--color-background) mt-0.5 shrink-0"
                />

                <p className="text-sm text-(--color-primary) leading-relaxed">
                  <span className="block">
                    Điểm tích lũy có thể được sử dụng để giảm giá tiền đặt
                    phòng.
                  </span>

                  <Link
                    className="inline-block mt-1 font-semibold underline cursor-pointer
                   hover:text-(--color-background)"
                    to="/points-policy"
                  >
                    Xem chính sách sử dụng điểm
                  </Link>
                </p>
              </div>
            </div>

            {/* Button */}
            <div className="pt-4 md:pt-6">
              <Button
                disabled={loading}
                onClick={handleUpdate}
                className="w-full bg-(--color-primary) hover:bg-[#2a4b70]
              text-white font-bold py-3 md:py-4 rounded-xl
              transition-all duration-200
              shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 text-white" />
                    Đang lưu thông tin...
                  </>
                ) : (
                  "Lưu thông tin"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
