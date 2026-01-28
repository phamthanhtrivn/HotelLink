/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useMemo } from "react";

const RevenueStatistics = ({ revenueData }) => {
  const availableYears = useMemo(
    () => (revenueData ? Object.keys(revenueData).sort() : []),
    [revenueData]
  );
  const [selectedYear, setSelectedYear] = useState(() => {
    const current = new Date().getFullYear().toString();
    return availableYears.includes(current)
      ? current
      : availableYears[availableYears.length - 1];
  });
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[availableYears.length - 1]);
    }
  }, [availableYears, selectedYear]);

  const chartHeight = 320; 
  const chartWidth = 800;
  const paddingX = 80;
  const paddingY = 80; 

  const currentData = (revenueData && revenueData[selectedYear]) || [];

  if (currentData.length === 0)
    return (
      <div className="bg-white p-6 rounded-2xl h-100 flex items-center justify-center text-slate-400">
        Không có dữ liệu
      </div>
    );

  const rawMax = Math.max(...currentData.map((d) => d.revenue), 0);
 
  const maxRevenue = rawMax === 0 ? 1000000 : rawMax * 1.25;
  const yAxisSteps = 5;

  const getX = (i) =>
    paddingX + (i / (currentData.length - 1)) * (chartWidth - 2 * paddingX);

  const getY = (val) =>
    chartHeight - paddingY / 2 - (val / maxRevenue) * (chartHeight - paddingY);

  const bottomY = chartHeight - paddingY / 2;

  const points = currentData
    .map((d, i) => `${getX(i)},${getY(d.revenue)}`)
    .join(" ");
  const areaPoints = `${getX(0)},${bottomY} ${points} ${getX(
    currentData.length - 1
  )},${bottomY}`;

  const formatCurrency = (val) => {
    if (val >= 1000000000) return (val / 1000000000).toFixed(1) + "B";
    if (val >= 1000000) return (val / 1000000).toFixed(0) + "M";
    return val;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Biểu đồ doanh thu
          </h2>
          <p className="text-sm text-slate-500">
            Doanh thu thực tế theo tháng (VNĐ)
          </p>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold py-2 px-4 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        >
          {availableYears.map((y) => (
            <option key={y} value={y}>
              Năm {y}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full overflow-hidden">
        {/* SVG với overflow-visible */}
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid & Y-Axis */}
          {Array.from({ length: yAxisSteps + 1 }).map((_, i) => {
            const val = (i * maxRevenue) / yAxisSteps;
            const y = getY(val);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX + 20}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeDasharray="4,4"
                />
                <text
                  x={paddingX - 15}
                  y={y + 5}
                  textAnchor="end"
                  className="text-xs font-semibold fill-slate-400"
                >
                  {formatCurrency(val)}
                </text>
              </g>
            );
          })}

          {/* Area & Line */}
          <polygon points={areaPoints} fill="url(#blueGradient)" />
          <polyline
            points={points}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points & Tooltips */}
          {currentData.map((d, i) => {
            const x = getX(i);
            const y = getY(d.revenue);
            const isHover = hoveredPoint === i;
            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={20}
                  fill="transparent"
                  className="cursor-pointer"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={isHover ? 6 : 4}
                  fill={isHover ? "#2563eb" : "white"}
                  stroke="#2563eb"
                  strokeWidth="2"
                  className="transition-all"
                />
                {isHover && (
                  <g style={{ pointerEvents: "none", zIndex: 10 }}>
                    <rect
                      x={x - 60}
                      y={y - 50}
                      width="120"
                      height="35"
                      rx="6"
                      fill="#1e293b"
                    />
                    <text
                      x={x}
                      y={y - 28}
                      textAnchor="middle"
                      className="text-xs font-bold fill-white"
                    >
                      {d.revenue.toLocaleString("vi-VN")} đ
                    </text>
                    <polygon
                      points={`${x - 6},${y - 15} ${x + 6},${y - 15} ${x},${
                        y - 9
                      }`}
                      fill="#1e293b"
                    />
                  </g>
                )}
              </g>
            );
          })}

          {/* X-Axis Labels */}
          {currentData.map((d, i) => (
            <text
              key={i}
              x={getX(i)}
              y={bottomY + 30}
              textAnchor="middle"
              className={`text-xs font-medium ${
                hoveredPoint === i
                  ? "fill-blue-600 font-bold"
                  : "fill-slate-500"
              }`}
            >
              {d.month}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default RevenueStatistics;
