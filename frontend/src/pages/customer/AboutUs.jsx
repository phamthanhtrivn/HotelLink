/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Crown, Sparkles, Leaf, Coffee, Users, Building } from "lucide-react";
import bg01 from "../../assets/Hotel-3.avif";
import bg02 from "../../assets/Hotel-4.avif";
import bg03 from "../../assets/Hotel-5.avif";

const AboutUs = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-(--color-primary) text-white">
        <div className="max-w-7xl mx-auto px-6 py-28 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-wide"
          >
            Chào mừng đến với Khách sạn HotelLink
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-6 max-w-3xl mx-auto text-lg text-gray-200"
          >
            Bản giao hưởng kiến trúc châu Âu giữa lòng Sài Gòn sôi động
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl font-semibold text-(--color-primary) flex items-center gap-3">
              <Crown className="w-7 h-7 text-(--color-background)" />
              Câu chuyện HotelLink
            </h2>
            <p className="mt-6 leading-relaxed text-gray-700">
              Giữa những con phố không ngủ của Sài Gòn, HotelLink hiện lên như một tòa lâu đài dát vàng, mang dáng vẻ cổ điển châu Âu đầy tinh tế. Những mái vòm mềm mại và đường nét kiến trúc cầu kỳ mở ra hành trình khám phá vẻ đẹp vượt thời gian.
            </p>
            <p className="mt-4 leading-relaxed text-gray-700">
              Từng chi tiết nhỏ, từ ánh đèn pha lê, những bức bích họa sống động đến các phù điêu nghệ thuật tinh xảo, đều được chăm chút để nâng niu cảm xúc và tôn vinh nghệ thuật tận hưởng cuộc sống.
            </p>
          </div>

          <div className="bg-[#f7f5f0] rounded-2xl p-10 shadow-lg">
            <Building className="w-12 h-12 text-(--color-background)" />
            <p className="mt-6 text-gray-700 leading-relaxed">
              HotelLink không chỉ là nơi lưu trú, mà là điểm đến nơi vẻ đẹp cổ điển hòa quyện cùng tiện nghi hiện đại, tạo nên một không gian nghỉ dưỡng đẳng cấp và khác biệt.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Image Gallery */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[bg02, bg01, bg03].map((src, index) => (
            <div key={index} className="relative overflow-hidden rounded-2xl group">
              <img
                src={src}
                alt="HotelLink"
                className="w-full h-72 object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          ))}
        </motion.div>
      </section>

      {/* Experience Section */}
      <section className="bg-[#f7f5f0] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-3xl font-semibold text-center text-(--color-primary)"
          >
            Trải nghiệm tại HotelLink
          </motion.h2>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Sparkles, title: "Thiết kế tinh xảo", text: "Hài hòa kiến trúc châu Âu cổ điển và thẩm mỹ hiện đại." },
              { icon: Leaf, title: "Ốc đảo giữa phố thị", text: "Hồ bơi tràn bờ và khu vườn La Garden yên bình." },
              { icon: Coffee, title: "Hành trình ẩm thực", text: "Không gian ẩm thực tinh tế và tiệc trà thanh nhã." },
              { icon: Users, title: "Khoảnh khắc đáng nhớ", text: "Nơi kết nối, tổ chức sự kiện và lưu giữ kỷ niệm." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition"
              >
                <item.icon className="w-10 h-10 text-(--color-background)" />
                <h3 className="mt-4 font-semibold text-lg text-(--color-primary)">{item.title}</h3>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-xl leading-relaxed text-gray-700"
        >
          Dù bạn là doanh nhân tìm kiếm sự cân bằng, nghệ sĩ khao khát nguồn cảm hứng mới hay người trẻ mong muốn tìm về những giá trị nguyên bản, HotelLink luôn chào đón bạn bằng sự mến khách chân thành và những khoảng lặng quý giá.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-6 text-(--color-background) font-medium"
        >
          HotelLink – nơi mỗi kỳ nghỉ trở thành một cảm xúc đáng nhớ.
        </motion.p>
      </section>
    </div>
  );
};

export default AboutUs;
