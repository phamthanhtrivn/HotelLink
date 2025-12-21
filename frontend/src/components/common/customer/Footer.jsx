import {
  Facebook,
  Instagram,
  Youtube,
  Phone,
  Mail,
  Clock,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-linear-to-br from-[#1a2332] to-[#2d3a4d] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Map Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-(--color-background) relative inline-block">
              Bản đồ
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-(--color-background)"></span>
            </h3>
            <div className="rounded-lg overflow-hidden shadow-xl border border-gray-700 hover:border-(--color-background) transition-colors duration-300">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.85816909105!2d106.68427047451765!3d10.822164158349457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174deb3ef536f31%3A0x8b7bb8b7c956157b!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2hp4buHcCBUUC5IQ00!5e0!3m2!1svi!2s!4v1760798549315!5m2!1svi!2s"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ vị trí khách sạn"
              ></iframe>
            </div>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-(--color-background) relative inline-block">
              Liên kết
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-(--color-background)"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-(--color-background) transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full group-hover:bg-(--color-background) transition-colors"></span>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-(--color-background) transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full group-hover:bg-(--color-background) transition-colors"></span>
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  to="/facility"
                  className="text-gray-300 hover:text-(--color-background) transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full group-hover:bg-(--color-background) transition-colors"></span>
                  Cơ sở vật chất
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-(--color-background) transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full group-hover:bg-(--color-background) transition-colors"></span>
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-(--color-background) relative inline-block">
              Liên hệ
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-(--color-background)"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors duration-200 group">
                <Phone
                  size={20}
                  className="text-(--color-background) mt-0.5 shrink-0 group-hover:scale-110 transition-transform"
                />
                <span className="text-sm leading-relaxed">
                  (+84) 398 694 435
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors duration-200 group">
                <Mail
                  size={20}
                  className="text-(--color-background) mt-0.5 shrink-0 group-hover:scale-110 transition-transform"
                />
                <span className="text-sm leading-relaxed break-all">
                  hotellink@gmail.com
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors duration-200 group">
                <MapPin
                  size={20}
                  className="text-(--color-background) mt-0.5 shrink-0 group-hover:scale-110 transition-transform"
                />
                <span className="text-sm leading-relaxed">
                  12 Nguyễn Văn Bảo, P.4, Q. Gò Vấp, TP.HCM
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors duration-200 group">
                <Clock
                  size={20}
                  className="text-(--color-background) mt-0.5 shrink-0 group-hover:scale-110 transition-transform"
                />
                <span className="text-sm leading-relaxed">
                  Thứ 2 - Chủ Nhật
                  <br />
                  07:00 - 22:00
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-(--color-background) relative inline-block">
              Mạng xã hội
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-(--color-background)"></span>
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 text-gray-300 hover:text-[#3b5998] transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center ">
                    <Facebook size={20} />
                  </div>
                  <span className="text-sm font-medium">Facebook</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 text-gray-300 hover:text-[#E1306C] transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center ">
                    <Instagram size={20} />
                  </div>
                  <span className="text-sm font-medium">Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 text-gray-300 hover:text-[#FF0000] transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center  ">
                    <Youtube size={20} />
                  </div>
                  <span className="text-sm font-medium transition-all duration-200">
                    YouTube
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <p className="text-center text-sm text-gray-400">
            © 2025 Công ty HotelLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
