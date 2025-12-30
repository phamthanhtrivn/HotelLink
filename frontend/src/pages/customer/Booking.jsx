/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import VNPayLogo from "../../assets/VNPay_Logo.svg";
import MomoLogo from "../../assets/MoMo_Logo.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  BedDouble,
  Calendar,
  FileText,
  Loader2,
  Receipt,
  User,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  calcStayNights,
  formatDateTimeForCustomer,
} from "@/helpers/dateHelpers";
import { toast } from "react-toastify";
import { roomTypeService } from "@/services/roomTypeService";
import { formatVND } from "@/helpers/currencyFormatter";
import { bookingService } from "@/services/bookingService";
import { AuthContext } from "@/context/AuthContext";
import { customerService } from "@/services/customerService";
import HotelPolicyModal from "@/components/common/customer/HotelPolicyModal";

const Booking = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const roomTypeFilters = useSelector((state) => state.roomTypeSearch);
  const roomTypeId = location.state?.roomTypeId;
  const [openPolicy, setOpenPolicy] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [name, setName] = useState(user ? user.fullName : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [phone, setPhone] = useState(user ? user.phone : "");
  const [notes, setNotes] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [roomType, setRoomType] = useState(null);
  const [totalBooking, setTotalBooking] = useState(0);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    agreeTerms: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const nights = calcStayNights(
    roomTypeFilters.checkIn.toString(),
    roomTypeFilters.checkOut.toString()
  );
  const totalPrice = roomType ? roomType.price * nights : 0;

  const firstTimeDiscount =
    user && totalBooking === 0 && roomType ? totalPrice * 0.1 : 0;

  const pointDiscount =
    user && customer && customer.points >= 10 && roomType ? roomType.price : 0;

  const subTotal = totalPrice - firstTimeDiscount - pointDiscount;

  const vat = subTotal > 0 ? subTotal * 0.08 : 0;

  const totalPayment = subTotal + vat;

  const handleFetchRoomTypeDetails = async () => {
    try {
      const res = await roomTypeService.getRoomTypeById(roomTypeId);
      if (res.success) setRoomType(res.data);
      else toast.error(res.message);
    } catch {
      toast.error("Lấy thông tin loại phòng thất bại!");
    }
  };

  const handleFetchTotalBooking = async () => {
    try {
      const res = await bookingService.getTotalBookingByCustomerId(user.userId);
      if (res.success) setTotalBooking(res.data);
    } catch {
      toast.error("Lấy tổng số đặt phòng thất bại!");
    }
  };

  const handleBooking = async () => {
    setErrors({ name: "", email: "", phone: "", agreeTerms: "" });
    setIsLoading(true);
    try {
      const bookingRequest = {
        roomTypeId: roomTypeId,
        checkIn: roomTypeFilters.checkIn.slice(0, 19),
        checkOut: roomTypeFilters.checkOut.slice(0, 19),
        nights,
        userId: user ? user.userId : null,
        name,
        email,
        phone,
        roomPrice: roomType.price,
        notes,
        pointDiscount,
        firstTimeDiscount,
        total: totalPrice,
        vatFee: vat,
        totalPayment,
      };

      const res = await bookingService.createBookingByCustomer(bookingRequest);
      if (res.success) {
        if (totalPayment === 0) {
          if (user) {
            toast.success("Đặt phòng thành công!");
            navigate("/member/booking-history");
          }
        } else {
          toast.success(
            "Đặt phòng thành công! Vui lòng thanh toán để hoàn tất."
          );
          navigate("/payment", { state: { bookingId: res.data.id } });
        }
      } else {
        setErrors({ name: "", email: "", phone: "", agreeTerms: "" });

        if (res.data && res.data.name) {
          setErrors((prev) => ({ ...prev, name: res.data.name }));
        }

        if (res.data && res.data.email) {
          setErrors((prev) => ({ ...prev, email: res.data.email }));
        }

        if (res.data && res.data.phone) {
          setErrors((prev) => ({ ...prev, phone: res.data.phone }));
        }

        if (!agreeTerms) {
          setErrors((prev) => ({
            ...prev,
            agreeTerms: "Vui lòng đồng ý với điều khoản.",
          }));
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Đặt phòng thất bại! Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchCustomerInfo = async () => {
    try {
      const res = await customerService.getCustomerById(user.userId);
      if (res.success) {
        setCustomer(res.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Lấy thông tin khách hàng thất bại!");
    }
  };

  useEffect(() => {
    if (user) handleFetchCustomerInfo();
  }, [user]);

  useEffect(() => {
    if (roomTypeId) handleFetchRoomTypeDetails();
  }, [roomTypeId]);

  useEffect(() => {
    if (user) handleFetchTotalBooking();
  }, [user]);

  useEffect(() => {
    if (roomTypeFilters.flow === "IDLE") {
      navigate("/room-types", { replace: true });
    }
  }, [roomTypeFilters.flow]);

  return (
    <div className="min-h-screen bg-linear-to-b from-black/5 to-transparent">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <Card className="rounded-[28px] shadow-2xl bg-white overflow-hidden pt-0">
            <CardHeader className="bg-linear-to-r bg-(--color-primary) py-5">
              <CardTitle className="flex items-center gap-2 text-white tracking-wide">
                <User className="w-5 h-5" />
                Thông tin khách hàng
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl focus:ring-(--color-primary)"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="rounded-xl focus:ring-(--color-primary)"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl focus:ring-(--color-primary)"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Ghi chú cho khách sạn
                </Label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border px-4 py-3 text-sm focus:ring-2 focus:ring-(--color-primary)"
                />
              </div>

              <Separator className="bg-black/10" />

              <div className="flex items-start gap-3">
                <Checkbox
                  checked={agreeTerms}
                  onCheckedChange={setAgreeTerms}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground">
                  Tôi đồng ý với{" "}
                  <span
                    onClick={() => setOpenPolicy(true)}
                    className="text-(--color-primary) underline cursor-pointer"
                  >
                    điều khoản và quy định của khách sạn
                  </span>
                  <span className="text-red-500"> *</span>
                </p>
                {errors.agreeTerms && (
                  <p className="text-sm text-red-500">{errors.agreeTerms}</p>
                )}
              </div>

              <HotelPolicyModal
                open={openPolicy}
                onOpenChange={setOpenPolicy}
              />

              <Separator className="bg-black/10" />

              <div className="flex items-center justify-between">
                <Label className="text-lg font-medium">
                  Phương thức thanh toán
                </Label>
                <div className="flex gap-4 opacity-90">
                  <img src={VNPayLogo} className="h-10" />
                  <img src={MomoLogo} className="h-10" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  disabled={isLoading}
                  onClick={handleBooking}
                  className="cursor-pointer px-14 py-6 rounded-2xl bg-(--color-primary) shadow-xl hover:bg-[#2a4b70] transition"
                >
                  {isLoading ? (
                    <div className="flex gap-3 items-center justify-center">
                      <Loader2 className="animate-spin" />
                      <p>Đang xử lý</p>
                    </div>
                  ) : (
                    "Tiến hành đặt phòng"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <Card className="sticky top-6 rounded-[28px] shadow-2xl bg-white overflow-hidden pt-0">
            <CardHeader className="bg-(--color-primary) py-5">
              <CardTitle className="flex items-center gap-2 text-white tracking-wide">
                <Receipt className="w-5 h-5" />
                Thông tin đặt phòng
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5 pt-6">
              <div className="h-44 rounded-2xl overflow-hidden">
                <img
                  src={roomType?.pictures[0]}
                  alt={roomType?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-2 font-semibold text-(--color-primary)">
                <BedDouble className="w-4 h-4" />
                {roomType?.name}
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Check-in
                  </span>
                  <span>
                    {formatDateTimeForCustomer(roomTypeFilters.checkIn)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Check-out
                  </span>
                  <span>
                    {formatDateTimeForCustomer(roomTypeFilters.checkOut)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Người lớn</span>
                  <span>{roomTypeFilters.adults}</span>
                </div>

                {roomTypeFilters.children > 0 && (
                  <div className="flex justify-between">
                    <span>Trẻ em</span>
                    <span>{roomTypeFilters.children}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Giá / 1 đêm</span>
                  <span>{roomType && formatVND(roomType.price)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Số đêm lưu trú</span>
                  <span>{nights}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{formatVND(totalPrice)}</span>
                </div>
              </div>

              <Separator />

              {user && totalBooking === 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá cho đơn đầu tiên (10%)</span>
                  <span>- {formatVND(firstTimeDiscount)}</span>
                </div>
              )}

              {user && customer && customer.points >= 10 && (
                <div className="flex justify-between text-green-600">
                  <span>Ưu đãi điểm tích lũy</span>
                  <span>- {formatVND(pointDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>VAT (8%)</span>
                <span>{formatVND(vat)}</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center border border-red-200 bg-red-50 rounded-2xl p-4">
                <span className="text-lg font-semibold text-red-600">
                  Tổng thanh toán
                </span>
                <span className="text-2xl font-bold text-red-600">
                  {formatVND(totalPayment)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Booking;
