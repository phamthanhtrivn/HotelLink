/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { bookingService } from "@/services/bookingService";
import { AuthContext } from "@/context/AuthContext";
import { statusOptions } from "@/constants/BookingStatusConstants";
import BookingItem from "@/components/common/customer/BookingItem";

const BookingHistory = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = async () => {
    const params = {
      page,
      size: 5,
    };

    if (filterStatus !== "ALL") {
      params.status = filterStatus;
    }

    const res = await bookingService.getBookingsByCustomerId(
      user.userId,
      params
    );

    const pageData = res.data;
    setBookings(pageData.content);
    setTotalPages(pageData.totalPages);
  };

  useEffect(() => {
    fetchBookings();
  }, [page, filterStatus]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Lịch sử đặt phòng
          </h1>
          <p className="text-muted-foreground">
            Danh sách các đơn đặt phòng gần nhất
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-muted-foreground" />
          <Select
            value={filterStatus}
            onValueChange={(v) => {
              setPage(0);
              setFilterStatus(v);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Lọc trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {bookings.map((b) => (
          <BookingItem key={b.id} booking={b} user={user} onBookingUpdated={fetchBookings} />
        ))}

        {bookings.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            Không có đơn đặt phòng nào
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4">
        <Button
          variant="outline"
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
        >
          Trước
        </Button>

        <span className="text-sm text-muted-foreground">
          Trang {page + 1} / {totalPages}
        </span>

        <Button
          variant="outline"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Sau
        </Button>
      </div>
    </div>
  );
};

export default BookingHistory;
