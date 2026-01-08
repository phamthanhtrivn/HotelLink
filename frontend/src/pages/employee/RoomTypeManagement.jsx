/* eslint-disable react-hooks/exhaustive-deps */
import ActionButtons from "@/components/common/employee/ActionButtons";
import AdminManagementLayout from "@/components/common/employee/AdminManagementLayout";
import AdminPagination from "@/components/common/employee/AdminPagination";
import AdminTable from "@/components/common/employee/AdminTable";
import DetailDialog from "@/components/common/employee/DetailModal";
import EditCreateModal from "@/components/common/employee/EditCreateModal";
import ImagePreviewDialog from "@/components/common/employee/ImagePreviewDialog";
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
  AREA_RANGE,
  CAPACITY_RANGE,
  PRICE_RANGE,
} from "@/constants/RoomTypeConstants";
import { STATUS_OPTIONS } from "@/constants/StatusConstants";
import { formatVND } from "@/helpers/currencyFormatter";
import { formatDateTimeForCustomer } from "@/helpers/dateHelpers";
import { roomTypeService } from "@/services/roomTypeService";
import { Loader2, RotateCcw, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const RoomTypeManagement = () => {
  const columns = [
    { key: "id", label: "ID", render: (i) => i?.id },
    { key: "name", label: "Tên loại phòng", render: (i) => i?.name },
    { key: "price", label: "Giá", render: (i) => formatVND(i?.price) },
    {
      key: "guestCapacity",
      label: "Số khách tối đa",
      render: (i) => i?.guestCapacity,
    },
    { key: "area", label: "Diện tích", render: (i) => `${i?.area} m²` },
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
    { key: "name", label: "Tên loại phòng", render: (i) => i?.name },
    { key: "price", label: "Giá", render: (i) => formatVND(i?.price) },
    {
      key: "guestCapacity",
      label: "Số khách tối đa",
      render: (i) => i?.guestCapacity,
    },
    { key: "area", label: "Diện tích", render: (i) => `${i?.area} m²` },
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
    { key: "description", label: "Mô tả", render: (i) => i?.description },
    {
      key: "pictures",
      label: "Hình ảnh",
      render: (i) => (
        <div className="grid grid-cols-3 gap-2">
          {i?.pictures?.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`room-${idx}`}
              className="h-24 w-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
              onClick={() => {
                setPreviewImage(url);
                setOpenPreview(true);
              }}
            />
          ))}
        </div>
      ),
    },
    {
      key: "beds",
      label: "Loại giường",
      render: (i) => (
        <div className="flex flex-col text-sm">
          {i?.beds?.map((bed) => (
            <span key={bed.id}>
              {bed.name} ({bed.description}) x {bed.quantity}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "amenities",
      label: "Tiện nghi",
      render: (i) => {
        if (!i?.amenities?.length) return "-";

        const grouped = i.amenities.reduce((acc, a) => {
          acc[a.type] = acc[a.type] || [];
          acc[a.type].push(a);
          return acc;
        }, {});

        return (
          <div className="space-y-2 max-w-md">
            {Object.entries(grouped).map(([type, items]) => (
              <div key={type}>
                <div className="text-xs font-medium text-gray-500 mb-1">
                  {type}
                </div>

                <div className="flex flex-wrap gap-1">
                  {items.map((a) => (
                    <span
                      key={a.id}
                      className="text-xs bg-blue-50 text-(--color-primary) px-2 py-0.5 rounded border border-blue-100"
                    >
                      {a.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      },
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
    }
  ];

  const [roomTypes, setRoomTypes] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [filters, setFilters] = useState({
    name: "",
    status: "",
  });
  const [priceRange, setPriceRange] = useState(PRICE_RANGE);
  const [capacityRange, setCapacityRange] = useState(CAPACITY_RANGE);
  const [areaRange, setAreaRange] = useState(AREA_RANGE);

  const [openDetail, setOpenDetail] = useState(false);
  const [currentRoomType, setCurrentRoomType] = useState(null);

  const [openForm, setOpenForm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

  const [formData, setFormData] = useState({
    // roomNumber: "",
    // floor: "",
    // roomTypeId: "",
  });
  const [errors, setErrors] = useState({});

  const fetchRoomTypes = async (
    pageIndex = 0,
    filtersOverride = filters,
    priceRangeOverride = priceRange,
    capacityRangeOverride = capacityRange,
    areaRangeOverride = areaRange
  ) => {
    setLoading(true);
    try {
      const res = await roomTypeService.searchAdvance({
        ...(filtersOverride.name && {
          name: filtersOverride.name,
        }),
        ...(priceRangeOverride && {
          minPrice: priceRangeOverride[0],
          maxPrice: priceRangeOverride[1],
        }),
        ...(capacityRangeOverride && {
          minCapacity: capacityRangeOverride[0],
          maxCapacity: capacityRangeOverride[1],
        }),
        ...(areaRangeOverride && {
          minArea: areaRangeOverride[0],
          maxArea: areaRangeOverride[1],
        }),
        ...(filtersOverride.status && { status: filtersOverride.status }),
        page: pageIndex,
        size: 10,
      });

      const pageData = res.data;

      setRoomTypes(pageData.content);
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
    fetchRoomTypes(0);
  };

  const handleClear = () => {
    const resetFilters = {
      name: "",
      status: "",
    };

    const resetPriceRange = PRICE_RANGE;
    const resetCapacityRange = CAPACITY_RANGE;
    const resetAreaRange = AREA_RANGE;

    setFilters(resetFilters);
    setPriceRange(resetPriceRange);
    setCapacityRange(resetCapacityRange);
    setAreaRange(resetAreaRange);

    setPage(0);
    fetchRoomTypes(
      0,
      resetFilters,
      resetPriceRange,
      resetCapacityRange,
      resetAreaRange
    );
  };

  const handleDetail = (roomType) => {
    setCurrentRoomType(roomType);
    setOpenDetail(true);
  };

  const handleToggleStatus = async (roomType) => {
    const nextStatus = !roomType.status;

    const result = await Swal.fire({
      title: "Xác nhận thay đổi",
      text: nextStatus
        ? "Bạn muốn cấp hoạt động cho loại phòng này?"
        : "Bạn muốn khóa loại phòng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await roomTypeService.updateStatus(roomType.id, nextStatus);

      if (res.success) {
        toast.success(res.message);
        fetchRoomTypes(page);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi cập nhật trạng thái phòng");
    }
  };

  const handleUpdate = (roomType) => {
    // setCurrentRoomType(roomType);
    // setFormData({
    //   roomNumber: roomType.roomNumber,
    //   floor: roomType.floor,
    //   roomTypeId: roomType.roomTypeId,
    // });
    // setErrors({});
    // setOpenForm(true);
  };

  const handleSaveAndUpdate = async () => {
    // setErrors({});
    // const payloadUpdate = {
    //   roomNumber: formData.roomNumber,
    //   floor: formData.floor,
    //   roomTypeId: formData.roomTypeId,
    // };
    // try {
    //   setUpdateLoading(true);
    //   if (currentRoom) {
    //     const res = await roomService.updateRoom(currentRoom.id, payloadUpdate);
    //     if (res.success) {
    //       toast.success(res.message);
    //       setOpenForm(false);
    //       fetchRooms(0);
    //       setPage(0);
    //     } else {
    //       toast.error(res.message);
    //       setErrors(res.data);
    //     }
    //   }
    // } catch (err) {
    //   console.log(err);
    //   toast.error("Lỗi khi lưu dữ liệu");
    // } finally {
    //   setUpdateLoading(false);
    // }
  };

  useEffect(() => {
    fetchRoomTypes(page);
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
        title="Quản lý Loại phòng"
        filters={
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Tên loại phòng..."
                value={filters.name}
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
              />

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
                  max={10000000}
                  step={500000}
                />
              </div>

              <div className="rounded-xl border p-4 bg-muted/30 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sức chứa</span>
                  <span className="font-medium">
                    {capacityRange[0]} - {capacityRange[1]}
                  </span>
                </div>

                <Slider
                  value={capacityRange}
                  onValueChange={setCapacityRange}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div className="rounded-xl border p-4 bg-muted/30 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Diện tích</span>
                  <span className="font-medium">
                    {areaRange[0]} m<sup>2</sup> - {areaRange[1]} m<sup>2</sup>
                  </span>
                </div>

                <Slider
                  value={areaRange}
                  onValueChange={setAreaRange}
                  min={10}
                  max={100}
                  step={10}
                />
              </div>

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
            data={roomTypes}
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

      {currentRoomType && (
        <>
          <DetailDialog
            title={"Chi tiết Loại phòng"}
            open={openDetail}
            onClose={() => setOpenDetail(false)}
            data={currentRoomType}
            fields={columnsDetail}
          />

          <ImagePreviewDialog
            open={openPreview}
            image={previewImage}
            onClose={() => setOpenPreview(false)}
          />
        </>
      )}

      <EditCreateModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        title={currentRoomType && `Cập nhật Loại phòng ${currentRoomType.id}`}
        onSubmit={handleSaveAndUpdate}
        loading={updateLoading}
      >
        <div className="space-y-4">
          <div className="space-y-2 flex justify-end">
            {currentRoomType && (
              <Badge
                className={`cursor-pointer italic ${
                  currentRoomType?.status ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {currentRoomType?.status ? "Hoạt động" : "Bị khóa"}
              </Badge>
            )}
          </div>

          {currentRoomType && (
            <>
              {/* <div className="space-y-2">
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
                  <p className="text-sm text-red-500">
                    {errors?.roomNumber || "Số phòng đã tồn tại"}
                  </p>
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
              </div> */}
            </>
          )}
        </div>
      </EditCreateModal>
    </>
  );
};

export default RoomTypeManagement;
