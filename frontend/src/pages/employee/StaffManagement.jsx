/* eslint-disable react-hooks/exhaustive-deps */
import ActionButtons from "@/components/common/employee/ActionButtons";
import AdminManagementLayout from "@/components/common/employee/AdminManagementLayout";
import AdminPagination from "@/components/common/employee/AdminPagination";
import AdminTable from "@/components/common/employee/AdminTable";
import DetailDialog from "@/components/common/employee/DetailModal";
import EditCreateModal from "@/components/common/employee/EditCreateModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GENDER_TYPES,
  GENDER_TYPES_OPTIONS,
  STATUS_STAFF_OPTIONS,
} from "@/constants/StaffConstants";
import { formatDateTimeForCustomer } from "@/helpers/dateHelpers";
import { staffService } from "@/services/staffService";
import { Loader2, PlusCircleIcon, RotateCcw, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const StaffManagement = () => {
  const columns = [
    { key: "id", label: "ID", render: (i) => i?.userId },
    { key: "name", label: "Họ tên", render: (i) => i?.fullName },
    { key: "email", label: "Email", render: (i) => i?.user.email },
    { key: "phone", label: "Số điện thoại", render: (i) => i?.phone },
    {
      key: "identificationId",
      label: "CMT/CCCD",
      render: (i) => i?.identificationId,
    },
    {
      key: "gender",
      label: "Giới tính",
      render: (i) => GENDER_TYPES?.[i?.gender],
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
    { key: "id", label: "ID", render: (i) => i?.userId },
    { key: "name", label: "Họ tên", render: (i) => i?.fullName },
    { key: "email", label: "Email", render: (i) => i?.user.email },
    { key: "phone", label: "Số điện thoại", render: (i) => i?.phone },
    {
      key: "identificationId",
      label: "CMT/CCCD",
      render: (i) => i?.identificationId,
    },
    {
      key: "gender",
      label: "Giới tính",
      render: (i) => GENDER_TYPES?.[i?.gender],
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (i) => (
        <Badge
          className={`italic ${i?.user.status ? "bg-green-600" : "bg-red-600"}`}
        >
          {i?.user.status ? "Hoạt động" : "Bị khóa"}
        </Badge>
      ),
    },
    {
      key: "dateOfBirth",
      label: "Ngày sinh",
      render: (i) => new Date(i?.dateOfBirth).toLocaleDateString("vi-VN"),
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      render: (i) => formatDateTimeForCustomer(i?.user.createdAt),
    },
    {
      key: "updatedAt",
      label: "Ngày cập nhật",
      render: (i) => formatDateTimeForCustomer(i?.user.updatedAt) || "-",
    },
  ];

  const [staffs, setStaffs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [filters, setFilters] = useState({
    fullName: "",
    email: "",
    phone: "",
    identificationId: "",
    gender: "",
    status: "",
  });

  const [openDetail, setOpenDetail] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);

  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    identificationId: "",
    gender: "MALE",
    dateOfBirth: "",
  });
  const [errors, setErrors] = useState({});

  const fetchStaffs = async (pageIndex = 0, filtersOverride = filters) => {
    setLoading(true);
    try {
      const res = await staffService.seachAdvance({
        page: pageIndex,
        size: 10,
        ...(filtersOverride.fullName && { fullName: filtersOverride.fullName }),
        ...(filtersOverride.email && { email: filtersOverride.email }),
        ...(filtersOverride.phone && { phone: filtersOverride.phone }),
        ...(filtersOverride.identificationId && {
          identificationId: filtersOverride.identificationId,
        }),
        ...(filtersOverride.gender && { gender: filtersOverride.gender }),
        ...(filtersOverride.status && { status: filtersOverride.status }),
      });

      const pageData = res.data;
      setStaffs(pageData.content);
      setPage(pageData.number);
      setTotalPages(pageData.totalPages);
    } catch (error) {
      console.log(error);
      toast.error("Đã có lỗi xảy ra khi tải danh sách nhân viên.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchStaffs(0);
  };

  const handleClear = () => {
    const resetFilters = {
      fullName: "",
      email: "",
      phone: "",
      identificationId: "",
      gender: "",
      status: "",
    };

    setFilters(resetFilters);
    setPage(0);

    fetchStaffs(0, resetFilters);
  };

  const handleDetail = (item) => {
    setCurrentStaff(item);
    setOpenDetail(true);
  };

  const handleToggleStatus = async (staff) => {
    const nextStatus = !staff.user.status;

    const result = await Swal.fire({
      title: "Xác nhận thay đổi",
      text: nextStatus
        ? "Bạn muốn cấp hoạt động cho tài khoản này?"
        : "Bạn muốn khóa tài khoản này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await staffService.updateStatus(staff.userId, nextStatus);

      if (res.success) {
        toast.success(res.message);
        fetchStaffs(page);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi cập nhật trạng thái nhân viên");
    }
  };

  const handleAdd = () => {
    setCurrentStaff(null);
    setFormData({
      email: "",
      password: "",
      fullName: "",
      phone: "",
      identificationId: "",
      gender: "MALE",
      dateOfBirth: "",
    });
    setErrors({});
    setOpenForm(true);
  };

  const handleUpdate = (staff) => {
    setCurrentStaff(staff);
    setFormData({
      email: staff.user.email,
      password: "",
      fullName: staff.fullName,
      phone: staff.phone,
      identificationId: staff.identificationId,
      gender: staff.gender,
      dateOfBirth: staff.dateOfBirth,
      status: staff.user.status,
    });
    setErrors({});
    setOpenForm(true);
  };

  const handleSaveAndUpdate = async () => {
    setErrors({});

    const payloadAdd = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone,
      identificationId: formData.identificationId,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
    };

        console.log(payloadAdd);

    const payloadUpdate = {
      fullName: formData.fullName,
      phone: formData.phone,
      identificationId: formData.identificationId,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
    };

    try {
      setSaveLoading(true);

      if (currentStaff) {
        const res = await staffService.updateStaff(
          currentStaff.userId,
          payloadUpdate
        );
        if (res.success) {
          toast.success(res.message);
          setOpenForm(false);
          fetchStaffs(0);
          setPage(0);
        } else {
          toast.error(res.message);
          setErrors(res.data);
        }
      } else {
        const res = await staffService.createStaff(payloadAdd);
        if (res.success) {
          toast.success(res.message);
          setOpenForm(false);
          fetchStaffs(0);
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
    fetchStaffs(page);
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
        title="Quản lý Nhân viên"
        actions={
          <Button
            onClick={handleAdd}
            className="bg-(--color-primary) hover:bg-[#2a4b70] cursor-pointer"
          >
            <PlusCircleIcon className="mr-1" />
            Thêm nhân viên
          </Button>
        }
        filters={
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="Tên nhân viên..."
                value={filters.fullName}
                onChange={(e) =>
                  setFilters({ ...filters, fullName: e.target.value })
                }
              />

              <Input
                placeholder="Email..."
                value={filters.email}
                onChange={(e) =>
                  setFilters({ ...filters, email: e.target.value })
                }
              />

              <Input
                placeholder="Số điện thoại..."
                value={filters.phone}
                onChange={(e) =>
                  setFilters({ ...filters, phone: e.target.value })
                }
              />

              <Input
                placeholder="Căn cước công dân..."
                value={filters.identificationId}
                onChange={(e) =>
                  setFilters({ ...filters, identificationId: e.target.value })
                }
              />

              <Select
                value={filters.gender}
                onValueChange={(v) => setFilters({ ...filters, gender: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Giới tính" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_TYPES_OPTIONS.map((t) => (
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
                  {STATUS_STAFF_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            data={staffs}
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

      {currentStaff && (
        <DetailDialog
          title={"Chi tiết Nhân viên"}
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          data={currentStaff}
          fields={columnsDetail}
        />
      )}

      <EditCreateModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        title={currentStaff ? "Cập nhật nhân viên" : "Thêm nhân viên"}
        onSubmit={handleSaveAndUpdate}
        loading={saveLoading}
      >
        <div className="space-y-4">
          <div className="space-y-2 flex justify-end">
            {currentStaff && (
              <Badge
                className={`cursor-pointer italic ${
                  currentStaff?.user.status ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {currentStaff?.user.status ? "Hoạt động" : "Bị khóa"}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={errors?.email && "border-red-500"}
              readOnly={Boolean(currentStaff)}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {!currentStaff && (
            <div className="space-y-2">
              <Label>
                Mật khẩu <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={errors.password && "border-red-500"}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label>
              Họ tên <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className={errors.fullName && "border-red-500"}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Số điện thoại <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className={errors.phone && "border-red-500"}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              CCCD/CMT <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.identificationId}
              onChange={(e) =>
                setFormData({ ...formData, identificationId: e.target.value })
              }
              className={errors.identificationId && "border-red-500"}
            />
            {errors.identificationId && (
              <p className="text-sm text-red-500">{errors.identificationId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Giới tính <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(v) => setFormData({ ...formData, gender: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                {GENDER_TYPES_OPTIONS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-red-500">{errors.gender}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Ngày sinh <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              className={errors.dateOfBirth && "border-red-500"}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
            )}
          </div>
        </div>
      </EditCreateModal>
    </>
  );
};

export default StaffManagement;
