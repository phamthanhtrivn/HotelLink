/* eslint-disable react-hooks/purity */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  CalendarCheck,
  CalendarX,
  Phone,
  Mail,
  User,
  Hotel,
  CreditCard,
} from "lucide-react";
import {
  statusColorMap,
  statusLabelMap,
} from "@/constants/BookingStatusConstants";
import { formatDateTimeForCustomer } from "@/helpers/dateHelpers";
import { formatVND } from "@/helpers/currencyFormatter";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { bookingService } from "@/services/bookingService";

const BookingDetailDialog = ({
  open,
  onOpenChange,
  booking,
  onBookingUpdated,
}) => {
  if (!booking) return null;

  const roomType = booking.room?.roomType;
  const isBanCancel =
    new Date(booking.checkIn).getTime() - Date.now() < 24 * 60 * 60 * 1000;
  const hasCancelled = booking.bookingStatus === "CANCELLED";

  const handleCancelledBooking = async () => {
    try {
      const res = await bookingService.cancelBookingByCustomer(booking.id);
      if (res.success) {
        onBookingUpdated();
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Hủy đơn đặt phòng thất bại!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Hotel className="w-5 h-5" />
            Chi tiết đơn đặt phòng
          </DialogTitle>
        </DialogHeader>

        {/* Trạng thái */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Mã đặt phòng: <b>{booking.id}</b>
          </span>

          <Badge
            className={`${statusColorMap[booking.bookingStatus]} px-3 py-1`}
          >
            {statusLabelMap[booking.bookingStatus]}
          </Badge>
        </div>

        {/* Thông tin phòng */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-muted-foreground">Loại phòng</p>
            <p className="font-medium">{roomType?.name}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Số phòng</p>
            <p className="font-medium">{booking.room?.roomNumber}</p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <CalendarCheck className="w-4 h-4" />
            Check-in: {formatDateTimeForCustomer(booking.checkIn)}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <CalendarX className="w-4 h-4" />
            Check-out: {formatDateTimeForCustomer(booking.checkOut)}
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <div className="border-t pt-4 mt-4 space-y-2">
          <h4 className="font-medium">Thông tin liên hệ</h4>

          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4" />
            {booking.contactName}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4" />
            {booking.contactPhone}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4" />
            {booking.contactEmail}
          </div>
        </div>

        {/* Thanh toán */}
        <div className="border-t pt-4 mt-4 space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Thanh toán
          </h4>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <p>Tổng tiền:</p>
            <p className="text-right font-medium">{formatVND(booking.total)}</p>

            <p>Giảm giá:</p>
            <p className="text-right text-green-600">
              -{formatVND(booking.firstTimeDiscount + booking.pointDiscount)}
            </p>

            <p>VAT:</p>
            <p className="text-right">{formatVND(booking.vatFee)}</p>

            <p className="font-medium">Thanh toán:</p>
            <p className="text-right font-semibold">
              {formatVND(booking.totalPayment)}
            </p>
          </div>
        </div>

        {isBanCancel && (
          <p className="text-xs text-gray-500 mt-1">
            <span className="text-red-600">* </span>Không thể hủy khi còn dưới
            24 giờ trước thời điểm check-in
          </p>
        )}

        {hasCancelled && (
          <p className="text-xs text-gray-500 mt-1">
            <span className="text-red-600">* </span>Không thể hủy khi còn dưới
            24 giờ trước thời điểm check-in
          </p>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            onClick={handleCancelledBooking}
            disabled={isBanCancel || hasCancelled}
            className={`bg-red-600 hover:bg-red-700 text-white cursor-pointer ${
              isBanCancel || hasCancelled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Hủy đặt phòng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailDialog;
