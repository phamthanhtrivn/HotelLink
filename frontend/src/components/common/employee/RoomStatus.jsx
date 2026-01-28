import { MoreHorizontal } from "lucide-react";
import React from "react";

const RoomStatus = ({ roomStatic }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Trạng thái phòng</h2>
        <button className="text-slate-400 hover:text-blue-600 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roomStatic.map((room, index) => {
          const percentage =
            room.total > 0 ? (room.occupied / room.total) * 100 : 0;

          return (
            <div
              key={index}
              className="group bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                {room.deals > 0 ? (
                  <span className="text-xs font-bold bg-rose-100 text-rose-600 px-2 py-1 rounded-full">
                    -{room.deals} Ưu đãi
                  </span>
                ) : (
                  <div className="h-6"></div>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-1 truncate">
                {room.tenLoaiPhong}
              </h3>

              <div className="flex items-baseline gap-1 mb-4">
                <p className="text-2xl font-bold text-blue-600">
                  {room.gia.toLocaleString("vi-VN")} đ
                </p>
                <span className="text-xs text-slate-500">/ đêm</span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Đã thuê</span>
                  <span className="font-semibold text-slate-700">
                    {room.occupied} / {room.total}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomStatus;
