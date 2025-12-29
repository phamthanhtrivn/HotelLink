import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, Gift, BedDouble, Info } from "lucide-react";

const PointsPolicyModal = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Chính sách điểm tích lũy
          </DialogTitle>
          <p className="text-gray-600 text-sm">
            Tri ân khách hàng bằng điểm thưởng cho mỗi lần lưu trú
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Rule 1 */}
          <div className="bg-white rounded-xl shadow-sm p-5 flex gap-4">
            <Star className="text-yellow-500 shrink-0" size={26} />
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-1">
                Nhận điểm khi đánh giá đơn đặt phòng
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sau khi hoàn tất đơn đặt phòng và gửi đánh giá trải nghiệm,
                khách hàng sẽ nhận điểm tương ứng với số đêm lưu trú.
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-semibold">Quy đổi:</span> 1 đêm = 1 điểm
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="bg-white rounded-xl shadow-sm p-5 flex gap-4">
            <Gift className="text-red-500 shrink-0" size={26} />
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-1">
                Đổi điểm lấy đêm nghỉ miễn phí
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Khi đủ <span className="font-semibold">10 điểm</span>, khách hàng
                có thể đổi{" "}
                <span className="font-semibold">
                  1 đêm nghỉ miễn phí
                </span>.
              </p>
              <p className="text-sm text-gray-700 mt-2">
                Áp dụng cho <span className="font-semibold">mọi loại phòng</span>.
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="bg-white rounded-xl shadow-sm p-5 flex gap-4">
            <BedDouble className="text-blue-500 shrink-0" size={26} />
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-1">
                Trừ điểm sau khi sử dụng
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sau khi sử dụng ưu đãi, hệ thống sẽ trừ{" "}
                <span className="font-semibold">10 điểm</span> khỏi tài khoản.
              </p>
            </div>
          </div>

          {/* Note */}
          <div className="bg-background/10 border-l-4 border-(--color-background) px-4 py-3 rounded-md flex gap-3">
            <Info className="text-(--color-background) shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 leading-relaxed">
              Điểm tích lũy không có giá trị quy đổi tiền mặt và chỉ sử dụng trong
              hệ thống khách sạn.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PointsPolicyModal;
