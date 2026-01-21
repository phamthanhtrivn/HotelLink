/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { bookingService } from "@/services/bookingService";
import { formatVND } from "@/helpers/currencyFormatter";
import { serviceService } from "@/services/serviceService";

const AddBookingServiceModal = ({
  open,
  onClose,
  bookingId,
  userId,
  bookingServices = [],
  reload,
}) => {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await serviceService.getAllActiveServices();
      if (res.success) {
        setServices(res.data);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Không thể tải danh sách dịch vụ");
    }
  };

  const selectedService = services.find((s) => s.id === selectedServiceId);

  const handleAddService = () => {
    if (!selectedService) return;

    const existed = items.find((i) => i.serviceId === selectedService.id);
    if (existed) {
      toast.warning("Dịch vụ đã được thêm");
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        serviceId: selectedService.id,
        name: selectedService.name,
        price: selectedService.unitPrice,
        serviceType: selectedService.serviceType,
        quantity: 1,
        originalQuantity: 1,
        isExisting: false,
      },
    ]);

    setSelectedServiceId("");
  };

  const updateQuantity = (serviceId, quantity) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.serviceId !== serviceId) return i;

        const newQty = Number(quantity);

        if (i.isExisting && newQty < i.originalQuantity) {
          return i;
        }

        return { ...i, quantity: newQty };
      }),
    );
  };

  const removeItem = (serviceId) => {
    setItems((prev) => prev.filter((i) => i.serviceId !== serviceId));
  };

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        userId,
        services: items.map((i) => ({
          serviceId: i.serviceId,
          quantity: i.quantity,
        })),
      };
      const res = await bookingService.addServicesToBooking(bookingId, payload);

      if (res.success) {
        toast.success(res.message);
        onClose();
        reload();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Thêm dịch vụ thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    fetchServices();

    if (bookingServices.length > 0) {
      setItems(
        bookingServices.map((bs) => ({
          serviceId: bs.service.id,
          name: bs.service.name,
          price: bs.price,
          serviceType: bs.service.serviceType,
          quantity: bs.quantity,
          originalQuantity: bs.quantity,
          isExisting: true,
        })),
      );
    } else {
      setItems([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm dịch vụ</DialogTitle>
        </DialogHeader>

        {/* Chọn dịch vụ */}
        <div className="flex gap-3 items-center">
          <Select
            value={selectedServiceId}
            onValueChange={setSelectedServiceId}
          >
            <SelectTrigger className="cursor-pointer border-gray-300 focus:ring-(--color-primary)">
              <SelectValue placeholder="Chọn dịch vụ" />
            </SelectTrigger>

            <SelectContent>
              {services.map((s) => (
                <SelectItem
                  key={s.id}
                  value={s.id}
                  className="cursor-pointer hover:bg-[#2a4b70] hover:text-white"
                >
                  {s.name} — {formatVND(s.unitPrice)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleAddService}
            className="bg-(--color-primary) hover:bg-[#2a4b70] cursor-pointer"
          >
            Thêm
          </Button>
        </div>

        {/* Danh sách dịch vụ đã chọn */}
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div
              key={item.serviceId}
              className="grid grid-cols-12 gap-3 items-center rounded-xl border bg-white p-3 shadow-sm hover:shadow-md transition"
            >
              <div className="col-span-4 font-semibold text-gray-700">
                {item.name}
              </div>

              <div className="col-span-2 text-right text-gray-600">
                {formatVND(item.price)}
              </div>

              <div className="col-span-3">
                <Input
                  type="number"
                  min={item.isExisting ? item.originalQuantity : 1}
                  value={item.quantity}
                  disabled={item.serviceType === "TIME_BASED"}
                  className={`${
                    item.serviceType === "TIME_BASED"
                      ? "bg-gray-100 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onChange={(e) =>
                    updateQuantity(item.serviceId, e.target.value)
                  }
                />
              </div>

              <div className="col-span-2 text-right font-semibold text-gray-800">
                {formatVND(item.price * item.quantity)}
              </div>

              <Button
                variant="ghost"
                disabled={item.isExisting || item.serviceType === "TIME_BASED"}
                className={`rounded-full ${
                  item.isExisting || item.serviceType === "TIME_BASED"
                    ? "cursor-not-allowed opacity-40"
                    : "cursor-pointer hover:bg-[#2a4b70]/10"
                }`}
                onClick={() => removeItem(item.serviceId)}
              >
                <Trash2
                  className={`w-4 h-4 ${
                    item.isExisting ? "text-gray-400" : "text-rose-500"
                  }`}
                />
              </Button>
            </div>
          ))}
        </div>

        {/* Tổng tiền */}
        <div className="flex justify-end mt-6 text-lg font-bold text-(--color-primary)">
          Tổng tiền dịch vụ:{" "}
          <span className="ml-2 text-red-600">{formatVND(totalPrice)}</span>
        </div>

        <DialogFooter className="mt-4 gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer hover:bg-gray-100"
          >
            Huỷ
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-(--color-primary) hover:bg-[#2a4b70] cursor-pointer"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Lưu dịch vụ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookingServiceModal;
