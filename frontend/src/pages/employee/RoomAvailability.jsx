/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { formatISO } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import RoomTypeSearchBar from "@/components/common/customer/RoomTypeSearchBar";
import { roomTypeService } from "@/services/roomTypeService";
import { Card, CardContent } from "@/components/ui/card";
import RoomTypeHeader from "@/components/common/employee/RoomTypeHeader";
import RoomCard from "./RoomCard";
import { roomStatusMeta } from "@/constants/RoomConstants";

const today = new Date();
today.setHours(14, 0, 0, 0);

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(12, 0, 0, 0);

const RoomAvailability = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [dateRange, setDateRange] = useState([
    { startDate: today, endDate: tomorrow, key: "selection" },
  ]);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomTypeName, setRoomTypeName] = useState("All");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData();
    }, 400);

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

      <div className="space-y-10 overflow-y-auto">
        {roomTypes.map((rt) => (
          <div key={rt.id} className="space-y-4">
            {/* RoomType header */}
            <RoomTypeHeader rt={rt} />

            {/* Rooms grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {rt.rooms?.map((room, index) => {
                const meta = roomStatusMeta[room.roomStatus];
                const Icon = meta.icon;

                return (
                  <RoomCard key={index} room={room} meta={meta} Icon={Icon} />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomAvailability;
