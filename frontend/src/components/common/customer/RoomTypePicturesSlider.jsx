import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RoomTypePicturesSlider = ({
  images = [],
  visibleCount = 3,
  height = "70vh",
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
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
          }}
        >
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`slide-${index}`}
              className="shrink-0 object-cover"
              style={{
                width: `${100 / visibleCount}%`,
                height,
              }}
            />
          ))}
        </div>
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full p-2 shadow z-10 disabled:opacity-30"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={nextSlide}
          disabled={currentIndex >= images.length - visibleCount}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full p-2 shadow z-10 disabled:opacity-30"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
};

export default RoomTypePicturesSlider;
