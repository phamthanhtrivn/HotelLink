import { useEffect, useRef, useState } from "react";

function FadeInSection({ children, direction = "up" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (el) observer.observe(el);
    return () => el && observer.unobserve(el);
  }, []);

  const getTransformClass = () => {
    switch (direction) {
      case "down":
        return "translate-y-[-30px]";
      case "left":
        return "translate-x-20";
      case "right":
        return "translate-x-[-20px]";
      default:
        return "translate-y-20";
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform will-change-transform
        ${
          visible
            ? "opacity-100 translate-x-0 translate-y-0"
            : `opacity-0 ${getTransformClass()}`
        }
      `}
    >
      {children}
    </div>
  );
}

const FacilitySection = ({
  title,
  subtitle,
  description,
  imageSrc,
  imageAlt,
  index,
}) => {
  const isReverse = index % 2 !== 0;

  return (
    <div className="py-12 md:py-20 px-4 md:px-8">
      <div
        className={`max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16 
  ${isReverse ? "md:flex-row-reverse" : ""}`}
      >
        {/* Hình ảnh */}
        <FadeInSection direction={isReverse ? "right" : "left"}>
          <div className="relative group">
            <div
              className="absolute -inset-4 bg-linear-to-r from-background/20 to-[#d4b869]/20 
              rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
            ></div>

            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-87.5 md:h-112.5 object-cover transform 
                group-hover:scale-110 transition-transform duration-700"
              />
              <div
                className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent 
                opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              ></div>
            </div>
          </div>
        </FadeInSection>

        {/* Nội dung */}
        <FadeInSection direction="up">
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                {title}
              </h2>

              {subtitle && (
                <h3 className="text-xl md:text-2xl font-semibold text-gray-700">
                  {subtitle}
                </h3>
              )}
            </div>

            <div className="w-20 h-1 bg-linear-to-r from-(--color-background) to-[#d4b869] rounded-full"></div>

            <p className="text-gray-600 leading-relaxed text-base md:text-lg">
              {description}
            </p>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
};

const Facilities = () => {
  const facilities = [
    {
      title: "PHÒNG NGHỈ HotelLink",
      subtitle: "KHÔNG GIAN NGHỈ DƯỠNG HIỆN ĐẠI",
      description:
        "HotelLink mang đến không gian lưu trú hiện đại, thoải mái và linh hoạt. Không còn những phòng kín khép kín, thay vào đó là khu vực mở với tiện nghi đầy đủ, nơi bạn có thể làm việc hoặc nghỉ ngơi thoải mái. Bàn làm việc chung, phòng họp, và nhiều tiện ích khác giúp kỳ nghỉ hoặc công tác của bạn luôn hiệu quả.",
      imageSrc:
        "https://dyf.vn/wp-content/uploads/2021/11/thiet-ke-noi-that-phong-khach-san-hien-dai.jpg",
      imageAlt: "Phòng khách sạn HotelLink",
      reverse: false,
    },
    {
      title: "HotelLink BAR",
      subtitle: "THỨC UỐNG & COCKTAIL ĐẶC SẮC",
      description:
        "Thưởng thức những ly cocktail hoặc bia thủ công trong không gian sang trọng, nhạc nền sôi động. HotelLink Bar là nơi lý tưởng để gặp gỡ bạn bè, thư giãn và tận hưởng buổi tối đầy phong cách.",
      imageSrc:
        "https://wink-hotels.com/wp-content/uploads/2024/10/4.-WINK-BAR.jpg",
      imageAlt: "HotelLink Bar",
      reverse: true,
    },
    {
      title: "KHÔNG GIAN HotelLink",
      subtitle: "NƠI KẾT NỐI VÀ GIAO LƯU",
      description:
        "HotelLink không chỉ là khách sạn, mà còn là điểm hẹn cộng đồng – nơi giao thoa giữa sáng tạo, tiện nghi và năng lượng trẻ trung. Với chính sách lưu trú linh hoạt, bạn hoàn toàn chủ động tận hưởng kỳ nghỉ hoặc chuyến công tác.",
      imageSrc:
        "https://wink-hotels.com/wp-content/uploads/2024/10/z6030656534340_70d3504d0cea4db773750632427a16e4-1.jpg",
      imageAlt: "Không gian HotelLink",
      reverse: false,
    },
    {
      title: "HotelLink GYM",
      subtitle: "SỨC KHỎE & CÂN BẰNG",
      description:
        "Phòng tập mở cửa 24/7 với đầy đủ thiết bị: máy chạy, tạ, thảm yoga. Ngoài ra, bạn có thể luyện tập ngoài trời hoặc tham gia các lớp HIIT tại khu vực gần khách sạn. Hít sâu, thở chậm và nạp năng lượng mới mỗi ngày tại HotelLink.",
      imageSrc:
        "https://wink-hotels.com/wp-content/uploads/2024/10/6.-WINK-GYM.jpg",
      imageAlt: "HotelLink Gym",
      reverse: true,
    },
    {
      title: "KHÔNG GIAN LÀM VIỆC CHUNG",
      subtitle: "CỘNG TÁC & SÁNG TẠO",
      description:
        "Khu vực làm việc mở hiện đại – nơi bạn có thể gặp gỡ, trao đổi ý tưởng và hợp tác. Thiết kế tối giản nhưng đầy cảm hứng, phù hợp cho cả công việc cá nhân và nhóm nhỏ.",
      imageSrc:
        "https://wink-hotels.com/wp-content/uploads/2024/10/z6031657040844_ed093332ba090d8f8e699a63e148772f-1-e1731575619797.jpg",
      imageAlt: "Không gian làm việc HotelLink",
      reverse: false,
    },
    {
      title: "BÃI ĐỖ XE",
      subtitle: "AN TOÀN & THUẬN TIỆN",
      description:
        "Hệ thống bãi đỗ xe rộng rãi, bảo vệ 24/7, đảm bảo an toàn tuyệt đối cho phương tiện của bạn. Dù là khách lưu trú hay chỉ ghé qua, bạn đều có thể yên tâm tại HotelLink.",
      imageSrc:
        "https://acihome.vn/uploads/15/giai-phap-thiet-ke-bai-do-xe-tai-resort.jpg",
      imageAlt: "Bãi đỗ xe HotelLink",
      reverse: true,
    },
  ];

  return (
    <div className="bg-linear-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Header */}
      <div className="relative bg-linear-to-r from-[#1a2332] to-[#2d3a4d] text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-(--color-background) rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-(--color-background) rounded-full filter blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <FadeInSection direction="down">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Cơ Sở Vật Chất
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Khám phá những tiện nghi hiện đại và không gian độc đáo tại HotelLink
            </p>
          </FadeInSection>
        </div>
      </div>

      {/* Facilities Sections */}
      <div className="divide-y divide-gray-200">
        {facilities.map((facility, index) => (
          <FacilitySection key={index} {...facility} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Facilities;
