import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BOOKING_SOURCE_COLOR_MAP,
  BOOKING_SOURCE_LABEL_MAP,
  statusColorMap,
  statusLabelMap,
} from "@/constants/BookingStatusConstants";
import { formatDateTimeForCustomer } from "@/helpers/dateHelpers";
import { formatVND } from "@/helpers/currencyFormatter";

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm text-muted-foreground">{label}</span>
    <div className="font-medium">{children ?? "—"}</div>
  </div>
);

const Section = ({ title, children, cols = 2 }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">{title}</h3>
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-4`}>
      {children}
    </div>
  </div>
);

export const BookingDetailModal = ({
  title,
  open,
  onClose,
  data,
  services,
}) => {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* 1. Thông tin đơn & khách */}
          <Section title="Thông tin đơn & khách hàng">
            <Field label="Mã đơn">{data.id}</Field>
            <Field label="Khách hàng">{data.contactName}</Field>
            <Field label="SĐT">{data.contactPhone}</Field>
            <Field label="Email">{data.contactEmail}</Field>
            <Field label="Phòng">{data.room?.roomNumber}</Field>
            <Field label="Nguồn đặt">
              <Badge className={BOOKING_SOURCE_COLOR_MAP[data.bookingSource]}>
                {BOOKING_SOURCE_LABEL_MAP[data.bookingSource]}
              </Badge>
            </Field>
          </Section>

          {/* 2. Trạng thái & thời gian */}
          <Section title="Trạng thái & thời gian">
            <Field label="Trạng thái">
              <Badge className={statusColorMap[data.bookingStatus]}>
                {statusLabelMap[data.bookingStatus]}
              </Badge>
            </Field>
            <Field label="Thanh toán">
              <Badge
                className={
                  data.paid
                    ? "bg-green-200 text-green-700"
                    : "bg-yellow-200 text-yellow-700"
                }
              >
                {data.paid ? "Đã thanh toán" : "Chưa thanh toán"}
              </Badge>
            </Field>
            <Field label="Nhận phòng dự kiến">
              {formatDateTimeForCustomer(data.checkIn)}
            </Field>
            <Field label="Trả phòng dự kiến">
              {formatDateTimeForCustomer(data.checkOut)}
            </Field>
            <Field label="Nhận phòng thực tế">
              {formatDateTimeForCustomer(data.actualCheckIn) || "-"}
            </Field>
            <Field label="Trả phòng thực tế">
              {formatDateTimeForCustomer(data.actualCheckOut) || "-"}
            </Field>
            <Field label="Số đêm">{data.nights}</Field>
          </Section>

          {/* 3. Chi tiết tiền */}
          <Section title="Chi tiết tiền" cols={2}>
            <Field label="Giá phòng / đêm">{formatVND(data.roomPrice)}</Field>
            <Field label="VAT">{formatVND(data.vatFee)}</Field>
            <Field label="Giảm giá lần đầu">
              {formatVND(data.firstTimeDiscount)}
            </Field>
            <Field label="Giảm giá điểm">{formatVND(data.pointDiscount)}</Field>
            <Field label="Dịch vụ bổ sung">
              {formatVND(data.extraServices)}
            </Field>
            <Field label="Tổng tiền">{formatVND(data.total)}</Field>
            <Field label="Tổng thanh toán">
              {formatVND(data.totalPayment)}
            </Field>
          </Section>

          {/* 4. Dịch vụ sử dụng */}
          <Section title="Dịch vụ sử dụng" cols={1}>
            {services && services.length > 0 ? (
              <div className="space-y-3">
                {services.map((item, index) => (
                  <div
                    key={item.bookingServiceId?.serviceId || index}
                    className="flex justify-between items-center border rounded-lg p-4"
                  >
                    {/* Thông tin dịch vụ */}
                    <div className="space-y-1">
                      <div className="font-medium">{item.service?.name}</div>

                      <div className="text-sm text-muted-foreground">
                        Loại dịch vụ: {item.service?.serviceType}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Số lượng: {item.quantity}
                      </div>
                    </div>

                    {/* Giá */}
                    <div className="text-right space-y-1">
                      <div className="text-sm">
                        Đơn giá: {formatVND(item.price)}
                      </div>

                      <div className="font-semibold text-primary">
                        {formatVND(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground italic">
                Không có dịch vụ bổ sung
              </span>
            )}
          </Section>

          {/* 4. Ghi chú & hệ thống */}
          <Section title="Ghi chú & hệ thống">
            <Field label="Ghi chú">{data.notes || "-"}</Field>
            <Field label="Người tạo">{data.createdBy?.email || "-"}</Field>
            <Field label="Ngày tạo">
              {formatDateTimeForCustomer(data.createdAt)}
            </Field>
            <Field label="Cập nhật bởi">{data.updatedBy?.email}</Field>
            <Field label="Ngày cập nhật">
              {formatDateTimeForCustomer(data.updatedAt)}
            </Field>
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
