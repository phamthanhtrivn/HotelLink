/* eslint-disable no-unused-vars */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROOM_STATUS_OPTIONS } from "@/constants/RoomConstants";
import { PlusCircle } from "lucide-react";
import React from "react";

const RoomCard = ({ room, meta, Icon }) => {
  return (
    <Card
      key={room.roomId}
      className={`
        px-4 py-3 flex items-center justify-between
        border-l-4 ${meta.border}
        ${meta.bg}
        bg-linear-to-r from-white/70 to-white
        cursor-pointer
        transition-all duration-200
        hover:shadow-xl hover:-translate-y-0.5
        hover:ring-1 hover:ring-black/5
        active:scale-[0.99]
      `}
    >
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="font-bold text-lg">Phòng {room.roomNumber}</span>
          <span className="text-gray-5 font-medium">({room.floor})</span>
        </div>

        <Badge
          className={`
            ${meta.badge}
            text-white flex items-center gap-2
            px-3 py-1 rounded-full
          `}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/70 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <Icon size={14} />
          {meta.label}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Select defaultValue={room.roomStatus}>
          <SelectTrigger
            className={`
              w-36
              ${meta.select}
              ${meta.ring}
              bg-white/80
              backdrop-blur
              cursor-pointer
              transition
              hover:bg-white
              shadow-sm
            `}
          >
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {ROOM_STATUS_OPTIONS.map((status, index) => (
              <SelectItem
                key={index}
                value={status.value}
                className="cursor-pointer"
              >
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {room.roomStatus === "AVAILABLE" && (
          <Button
            size="sm"
            className={`
              cursor-pointer
              ${
                room.roomStatus === "AVAILABLE"
                  ? "bg-(--color-primary) hover:bg-[#2a4b70] text-white"
                  : "opacity-60 cursor-not-allowed"
              }
            `}
          >
            <PlusCircle size={16} />
            Tạo đơn
          </Button>
        )}
      </div>
    </Card>
  );
};

export default RoomCard;
