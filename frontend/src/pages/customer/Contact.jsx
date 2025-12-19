/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Mail, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="bg-white text-gray-800">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#1e2a38] text-white">
        <div className="max-w-7xl mx-auto px-6 py-28 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-wide"
          >
            Liên hệ với Lachateau
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-6 max-w-3xl mx-auto text-lg text-gray-200"
          >
            Chúng tôi luôn sẵn sàng lắng nghe và đồng hành cùng bạn
          </motion.p>
        </div>
        {/* Optional: overlay gradient / background image */}
        <div className="absolute inset-0 bg-linear-to-b from-[#1e2a38]/90 to-[#1e2a38]/60"></div>
      </section>

      {/* Main Contact Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Map */}
        <div className="hidden md:block w-full h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white hover:shadow-2xl transition-shadow duration-300">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.85816909105!2d106.68427047451765!3d10.822164158349457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174deb3ef536f31%3A0x8b7bb8b7c956157b!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2hp4buHcCBUUC5IQ00!5e0!3m2!1svi!2s!4v1760798549315!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bản đồ vị trí khách sạn"
          ></iframe>
        </div>

        {/* Contact Form */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-10 w-full h-full transform hover:scale-[1.02] transition-transform duration-300 flex flex-col">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-linear-to-br from-[#1E2A38] to-[#1E2A38] p-4 rounded-full">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Gửi lời nhắn cho chúng tôi
          </h2>

          <p className="text-gray-500 text-center mb-8">
            Chúng tôi sẽ phản hồi trong vòng 24 giờ
          </p>

          <form className="space-y-6 flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#1E2A38] focus:border-[#1E2A38] outline-none transition-all duration-200 hover:border-gray-300"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#1E2A38] focus:border-[#1E2A38] outline-none transition-all duration-200 hover:border-gray-300"
              />
            </div>

            <input
              type="text"
              placeholder="Tiêu đề"
              className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#1E2A38] focus:border-[#1E2A38] outline-none transition-all duration-200 hover:border-gray-300"
            />

            <textarea
              rows={5}
              placeholder="Nội dung tin nhắn"
              className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#1E2A38] focus:border-[#1E2A38] outline-none transition-all duration-200 hover:border-gray-300 resize-none"
            ></textarea>

            <div className="text-center mt-auto">
              <button
                type="submit"
                className="bg-linear-to-r from-[#1E2A38] to-[#1E2A38] hover:from-[#1E2A38] hover:to-[#1E2A38] text-white font-semibold py-4 px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 mx-auto group"
              >
                <span>Gửi tin nhắn</span>
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Address Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-[#1E2A38] group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-[#1E2A38] to-[#1E2A38] rounded-full mb-5 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Địa chỉ</h3>
            <p className="text-gray-600 leading-relaxed">
              12 Nguyễn Văn Bảo, P.4,<br/>
              Q. Gò Vấp, TP.HCM
            </p>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-[#1E2A38] group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-[#1E2A38] to-[#1E2A38] rounded-full mb-5 group-hover:scale-110 transition-transform duration-300">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Liên hệ</h3>
            <p className="text-gray-600 mb-2 hover:text-[#1E2A38] transition-colors cursor-pointer">
              (+84) 398 694 435
            </p>
            <p className="text-gray-600 hover:text-[#1E2A38] transition-colors cursor-pointer">
              hotellink@gmail.com
            </p>
          </div>

          {/* Hours Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-[#1E2A38] group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-[#1E2A38] to-[#1E2A38] rounded-full mb-5 group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Giờ làm việc</h3>
            <p className="text-gray-600 mb-2">Thứ 2 - Chủ Nhật</p>
            <p className="text-gray-600 font-semibold">07:00 - 22:00</p>
          </div>
        </div>
      </section>
    </div>
  );
}
