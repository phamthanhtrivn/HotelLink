import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatVND } from "@/helpers/currencyFormatter";
import { Eye } from "lucide-react";
import React, { useState } from "react";
import DetailDialog from "./DetailModal";
import ImagePreviewDialog from "./ImagePreviewDialog";
import { Badge } from "@/components/ui/badge";

const RoomTypeHeader = ({ rt }) => {
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
  ];

  const [openDetail, setOpenDetail] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

  if (!rt) return null;

  return (
    <>
      <Card className="rounded-none rounded-t-xl shadow-none">
        <CardContent className="flex justify-between items-center py-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">{rt.name}</h2>
            <div className="flex gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-red-500">
                {formatVND(rt.price)} / đêm
              </span>
              <span>&bull;</span>
              <span className="text-[#2a4b70] font-bold">
                {rt.availableRoomCount} phòng trống
              </span>
              <span>&bull;</span>
              <span>{rt.guestCapacity} khách tối đa</span>
            </div>
          </div>

          <Button
            onClick={() => setOpenDetail(true)}
            variant="outline"
            size="sm"
            className="cursor-pointer hover:bg-primary/10"
          >
            <Eye size={16} />
            Xem chi tiết
          </Button>
        </CardContent>
      </Card>

      {rt && (
        <>
          <DetailDialog
            title={"Chi tiết Loại phòng"}
            open={openDetail}
            onClose={() => setOpenDetail(false)}
            data={rt}
            fields={columnsDetail}
          />

          <ImagePreviewDialog
            open={openPreview}
            image={previewImage}
            onClose={() => setOpenPreview(false)}
          />
        </>
      )}
    </>
  );
};

export default RoomTypeHeader;
