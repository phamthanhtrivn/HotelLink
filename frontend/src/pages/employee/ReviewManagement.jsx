/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader2, RotateCcw, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import AdminManagementLayout from "@/components/common/employee/AdminManagementLayout";
import AdminTable from "@/components/common/employee/AdminTable";
import AdminPagination from "@/components/common/employee/AdminPagination";
import ActionButtons from "@/components/common/employee/ActionButtons";
import DetailDialog from "@/components/common/employee/DetailModal";
import EditCreateModal from "@/components/common/employee/EditCreateModal";

import { reviewService } from "@/services/reviewService";
import { formatDateTimeForCustomer } from "@/helpers/dateHelpers";
import { STATUS_REVIEW_OPTIONS } from "@/constants/StatusConstants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";
import { SCORE_RANGE } from "@/constants/ReviewConstants";

const ReviewManagement = () => {
  const columns = [
    { key: "id", label: "ID" },
    {
      key: "customer",
      label: "Khách hàng",
      render: (i) => i?.customer?.fullName || "—",
    },
    {
      key: "booking",
      label: "Mã Booking",
      render: (i) => i?.booking?.id || "—",
    },
    {
      key: "scores",
      label: "Điểm trung bình",
      render: (i) =>
        `${(
          (Number(i?.cleanlinessScore) +
            Number(i?.serviceScore) +
            Number(i?.facilitiesScore)) /
          3
        ).toFixed(2)} / 10`,
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (i) => (
        <Badge
          onClick={() => handleToggleStatus(i)}
          className={`cursor-pointer italic ${
            i?.status ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {i?.status ? "Hiển thị" : "Ẩn"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      render: (i) => formatDateTimeForCustomer(i.createdAt),
    },
  ];

  const columnsDetail = [
    { key: "id", label: "ID" },

    {
      key: "cleanlinessScore",
      label: "Điểm sạch sẽ",
      render: (i) => `${Number(i?.cleanlinessScore)} / 10`,
    },
    {
      key: "serviceScore",
      label: "Điểm dịch vụ",
      render: (i) => `${i?.serviceScore} / 10`,
    },
    {
      key: "facilitiesScore",
      label: "Điểm cơ sở vật chất",
      render: (i) => `${i?.facilitiesScore} / 10`,
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (i) => (
        <Badge
          className={`italic ${i?.status ? "bg-green-600" : "bg-red-600"}`}
        >
          {i?.status ? "Hiển thị" : "Ẩn"}
        </Badge>
      ),
    },
    {
      key: "comments",
      label: "Bình luận",
      render: (i) => `${i?.comments}`,
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      render: (i) => formatDateTimeForCustomer(i?.createdAt) || "-",
    },
    {
      key: "updatedAt",
      label: "Ngày cập nhật",
      render: (i) => formatDateTimeForCustomer(i?.updatedAt) || "-",
    },
    {
      key: "customerId",
      label: "Mã khách hàng",
      render: (i) => i?.customer?.userId || "—",
    },
    {
      key: "fullName",
      label: "Họ tên khách hàng",
      render: (i) => i?.customer?.fullName || "—",
    },
    {
      key: "phone",
      label: "Số điện thoại",
      render: (i) => i?.customer?.phone || "—",
    },
    {
      key: "email",
      label: "Email",
      render: (i) => i?.customer?.user?.email || "—",
    },
    {
      key: "bookingId",
      label: "Mã đơn đặt phòng",
      render: (i) => i?.booking?.id || "—",
    },
    {
      key: "roomNumber",
      label: "Số phòng",
      render: (i) => i?.booking?.room?.roomNumber || "—",
    },
    {
      key: "floor",
      label: "Số tầng",
      render: (i) => i?.booking?.room?.floor || "—",
    },
    {
      key: "roomTypeName",
      label: "Loại phòng",
      render: (i) => i?.booking?.room?.roomType?.name || "—",
    },
    {
      key: "bookingStatus",
      label: "Trạng thái",
      render: (i) => i?.booking?.bookingStatus || "—",
    },
  ];

  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    customerName: "",
    bookingId: "",
    keyword: "",
    status: "",
  });
  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  });

  const [scoreRange, setScoreRange] = useState(SCORE_RANGE);

  const [openDetail, setOpenDetail] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);

  const fetchReviews = async (
    pageIndex = 0,
    scoreOverride = scoreRange,
    filterOverride = filters,
    dateOverride = dateRange
  ) => {
    setLoading(true);
    try {
      const res = await reviewService.searchAdvance({
        page: pageIndex,
        size: 10,
        ...(filterOverride?.customerName && {
          customerName: filterOverride.customerName,
        }),
        ...(filterOverride?.bookingId && {
          bookingId: filterOverride.bookingId,
        }),
        ...(filterOverride?.keyword && {
          keyword: filterOverride.keyword,
        }),
        ...(filterOverride?.status !== "" && {
          status: filterOverride.status,
        }),

        ...(dateOverride?.fromDate && { fromDate: dateOverride.fromDate }),
        ...(dateOverride?.toDate && { toDate: dateOverride.toDate }),

        ...(scoreOverride && {
          minScore: scoreOverride[0],
          maxScore: scoreOverride[1],
        }),
      });

      const pageData = res.data;
      setReviews(pageData.content);
      setPage(pageData.number);
      setTotalPages(pageData.totalPages);
    } catch (e) {
      console.log(e);
      toast.error("Lỗi khi tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchReviews(0, scoreRange);
  };

  const handleClear = () => {
    const clearedFilters = {
      customerName: "",
      bookingId: "",
      keyword: "",
      status: "",
    };

    const clearedDate = {
      fromDate: "",
      toDate: "",
    };

    setFilters(clearedFilters);
    setDateRange(clearedDate);
    setScoreRange(SCORE_RANGE);
    setPage(0);

    fetchReviews(0, null, clearedFilters, clearedDate);
  };

  const handleDetail = (item) => {
    setCurrentReview(item);
    setOpenDetail(true);
  };

  const handleToggleStatus = async (review) => {
    const nextStatus = !review.status;

    const result = await Swal.fire({
      title: "Xác nhận thay đổi",
      text: nextStatus
        ? "Bạn muốn hiển thị đánh giá này?"
        : "Bạn muốn ẩn đánh giá này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await reviewService.updateStatus(review.id, nextStatus);

      if (res.success) {
        toast.success(res.message);
        fetchReviews(page);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi cập nhật trạng thái đánh giá");
    }
  };

  useEffect(() => {
    fetchReviews(page);
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
        title="Quản lý Đánh giá"
        filters={
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                placeholder="Họ tên khách hàng"
                value={filters.customerName}
                onChange={(e) =>
                  setFilters({ ...filters, customerName: e.target.value })
                }
              />

              <Input
                placeholder="Mã đơn đặt phòng"
                value={filters.bookingId}
                onChange={(e) =>
                  setFilters({ ...filters, bookingId: e.target.value })
                }
              />

              <Input
                placeholder="Nội dung đánh giá..."
                value={filters.keyword}
                onChange={(e) =>
                  setFilters({ ...filters, keyword: e.target.value })
                }
              />

              <Select
                value={filters.status}
                onValueChange={(v) => setFilters({ ...filters, status: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_REVIEW_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Từ ngày</Label>
                <Input
                  type="datetime-local"
                  value={dateRange.fromDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, fromDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <Label>Đến ngày</Label>
                <Input
                  type="datetime-local"
                  value={dateRange.toDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, toDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="rounded-xl border p-4 bg-muted/30 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Khoảng điểm</span>
                <span className="font-medium">
                  {scoreRange[0]} - {scoreRange[1]}
                </span>
              </div>

              <Slider
                value={scoreRange}
                onValueChange={setScoreRange}
                min={0}
                max={10}
                step={1}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-1" />
                Tìm kiếm
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Làm mới
              </Button>
            </div>
          </div>
        }
        table={
          <AdminTable
            columns={columns}
            data={reviews}
            renderActions={(item) => (
              <ActionButtons onView={() => handleDetail(item)} />
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

      {currentReview && (
        <DetailDialog
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          data={currentReview}
          fields={columnsDetail}
        />
      )}
    </>
  );
};

export default ReviewManagement;
