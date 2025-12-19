import { useEffect, useState } from "react";

const ImgSlider = ({ images, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full h-full">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
        className="object-cover w-full h-full transition-all duration-700"
      />
      {images.length > 1 && (
        <div className="absolute flex gap-2 -translate-x-1/2 bottom-4 left-1/2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === currentIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ImgSlider;