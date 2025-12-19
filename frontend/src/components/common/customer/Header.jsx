import { Menu, User, ChevronDown } from "lucide-react";
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import { AuthContext } from "@/context/AuthContext";
import Swal from "sweetalert2";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: "Bạn có muốn đăng xuất không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
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

  const menuItems = [
    { to: "/", label: "TRANG CHỦ" },
    { to: "/about", label: "GIỚI THIỆU" },
    { to: "/room-types", label: "ĐẶT PHÒNG" },
    { to: "/facility", label: "CƠ SỞ VẬT CHẤT" },
    { to: "/contact", label: "LIÊN HỆ" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="flex items-center space-x-2 cursor-pointer">
          <span className="text-xl font-bold font-serif tracking-tight text-(--color-primary) hover:text-[#2a4b70]">
            HotelLink
          </span>
        </Link>

        {/* Menu desktop */}
        <div className="hidden lg:flex items-center space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative text-sm font-medium text-foreground/80 hover:text-foreground group"
            >
              {item.label}
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center relative space-x-4">
          {/* Desktop user section */}
          {!user ? (
            <Button
              onClick={() => navigate("/login")}
              className="hidden lg:inline-flex text-white bg-(--color-primary) hover:bg-[#2a4b70] font-medium cursor-pointer transition-all duration-300"
            >
              Đăng Nhập
            </Button>
          ) : (
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-sm text-(--color-primary) font-medium">
                Xin chào,{" "}
                <span className="font-semibold">
                  {(user && user.fullName) || "Người dùng"}
                </span>
              </span>
              <div className="relative">
                <Button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-(--color-primary) hover:bg-[#2a4b70] text-white font-medium cursor-pointer"
                >
                  <User size={20} className="text-white" />
                </Button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                    <Link
                      to="/member"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-300"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Thông tin tài khoản
                    </Link>
                    <Link
                      to="/member/booking-history"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-300"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Lịch sử đặt phòng
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-300 cursor-pointer"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button className="cursor-pointer bg-(--color-primary) hover:bg-[#2a4b70]">
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-70 sm:w-[320px] p-6 flex flex-col justify-between rounded-l-2xl shadow-2xl border-l border-[(--color-background)]/30 animate-slide-in"
            >
              <SheetTitle className="sr-only">Menu của TWAN HOTEL</SheetTitle>
              <SheetDescription className="sr-only">
                Đây là menu điều hướng chính của website TWAN HOTEL.
              </SheetDescription>

              {user && (
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-(--color-primary) font-medium text-base">
                    Xin chào,{" "}
                    {(user && user.fullName) || "Người dùng"}
                  </span>
                </div>
              )}

              <div className="mb-8 text-center">
                <span className="text-lg font-bold tracking-wide text-(--color-primary) font-serif">
                  HotelLink
                </span>
              </div>

              {/* Menu Items */}
              <nav className="flex flex-col space-y-6 text-center">
                {menuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="relative text-lg font-medium tracking-wide text-(--color-primary) transition-all group"
                  >
                    {item.label}
                    <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-(--color-primary) transition-all duration-500 ease-out group-hover:w-full"></span>
                  </Link>
                ))}
              </nav>

              {/* Auth section (mobile) */}
              <div className="mt-12 flex flex-col gap-3">
                {!user ? (
                  <Button
                    onClick={() => {
                      navigate("/login");
                      setMobileOpen(false);
                    }}
                    className="w-full py-4 text-white bg-(--color-primary) hover:bg-[#2a4b70] rounded-md font-medium tracking-wide transition-all duration-300 cursor-pointer"
                  >
                    Đăng Nhập
                  </Button>
                ) : (
                  <>
                    <div className="flex flex-col gap-2">
                      <Link
                        to="/member"
                        onClick={() => setMobileOpen(false)}
                        className="w-full py-3 text-white bg-(--color-primary) hover:bg-[#2a4b70] rounded-md font-medium tracking-wide text-center transition-all duration-300"
                      >
                        Thông tin cá nhân
                      </Link>
                      <Link
                        to="/member/booking-history"
                        onClick={() => setMobileOpen(false)}
                        className="w-full py-3 text-white bg-(--color-primary) hover:bg-[#2a4b70] rounded-md font-medium tracking-wide text-center transition-all duration-300"
                      >
                        Lịch sử đặt phòng
                      </Link>
                    </div>

                    <Button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="w-full py-3 bg-(--color-background) hover:bg-[#b8944f] text-white rounded-md font-medium tracking-wide transition-all duration-300 mt-3 cursor-pointer"
                    >
                      Đăng xuất
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Header;
