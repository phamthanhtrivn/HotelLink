/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";

import heroImg from "../../assets/Hotel-1.jpg";
import hotelImg from "../../assets/Hotel-2.png";
import standardImg from "../../assets/Standard.jpg";
import deluxeImg from "../../assets/Deluxe.jpg";
import suiteImg from "../../assets/Suite.jpg";
import familyImg from "../../assets/Family.jpg";
import poolImg from "../../assets/Pool.webp";
import spaImg from "../../assets/Spa.jpg";
import restaurantImg from "../../assets/Restaurant.avif";
import gymImg from "../../assets/Gym.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { reviewService } from "@/services/reviewService";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const Section = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="px-6 mx-auto my-20 max-w-7xl"
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  const navigation = useNavigate();
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await reviewService.getTop3Reviews()
        if (res.success) {
          const mappedRatings = res.data.map((rv) => ({
            stars: (rv.cleanlinessScore + rv.serviceScore + rv.facilitiesScore) / 3,
            review: rv.comments,
            time: new Date(rv.createdAt).toLocaleDateString("vi-VN"),
            name: rv.customer.fullName,
          }));
          setRatings(mappedRatings);
        } else {
          toast.info(res.message || "Không có đánh giá nào");
        }
      } catch (error) {
        console.error("Error fetching ratings:", error);
        toast.error("Lấy đánh giá thất bại");
      }
    };

    fetchRatings();
  }, []);

  return (
    <div className="text-gray-800 bg-white">
      {/* HERO SECTION */}
      <section className="relative h-[95vh] flex items-center justify-center text-center">
        <img
          src={heroImg}
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 px-6"
        >
          <h1 className="mb-4 text-6xl font-extrabold text-white drop-shadow-2xl">
            HotelLink
          </h1>
          <p className="max-w-3xl mx-auto mb-6 text-xl text-gray-200">
            Trong dáng hình của một tòa lâu đài trác tuyệt, Khách sạn HotelLink như một thế giới yên bình khác biệt ngay giữa lòng Sài Gòn
          </p>
          <Button
            onClick={() => navigation("/room-types")}
            className="px-12 py-6 text-xl font-semibold bg-(--color-primary)  shadow-xl hover:bg-[#2a4b70] rounded-md cursor-pointer"
          >
            Đặt phòng ngay
          </Button>
        </motion.div>
      </section>

      {/* ABOUT */}
      <Section>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.img
            src={hotelImg}
            whileHover={{ scale: 1.03 }}
            className="shadow-xl rounded-2xl"
          />
          <div>
            <h2 className="mb-4 text-4xl font-bold text-[#1E2A38]">
              Khách sạn HotelLink
            </h2>
            <p className="mb-4 leading-relaxed">
              Đạt chuẩn 5 sao tại Sài Gòn, HotelLink mang đến trải nghiệm nghỉ dưỡng
              sang trọng, tiện nghi hiện đại và đa dạng dịch vụ 24/7.
            </p>
            <p className="mb-4 leading-relaxed">
              Khách sạn có cơ sở vật chất hiện đại và đa dạng dịch vụ đi kèm,
              mang tới sự tiện lợi tối đa cho khách hàng yên tâm và thoải mái nghỉ
              dưỡng
            </p>
            <p className="leading-relaxed">
              Hơn 50 phòng với nhiều lựa chọn loại giường và tiện nghi cao cấp,
              phù hợp mọi chuyến đi: cặp đôi, gia đình hay nhóm bạn.
            </p>
          </div>
        </div>
      </Section>

      {/* ROOMS */}
      <Section>
        <h2 className="mb-12 text-4xl font-bold text-center">
          Các Loại Phòng Chính Của Khách Sạn
        </h2>
        <div className="grid gap-10 md:grid-cols-4">
          {[
            {
              img: standardImg,
              name: "Standard",
              price: "600.000 VNĐ / Đêm",
              desc: "Tiện nghi - Giá tốt",
            },
            {
              img: deluxeImg,
              name: "Deluxe",
              price: "850.000 - 1tr1 VNĐ / Đêm",
              desc: "Sang trọng - Có ban công",
            },
            {
              img: suiteImg,
              name: "Suite",
              price: "1tr8 - 2tr1 VNĐ / Đêm",
              desc: "Rộng rãi - Riêng tư",
            },
            {
              img: familyImg,
              name: "Family/Group",
              price: "2tr - 2tr3 VNĐ / Đêm",
              desc: "Lý tưởng cho gia đình, bạn bè",
            },
          ].map((r, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="overflow-hidden bg-white shadow-xl rounded-2xl"
            >
              <img src={r.img} className="object-cover w-full h-48" />
              <div className="p-5 text-center">
                <h3 className="text-xl font-bold text-[#1E2A38]">{r.name}</h3>
                <p className="mt-1 text-gray-700">{r.desc}</p>
                <p className="mt-2 font-semibold text-red-600">{r.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* FACILITIES */}
      <Section className="bg-[#1E2A38]/5 py-20">
        <h2 className="mb-12 text-4xl font-extrabold text-center text-[#1E2A38]">
          Tiện ích nổi bật
        </h2>

        {/* Hàng trên: 2 tiện ích */}
        <div className="grid gap-10 mb-10 md:grid-cols-2">
          {[
            {
              img: poolImg,
              title: "Hồ bơi vô cực",
              desc: "Thư giãn giữa làn nước xanh trong, hướng trọn view biển tuyệt đẹp.",
            },
            {
              img: spaImg,
              title: "Spa cao cấp",
              desc: "Mang lại trải nghiệm phục hồi năng lượng đỉnh cao.",
            }
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.06 }}
              className="text-center cursor-pointer group"
            >
              <img
                src={f.img}
                className="object-cover w-full h-56 transition-all shadow-xl rounded-2xl"
              />
              <h3 className="mt-4 text-xl font-semibold text-(--color-primary) group-hover:text-[#2a4b70] group-hover:text-2xl transition-all">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-[#9b9b9b]">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Hàng dưới: 2 tiện ích */}
        <div className="grid gap-10 md:grid-cols-2">
          {[
            {
              img: gymImg,
              title: "Phòng gym hiện đại",
              desc: "Trang thiết bị cao cấp hỗ trợ tập luyện mỗi ngày.",
            },
            {
              img: restaurantImg,
              title: "Nhà hàng sang trọng",
              desc: "Ẩm thực tinh hoa với đầu bếp giàu kinh nghiệm.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.06 }}
              className="text-center cursor-pointer group "
            >
              <img
                src={f.img}
                className="object-cover w-full h-56 transition-all shadow-xl rounded-2xl"
              />
              <h3 className="mt-4 text-xl font-semibold text-(--color-primary) group-hover:text-[#2a4b70] group-hover:text-2xl transition-all">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-[#9b9b9b]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* REVIEWS */}
      <Section className="py-20 bg-[#1E2A38]/5">
        <h2 className="mb-12 text-4xl font-bold text-center text-[#1E2A38]">
          Khách Đã Trải Nghiệm Nói Gì?
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {ratings.length > 0 ? (
            ratings.map((rv, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              className="p-6 transition-all bg-white shadow-xl rounded-2xl group "
            >
              {/* Rating */}
              <div className="flex items-center justify-between cursor-pointer">
                <div className="gap-2">
                  <span className="text-lg font-bold text-[#CBA75E]">
                    {rv.stars.toFixed(1)}
                  </span>
                  <span className="text-[#E5C97B] text-lg">⭐</span>
                </div>
                <div className="text-sm text-[#B5B5B5] flex justify-between">
                  ⏱️ {rv.time}
                </div>
              </div>

              {/* Comment */}
              <p className="mt-4 italic text-[#1E2A38]/90">“{rv.review}”</p>

              <p className="mt-4 font-bold text-(--color-primary) group-hover:text-[#CBA75E] transition-colors">
                {rv.name}
              </p>
            </motion.div>
          ))
          ) : (
            <p className="text-center col-span-3 text-gray-500">Chưa có đánh giá nào</p>
          )}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <h2 className="mb-12 text-4xl font-bold text-center">
          Ưu Đãi Cho Khách Hàng Mới Và Cũ
        </h2>
        <div className="py-16 text-center text-white bg-(--color-primary) shadow-xl rounded-2xl">
          <h2 className="mb-4 text-4xl font-bold">
            Sẵn sàng đặt kỳ nghỉ mơ ước?
          </h2>
          <p className="mb-6 text-lg text-red-100">
            Nhận 10% ưu đãi cho đơn đặt phòng đầu tiên và 1 đêm miễn phí nếu
            tích lũy đủ 10 đêm tại khách sạn.
          </p>
          <Button
            onClick={() => navigation("/room-types")}
            variant="secondary"
            className="px-12 py-6 text-lg font-semibold text-(--color-primary) bg-white hover:bg-gray-300 rounded-xl cursor-pointer"
          >
            Đặt phòng ngay
          </Button>
        </div>
      </Section>
    </div>
  );
}
