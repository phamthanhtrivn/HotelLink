/* eslint-disable react-hooks/exhaustive-deps */
import ActionButtons from "@/components/common/employee/ActionButtons";
import AdminManagementLayout from "@/components/common/employee/AdminManagementLayout";
import AdminPagination from "@/components/common/employee/AdminPagination";
import AdminTable from "@/components/common/employee/AdminTable";
import DetailDialog from "@/components/common/employee/DetailModal";
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
import { Slider } from "@/components/ui/slider";
import {
  POINT_RANGE,
  STATUS_CUSTOMER_OPTIONS,
} from "@/constants/CustomerConstants";
import { formatDateTimeForCustomer } from "@/helpers/dateHelpers";
import { customerService } from "@/services/customerService";
import { Loader2, RotateCcw, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const CustomerManagement = () => {
  const columns = [
    { key: "id", label: "ID", render: (i) => i?.userId || "-" },
    {
      key: "fullName",
      label: "Họ tên",
      render: (i) => i?.fullName || "-",
    },
    {
      key: "email",
      label: "Email",
      render: (i) => i?.user.email || "-",
    },
    {
      key: "phone",
      label: "Số điện thoại",
      render: (i) => i?.phone || "—",
    },
    {
      key: "points",
      label: "Điểm tích lũy",
      render: (i) => i?.points || "-",
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (i) => (
        <Badge
          onClick={() => handleToggleStatus(i)}
          className={`cursor-pointer italic ${
            i?.user.status ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {i?.user.status ? "Hoạt động" : "Bị khóa"}
        </Badge>
      ),
    },
  ];

  const columnsDetail = [
    { key: "id", label: "ID", render: (i) => i?.userId || "-" },
    {
      key: "fullName",
      label: "Họ tên",
      render: (i) => i?.fullName || "-",
    },
    {
      key: "email",
      label: "Email",
      render: (i) => i?.user.email || "-",
    },
    {
      key: "phone",
      label: "Số điện thoại",
      render: (i) => i?.phone || "—",
    },
    {
      key: "points",
      label: "Điểm tích lũy",
      render: (i) => i?.points || "-",
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (i) => (
        <Badge
          onClick={() => handleToggleStatus(i)}
          className={`cursor-pointer italic ${
            i?.user.status ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {i?.user.status ? "Hoạt động" : "Bị khóa"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      render: (i) => formatDateTimeForCustomer(i?.user.createdAt),
    },
    {
      key: "updatedAt",
      label: "Ngày cập nhật",
      render: (i) => formatDateTimeForCustomer(i?.user.updatedAt),
    },
  ];

  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    fullName: "",
    email: "",
    phone: "",
    status: "",
  });
  const [pointRange, setPointRange] = useState(POINT_RANGE);

  const [openDetail, setOpenDetail] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  const fetchCustomers = async (
    pageIndex = 0,
    pointOveride = pointRange,
    filterOverride = filters
  ) => {
    setLoading(true);
    try {
      const res = await customerService.searchAdvance({
        page: pageIndex,
        size: 10,
        ...(filterOverride?.fullName && {
          fullName: filterOverride.fullName,
        }),
        ...(filterOverride?.email && {
          email: filterOverride.email,
        }),
        ...(filterOverride?.phone && {
          phone: filterOverride.phone,
        }),
        ...(filterOverride?.status && {
          status: filterOverride.status,
        }),
        ...(pointOveride && {
          minPoint: pointOveride[0],
          maxPoint: pointOveride[1],
        }),
      });

      const pageData = res.data;
      setCustomers(pageData.content);
      setPage(pageData.number);
      setTotalPages(pageData.totalPages);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách khách hàng");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchCustomers(0, pointRange, filters);
  };

  const handleClear = () => {
    const resetFilters = {
      fullName: "",
      email: "",
      phone: "",
      status: "",
    };

    const resetPointRange = POINT_RANGE;

    setFilters(resetFilters);
    setPointRange(resetPointRange);
    setPage(0);

    fetchCustomers(0, resetPointRange, resetFilters);
  };

  const handleDetail = (item) => {
    setCurrentCustomer(item);
    setOpenDetail(true);
  };

  const handleToggleStatus = async (customer) => {
    const nextStatus = !customer.user.status;

    const result = await Swal.fire({
      title: "Xác nhận thay đổi",
      text: nextStatus
        ? "Bạn muốn cho khách hàng này hoạt động?"
        : "Bạn muốn khóa khách hàng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await customerService.updateStatus(
        customer.userId,
        nextStatus
      );

      if (res.success) {
        toast.success(res.message);
        fetchCustomers(page);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi cập nhật trạng thái khách hàng");
    }
  };

  useEffect(() => {
    fetchCustomers(page);
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
        title="Quản lý Khách hàng"
        filters={
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                placeholder="Họ tên khách hàng"
                value={filters.fullName}
                onChange={(e) =>
                  setFilters({ ...filters, fullName: e.target.value })
                }
              />

              <Input
                placeholder="Email"
                value={filters.email}
                onChange={(e) =>
                  setFilters({ ...filters, email: e.target.value })
                }
              />

              <Input
                placeholder="Số điện thoại"
                value={filters.phone}
                onChange={(e) =>
                  setFilters({ ...filters, phone: e.target.value })
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
                  {STATUS_CUSTOMER_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-xl border p-4 bg-muted/30 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Khoảng điểm tích lũy</span>
                <span className="font-medium">
                  {pointRange[0]} - {pointRange[1]}
                </span>
              </div>

              <Slider
                value={pointRange}
                onValueChange={setPointRange}
                min={0}
                max={50}
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
            data={customers}
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

      {currentCustomer && (
        <DetailDialog
          title={"Chi tiết Khách hàng"}
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          data={currentCustomer}
          fields={columnsDetail}
        />
      )}
    </>
  );
};

export default CustomerManagement;
