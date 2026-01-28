import React from "react";

const FloorStatus = ({ floorStatus }) => {
  const radius = 70;
  const stroke = 14;
  const normalizedRadius = radius - stroke;
  const fullCircumference = 2 * Math.PI * normalizedRadius;
  const gaugeSize = fullCircumference * 0.75;
  const progress = (floorStatus / 100) * gaugeSize;

  const readyPercent = Number(floorStatus).toFixed(2);
  const notReadyPercent = (100 - floorStatus).toFixed(2);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col items-center justify-between">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">Trạng thái phòng</h2>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            floorStatus > 80
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {floorStatus > 80 ? "Tốt" : "Cần lưu ý"}
        </span>
      </div>

      <div className="relative flex items-center justify-center py-4">
        <svg
          height="160"
          width="160"
          viewBox="0 0 160 160"
          className="transform rotate-135"
        >
          {/* Background Circle */}
          <circle
            cx="80"
            cy="80"
            r={normalizedRadius}
            stroke="#f1f5f9"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${gaugeSize} ${fullCircumference}`}
          />
          {/* Progress Circle */}
          <circle
            cx="80"
            cy="80"
            r={normalizedRadius}
            stroke="#3b82f6"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${fullCircumference}`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center transform rotate-0">
          <span className="text-3xl font-extrabold text-slate-800">
            {readyPercent}%
          </span>
          <span className="text-xs text-slate-400 font-bold uppercase mt-1">
            Sẵn sàng
          </span>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-4 mt-2">
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-slate-500 font-medium mb-1">Đã dọn</p>

          <p className="text-xl font-bold text-blue-600">{readyPercent}%</p>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-xs text-slate-500 font-medium mb-1">Chưa dọn</p>

          <p className="text-xl font-bold text-slate-600">{notReadyPercent}%</p>
        </div>
      </div>
    </div>
  );
};

export default FloorStatus;
