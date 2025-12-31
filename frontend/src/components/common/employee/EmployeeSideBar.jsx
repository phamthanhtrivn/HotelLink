/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronUp, LogOut, User2, UserCircle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import SidebarMenuList from "./SidebarMenuList";
import { itemsAdminMenu, itemsStaffMenu } from "@/constants/StaffMenuConstants";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Swal from "sweetalert2";
import { personService } from "@/services/personService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminProfileModal from "./AdminProfileModal";
import { useNavigate } from "react-router-dom";

const AdminSidebar = ({ user, setUser, logout }) => {
  const menuByRole = {
    ADMIN: itemsAdminMenu,
    STAFF: itemsStaffMenu,
  };
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const [infor, setInfor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchAdminInfor = async () => {
    setIsLoading(true);
    try {
      const res = await personService.getInfoById(user?.userId);
      if (res.success) {
        setInfor(res.data);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi lấy thông tin!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchStaffInfor = async () => {};

  useEffect(() => {
    if (user.role === "ADMIN") {
      handleFetchAdminInfor();
    } else {
      handleFetchStaffInfor();
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Bạn có muốn đăng xuất không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "gray",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/");
        Swal.fire({
          title: "Đăng xuất thành công!",
          icon: "success",
        });
      }
    });
  };

  return (
    <Sidebar className="border-r border-slate-200 bg-white">
      {/* ===== Header ===== */}
      <SidebarHeader className="px-5 py-6 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <Avatar className="h-11 w-11">
            <AvatarFallback className="bg-slate-800 text-white font-bold">
              {user?.fullName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="leading-tight">
            <div className="text-lg font-bold text-slate-800">HotelLink</div>
            <div className="text-sm text-slate-600 font-medium">
              {user?.fullName}
            </div>

            <Badge variant="secondary" className="mt-1 text-[11px] px-2 py-0.5">
              {user?.role}
            </Badge>
          </div>
        </div>
      </SidebarHeader>

      {/* ===== Menu ===== */}
      <SidebarContent className="px-3 py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {user?.role && menuByRole[user.role] && (
                <SidebarMenuList items={menuByRole[user.role]} />
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ===== Footer ===== */}
      <SidebarFooter className="p-4 border-t border-slate-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="
                    cursor-pointer
                    flex items-center gap-3
                    rounded-md
                    bg-(--color-primary)
                    px-4 py-6
                    text-white
                    hover:bg-[#2a4b70]
                    transition-all
                  "
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-white/20 text-white font-semibold">
                      {user?.fullName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-sm font-semibold text-white text-left">
                    {user?.fullName}
                  </div>

                  <ChevronUp className="ml-auto h-4 w-4 opacity-80 text-white" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="start"
                className="
                  w-[--radix-popper-anchor-width]
                  rounded-md
                  border border-slate-200
                  bg-white
                  p-1
                  shadow-lg
                "
              >
                <DropdownMenuItem
                  onClick={() => setOpenProfile(true)}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                >
                  <UserCircle className="h-4 w-4 text-slate-600" />
                  <span>Thông tin cá nhân</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="
                    flex items-center gap-2 px-3 py-2 cursor-pointer
                    text-red-600 focus:text-red-600 focus:bg-red-50
                  "
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <AdminProfileModal
        open={openProfile}
        onClose={setOpenProfile}
        isLoading={isLoading}
        infor={infor}
        setInfor={setInfor}
        setUser={setUser}
      />
    </Sidebar>
  );
};

export default AdminSidebar;
