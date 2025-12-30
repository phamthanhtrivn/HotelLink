/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ConciergeBell,
  Building2,
  MessageSquareText,
  Bubbles,
  Check,
} from "lucide-react";
import { REVIEW_STATUS_MAP, TAGS } from "@/constants/ReviewConstants";
import ScoreItem from "./ScoreItem";
import { toast } from "react-toastify";
import { reviewService } from "@/services/reviewService";

const BookingReviewDialog = ({ open, onOpenChange, customerId, bookingId }) => {
  const [review, setReview] = useState(null);
  const [cleanlinessScore, setCleanlinessScore] = useState(8);
  const [serviceScore, setServiceScore] = useState(8);
  const [facilitiesScore, setFacilitiesScore] = useState(8);
  const [comments, setComments] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isReviewed = Boolean(review);

  const handleToggleTag = (tag) => {
    setComments((prev) => {
      if (prev.includes(tag)) {
        return prev
          .replace(new RegExp(`(,\\s*)?${tag}`), "")
          .replace(/^,\s*/, "")
          .trim();
      }

      return prev ? `${prev.trim()}, ${tag}` : tag;
    });
  };

  const handleCreateReview = async () => {
    setIsLoading(true);
    try {
      const reviewRequest = {
        cleanlinessScore,
        serviceScore,
        facilitiesScore,
        comments,
      };
      const res = await reviewService.reviewByCustomer(
        reviewRequest,
        customerId,
        bookingId
      );
      if (res.success) {
        toast.success(res.message);
        setReview(res.data);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Đánh giá thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchReview = async () => {
    try {
      const res = await reviewService.getReviewByBookingId(bookingId);
      if (res.success) {
        if (res.data) {
          setReview(res.data);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Lấy đánh giá thất bại!");
    }
  };

  useEffect(() => {
    handleFetchReview();
  }, [customerId, bookingId]);

  useEffect(() => {
    if (!review) return;

    setCleanlinessScore(review.cleanlinessScore);
    setServiceScore(review.serviceScore);
    setFacilitiesScore(review.facilitiesScore);
    setComments(review.comments || "");
  }, [review]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            Đánh giá kỳ nghỉ của bạn
            {review?.status && (
              <Badge
                variant="outline"
                className={REVIEW_STATUS_MAP[review.status]?.className}
              >
                {REVIEW_STATUS_MAP[review.status]?.label}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Scores */}
        <div className="space-y-6 mt-2">
          <ScoreItem
            disabled={isReviewed}
            icon={<Bubbles className="w-4 h-4 text-sky-500" />}
            label="Sạch sẽ"
            value={cleanlinessScore}
            onChange={setCleanlinessScore}
          />
          <ScoreItem
            disabled={isReviewed}
            icon={<ConciergeBell className="w-4 h-4 text-amber-500" />}
            label="Phục vụ"
            value={serviceScore}
            onChange={setServiceScore}
          />
          <ScoreItem
            disabled={isReviewed}
            icon={<Building2 className="w-4 h-4 text-violet-500" />}
            label="Cơ sở vật chất"
            value={facilitiesScore}
            onChange={setFacilitiesScore}
          />
        </div>

        {/* Tags */}
        <div className="mt-6">
          <p className="text-sm font-medium mb-2 text-muted-foreground">
            Gợi ý nhanh
          </p>

          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => {
              const active = comments.includes(tag);

              return (
                <Badge
                  key={tag}
                  variant="outline"
                  onClick={() => {
                    if (isReviewed) return;
                    handleToggleTag(tag);
                  }}
                  className={`
                    cursor-pointer transition-all
                    ${
                      active
                        ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                        : "hover:bg-muted"
                    }
                  `}
                >
                  {active && <Check className="w-3 h-3 mr-1" />}
                  {tag}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Comment */}
        <div className="mt-4">
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <MessageSquareText className="w-4 h-4" />
            Bình luận
          </label>

          <Textarea
            disabled={review}
            rows={5}
            className="max-h-48 resize-none overflow-y-auto"
            placeholder="Chia sẻ trải nghiệm thực tế của bạn..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Hủy
          </Button>

          <Button
            disabled={isLoading || review}
            onClick={handleCreateReview}
            className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xử lý...
              </div>
            ) : (
              `Gửi đánh giá`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingReviewDialog;
