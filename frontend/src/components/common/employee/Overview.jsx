import React from "react";
import { LogIn, LogOut, Home, BedDouble, Users } from "lucide-react";

const Overview = ({ overviewData }) => {
  const mapLabel = (label) => {
    const lower = label.toLowerCase();
    if (lower.includes("check-in"))
      return {
        name: "Check-in hôm nay",
        icon: <LogIn />,
        color: "text-blue-600",
        bg: "bg-blue-100",
      };
    if (lower.includes("check-out"))
      return {
        name: "Check-out hôm nay",
        icon: <LogOut />,
        color: "text-orange-600",
        bg: "bg-orange-100",
      };
    if (lower.includes("in hotel"))
      return {
        name: "Đang lưu trú",
        icon: <Users />,
        color: "text-purple-600",
        bg: "bg-purple-100",
      };
    if (lower.includes("available"))
      return {
        name: "Phòng trống",
        icon: <Home />,
        color: "text-emerald-600",
        bg: "bg-emerald-100",
      };
    if (lower.includes("occupied"))
      return {
        name: "Phòng đã thuê",
        icon: <BedDouble />,
        color: "text-rose-600",
        bg: "bg-rose-100",
      };
    return {
      name: label,
      icon: <Home />,
      color: "text-slate-600",
      bg: "bg-slate-100",
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {overviewData.map((o, index) => {
        const style = mapLabel(o.label);
        return (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200 flex flex-col items-start justify-between space-y-4"
          >
            <div className={`p-3 rounded-xl ${style.bg} ${style.color}`}>
              {React.cloneElement(style.icon, { size: 24 })}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{style.name}</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">
                {o.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Overview;
