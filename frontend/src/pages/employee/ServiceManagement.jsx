/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader2, PlusCircleIcon, RotateCcw, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import AdminManagementLayout from "@/components/common/employee/AdminManagementLayout";
import AdminTable from "@/components/common/employee/AdminTable";
import AdminPagination from "@/components/common/employee/AdminPagination";
import ActionButtons from "@/components/common/employee/ActionButtons";
import DetailDialog from "@/components/common/employee/DetailModal";

import { serviceSerice } from "@/services/serviceService";
import { formatVND } from "@/helpers/currencyFormatter";
import {
  DEFAULT_PRICE_RANGE,
  SERVICE_TYPES,
  SERVICE_TYPE_LABELS,
} from "@/constants/ServiceConstants";
import { STATUS_OPTIONS } from "@/constants/StatusConstants";
import EditCreateModal from "@/components/common/employee/EditCreateModal";

const ServiceManagement = () => {
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Tên" },
    {
      key: "serviceType",
      label: "Loại",
      render: (i) => SERVICE_TYPE_LABELS?.[i?.serviceType] || "—",
    },
    {
      key: "unitPrice",
      label: "Giá",
      render: (i) => formatVND(i?.unitPrice),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (i) => (
        <Badge
          className={`italic ${i?.status ? "bg-green-600" : "bg-red-600"}`}
        >
          {i?.status ? "Hoạt động" : "Tạm ngưng"}
        </Badge>
      ),
    },
  ];

  const [services, setServices] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [filters, setFilters] = useState({
    name: "",
    type: "",
    status: "",
  });

  const [priceRange, setPriceRange] = useState(DEFAULT_PRICE_RANGE);

  const [openDetail, setOpenDetail] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    serviceType: "OTHER",
    unitPrice: "",
    status: true,
  });
  const [errors, setErrors] = useState({});

  const fetchServices = async (pageIndex = 0, priceOverride) => {
    setLoading(true);
    try {
      const res = await serviceSerice.findService({
        page: pageIndex,
        size: 10,
        ...(filters.name && { name: filters.name }),
        ...(filters.type && { type: filters.type }),
        ...(filters.status !== "" && { status: filters.status }),
        ...(priceOverride && {
          minPrice: priceOverride[0],
          maxPrice: priceOverride[1],
        }),
      });

      const pageData = res.data;
      setServices(pageData.content);
      setPage(pageData.number);
      setTotalPages(pageData.totalPages);
    } catch (e) {
      console.log(e);
      toast.error("Lỗi khi tải danh sách dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchServices(0, priceRange);
  };

  const handleClear = () => {
    setFilters({ name: "", type: "", status: "" });
    setPriceRange(DEFAULT_PRICE_RANGE);
    setPage(0);
    fetchServices(0);
  };

  const handleDetail = (item) => {
    setCurrentService(item);
    setOpenDetail(true);
  };

  const handleAdd = () => {
    setCurrentService(null);
    setFormData({
      name: "",
      serviceType: "OTHER",
      unitPrice: "",
      status: true,
    });
    setErrors({});
    setOpenForm(true);
  };

  const handleUpdate = (item) => {
    setCurrentService(item);
    setFormData({
      name: item.name,
      serviceType: item.serviceType,
      unitPrice: item.unitPrice,
      status: item.status,
    });
    setErrors({});
    setOpenForm(true);
  };

  const handleSaveAndUpdate = async () => {
    setErrors({});

    const payload = {
      name: formData.name,
      serviceType: formData.serviceType,
      unitPrice: Number(formData.unitPrice),
      status: formData.status,
    };

    try {
      setSaveLoading(true);

      if (currentService) {
        const res = await serviceSerice.updateService(
          currentService.id,
          payload
        );
        if (res.success) {
          toast.success(res.message);
          setOpenForm(false);
          fetchServices(0);
          setPage(0);
        } else {
          toast.error(res.message);
          setErrors(res.data);
        }
      } else {
        const res = await serviceSerice.saveService(payload);
        if (res.success) {
          toast.success(res.message);
          setOpenForm(false);
          fetchServices(0);
          setPage(0);
        } else {
          toast.error(res.message);
          setErrors(res.data);
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi lưu dữ liệu");
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(page);
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
        title="Quản lý Dịch vụ"
        actions={
          <Button
            onClick={handleAdd}
            className="bg-(--color-primary) hover:bg-[#2a4b70] cursor-pointer"
          >
            <PlusCircleIcon className="mr-1" />
            Thêm dịch vụ
          </Button>
        }
        filters={
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="Tên dịch vụ..."
                value={filters.name}
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
              />

              <Select
                value={filters.type}
                onValueChange={(v) => setFilters({ ...filters, type: v })}
              >
                <SelectTrigger>
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
                onValueChange={(v) => setFilters({ ...filters, status: v })}
              >
                <SelectTrigger>
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

            <div className="rounded-xl border p-4 bg-muted/30 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Khoảng giá</span>
                <span className="font-medium">
                  {formatVND(priceRange[0])} - {formatVND(priceRange[1])}
                </span>
              </div>

              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={500000}
                step={10000}
              />
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
            data={services}
            renderActions={(item) => (
              <ActionButtons
                onView={() => handleDetail(item)}
                onEdit={() => handleUpdate(item)}
              />
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

      {currentService && (
        <DetailDialog
          title={"Chi tiết Dịch vụ"}
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          data={currentService}
          fields={columns}
        />
      )}

      <EditCreateModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        title={currentService ? "Cập nhật Dịch vụ" : "Thêm Dịch vụ"}
        onSubmit={handleSaveAndUpdate}
        loading={saveLoading}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>
              Tên dịch vụ <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={errors.name && "border-red-500"}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Đơn giá <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              value={formData.unitPrice}
              onChange={(e) =>
                setFormData({ ...formData, unitPrice: e.target.value })
              }
              className={errors.unitPrice && "border-red-500"}
            />
            {errors.unitPrice && (
              <p className="text-sm text-red-500">{errors.unitPrice}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Loại dịch vụ <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.serviceType}
              onValueChange={(v) =>
                setFormData({ ...formData, serviceType: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.serviceType && (
              <p className="text-sm text-red-500">{errors.serviceType}</p>
            )}
          </div>

          {currentService && (
            <div className="space-y-2">
              <Label>
                Trạng thái <span className="text-red-500">*</span>
              </Label>

              <Select
                value={String(formData.status)}
                onValueChange={(v) =>
                  setFormData({ ...formData, status: v === "true" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Hoạt động</SelectItem>
                  <SelectItem value="false">Tạm ngưng</SelectItem>
                </SelectContent>
              </Select>

              {errors.status && (
                <p className="text-sm text-red-500">{errors.status}</p>
              )}
            </div>
          )}
        </div>
      </EditCreateModal>
    </>
  );
};

export default ServiceManagement;
