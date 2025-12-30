/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { bookingService } from "@/services/bookingService";

const PaymentSuccess = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get("bookingId");

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getBookingById(bookingId);
      if (res.success && res.data.bookingStatus === "CONFIRMED") {
        setBooking(res.data);
      } else {
        toast.error("Đơn đặt phòng không tồn tại hoặc đã thanh toán.");
        navigate("/");
      }
    } catch (error) {
      toast.error("Lỗi khi tải thông tin đơn đặt phòng.");
      console.log(error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!bookingId) {
      toast.error("Không tìm thấy mã đơn đặt phòng.");
      navigate("/");
      return;
    }

    fetchBooking();
  }, [bookingId]);

  if (loading) return <p className="text-center mt-8">Đang tải...</p>;

  return (
    <div className="min-h-screen bg-[#F1F3F6] flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 text-center p-8 shadow-lg rounded-2xl">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Thanh toán thành công!
        </h2>
        <div className="text-gray-600">
          Mã đơn của bạn:{" "}
          <span className="font-mono font-semibold text-gray-900">
            {booking?.id}
          </span>
        </div>
        <div className="text-gray-600">
          Khách hàng:{" "}
          <span className="font-semibold">{booking?.contactName}</span>
        </div>
        {user ? (
          <Button
            onClick={() => navigate("/member/booking-history")}
            className="w-full bg-[#1E2A38] hover:bg-[#2B3B4E] cursor-pointer"
          >
            Xem lịch sử đơn đặt phòng
          </Button>
        ) : (
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-[#1E2A38] hover:bg-[#2B3B4E] cursor-pointer"
          >
            Quay lại trang chủ
          </Button>
        )}
      </Card>
    </div>
  );
};

export default PaymentSuccess;
