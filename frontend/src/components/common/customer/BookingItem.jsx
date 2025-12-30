import { BedDouble, Users, CalendarCheck, CalendarX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  statusColorMap,
  statusLabelMap,
} from "@/constants/BookingStatusConstants";
import { Button } from "@/components/ui/button";
import { formatDateTimeForCustomer } from "@/helpers/dateHelpers";
import { useNavigate } from "react-router-dom";
import BookingDetailDialog from "./BookingDetailDialog";
import { useState } from "react";
import BookingReviewDialog from "./BookingReviewDialog";

const BookingItem = ({ booking, user, onBookingUpdated  }) => {
  const navigate = useNavigate();
  const [openDetail, setOpenDetail] = useState(false);
  const [openReview, setOpenReview] = useState(false);

  const roomType = booking.room?.roomType;
  const image = roomType.pictures.length > 0 && roomType.pictures[0];
  const statusText = statusLabelMap[booking.bookingStatus];
  const statusColor = statusColorMap[booking.bookingStatus];

  return (
    <div className="bg-gray-100 grid grid-cols-12 items-center gap-4 py-6 px-4 hover:bg-gray-200 transition-colors rounded-xl">
      {/* Phòng */}
      <div className="col-span-12 md:col-span-5 flex items-start gap-4">
        <img
          src={image}
          alt={roomType?.name}
          className="w-32 h-24 object-cover rounded-lg border"
        />

        <div>
          <h3 className="text-lg font-medium text-foreground">
            {roomType?.name || "Loại phòng không xác định"}
          </h3>

          <div className="text-sm text-muted-foreground flex items-center mt-1">
            <BedDouble className="w-4 h-4 mr-1" />
            {roomType?.area || "—"} m²
          </div>

          <div className="text-sm text-muted-foreground flex items-center mt-1">
            <Users className="w-4 h-4 mr-1" />
            {roomType?.guestCapacity || 1} khách
          </div>
        </div>
      </div>

      {/* Thời gian */}
      <div className="col-span-12 md:col-span-3 text-sm text-muted-foreground space-y-1">
        <div className="flex items-center gap-1">
          <CalendarCheck className="w-4 h-4" />
          <span>Check-in: {formatDateTimeForCustomer(booking.checkIn)}</span>
        </div>

        <div className="flex items-center gap-1">
          <CalendarX className="w-4 h-4" />
          <span>Check-out: {formatDateTimeForCustomer(booking.checkOut)}</span>
        </div>
      </div>

      {/* Trạng thái */}
      <div className="col-span-12 md:col-span-2 text-right">
        <Badge className={`${statusColor} px-3 py-1 rounded-full`}>
          {statusText}
        </Badge>
      </div>

      {/* Hành động (chỉ UI, chưa bắt sự kiện) */}
      <div className="col-span-12 md:col-span-2 flex flex-col items-end gap-3">
        <Button
          onClick={() => setOpenDetail(true)}
          className="bg-(--color-primary) hover:bg-[#2a4b70] cursor-pointer min-w-27.5 text-center border border-border px-4 py-1.5 rounded-full text-sm transition"
        >
          Chi tiết
        </Button>

        {booking.bookingStatus === "PENDING" && (
          <Button
            onClick={() =>
              navigate("/payment", { state: { bookingId: booking.id } })
            }
            className="bg-white cursor-pointer min-w-27.5 text-center border border-yellow-300 px-4 py-1.5 rounded-full text-sm text-yellow-700 hover:bg-yellow-100 transition"
          >
            Thanh toán
          </Button>
        )}

        {booking.bookingStatus === "COMPLETED" && (
          <Button
            onClick={() => setOpenReview(true)}
            className="bg-white cursor-pointer min-w-27.5 text-center border border-emerald-300 px-4 py-1.5 rounded-full text-sm text-emerald-700 hover:bg-emerald-100 transition"
          >
            Đánh giá
          </Button>
        )}
      </div>

      <BookingDetailDialog
        open={openDetail}
        onOpenChange={setOpenDetail}
        booking={booking}
        onBookingUpdated={onBookingUpdated}
      />

      <BookingReviewDialog
        open={openReview}
        onOpenChange={setOpenReview}
        bookingId={booking.id}
        customerId={user.userId}
      />
    </div>
  );
};

export default BookingItem;
