import { MoreHorizontal, Star } from "lucide-react";
import React from "react";

const CustomerFeedback = ({ feedbackData }) => {
  const sortedFeedback = [...feedbackData].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime(),
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-150 sticky top-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Đánh giá khách hàng
          </h2>
          <p className="text-sm text-slate-500">
            {feedbackData.length} đánh giá mới
          </p>
        </div>
        <button className="text-slate-400 hover:text-blue-600 p-1 hover:bg-slate-50 rounded-full transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 20px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #94a3b8;
          }
        `}</style>

        {sortedFeedback.map((feedback, index) => {
          const avg =
            (feedback.cleanlinessScore +
              feedback.serviceScore +
              feedback.facilitiesScore) /
            3;
          const formattedDate = new Date(
            feedback.createdAt,
          ).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          return (
            <div
              key={index}
              className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
            >
              {/* Info Row */}
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded uppercase tracking-wide">
                  {feedback.roomTypeName}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {formattedDate}
                </span>
              </div>

              {/* Comment */}
              <p className="text-sm text-slate-700 leading-snug mb-3">
                "{feedback.comments}"
              </p>

              {/* Rating Row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 mt-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={`${star <= Math.round(avg / 2) ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-900 font-bold text-sm">
                    {avg.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-400">/ 10</span>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                {[
                  { l: "Sạch sẽ", s: feedback.cleanlinessScore },
                  { l: "Dịch vụ", s: feedback.serviceScore },
                  { l: "Vật chất", s: feedback.facilitiesScore },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-white rounded py-1 border border-slate-100 flex flex-col items-center justify-center"
                  >
                    <span className="text-[9px] text-slate-400 uppercase">
                      {item.l}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {item.s}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerFeedback;
