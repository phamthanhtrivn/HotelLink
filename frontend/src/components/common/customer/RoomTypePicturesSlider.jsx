/* eslint-disable no-unused-vars */
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RoomTypePicturesSlider = ({
  images = [],
  visibleCount = 1,
  height = "70vh", // giữ prop cho tương thích, KHÔNG dùng
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex < images.length - visibleCount) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!images.length) return null;

  return (
    <section className="relative w-full h-full overflow-hidden">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
        }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`slide-${index}`}
            className="shrink-0 w-full h-full object-cover"
            style={{
              width: `${100 / visibleCount}%`,
            }}
          />
        ))}
      </div>

      {/* PREV */}
      <button
        onClick={prevSlide}
        disabled={currentIndex === 0}
        className="
          absolute left-3 top-1/2 -translate-y-1/2
          bg-white/70 hover:bg-white
          text-black
          rounded-full p-2
          shadow z-10
          disabled:opacity-30
        "
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* NEXT */}
      <button
        onClick={nextSlide}
        disabled={currentIndex >= images.length - visibleCount}
        className="
          absolute right-3 top-1/2 -translate-y-1/2
          bg-white/70 hover:bg-white
          text-black
          rounded-full p-2
          shadow z-10
          disabled:opacity-30
        "
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
    </section>
  );
};

export default RoomTypePicturesSlider;
