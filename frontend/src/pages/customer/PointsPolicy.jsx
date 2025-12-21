import React from "react";
import { Star, Gift, BedDouble, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PointsPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen px-4 md:px-10 lg:px-20 py-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Chính sách điểm tích lũy
        </h1>
        <p className="text-gray-600">
          Tri ân khách hàng bằng điểm thưởng cho mỗi lần lưu trú
        </p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Rule 1 */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex gap-4">
          <Star className="text-yellow-500 shrink-0" size={28} />
          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-1">
              Nhận điểm khi đánh giá đơn đặt phòng
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Sau khi hoàn tất đơn đặt phòng và gửi đánh giá trải nghiệm, khách
              hàng sẽ nhận được điểm tích lũy tương ứng với số đêm lưu trú.
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <span className="font-semibold">Quy đổi:</span> 1 đêm lưu trú = 1
              điểm
            </p>
          </div>
        </div>

        {/* Rule 2 */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex gap-4">
          <Gift className="text-red-500 shrink-0" size={28} />
          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-1">
              Đổi điểm lấy đêm nghỉ miễn phí
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Khi tích lũy đủ <span className="font-semibold">10 điểm</span>,
              khách hàng có thể đổi để nhận{" "}
              <span className="font-semibold">
                1 đêm nghỉ miễn phí tại khách sạn
              </span>
              .
            </p>
            <p className="text-sm text-gray-700 mt-2">
              Đêm miễn phí áp dụng cho{" "}
              <span className="font-semibold">mọi loại phòng</span> đang được
              kinh doanh.
            </p>
          </div>
        </div>

        {/* Rule 3 */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex gap-4">
          <BedDouble className="text-blue-500 shrink-0" size={28} />
          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-1">
              Trừ điểm sau khi sử dụng
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Sau khi khách hàng sử dụng ưu đãi miễn phí 1 đêm, hệ thống sẽ tự
              động trừ <span className="font-semibold">10 điểm</span> khỏi tổng
              điểm tích lũy hiện có.
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="bg-background/10 border-l-4 border-(--color-background) px-4 py-3 rounded-md flex gap-3">
          <Info className="text-(--color-background) shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 leading-relaxed">
            Điểm tích lũy không có giá trị quy đổi thành tiền mặt và chỉ được sử
            dụng cho các ưu đãi trong hệ thống khách sạn.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="px-6 py-3 cursor-pointer"
          >
            Quay lại trang trước
          </Button>

          <Button
            onClick={() => navigate("/", { replace: true })}
            className="px-6 py-3 bg-(--color-primary) hover:bg-[#2a4b70] text-white cursor-pointer"
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PointsPolicy;
