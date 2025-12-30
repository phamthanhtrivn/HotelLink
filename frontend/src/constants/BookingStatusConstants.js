export const statusOptions = [
  { value: "ALL", label: "Tất cả" },

  { value: "PENDING", label: "Chờ thanh toán" },
  { value: "CONFIRMED", label: "Đã xác nhận" },

  { value: "CHECKED_IN", label: "Đang lưu trú" },
  { value: "COMPLETED", label: "Đã hoàn thành" },

  { value: "CANCELLED", label: "Đã hủy" },
  { value: "NO_SHOW", label: "Không đến nhận phòng" },
];

export const statusColor = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",

  CHECKED_IN: "bg-indigo-100 text-indigo-700",
  COMPLETED: "bg-green-100 text-green-700",

  CANCELLED: "bg-red-100 text-red-700",
  NO_SHOW: "bg-gray-200 text-gray-600",
};

export const statusLabelMap = {
  PENDING: "Chờ thanh toán",
  CONFIRMED: "Đã xác nhận",
  CHECKED_IN: "Đang lưu trú",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
  NO_SHOW: "Không đến nhận phòng",
};

export const statusColorMap = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  CHECKED_IN: "bg-indigo-100 text-indigo-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  NO_SHOW: "bg-gray-200 text-gray-600",
};
