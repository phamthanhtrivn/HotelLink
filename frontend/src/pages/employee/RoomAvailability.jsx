/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { formatISO } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import RoomTypeSearchBar from "@/components/common/customer/RoomTypeSearchBar";
import { roomTypeService } from "@/services/roomTypeService";
import { Card, CardContent } from "@/components/ui/card";
import RoomTypeHeader from "@/components/common/employee/RoomTypeHeader";
import RoomCard from "./RoomCard";
import { roomStatusMeta } from "@/constants/RoomConstants";
import { roomService } from "@/services/roomService";
import {
  getDefaultCheckInDate,
  getDefaultCheckOutDate,
} from "@/helpers/dateHelpers";
import CreateBookingModal from "@/components/common/employee/CreateBookingModal";
import { AuthContext } from "@/context/AuthContext";
import { bookingService } from "@/services/bookingService";

const RoomAvailability = () => {
  const { user } = useContext(AuthContext);
  const [roomTypes, setRoomTypes] = useState([]);
  const [dateRange, setDateRange] = useState([
    {
      startDate: getDefaultCheckInDate(),
      endDate: getDefaultCheckOutDate(),
      key: "selection",
    },
  ]);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomTypeName, setRoomTypeName] = useState("All");
  const [loading, setLoading] = useState(false);
  const [openBooking, setOpenBooking] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [saveBookingLoading, setSaveBookingLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        checkIn: formatISO(dateRange[0].startDate),
        checkOut: formatISO(dateRange[0].endDate),
        adults,
        children,
        roomTypeName: roomTypeName === "All" ? "" : roomTypeName,
      };

      const res = await roomTypeService.searchRoomAvailability(params);
      if (res.success) {
        setRoomTypes(res.data.content);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Không thể tải danh sách phòng");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRoomStatus = async (roomId, roomStatus) => {
    try {
      const res = await roomService.updateRoomStatus(roomId, roomStatus);
      if (res.success) {
        toast.success("Cập nhật trạng thái phòng thành công");
        fetchData();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Cập nhật trạng thái phòng thất bại");
    }
  };

  const handleCreateBooking = (room, roomType) => {
    setSelectedRoom({
      ...room,
      price: roomType.price,
    });
    setOpenBooking(true);
  };

  const handleSubmitBooking = async (payload) => {
    const bookingRequest = {
      ...payload,
      userId: user.userId,
      checkIn: formatISO(payload.checkIn).slice(0, 19),
      checkOut: formatISO(payload.checkOut).slice(0, 19),
    };
    try {
      setSaveBookingLoading(true);
      const res = await bookingService.createByStaff(bookingRequest);
      if (res.success) {
        toast.success("Tạo đơn đặt phòng thành công!");
        setOpenBooking(false);
        fetchData();
      } else {
        setErrors(res.data);
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi tạo đơn đặt phòng!");
    } finally {
      setSaveBookingLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [
    dateRange[0].startDate,
    dateRange[0].endDate,
    adults,
    children,
    roomTypeName,
  ]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="shadow-xl">
        <CardContent>
          <RoomTypeSearchBar
            dateRange={dateRange}
            setDateRange={setDateRange}
            adults={adults}
            setAdults={setAdults}
            children={children}
            setChildren={setChildren}
            roomTypeName={roomTypeName}
            setRoomTypeName={setRoomTypeName}
            onSearch={fetchData}
          />
        </CardContent>
      </Card>

      <div className="space-y-10 overflow-y-auto ">
        {roomTypes.map((rt) => (
          <section
            key={rt.id}
            className="rounded-xl border-0 border-l-4 border-[#2a4b70] bg-muted/30 shadow-sm overflow-hidden"
          >
            {/* Header */}
            <RoomTypeHeader rt={rt} />

            {/* Rooms wrapper */}
            <div className="bg-slate-50 px-5 py-4">
              {rt.rooms?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {rt.rooms.map((room, index) => {
                    const meta = roomStatusMeta[room.roomStatus];
                    const Icon = meta.icon;

                    return (
                      <RoomCard
                        key={room.roomId || index}
                        room={room}
                        roomType={rt}
                        meta={meta}
                        Icon={Icon}
                        onUpdate={handleUpdateRoomStatus}
                        onCreate={handleCreateBooking}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  Không có phòng trống trong khoảng thời gian này
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {selectedRoom && (
        <CreateBookingModal
          open={openBooking}
          onClose={() => setOpenBooking(false)}
          room={selectedRoom}
          checkIn={dateRange[0].startDate}
          checkOut={dateRange[0].endDate}
          onSubmit={handleSubmitBooking}
          loading={saveBookingLoading}
          errors={errors}
        />
      )}
    </div>
  );
};

export default RoomAvailability;
