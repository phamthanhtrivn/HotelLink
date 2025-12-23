import { useState, useRef, useEffect } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RoomTypeSearchBar = ({
  dateRange,
  setDateRange,
  adults,
  setAdults,
  children,
  setChildren,
  roomTypeName,
  setRoomTypeName,
  onSearch,
}) => {
  const [openCalendar, setOpenCalendar] = useState(false);
  const calendarRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setOpenCalendar(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // STYLE CHUNG CHO CÁC Ô
  const fieldClass =
    "h-16 border rounded-xl px-4 flex items-center " +
    "transition hover:border-[var(--color-primary)] " +
    "focus-within:border-[var(--color-primary)]";

  return (
    <div
      className="
        relative w-full bg-white
        rounded-2xl shadow-lg
        p-4 sm:p-5
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6
        gap-4 items-end
      "
    >
      {/* DATE */}
      <div className="relative sm:col-span-2 lg:col-span-2 flex flex-col gap-1">
        <div className="text-xs text-gray-500 font-medium">
          Check-in / Check-out
        </div>

        <div
          onClick={() => setOpenCalendar(!openCalendar)}
          className={`${fieldClass} justify-between cursor-pointer`}
        >
          <div className="font-medium text-gray-800">
            {dateRange[0].startDate.toLocaleDateString("vi-VN")} –{" "}
            {dateRange[0].endDate.toLocaleDateString("vi-VN")}
          </div>
          <FaRegCalendarAlt className="text-gray-500" size={20} />
        </div>

        {openCalendar && (
          <div
            ref={calendarRef}
            className="
              absolute z-50 mt-3
              bg-white rounded-xl
              shadow-2xl overflow-hidden
            "
          >
            <DateRange
              ranges={dateRange}
              onChange={(item) => setDateRange([item.selection])}
              months={2}
              editableDateInputs
              direction="horizontal"
              rangeColors={["var(--color-primary)"]}
              minDate={new Date()}
            />
          </div>
        )}
      </div>

      {/* ADULTS */}
      <div>
        <div className="text-xs text-gray-500 font-medium mb-1">
          Người lớn
        </div>
        <div className={`${fieldClass} gap-2 justify-between px-3`}>
          <Button
            size="icon"
            onClick={() => setAdults(adults > 1 ? adults - 1 : 1)}
            className="bg-(--color-primary) hover:bg-[#2a4b70]"
          >
            −
          </Button>
          <Input
            type="number"
            min={1}
            max={8}
            value={adults}
            onChange={(e) => setAdults(+e.target.value)}
            className="
              w-12 text-center font-medium
              border-none focus-visible:ring-0
            "
          />
          <Button
            size="icon"
            onClick={() => setAdults(adults < 8 ? adults + 1 : 8)}
            className="bg-(--color-primary) hover:bg-[#2a4b70]"
          >
            +
          </Button>
        </div>
      </div>

      {/* CHILDREN */}
      <div>
        <div className="text-xs text-gray-500 font-medium mb-1">
          Trẻ em dưới 12 tuổi
        </div>
        <div className={`${fieldClass} gap-2 justify-between px-3`}>
          <Button
            size="icon"
            onClick={() => setChildren(children > 0 ? children - 1 : 0)}
            className="bg-(--color-primary) hover:bg-[#2a4b70]"
          >
            −
          </Button>
          <Input
            type="number"
            min={0}
            max={8}
            value={children}
            onChange={(e) => setChildren(+e.target.value)}
            className="
              w-12 text-center font-medium
              border-none focus-visible:ring-0
            "
          />
          <Button
            size="icon"
            onClick={() => setChildren(children < 8 ? children + 1 : 8)}
            className="bg-(--color-primary) hover:bg-[#2a4b70]"
          >
            +
          </Button>
        </div>
      </div>

      {/* ROOM TYPE */}
      <div>
        <div className="text-xs text-gray-500 font-medium mb-1">
          Loại phòng
        </div>

        <div className={`${fieldClass} gap-2 justify-between px-3`}>
          <Select value={roomTypeName} onValueChange={setRoomTypeName}>
          <SelectTrigger
            className="
              h-16 rounded-xl  px-4
              flex items-center
              border-none focus-visible:ring-0  
            "
          >
            <SelectValue className="cursor-pointer" placeholder="Chọn loại phòng" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Loại phòng</SelectLabel>
              <SelectItem className="cursor-pointer" value="All">Tất cả</SelectItem>
              <SelectItem className="cursor-pointer" value="Standard">Standard</SelectItem>
              <SelectItem className="cursor-pointer" value="Deluxe">Deluxe</SelectItem>
              <SelectItem className="cursor-pointer" value="Suite">Suite</SelectItem>
              <SelectItem className="cursor-pointer" value="Family">Family</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        </div>
      </div>

      {/* SEARCH */}
      <div className="sm:col-span-2 lg:col-span-1">
        <Button
          onClick={onSearch}
          className="
            w-full h-16 rounded-xl
            bg-(--color-primary)
            hover:bg-[#2a4b70]
            text-lg font-semibold
            transition
            cursor-pointer
          "
        >
          Tìm phòng
        </Button>
      </div>
    </div>
  );
};

export default RoomTypeSearchBar;
