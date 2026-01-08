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
  FLOOR_OPTIONS,
  ROOM_STATUS,
  ROOM_TYPE_OPTIONS,
} from "@/constants/roomConstants";
import { STATUS_OPTIONS } from "@/constants/StatusConstants";
import { formatDateTimeForCustomer } from "@/helpers/dateHelpers";
import { roomService } from "@/services/roomService";
import { roomTypeService } from "@/services/roomTypeService";
import { Loader2, RotateCcw, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const RoomManagement = () => {
  const columns = [
    { key: "id", label: "ID", render: (i) => i?.id },
    { key: "roomNumber", label: "Số phòng", render: (i) => i?.roomNumber },
    { key: "floor", label: "Tầng", render: (i) => i?.floor },
    { key: "roomType", label: "Loại phòng", render: (i) => i?.roomType.name },
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
          {i?.status ? "Hoạt động" : "Bị khóa"}
        </Badge>
      ),
    },
  ];

  const columnsDetail = [
    { key: "id", label: "ID", render: (i) => i?.id },
    { key: "roomNumber", label: "Số phòng", render: (i) => i?.roomNumber },
    { key: "floor", label: "Tầng", render: (i) => i?.floor },
    { key: "roomType", label: "Loại phòng", render: (i) => i?.roomType.name },
    {
      key: "status",
      label: "Trạng thái",
      render: (i) => (
        <Badge
          className={`cursor-pointer italic ${
            i?.status ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {i?.status ? "Hoạt động" : "Bị khóa"}
        </Badge>
      ),
    },
    {
      key: "roomStatus",
      label: "Trạng thái phòng",
      render: (i) => ROOM_STATUS[i?.roomStatus],
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      render: (i) => formatDateTimeForCustomer(i?.createdAt),
    },
    {
      key: "updatedAt",
      label: "Ngày cập nhật",
      render: (i) => formatDateTimeForCustomer(i?.updatedAt) || "-",
    },
  ];

  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [filters, setFilters] = useState({
    roomNumber: "",
    floor: "",
    roomTypeName: "",
    status: "",
  });

  const [openDetail, setOpenDetail] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);

  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: "",
    floor: "",
    roomTypeId: "",
  });
  const [roomTypes, setRoomTypes] = useState([]);
  const [errors, setErrors] = useState({});

  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const res = await roomTypeService.activeRoomTypes();
      if (res.success) {
        setRoomTypes(res.data);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Đã có lỗi xảy ra khi tải loại phòng.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async (pageIndex = 0, filtersOverride = filters) => {
    setLoading(true);
    try {
      const res = await roomService.searchAdvance({
        ...(filtersOverride.roomNumber && {
          roomNumber: filtersOverride.roomNumber,
        }),
        ...(filtersOverride.floor && { floor: filtersOverride.floor }),
        ...(filtersOverride.roomTypeName && {
          roomTypeName: filtersOverride.roomTypeName,
        }),
        ...(filtersOverride.status && { status: filtersOverride.status }),
        page: pageIndex,
        size: 10,
      });

      const pageData = res.data;

      setRooms(pageData.content);
      setPage(pageData.number);
      setTotalPages(pageData.totalPages);
    } catch (error) {
      console.log(error);
      toast.error("Đã có lỗi xảy ra khi tải danh sách phòng.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchRooms(0);
  };

  const handleClear = () => {
    const resetFilters = {
      roomNumber: "",
      floor: "",
      roomTypeName: "",
      status: "",
    };

    setFilters(resetFilters);
    setPage(0);
    fetchRooms(0, resetFilters);
  };

  const handleDetail = (room) => {
    setCurrentRoom(room);
    setOpenDetail(true);
  };

  const handleToggleStatus = async (room) => {
    const nextStatus = !room.status;

    const result = await Swal.fire({
      title: "Xác nhận thay đổi",
      text: nextStatus
        ? "Bạn muốn cấp hoạt động cho phòng này?"
        : "Bạn muốn khóa phòng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await roomService.updateStatus(room.id, nextStatus);

      if (res.success) {
        toast.success(res.message);
        fetchRooms(page);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi cập nhật trạng thái phòng");
    }
  };

  const handleUpdate = (room) => {
    setCurrentRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      floor: room.floor,
      roomTypeId: room.roomType.id,
    });
    setErrors({});
    setOpenForm(true);
  };

  const handleSaveAndUpdate = async () => {
    setErrors({});

    const payloadUpdate = {
      roomNumber: formData.roomNumber,
      floor: formData.floor,
      roomTypeId: formData.roomTypeId,
    };

    try {
      setUpdateLoading(true);

      if (currentRoom) {
        const res = await roomService.updateRoom(currentRoom.id, payloadUpdate);
        if (res.success) {
          toast.success(res.message);
          setOpenForm(false);
          fetchRooms(0);
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
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    fetchRooms(page);
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
        filters={
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Số phòng..."
                value={filters.roomNumber}
                onChange={(e) =>
                  setFilters({ ...filters, roomNumber: e.target.value })
                }
              />

              <Select
                value={filters.floor}
                onValueChange={(v) => setFilters({ ...filters, floor: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Số Tầng..." />
                </SelectTrigger>
                <SelectContent>
                  {FLOOR_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.roomTypeName}
                onValueChange={(v) =>
                  setFilters({ ...filters, roomTypeName: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Loại phòng" />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_TYPE_OPTIONS.map((t) => (
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
            data={rooms}
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

      {currentRoom && (
        <DetailDialog
          title={"Chi tiết Phòng"}
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          data={currentRoom}
          fields={columnsDetail}
        />
      )}

      <EditCreateModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        title={currentRoom && `Cập nhật Phòng ${currentRoom.id}`}
        onSubmit={handleSaveAndUpdate}
        loading={updateLoading}
      >
        <div className="space-y-4">
          <div className="space-y-2 flex justify-end">
            {currentRoom && (
              <Badge
                className={`cursor-pointer italic ${
                  currentRoom?.status ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {currentRoom?.status ? "Hoạt động" : "Bị khóa"}
              </Badge>
            )}
          </div>

          {currentRoom && (
            <>
              <div className="space-y-2">
                <Label>
                  Số phòng <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.roomNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, roomNumber: e.target.value })
                  }
                  className={errors?.roomNumber && "border-red-500"}
                />
                {errors?.roomNumber && (
                  <p className="text-sm text-red-500">{errors?.roomNumber || "Số phòng đã tồn tại"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  Số tầng <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.floor}
                  onValueChange={(v) => setFormData({ ...formData, floor: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn số tầng" />
                  </SelectTrigger>
                  <SelectContent>
                    {FLOOR_OPTIONS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors?.floor && (
                  <p className="text-sm text-red-500">{errors?.floor}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  Loại phòng <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.roomTypeId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, roomTypeId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại phòng" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes?.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </EditCreateModal>
    </>
  );
};

export default RoomManagement;
