/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Star, BedDouble, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

import { roomTypeService } from "@/services/roomTypeService";
import { reviewService } from "@/services/reviewService";
import { formatVND } from "@/helpers/currencyFormatter";
import ImageSliderDetail from "@/components/common/customer/ImageSliderDetail";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setFlow } from "@/store/roomTypeSearchSlice";

const RoomTypeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [roomType, setRoomType] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [scoreRange, setScoreRange] = useState("ALL");
  const { flow } = useSelector((state) => state.roomTypeSearch);
  const dispatch = useDispatch();

  const fetchRoomType = async () => {
    try {
      setLoading(true);
      const res = await roomTypeService.getRoomTypeById(id);
      if (res.success) setRoomType(res.data);
      else toast.error(res.message);
    } catch {
      toast.error("Không thể tải chi tiết loại phòng!");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewService.getReviewsByRoomTypeId(id);
      if (res.success) setReviews(res.data || []);
    } catch {
      toast.error("Không thể tải đánh giá!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRoomType();
      fetchReviews();
    }
  }, [id]);

  // tính điểm trung bình cho 1 review
  const calcAvgScore = (r) =>
    ((r.cleanlinessScore + r.serviceScore + r.facilitiesScore) / 3).toFixed(1);

  // filter theo khoảng điểm 0–10
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const avg = calcAvgScore(r);
      if (scoreRange === "ALL") return true;
      if (scoreRange === "0-5") return avg <= 5;
      if (scoreRange === "6-8") return avg > 5 && avg <= 8;
      if (scoreRange === "9-10") return avg > 8;
      return true;
    });
  }, [reviews, scoreRange]);

  const pagedReviews = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredReviews.slice(start, start + pageSize);
  }, [filteredReviews, page]);

  const totalPages = Math.ceil(filteredReviews.length / pageSize);

  const overallScore = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce(
      (sum, r) =>
        sum + (r.cleanlinessScore + r.serviceScore + r.facilitiesScore) / 3,
      0
    );
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const handleNavigateBooking = () => {
    dispatch(setFlow("BOOKING"));
    navigate("/booking", { state: { roomTypeId: id } });
  };

  useEffect(() => {
    if (flow === "IDLE") {
      navigate("/room-types", { replace: true });
    }
  }, [flow]);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        <Loader2 className="w-14 h-14 animate-spin text-(--color-primary)" />
      </div>
    );

  if (!roomType) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SLIDER */}
      <div className="w-full h-[60vh]">
        <ImageSliderDetail images={roomType.pictures} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-10">
          {/* TITLE */}
          <div>
            <h1 className="text-4xl font-semibold text-(--color-primary)">
              {roomType.name}
            </h1>
            <p className="mt-2 text-gray-600">{roomType.description}</p>

            <div className="flex items-center gap-2 mt-3">
              <Star className="w-5 h-5 text-(--color-background)" />
              <span className="font-semibold">{overallScore}/10</span>
              <span className="text-sm text-gray-500">
                ({reviews.length} đánh giá)
              </span>
            </div>
          </div>

          {/* BEDS */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-(--color-primary)">
              Giường ngủ
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {roomType.beds.map((bed) => (
                <div key={bed.id} className="border rounded-xl p-4 bg-white">
                  <div className="flex items-center gap-2 font-medium">
                    <BedDouble size={18} />
                    {bed.name}
                  </div>
                  <p className="text-sm text-gray-600">{bed.description}</p>
                  <p className="text-sm mt-1">
                    Số lượng: <strong>{bed.quantity}</strong>
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* AMENITIES */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-(--color-primary)">
              Tiện nghi phòng
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {roomType.amenities.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-2 border rounded-lg p-3 bg-white"
                >
                  <CheckCircle
                    size={16}
                    className="text-(--color-background)"
                  />
                  <span className="text-sm">{a.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* REVIEWS */}
          <section>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold text-(--color-primary)">
                Đánh giá của khách
              </h2>

              <Select
                value={scoreRange}
                onValueChange={(v) => {
                  setPage(1);
                  setScoreRange(v);
                }}
              >
                <SelectTrigger className="w-45 cursor-pointer">
                  <SelectValue placeholder="Chọn điểm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="ALL">
                    Tất cả điểm
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="0-5">
                    0 - 5 (khá tệ)
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="6-8">
                    6 - 8 (trung bình)
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="9-10">
                    9 - 10 (tuyệt vời)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {pagedReviews.length === 0 && (
              <p className="text-sm text-gray-500">Chưa có đánh giá phù hợp.</p>
            )}

            <div className="space-y-4">
              {pagedReviews.map((r) => (
                <div
                  key={r.id}
                  className="
                    bg-white
                    border border-gray-200
                    rounded-2xl
                    p-5
                    shadow-sm
                    hover:shadow-md
                    transition
                  "
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {r.customer?.fullName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>

                    {/* Score */}
                    <div
                      className="
                        flex items-center justify-center
                        w-11 h-11
                        rounded-full
                        bg-emerald-100
                        text-emerald-700
                        font-bold
                        text-sm
                      "
                    >
                      {calcAvgScore(r)}
                    </div>
                  </div>

                  {/* Comment */}
                  {r.comments && (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {r.comments}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-6">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 border rounded disabled:opacity-40"
                >
                  Trước
                </button>
                <span className="px-3 py-2 text-sm">
                  {page}/{totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 border rounded disabled:opacity-40"
                >
                  Sau
                </button>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT */}
        <aside className="sticky top-24 h-fit">
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <p className="text-sm text-gray-500">Giá mỗi đêm</p>
            <p className="text-3xl font-bold text-(--color-primary)">
              {formatVND(roomType.price)}
            </p>
            <div className="text-sm space-y-1">
              <p>Sức chứa tối đa: {roomType.guestCapacity} khách</p>
              <p>Trẻ em dưới 12 tuổi có thể ở chung không cần giường riêng</p>
              <p>Diện tích: {roomType.area} m²</p>
            </div>
            <Button
              onClick={handleNavigateBooking}
              className="w-full py-4 rounded-xl text-white font-semibold cursor-pointer bg-(--color-primary) hover:bg-[#2a4b70]"
            >
              Đặt phòng ngay
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RoomTypeDetail;
