export const formatDateTimeForCustomer = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  return date.toLocaleString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const calcStayNights = (checkInISO, checkOutISO) => {
  if (!checkInISO || !checkOutISO) return 0;

  const checkIn = new Date(checkInISO);
  const checkOut = new Date(checkOutISO);

  // reset giờ để tránh lệch do timezone / giờ check-in
  checkIn.setHours(0, 0, 0, 0);
  checkOut.setHours(0, 0, 0, 0);

  const diffTime = checkOut - checkIn;
  const nights = diffTime / (1000 * 60 * 60 * 24);

  return Math.max(nights, 0);
};

export const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  // Các mốc thời gian
  const intervals = {
    năm: 31536000,
    tháng: 2592000,
    tuần: 604800,
    ngày: 86400,
    giờ: 3600,
    phút: 60,
    giây: 1,
  };

  // Tìm khoảng thời gian phù hợp
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const diff = Math.floor(diffInSeconds / secondsInUnit);

    if (diff >= 1) {
      return `cách đây ${diff} ${unit}`;
    }
  }

  return "Vừa xong";
};

export const withCheckInTime = (date) => {
  const d = new Date(date);
  d.setHours(14, 0, 0, 0);
  return d;
};

export const withCheckOutTime = (date) => {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  return d;
};

export const getDefaultCheckInDate = () => {
  const date = new Date();
  date.setHours(14, 0, 0, 0);
  return date;
};

export const getDefaultCheckOutDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(12, 0, 0, 0);
  return date;
};
