import { BedDouble, Sparkles, Wrench } from "lucide-react";

export const ROOM_STATUS = {
  AVAILABLE: 'Còn trống',
  MAINTENANCE: 'Bảo trì',
  CLEANING: 'Đang dọn dẹp',
}

export const FLOOR_OPTIONS = [
  { value: "Tầng 1", label: "Tầng 1" },
  { value: "Tầng 2", label: "Tầng 2" },
  { value: "Tầng 3", label: "Tầng 3" },
  { value: "Tầng 4", label: "Tầng 4" },
  { value: "Tầng 5", label: "Tầng 5" },
  { value: "Tầng 6", label: "Tầng 6" },
  { value: "Tầng 7", label: "Tầng 7" },
]

export const ROOM_TYPE_OPTIONS = [
  { value: "Standard", label: "Phòng Standard" },
  { value: "Deluxe", label: "Phòng Deluxe" },
  { value: "Family", label: "Phòng Family" },
  { value: "Suite", label: "Phòng Suite" },
]

export const ROOM_STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Còn trống" },
  { value: "MAINTENANCE", label: "Bảo trì" },
  { value: "CLEANING", label: "Đang dọn dẹp" },
]

export const roomStatusMeta = {
  AVAILABLE: {
    label: "Trống",
    icon: BedDouble,
    badge: "bg-emerald-600",
    bg: "bg-emerald-50/80",
    border: "border-emerald-500",
    select: "border-emerald-400 text-emerald-700",
    ring: "focus:ring-emerald-300",
  },
  MAINTENANCE: {
    label: "Bảo trì",
    icon: Wrench,
    badge: "bg-amber-600",
    bg: "bg-amber-50/80",
    border: "border-amber-500",
    select: "border-amber-400 text-amber-700",
    ring: "focus:ring-amber-300",
  },
  CLEANING: {
    label: "Dọn dẹp",
    icon: Sparkles,
    badge: "bg-blue-600",
    bg: "bg-blue-50/80",
    border: "border-blue-500",
    select: "border-blue-400 text-blue-700",
    ring: "focus:ring-blue-300",
  },
};