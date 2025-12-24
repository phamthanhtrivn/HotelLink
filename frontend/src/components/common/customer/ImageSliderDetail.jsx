import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const ImageSliderDetail = ({ images = [] }) => {
  const [index, setIndex] = useState(0);

  if (!images.length) return null;

  const prev = () =>
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () =>
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="relative w-full h-full overflow-hidden">
      <img
        src={images[index]}
        alt="room"
        className="w-full h-full object-cover transition-all duration-500"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white"
          >
            <ChevronRight />
          </button>
        </>
      )}
    </div>
  );
};

export default ImageSliderDetail;