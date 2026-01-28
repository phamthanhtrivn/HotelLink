/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useMemo } from "react";

const OccupancyStatistics = ({ occupancyData }) => {
  if (!occupancyData) return null;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const monthlyData = occupancyData.monthly || {};
  const weeklyData = occupancyData.weekly || {};
  const yearlyData = occupancyData.yearly || [];
  const availableYears = useMemo(
    () => Object.keys(monthlyData).sort(),
    [monthlyData],
  );
  const today = new Date();
  const currentMonthStr = (today.getMonth() + 1).toString().padStart(2, "0");
  const currentYearStr = today.getFullYear().toString();

  const [view, setView] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState(() =>
    availableYears.length > 0
      ? availableYears[availableYears.length - 1]
      : currentYearStr,
  );
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[availableYears.length - 1]);
    }
  }, [availableYears, selectedYear]);

  let currentData = [];
  if (view === "weekly") {
    const key = `${selectedYear}-${selectedMonth.padStart(2, "0")}`;
    currentData = weeklyData[key] || [];
  } else if (view === "monthly") {
    currentData = monthlyData[selectedYear] || [];
  } else {
    currentData = yearlyData;
  }

  const chartHeight = 150;
  const chartWidth = 400;
  const marginLeft = 30;
  const marginBottom = 20;
  const barWidth = 16;
  const gap =
    currentData.length > 1
      ? (chartWidth - marginLeft - currentData.length * barWidth) /
        (currentData.length - 1)
      : 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Tỷ lệ lấp đầy</h2>
          <p className="text-sm text-slate-500">Công suất phòng (%)</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {[
            { k: "weekly", l: "Tuần" },
            { k: "monthly", l: "Tháng" },
            { k: "yearly", l: "Năm" },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setView(t.k)}
              className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all ${
                view === t.k
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.l}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mb-2">
        {view === "weekly" && (
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold py-1.5 px-3 rounded-md outline-none focus:ring-1 focus:ring-blue-500"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={(i + 1).toString().padStart(2, "0")}>
                Tháng {i + 1}
              </option>
            ))}
          </select>
        )}
        {view !== "yearly" && (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold py-1.5 px-3 rounded-md outline-none focus:ring-1 focus:ring-blue-500"
          >
            {availableYears.length > 0 ? (
              availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))
            ) : (
              <option>{selectedYear}</option>
            )}
          </select>
        )}
      </div>

      {/* Container đồ thị */}
      <div className="flex-1 w-full min-h-50">
        {currentData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            Chưa có dữ liệu
          </div>
        ) : (
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="overflow-visible"
          >
            {/* Grid & Axis Y */}
            {[0, 25, 50, 75, 100].map((val) => {
              const y =
                chartHeight -
                marginBottom -
                (val / 100) * (chartHeight - marginBottom - 10);
              return (
                <g key={val}>
                  <text
                    x={marginLeft - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="font-medium fill-slate-400"
                    style={{ fontSize: "10px" }}
                  >
                    {val}
                  </text>
                  <line
                    x1={marginLeft}
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeDasharray="3,3"
                  />
                </g>
              );
            })}

            {/* Bars */}
            {currentData.map((d, i) => {
              const val = d.occupancy ?? d.value ?? 0;
              const h = (val / 100) * (chartHeight - marginBottom - 10);
              const x = marginLeft + i * (barWidth + gap);
              const y = chartHeight - marginBottom - h;

              return (
                <g key={i} className="group">
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={h}
                    rx="3"
                    className="fill-blue-500 hover:fill-blue-600 transition-all duration-300 cursor-pointer"
                  />

                  {/* Tooltip */}
                  <text
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    className="text-xs font-bold fill-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {val}%
                  </text>

                  <text
                    x={x + barWidth / 2}
                    y={chartHeight - 5}
                    textAnchor="middle"
                    className="font-medium fill-slate-500"
                    style={{ fontSize: "10px" }}
                  >
                    {d.week || d.month || d.year}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
};

export default OccupancyStatistics;
