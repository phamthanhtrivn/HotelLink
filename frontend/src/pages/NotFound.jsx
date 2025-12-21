import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      <h1 className="mb-4 text-7xl font-extrabold text-(--color-primary)">
        404
      </h1>

      <p className="mb-8 text-lg md:text-xl text-gray-600">
        Trang bạn tìm không tồn tại hoặc đã bị di chuyển.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="px-6 py-3 cursor-pointer"
        >
          Quay lại trang trước
        </Button>

        <Button
          onClick={() => navigate("/", { replace: true })}
          className="px-6 py-3 bg-(--color-primary) hover:bg-[#2a4b70] text-white cursor-pointer"
        >
          Về trang chủ
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
