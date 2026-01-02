/* eslint-disable react-hooks/exhaustive-deps */
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import AdminTable from "@/components/common/employee/AdminTable";
import AdminPagination from "@/components/common/employee/AdminPagination";
import ActionButtons from "@/components/common/employee/ActionButtons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { serviceSerice } from "@/services/serviceService";
import { Loader2, PlusCircleIcon, RotateCcw, Search } from "lucide-react";
import {
  SERVICE_TYPE_LABELS,
  SERVICE_TYPES,
} from "@/constants/ServiceConstants";
import { STATUS_OPTIONS } from "@/constants/StatusConstants";
import AdminManagementLayout from "@/components/common/employee/AdminManagementLayout";
import { formatVND } from "@/helpers/currencyFormatter";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

const ServiceManagement = () => {
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Tên" },
    {
      key: "serviceType",
      label: "Loại",
      render: (i) => SERVICE_TYPE_LABELS[i.serviceType] || "—",
    },
    {
      key: "unitPrice",
      label: "Giá",
      render: (i) => formatVND(i.unitPrice),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (i) => (
        <Badge className={`${i.status ? "bg-green-600" : "bg-red-600"} italic`}>
          {i.status ? "Hoạt động" : "Tạm ngưng"}
        </Badge>
      ),
    },
  ];

  const [services, setServices] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState({
    name: "",
    type: "",
    status: "",
    minPrice: "",
    maxPrice: "",
  });
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [loading, setLoading] = useState(false);

  const handleFetchServices = async (pageIndex = 0, overrideFilters = {}) => {
    setLoading(true);
    try {
      const res = await serviceSerice.findService({
        page: pageIndex,
        size: 10,
        ...(filters.name && { name: filters.name }),
        ...(filters.type && { type: filters.type }),
        ...(filters.status !== "" && { status: filters.status }),
        ...(overrideFilters.minPrice !== undefined && {
          minPrice: overrideFilters.minPrice,
        }),
        ...(overrideFilters.maxPrice !== undefined && {
          maxPrice: overrideFilters.maxPrice,
        }),
      });

      const pageData = res.data;
      setServices(pageData.content);
      setPage(pageData.number);
      setTotalPages(pageData.totalPages);
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi lấy danh sách dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    handleFetchServices(0, {
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  const handleClear = async () => {
    const clearedFilters = {
      name: "",
      type: "",
      status: "",
      minPrice: "",
      maxPrice: "",
    };

    setFilters(clearedFilters);
    setPriceRange([0, 500000]);
    setPage(0);

    setLoading(true);
    try {
      const res = await serviceSerice.findService({
        page: 0,
        size: 10,
      });

      const pageData = res.data;
      setServices(pageData.content);
      setTotalPages(pageData.totalPages);
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi làm mới dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchServices(page);
  }, [page]);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        <Loader2 className="w-16 h-16 text-[#1E2A38] animate-spin" />
      </div>
    );

  return (
    <AdminManagementLayout
      title="Quản lý Dịch vụ"
      actions={
        <Button className="bg-(--color-primary) cursor-pointer hover:bg-[#2a4b70]">
          <PlusCircleIcon />
          Thêm dịch vụ
        </Button>
      }
      filters={
        <div className="flex flex-col gap-4">
          {/* ROW 1: TEXT / SELECT FILTERS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="Tên dịch vụ..."
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />

            <Select
              value={filters.type}
              onValueChange={(value) => setFilters({ ...filters, type: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Loại dịch vụ" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ROW 2: PRICE SLIDER */}
          <div className="rounded-xl border p-4 space-y-3 bg-muted/30">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Khoảng giá</span>
              <span className="font-medium text-foreground">
                {formatVND(priceRange[0])} – {formatVND(priceRange[1])}
              </span>
            </div>

            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={0}
              max={500000}
              step={10000}
              className="mt-2 bg-(--color-primary) cursor-pointer"
            />
          </div>

          {/* ROW 3: ACTIONS */}
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setFilters({
                  ...filters,
                  minPrice: priceRange[0],
                  maxPrice: priceRange[1],
                });
                handleSearch();
              }}
              className="bg-(--color-primary) cursor-pointer hover:bg-[#2a4b70]"
            >
              <Search className="w-4 h-4 mr-1" />
              Tìm kiếm
            </Button>

            <Button
              variant="outline"
              onClick={handleClear}
              className="hover:bg-gray-300 cursor-pointer"
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
          data={services}
          renderActions={() => (
            <ActionButtons onView={() => {}} onEdit={() => {}} />
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
  );
};

export default ServiceManagement;
