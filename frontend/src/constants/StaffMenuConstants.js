import {
  BedDouble,
  BookOpen,
  Building,
  Calendar,
  ChartPie,
  HandPlatter,
  MessageSquare,
  UserRoundCog,
  Users,
} from "lucide-react";

export const itemsAdminMenu = [
  { name: "Dashboard", icon: ChartPie, url: "/admin" },
  { name: "Đơn đặt phòng", icon: Calendar, url: "/admin/bookings" },
  {
    name: "Danh sách phòng trống",
    icon: Building,
    url: "/admin/room-availability",
  },
  { name: "Loại phòng", icon: BookOpen, url: "/admin/room-types" },
  { name: "Phòng", icon: BedDouble, url: "/admin/rooms" },
  { name: "Khách hàng", icon: Users, url: "/admin/customers" },
  { name: "Nhân viên", icon: UserRoundCog, url: "/admin/staffs" },
  { name: "Đánh giá", icon: MessageSquare, url: "/admin/reviews" },
  { name: "Dịch vụ", icon: HandPlatter, url: "/admin/service" },
];

export const itemsStaffMenu = [
  { name: "Dashboard", icon: ChartPie, url: "/staff" },
  { name: "Đơn đặt phòng", icon: Calendar, url: "/staff/bookings" },
  {
    name: "Danh sách phòng trống",
    icon: Building,
    url: "/staff/room-availability",
  },
];
