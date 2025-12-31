import { AuthContext } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";

const EmployeeHeader = ({ user }) => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      const formattedTime = now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const formattedDate = now.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      setCurrentTime(formattedTime);
      setCurrentDate(
        formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex items-center justify-between w-full px-8 py-3 bg-white shadow-lg shadow-gray-300">
      {/* Admin Area Title */}
      <div className="flex items-center space-x-3">
        <p className="text-xl font-bold tracking-wide text-gray-800">
          {user?.role === "ADMIN" ? "Hotel Admin Management" : "Hotel Staff Management"}
        </p>
      </div>

      <div className="text-right">
        <p className="text-lg font-semibold text-red-600">{currentTime}</p>
        <p className="text-sm text-gray-600">{currentDate}</p>
        <p className="text-xs italic text-gray-500">Thành phố Hồ Chí Minh, Việt Nam</p>
      </div>
    </header>
  );
};

export default EmployeeHeader;
