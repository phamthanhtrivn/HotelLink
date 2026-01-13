import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  Phone,
  User,
  Mail,
  FileText,
  CreditCard,
} from "lucide-react";
import { calcStayNights } from "@/helpers/dateHelpers";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";

const CreateBookingModal = ({
  open,
  onClose,
  room,
  checkIn,
  checkOut,
  onSubmit,
  loading,
  errors,
}) => {
  const nights = useMemo(
    () => calcStayNights(checkIn.toString(), checkOut.toString()),
    [checkIn, checkOut]
  );
  const roomPrice = useMemo(() => room?.price || 0, [room]);
  const total = useMemo(() => roomPrice * nights, [roomPrice, nights]);
  const vatFee = useMemo(() => total * 0.08, [total]);
  const totalPayment = useMemo(() => total + vatFee, [total, vatFee]);

  const [form, setForm] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    notes: "",
    bookingSource: "FRONT_DESK",
    paid: false,
  });

  const FieldError = ({ message }) => {
    if (!message) return null;
    return <p className="mt-1 text-xs text-red-500">{message}</p>;
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...form,
      roomId: room.roomId,
      checkIn,
      checkOut,
      roomPrice,
      nights,
      vatFee,
      total,
      totalPayment,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Tạo đơn phòng {room?.roomNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thông tin khách hàng */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Thông tin khách hàng
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className={`pl-9 ${
                    errors?.contactName ? "border-red-500" : ""
                  }`}
                  placeholder="Họ và tên"
                  value={form.contactName}
                  onChange={(e) => handleChange("contactName", e.target.value)}
                />
                {errors?.contactName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.contactName}
                  </p>
                )}
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className={`pl-9 ${
                    errors?.contactPhone ? "border-red-500" : ""
                  }`}
                  placeholder="Số điện thoại"
                  value={form.contactPhone}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                />
                {errors?.contactPhone && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.contactPhone}
                  </p>
                )}
              </div>

              <div className="relative md:col-span-2">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className={`pl-9 ${
                    errors?.contactEmail ? "border-red-500" : ""
                  }`}
                  placeholder="Email"
                  value={form.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                />
                {errors?.contactEmail && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.contactEmail}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Thông tin đặt phòng */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">
              Thông tin đặt phòng
            </h3>

            <div className="rounded-lg border bg-gray-50 p-3 text-sm space-y-1">
              <div className="flex items-center gap-2">
                <CalendarDays size={14} />
                <span>
                  {format(checkIn, "dd/MM/yyyy")} →{" "}
                  {format(checkOut, "dd/MM/yyyy")} ({nights} đêm)
                </span>
              </div>
              <div>Phòng: {room?.roomNumber}</div>
              <div>{room?.floor}</div>
            </div>

            <h3 className="text-sm font-semibold text-gray-700">
              Đặt từ nguồn
            </h3>
            <Select
              value={form.bookingSource}
              onValueChange={(v) => handleChange("bookingSource", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Nguồn đặt phòng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FRONT_DESK">
                  Trực tiếp từ quầy lễ tân
                </SelectItem>
                <SelectItem value="PHONE">Điện thoại</SelectItem>
              </SelectContent>
            </Select>
          </section>

          {/* Thanh toán */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <CreditCard size={16} /> Thanh toán
            </h3>

            <div className="rounded-lg border p-3">
              <RadioGroup
                value={form.paid ? "PAID" : "UNPAID"}
                onValueChange={(v) => handleChange("paid", v === "PAID")}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="UNPAID" id="unpaid" />
                  <Label htmlFor="unpaid">Chưa thanh toán</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PAID" id="paid" />
                  <Label htmlFor="paid">Đã thanh toán</Label>
                </div>
              </RadioGroup>
            </div>
          </section>

          {/* Ghi chú */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Ghi chú</h3>

            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                className="pl-9"
                placeholder="Ghi chú thêm cho đơn đặt phòng"
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>
          </section>

          {/* Tổng tiền */}
          <section className="rounded-lg border bg-white p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Giá / đêm</span>
              <span className="font-medium">
                {roomPrice.toLocaleString()} ₫
              </span>
            </div>

            <div className="flex justify-between">
              <span>Số đêm</span>
              <span>{nights}</span>
            </div>

            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{total.toLocaleString()} ₫</span>
            </div>

            <div className="flex justify-between">
              <span>VAT (8%)</span>
              <span>{vatFee.toLocaleString()} ₫</span>
            </div>

            <div className="border-t pt-3 flex justify-between text-base font-semibold">
              <span>Tổng thanh toán</span>
              <span className="text-(--color-primary)">
                {totalPayment.toLocaleString()} ₫
              </span>
            </div>
          </section>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Huỷ
          </Button>
          <Button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-(--color-primary) hover:bg-[#2a4b70] cursor-pointer"
          >
            {loading ? "Đang lưu..." : "Tạo đơn đặt phòng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBookingModal;
