/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";

import AdminManagementLayout from "@/components/common/employee/AdminManagementLayout";
import AdminTable from "@/components/common/employee/AdminTable";
import AdminPagination from "@/components/common/employee/AdminPagination";
import ActionButtons from "@/components/common/employee/ActionButtons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Search,
  RotateCcw,
  Loader2,
  PlusCircle,
  LogOut,
  LogIn,
  Ban,
  UserX,
} from "lucide-react";
import { toast } from "react-toastify";

import { bookingService } from "@/services/bookingService";
import { formatDateTimeForCustomer } from "@/helpers/dateHelpers";
import {
  BOOKING_SOURCE_COLOR_MAP,
  BOOKING_SOURCE_LABEL_MAP,
  BOOKING_SOURCE_OPTIONS,
  statusColorMap,
  statusLabelMap,
  statusOptions,
} from "@/constants/BookingStatusConstants";
import { AuthContext } from "@/context/AuthContext";
import { formatVND } from "@/helpers/currencyFormatter";
import { BookingDetailModal } from "@/components/common/employee/BookingDetailModal";
import AddBookingServiceModal from "@/components/common/employee/AddBookingServiceModal";
import PreviewCheckoutModal from "@/components/common/employee/PreviewCheckoutModal";

const BookingManagement = () => {
  const { user } = useContext(AuthContext);
  const columns = [
    { key: "id", label: "Mã đơn", render: (i) => i?.booking.id },
    {
      key: "contactName",
      label: "Khách hàng",
      render: (i) => i?.booking.contactName,
    },
    {
      key: "contactPhone",
      label: "SĐT",
      render: (i) => i?.booking.contactPhone,
    },
    { key: "room", label: "Phòng", render: (i) => i?.booking.room?.roomNumber },

    {
      key: "bookingStatus",
      label: "Trạng thái",
      render: (i) => (
        <Badge className={statusColorMap[i?.booking.bookingStatus]}>
          {statusLabelMap[i?.booking.bookingStatus]}
        </Badge>
      ),
    },
    {
      key: "paid",
      label: "Thanh toán",
      render: (i) => (
        <Badge
          className={
            i?.booking.paid
              ? "bg-green-200 text-green-700"
              : "bg-yellow-200 text-yellow-700"
          }
        >
          {i?.booking.paid ? "Đã thanh toán" : "Chưa thanh toán"}
        </Badge>
      ),
    },

    {
      key: "checkIn",
      label: "Nhận phòng",
      render: (i) => formatDateTimeForCustomer(i?.booking.checkIn),
    },
    {
      key: "checkOut",
      label: "Trả phòng",
      render: (i) => formatDateTimeForCustomer(i?.booking.checkOut),
    },

    {
      key: "total",
      label: "Tổng tiền thanh toán",
      render: (i) => formatVND(i?.booking.totalPayment),
    },

    {
      key: "bookingSource",
      label: "Nguồn đặt",
      render: (i) => (
        <Badge className={BOOKING_SOURCE_COLOR_MAP[i?.booking.bookingSource]}>
          {BOOKING_SOURCE_LABEL_MAP[i?.booking.bookingSource]}
        </Badge>
      ),
    },

    {
      key: "actions",
      label: "Hành động",
    },
  ];

  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openAddService, setOpenAddService] = useState(false);
  const [openPreviewCheckout, setOpenPreviewCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noShowUpLoading, setNoShowUpLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);

  const [filters, setFilters] = useState({
    keyword: "",
    bookingStatus: "",
    bookingSource: "",
    paid: "",
    roomNumber: "",
  });
  const [dateRangeCheckIn, setDateRangeCheckIn] = useState({
    fromDate: "",
    toDate: "",
  });
  const [dateRangeCheckOut, setDateRangeCheckOut] = useState({
    fromDate: "",
    toDate: "",
  });

  const fetchBookings = async (
    pageIndex = 0,
    overrideFilters = filters,
    overrideDateRangeCheckIn = dateRangeCheckIn,
    overrideDateRangeCheckOut = dateRangeCheckOut,
  ) => {
    setLoading(true);
    try {
      const res = await bookingService.searchAdvance(
        {
          ...(overrideFilters.keyword && { keyword: overrideFilters.keyword }),
          ...(overrideFilters.bookingStatus && {
            bookingStatus: overrideFilters.bookingStatus,
          }),
          ...(overrideFilters.bookingSource && {
            bookingSource: overrideFilters.bookingSource,
          }),
          ...(overrideFilters.paid !== "" && {
            paid: overrideFilters.paid === "true",
          }),

          ...(overrideFilters.roomNumber && {
            roomNumber: overrideFilters.roomNumber,
          }),

          ...(overrideDateRangeCheckIn.fromDate && {
            checkInFrom: overrideDateRangeCheckIn.fromDate,
          }),
          ...(overrideDateRangeCheckIn.toDate && {
            checkInTo: overrideDateRangeCheckIn.toDate,
          }),

          ...(overrideDateRangeCheckOut.fromDate && {
            checkOutFrom: overrideDateRangeCheckOut.fromDate,
          }),
          ...(overrideDateRangeCheckOut.toDate && {
            checkOutTo: overrideDateRangeCheckOut.toDate,
          }),
        },
        {
          page: pageIndex,
          size: 5,
        },
      );

      const pageData = res.data;
      setBookings(pageData.content);
      setPage(pageData.number);
      setTotalPages(pageData.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách đơn đặt phòng");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchBookings(0);
  };

  const handleClear = () => {
    const reset = {
      keyword: "",
      bookingStatus: "",
      bookingSource: "",
      paid: "",
      roomNumber: "",
    };

    const resetDataRange = { fromDate: "", toDate: "" };
    setFilters(reset);
    setDateRangeCheckIn(resetDataRange);
    setDateRangeCheckOut(resetDataRange);

    setPage(0);
    fetchBookings(0, reset, resetDataRange, resetDataRange);
  };

  const handleDetail = (booking) => {
    setCurrentBooking(booking);
    setOpenDetail(true);
  };

  const handleNoShowUp = async (bookingId) => {
    setNoShowUpLoading(true);
    try {
      const data = {
        userId: user.userId,
        bookingStatus: "NO_SHOW",
      };
      const res = await bookingService.updateBookingStatus(bookingId, data);
      if (res.success) {
        toast.success(res.message);
        fetchBookings(page);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật trạng thái không đến thất bại");
    } finally {
      setNoShowUpLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    setCancelLoading(true);
    try {
      const data = {
        userId: user.userId,
        bookingStatus: "CANCELLED",
      };
      const res = await bookingService.updateBookingStatus(bookingId, data);
      if (res.success) {
        toast.success(res.message);
        fetchBookings(page);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật trạng thái không đến thất bại");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleCheckIn = async (bookingId) => {
    setCheckInLoading(true);
    try {
      const userId = user.userId;
      const res = await bookingService.checkInBooking(bookingId, userId);
      if (res.success) {
        toast.success(res.message);
        fetchBookings(page);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật trạng thái nhận phòng thất bại");
    } finally {
      setCheckInLoading(false);
    }
  };

  const handleAddServices = (booking) => {
    setCurrentBooking(booking);
    setOpenAddService(true);
  };

  const handleOpenPreviewCheckout = (booking) => {
    setCurrentBooking(booking);
    setOpenPreviewCheckout(true);
  };

  useEffect(() => {
    fetchBookings(page);
  }, [page]);

  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
        <Loader2 className="h-16 w-16 animate-spin text-[#1E2A38]" />
      </div>
    );

  return (
    <>
      <AdminManagementLayout
        title="Quản lý Đơn đặt phòng"
        filters={
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Tìm theo mã đơn / tên / SĐT / email"
                value={filters.keyword}
                onChange={(e) =>
                  setFilters({ ...filters, keyword: e.target.value })
                }
              />

              <Input
                placeholder="Số phòng"
                value={filters.roomNumber}
                onChange={(e) =>
                  setFilters({ ...filters, roomNumber: e.target.value })
                }
              />

              <Select
                value={filters.bookingStatus}
                onValueChange={(v) =>
                  setFilters({ ...filters, bookingStatus: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái đơn" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.bookingSource}
                onValueChange={(v) =>
                  setFilters({ ...filters, bookingSource: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nguồn đặt" />
                </SelectTrigger>
                <SelectContent>
                  {BOOKING_SOURCE_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.paid}
                onValueChange={(v) => setFilters({ ...filters, paid: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Thanh toán" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Đã thanh toán</SelectItem>
                  <SelectItem value="false">Chưa thanh toán</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Check-in từ</label>
                <Input
                  type="datetime-local"
                  value={dateRangeCheckIn.fromDate}
                  onChange={(e) =>
                    setDateRangeCheckIn({
                      ...dateRangeCheckIn,
                      fromDate: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Check-in đến</label>
                <Input
                  type="datetime-local"
                  value={dateRangeCheckIn.toDate}
                  onChange={(e) =>
                    setDateRangeCheckIn({
                      ...dateRangeCheckIn,
                      toDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Check-out từ</label>
                <Input
                  type="datetime-local"
                  value={dateRangeCheckOut.fromDate}
                  onChange={(e) =>
                    setDateRangeCheckOut({
                      ...dateRangeCheckOut,
                      fromDate: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Check-out đến</label>
                <Input
                  type="datetime-local"
                  value={dateRangeCheckOut.toDate}
                  onChange={(e) =>
                    setDateRangeCheckOut({
                      ...dateRangeCheckOut,
                      toDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={handleSearch}
                className="cursor-pointer bg-(--color-primary) hover:bg-[#2a4b70]"
              >
                <Search className="w-4 h-4 mr-1" />
                Tìm kiếm
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                className="cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Làm mới
              </Button>
            </div>
          </div>
        }
        table={
          <AdminTable
            columns={columns}
            data={bookings}
            renderActions={(item) => (
              <div className="flex flex-col gap-2 items-end">
                <ActionButtons onView={() => handleDetail(item)} />
                <div className="flex flex-col items-end gap-2">
                  {item.booking.bookingStatus === "CONFIRMED" && (
                    <>
                      <Button
                        onClick={() => handleNoShowUp(item.booking.id)}
                        disabled={noShowUpLoading}
                        className="
                        flex items-center justify-center gap-2
                        bg-amber-500 hover:bg-amber-600
                        text-white font-medium
                        rounded-lg h-10
                        transition-all
                        cursor-pointer
                      "
                      >
                        {noShowUpLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <UserX className="w-4 h-4" />
                            Không đến
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleCancelBooking(item.booking.id)}
                        disabled={cancelLoading}
                        variant="outline"
                        className="
                        flex items-center justify-center gap-2
                        border border-rose-500
                        text-rose-600 hover:bg-rose-50
                        font-medium
                        rounded-lg h-10
                        transition-all
                        cursor-pointer
                      "
                      >
                        {cancelLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Ban className="w-4 h-4" />
                            Huỷ
                          </>
                        )}
                      </Button>
                    </>
                  )}

                  {item.booking.bookingStatus === "CONFIRMED" &&
                    item.booking.bookingStatus !== "COMPLETED" && (
                      <Button
                        onClick={() => handleCheckIn(item.booking.id)}
                        disabled={checkInLoading}
                        className="
                        flex items-center justify-center gap-2
                        bg-emerald-500 hover:bg-emerald-600
                        text-white font-medium
                        rounded-lg h-10
                        transition-all
                        cursor-pointer
                      "
                      >
                        <LogIn className="w-4 h-4" />
                        Nhận phòng
                      </Button>
                    )}

                  {item.booking.bookingStatus === "CHECKED_IN" && (
                    <>
                      <Button
                        onClick={() => handleOpenPreviewCheckout(item)}
                        className="
                          flex items-center justify-center gap-2
                          bg-rose-500 hover:bg-rose-600
                          text-white font-medium
                          rounded-lg h-10
                          transition-all
                          cursor-pointer
                        "
                      >
                        <LogOut className="w-4 h-4" />
                        Trả phòng
                      </Button>

                      <Button
                        onClick={() => handleAddServices(item)}
                        className="
                          flex items-center justify-center gap-2
                          bg-(--color-primary) hover:bg-[#2a4b70]
                          text-white font-medium
                          rounded-lg h-10
                          transition-all
                          cursor-pointer
                        "
                      >
                        <PlusCircle className="w-4 h-4" />
                        Thêm dịch vụ
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          />
        }
        pagination={
          <AdminPagination
            currentPage={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        }
      />
      {currentBooking && (
        <BookingDetailModal
          title={"Chi tiết Đơn đặt phòng"}
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          data={currentBooking.booking}
          services={currentBooking.bookingServices}
        />
      )}
      {currentBooking && (
        <AddBookingServiceModal
          open={openAddService}
          onClose={() => setOpenAddService(false)}
          bookingId={currentBooking.booking.id}
          userId={user.userId}
          bookingServices={currentBooking.bookingServices}
          reload={() => fetchBookings(page)}
        />
      )}
      {currentBooking && (
        <PreviewCheckoutModal
          open={openPreviewCheckout}
          onClose={() => setOpenPreviewCheckout(false)}
          booking={currentBooking.booking}
          userId={user.userId}
          reload={() => fetchBookings(page)}
        />
      )}
    </>
  );
};

export default BookingManagement;
