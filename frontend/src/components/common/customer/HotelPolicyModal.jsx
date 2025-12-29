import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  CreditCard,
  Clock,
  Gift,
  ShieldCheck,
  IdCard,
  AlertTriangle,
} from "lucide-react";

const HotelPolicyModal = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-(--color-primary)">
            Chính sách & Quy định khách sạn
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Vui lòng đọc kỹ trước khi xác nhận đặt phòng
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6 text-sm text-gray-700">
          {/* Đặt phòng */}
          <section className="flex gap-3">
            <FileText className="text-blue-500 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Đặt phòng</h4>
              <p>Khách hàng cần cung cấp thông tin cá nhân chính xác.</p>
              <p>Thanh toán đầy đủ để giữ phòng.</p>
            </div>
          </section>

          {/* Hủy phòng */}
          <section className="flex gap-3">
            <AlertTriangle className="text-red-500 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">
                Hủy đặt phòng
              </h4>
              <p>
                - Hủy trước thời gian check-in tối thiểu <b>24 giờ</b>.
              </p>
              <p className="text-sm text-gray-500">
                (Tiền sẽ được khách sạn hoản trả trong vòng 24 giờ)
              </p>
              <p>
                - Không đến nhận phòng sẽ bị <b>mất tiền đặt phòng</b>.
              </p>
            </div>
          </section>

          {/* Check-in / Check-out */}
          <section className="flex gap-3">
            <Clock className="text-indigo-500 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">
                Thời gian nhận - trả phòng
              </h4>
              <p> - Check-in từ <b>14:00</b>.</p>
              <p className="text-sm text-gray-500">(Nếu đến sớm hơn 30 phút sẽ phụ thu <b>200.000 đ</b>)</p>
              <p> - Check-out trước <b>12:00</b>.</p>
              <p className="text-sm text-gray-500">(Nếu ra trễ hơn 30 phút sẽ phụ thu <b>200.000 đ</b>)</p>
            </div>
          </section>

          {/* Thanh toán */}
          <section className="flex gap-3">
            <CreditCard className="text-green-600 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">
                Chính sách thanh toán
              </h4>
              <p>Thanh toán bằng thẻ hoặc ví điện tử (Momo, VNPay…).</p>
              <p>Giá đã bao gồm <b>8% Thuế GTGT</b>.</p>
            </div>
          </section>

          {/* Ưu đãi */}
          <section className="flex gap-3">
            <Gift className="text-pink-500 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">
                Chính sách ưu đãi
              </h4>
              <p>Giảm <b>10%</b> cho lần đặt phòng đầu tiên của thành viên.</p>
              <p>
                Tặng <b>1 đêm miễn phí (với loại phòng bất kì)</b> khi tích lũy đủ <b>10 đêm</b>.
              </p>
            </div>
          </section>

          {/* Giấy tờ */}
          <section className="flex gap-3">
            <IdCard className="text-gray-600 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">
                Giấy tờ khi nhận phòng
              </h4>
              <p>Xuất trình CMND/CCCD hoặc hộ chiếu.</p>
              <p>Khách nước ngoài cần khai báo tạm trú.</p>
            </div>
          </section>

          {/* Bảo mật */}
          <section className="flex gap-3">
            <ShieldCheck className="text-emerald-600 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">
                Bảo mật thông tin
              </h4>
              <p>
                Khách sạn cam kết bảo mật thông tin cá nhân của khách hàng.
              </p>
              <p>
                Chỉ cung cấp khi có sự đồng ý hoặc theo yêu cầu pháp lý.
              </p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HotelPolicyModal;
