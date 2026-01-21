/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { bookingService } from "@/services/bookingService";
import { formatVND } from "@/helpers/currencyFormatter";
import { formatDateTimeForCustomer } from "@/helpers/dateHelpers";
import { Badge } from "@/components/ui/badge";
import {
  statusColorMap,
  statusLabelMap,
} from "@/constants/BookingStatusConstants";

/* ---- Small reusable field ---- */
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm text-muted-foreground">{label}</span>
    <div className="font-medium">{children ?? "—"}</div>
  </div>
);

const PreviewCheckoutModal = ({ open, onClose, booking, userId, reload }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const fetchPreview = async () => {
    setLoading(true);
    try {
      const res = await bookingService.previewCheckOut(booking.id);
      if (res.success) {
        setPreview(res.data);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể xem trước checkout");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await bookingService.checkOutBooking(booking.id, { userId });
      if (res.success) {
        toast.success(res.message);
        onClose();
        reload();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Check-out thất bại");
    }
  };

  useEffect(() => {
    if (open) fetchPreview();
  }, [open]);

  const servicesTotal = useMemo(() => {
    if (!preview?.usedServices) return 0;
    return preview.usedServices.reduce(
      (sum, s) => sum + s.price * s.quantity,
      0,
    );
  }, [preview]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Xác nhận trả phòng</DialogTitle>
        </DialogHeader>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin w-6 h-6" />
          </div>
        )}

        {/* ===== 1. BOOKING SUMMARY ===== */}
        {!loading && booking && preview && (
          <div className="rounded-xl border bg-slate-50 p-5 mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Thông tin đơn</h3>

              <div className="flex items-center gap-2">
                <Badge className={statusColorMap[booking.bookingStatus]}>
                  {statusLabelMap[booking.bookingStatus]}
                </Badge>

                <Badge
                  className={
                    booking.paid
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {booking.paid ? "Đã thanh toán" : "Chưa thanh toán"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <Field label="Mã đơn">{booking.id}</Field>
              <Field label="Phòng">{booking.room?.roomNumber}</Field>

              <Field label="Khách hàng">
                {booking.customer?.fullName || booking.contactName}
              </Field>

              <Field label="Số đêm">{booking.nights}</Field>

              <Field label="Check-in">
                {formatDateTimeForCustomer(booking.checkIn)}
              </Field>

              <Field label="Dự kiến check-out">
                {formatDateTimeForCustomer(booking.checkOut)}
              </Field>

              {/* ===== TIỀN ===== */}
              <Field label="Giá phòng / đêm">
                {formatVND(booking.roomPrice)}
              </Field>

              <Field label="Tiền phòng">
                {formatVND(booking.roomPrice * booking.nights)}
              </Field>

              <Field label="VAT">{formatVND(booking.vatFee)}</Field>

              <Field label="Giảm giá (lần đầu + điểm tích lũy)">
                {formatVND(booking.firstTimeDiscount + booking.pointDiscount)}
              </Field>

              <Field label="Tổng tiền">
                <span className="font-semibold">
                  {formatVND(booking.totalPayment)}
                </span>
              </Field>

              <Field label="Cần thanh toán">
                <span className="font-semibold text-red-600">
                  {booking.paid
                    ? formatVND(
                        servicesTotal + preview?.lateCheckOutService.unitPrice,
                      )
                    : formatVND(
                        booking.totalPayment +
                          servicesTotal +
                          preview?.lateCheckOutService.unitPrice,
                      )}
                </span>
              </Field>
            </div>
          </div>
        )}

        {/* ===== 2. SERVICES & FEES ===== */}
        {!loading && preview && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dịch vụ & phụ thu</h3>

            {preview.usedServices.map((bs) => (
              <div
                key={bs.bookingServiceId.serviceId}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">{bs.service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    SL: {bs.quantity} × {formatVND(bs.price)}
                  </p>
                </div>

                <div className="font-semibold">
                  {formatVND(bs.price * bs.quantity)}
                </div>
              </div>
            ))}

            {preview.lateCheckOutService && (
              <div className="flex justify-between rounded-lg border border-yellow-300 bg-yellow-50 p-4">
                <span className="font-semibold text-yellow-700">
                  Phụ thu checkout trễ
                </span>
                <span className="font-semibold text-yellow-700">
                  {formatVND(preview.lateCheckOutService.unitPrice)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ===== 3. TOTAL ===== */}
        {!loading && preview && (
          <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-100 p-5">
            <span className="text-base font-semibold text-gray-700">
              Tổng tiền dịch vụ
            </span>

            <span className="text-2xl font-bold text-red-600">
              {formatVND(
                servicesTotal + (preview.lateCheckOutService?.unitPrice || 0),
              )}
            </span>
          </div>
        )}

        {/* Footer */}
        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>

          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={handleCheckOut}
          >
            Xác nhận trả phòng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewCheckoutModal;
