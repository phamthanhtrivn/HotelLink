import { formatVND } from "@/helpers/currencyFormatter";
import RoomTypePicturesSlider from "./RoomTypePicturesSlider";
import { Button } from "@/components/ui/button";

const RoomTypeCard = ({ roomType, onDetail }) => {
  return (
    <section className="w-full">
      <div
        className="
          w-full
          bg-white
          rounded-3xl
          shadow-lg
          overflow-hidden
          flex flex-col lg:flex-row
          transition hover:shadow-2xl
        "
      >
        {/* IMAGE */}
        <div
          className="
            relative
            w-full lg:w-2/3
            aspect-4/3
            sm:aspect-16/10
            lg:aspect-auto
            lg:h-full
            min-h-60
          "
        >
          <RoomTypePicturesSlider
            images={roomType?.pictures || []}
            visibleCount={1}
          />

          {roomType.availableRooms <= 3 && (
            <div className="absolute top-4 left-4 bg-(--color-primary) font-bold text-sm sm:text-base text-(--color-background) px-3 py-1.5 rounded-full backdrop-blur">
              Chỉ còn {roomType.availableRooms} phòng
            </div>
          )}
        </div>

        {/* INFO */}
        <div
          onClick={() => onDetail(roomType.id)}
          className="
            w-full lg:w-1/3
            p-5 sm:p-6 lg:p-10
            flex flex-col justify-between
            cursor-pointer
            bg-(--color-primary)
            text-white
          "
        >
          <div className="space-y-5">
            {/* TITLE */}
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight">
                {roomType.name}
              </h2>

              <p className="text-white/60 uppercase text-sm mt-6">
                Giá mỗi đêm
              </p>

              <p className="text-2xl sm:text-3xl mt-1 text-(--color-background) font-bold">
                {formatVND(roomType.price)}
              </p>
            </div>

            {/* META */}
            <div className="space-y-2 text-sm sm:text-base">
              {roomType.guestCapacity && (
                <div className="flex justify-between">
                  <span className="text-white/60">Sức chứa</span>
                  <span>{roomType.guestCapacity} khách</span>
                </div>
              )}

              {roomType.area && (
                <div className="flex justify-between">
                  <span className="text-white/60">Diện tích</span>
                  <span>{roomType.area} m²</span>
                </div>
              )}

              {roomType.description && (
                <p className="text-white/80 text-sm leading-relaxed line-clamp-3">
                  {roomType.description}
                </p>
              )}
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={() => onDetail(roomType.id)}
            className="
              mt-6 w-full
              bg-white text-gray-900
              hover:bg-[#f6c96f]
              font-semibold
              py-5 rounded-xl
              transition
              cursor-pointer
            "
          >
            Xem chi tiết
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RoomTypeCard;
