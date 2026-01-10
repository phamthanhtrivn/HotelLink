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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  AREA_RANGE,
  CAPACITY_RANGE,
  PRICE_RANGE,
} from "@/constants/RoomTypeConstants";
import { STATUS_OPTIONS } from "@/constants/StatusConstants";
import { formatVND } from "@/helpers/currencyFormatter";
import { formatDateTimeForCustomer } from "@/helpers/dateHelpers";
import { amenityService } from "@/services/amenityService";
import { bedService } from "@/services/bedService";
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
    },
  ];

  const [roomTypes, setRoomTypes] = useState([]);
  const [allAmenities, setAllAmenities] = useState([]);
  const [allBeds, setAllBeds] = useState([]);
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

  const [updateForm, setUpdateForm] = useState({
    price: "",
    description: "",
    status: true,
    amenities: [],
    beds: [],
  });
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const groupedAmenities = allAmenities.reduce((acc, a) => {
    const typeName = a?.amenityType?.name || "Khác";

    acc[typeName] = acc[typeName] || [];
    acc[typeName].push(a);

    return acc;
  }, {});

  const [errors, setErrors] = useState({});

  const fetchaMasterData = async () => {
    try {
      const [amenitiesRes, bedsRes] = await Promise.all([
        amenityService.getAll(),
        bedService.getAll(),
      ]);

      setAllAmenities(amenitiesRes.data);
      setAllBeds(bedsRes.data);
    } catch (error) {
      console.log(error);
      toast.error("Đã có lỗi xảy ra khi tải dữ liệu cập nhật.");
    }
  };

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
    setCurrentRoomType(roomType);

    setUpdateForm({
      price: roomType.price,
      description: roomType.description,
      status: roomType.status,
      amenities: roomType.amenities.map((a) => a.id),
      beds: roomType.beds.map((b) => ({
        bedId: b.id,
        quantity: b.quantity,
      })),
    });

    setExistingImages(roomType.pictures);
    setRemovedImages([]);
    setNewImages([]);
    setErrors({});

    setOpenForm(true);
  };

  const handleSaveAndUpdate = async () => {
    try {
      setUpdateLoading(true);

      const formData = new FormData();

      const payload = {
        price: Number(updateForm.price),
        description: updateForm.description,
        status: updateForm.status,
        amenities: updateForm.amenities.map((a) => ({
          amenityId: a,
        })),
        beds: updateForm.beds,
        keepImages: existingImages,
        deleteImages: removedImages,
      };

      formData.append(
        "data",
        new Blob([JSON.stringify(payload)], {
          type: "application/json",
        })
      );

      newImages.forEach((file) => {
        formData.append("images", file);
      });

      const res = await roomTypeService.updateRoomType(
        currentRoomType.id,
        formData
      );

      if (res.success) {
        toast.success(res.message);
        setOpenForm(false);
        fetchRoomTypes(page);
      } else {
        toast.error(res.message);
        if (res?.data) {
          setErrors(res.data);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật loại phòng");
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes(page);
  }, [page]);

  useEffect(() => {
    fetchaMasterData();
  }, []);

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
        onClose={() => {
          setOpenForm(false);
          setErrors({});
        }}
        title={currentRoomType && `Cập nhật Loại phòng ${currentRoomType.id}`}
        onSubmit={handleSaveAndUpdate}
        loading={updateLoading}
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {currentRoomType && (
          <div className="space-y-6">
            {/* ===== Trạng thái ===== */}
            <div className="flex justify-end">
              <Badge
                className={`italic ${
                  updateForm.status ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {updateForm.status ? "Hoạt động" : "Bị khóa"}
              </Badge>
            </div>

            {/* ===== Giá phòng ===== */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Giá phòng <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                value={updateForm.price}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, price: e.target.value })
                }
                className={errors.price ? "border-red-500" : ""}
                placeholder="Nhập giá phòng"
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            {/* ===== Mô tả ===== */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Mô tả <span className="text-red-500">*</span>
              </Label>
              <Textarea
                rows={5}
                value={updateForm.description}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, description: e.target.value })
                }
                className={`w-full rounded-md border p-2 text-sm resize-none ${
                  errors.description ? "border-red-500" : ""
                }`}
                placeholder="Mô tả chi tiết loại phòng"
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* ===== Trạng thái (Select) ===== */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Trạng thái</Label>
              <Select
                value={String(updateForm.status)}
                onValueChange={(v) =>
                  setUpdateForm({ ...updateForm, status: v === "true" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Hoạt động</SelectItem>
                  <SelectItem value="false">Bị khóa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ===== Ảnh hiện có ===== */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Hình ảnh hiện tại</Label>
              <div className="grid grid-cols-3 gap-3">
                {existingImages.map((url) => (
                  <div key={url} className="relative group">
                    <img
                      src={url}
                      className="h-24 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setExistingImages(
                          existingImages.filter((i) => i !== url)
                        );
                        setRemovedImages([...removedImages, url]);
                      }}
                      className="absolute top-1 right-1 hidden group-hover:block bg-red-600 text-white rounded-full w-6 h-6 text-xs cursor-pointer"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              {errors.images && (
                <p className="text-sm text-red-500">{errors.images}</p>
              )}
            </div>

            {/* ===== Ảnh mới ===== */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Thêm hình ảnh mới</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setNewImages([...newImages, ...Array.from(e.target.files)])
                }
              />
            </div>

            {/* ===== Tiện nghi ===== */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tiện nghi</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(groupedAmenities).map(([type, items]) => (
                  <div key={type} className="space-y-2">
                    <div className="text-xs font-semibold uppercase text-muted-foreground">
                      {type}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {items.map((a) => {
                        const active = updateForm.amenities.includes(a.id);

                        return (
                          <Badge
                            key={a.id}
                            className={`cursor-pointer transition ${
                              active
                                ? "bg-(--color-primary)"
                                : "bg-gray-200 text-gray-600"
                            }`}
                            onClick={() =>
                              setUpdateForm({
                                ...updateForm,
                                amenities: active
                                  ? updateForm.amenities.filter(
                                      (id) => id !== a.id
                                    )
                                  : [...updateForm.amenities, a.id],
                              })
                            }
                          >
                            {a.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {errors.amenities && (
                <p className="text-sm text-red-500">{errors.amenities}</p>
              )}
            </div>

            {/* ===== Giường ===== */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Loại giường</Label>
              {allBeds.map((bed) => {
                const selected = updateForm.beds.find(
                  (b) => b.bedId === bed.id
                );

                return (
                  <div key={bed.id} className="flex items-center gap-4">
                    <div className="w-40 text-sm">
                      <div className="font-medium">{bed.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {bed.description}
                      </div>
                    </div>

                    <Input
                      type="number"
                      min={0}
                      value={selected?.quantity || 0}
                      onChange={(e) => {
                        const qty = Number(e.target.value);
                        let beds = [...updateForm.beds];

                        if (qty === 0) {
                          beds = beds.filter((b) => b.bedId !== bed.id);
                        } else if (selected) {
                          beds = beds.map((b) =>
                            b.bedId === bed.id ? { ...b, quantity: qty } : b
                          );
                        } else {
                          beds.push({ bedId: bed.id, quantity: qty });
                        }

                        setUpdateForm({ ...updateForm, beds });
                      }}
                      className="w-24"
                    />
                  </div>
                );
              })}
              {errors.beds && (
                <p className="text-sm text-red-500">{errors.beds}</p>
              )}
            </div>
          </div>
        )}
      </EditCreateModal>
    </>
  );
};

export default RoomTypeManagement;
