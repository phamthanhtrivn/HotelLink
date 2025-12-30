/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { formatISO } from "date-fns";
import RoomTypeCard from "@/components/common/customer/RoomTypeCard";
import RoomTypeSearchBar from "@/components/common/customer/RoomTypeSearchBar";
import { roomTypeService } from "@/services/roomTypeService";
import hotel from "../../assets/Hotel-1.jpg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFlow, setSearchRoomTypeFilters } from "@/store/roomTypeSearchSlice";

const RoomTypes = () => {
  const roomTypeFilter = useSelector((state) => state.roomTypeSearch);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const roomTypeSectionRef = useRef(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(roomTypeFilter.checkIn),
      endDate: new Date(roomTypeFilter.checkOut),
      key: "selection",
    },
  ]);
  const [adults, setAdults] = useState(roomTypeFilter.adults);
  const [children, setChildren] = useState(roomTypeFilter.children);
  const [roomTypeName, setRoomTypeName] = useState(roomTypeFilter.roomTypeName);

  const buildSearchParams = () => ({
    checkIn: dateRange[0].startDate,
    checkOut: dateRange[0].endDate,
    adults,
    children,
    roomTypeName: roomTypeName === "All" ? "" : roomTypeName,
  });

  const fetchRoomTypes = async (pageNumber = 0) => {
    setLoading(true);
    const params = buildSearchParams();
    const res = await roomTypeService.fetchRoomTypes(
      {
        ...params,
        checkIn: formatISO(params.checkIn),
        checkOut: formatISO(params.checkOut),
      },
      pageNumber
    );

    dispatch(
      setSearchRoomTypeFilters({
        ...params,
        checkIn: formatISO(params.checkIn),
        checkOut: formatISO(params.checkOut),
      })
    );

    setRoomTypes(res.content || []);
    setTotalPages(res.totalPages || 0);
    setPage(pageNumber);
    setLoading(false);

    if (roomTypeSectionRef.current) {
      roomTypeSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDetail = (roomTypeId) => {
    dispatch(setFlow("DETAIL"));
    navigate(`/room-types/${roomTypeId}`);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(0);
      fetchRoomTypes(0);
    }, 400);

    return () => clearTimeout(timeout);
  }, [
    dateRange[0].startDate,
    dateRange[0].endDate,
    adults,
    children,
    roomTypeName,
  ]);

  useEffect(() => {
    fetchRoomTypes(page);
  }, [page]);

  useEffect(() => {
    dispatch(setFlow("LIST"));
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
      {/* HERO */}
      <section
        className="
          relative
          h-105 sm:h-125 md:h-155
          bg-cover bg-center
        "
        style={{ backgroundImage: `url(${hotel})` }}
      >
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 h-full flex items-center px-5 sm:px-10 lg:px-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight">
              HotelLink Sài Gòn
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed">
              Nơi bạn tạm dừng nhịp sống vội vã, mở cửa bước vào không gian nghỉ
              dưỡng tinh tế giữa lòng thành phố.
            </p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div
          className="
            absolute left-1/2
            -bottom-20 sm:-bottom-16
            transform -translate-x-1/2
            w-full max-w-7xl
            px-4 sm:px-6
            z-20
          "
        >
          <div
            ref={roomTypeSectionRef}
            className="
              rounded-2xl shadow-xl
              bg-white/95 backdrop-blur
            "
          >
            <RoomTypeSearchBar
              dateRange={dateRange}
              setDateRange={setDateRange}
              adults={adults}
              setAdults={setAdults}
              children={children}
              setChildren={setChildren}
              roomTypeName={roomTypeName}
              setRoomTypeName={setRoomTypeName}
              onSearch={() => fetchRoomTypes(0)}
            />
          </div>
        </div>
      </section>

      {/* TITLE */}
      <section
        className="
          max-w-7xl mx-auto
          px-4 sm:px-8 lg:px-12
          pt-32 sm:pt-28
          pb-8 sm:pb-10
        "
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800">
          Chọn phòng phù hợp cho bạn
        </h2>
        <div className="mt-3 h-1 w-16 sm:w-20 bg-primary rounded-full" />
      </section>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500 animate-pulse text-base sm:text-lg">
            Đang tìm phòng phù hợp cho bạn...
          </p>
        </div>
      )}

      {/* ROOM LIST */}
      <section
        className="
          max-w-7xl mx-auto
          px-4 sm:px-8 lg:px-12
          space-y-5 sm:space-y-6
        "
      >
        {roomTypes.map((rt) => (
          <RoomTypeCard key={rt.id} roomType={rt} onDetail={handleDetail} />
        ))}
      </section>

      {/* PAGINATION */}
      {totalPages > 1 ? (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 py-14 sm:py-16">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="
              px-5 py-2 rounded-full
              border border-gray-300
              hover:bg-gray-100
              disabled:opacity-40 disabled:cursor-not-allowed
              transition
            "
          >
            &lt; Trước
          </button>

          <span className=" font-medium">
            Trang {page + 1} / {totalPages}
          </span>

          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="
              px-5 py-2 rounded-full
              border border-gray-300
              hover:bg-gray-100
              disabled:opacity-40 disabled:cursor-not-allowed
              transition
            "
          >
            Sau &gt;
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 py-14 sm:py-16"></div>
      )}
    </div>
  );
};

export default RoomTypes;
