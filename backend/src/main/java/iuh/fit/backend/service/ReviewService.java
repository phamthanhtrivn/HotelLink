package iuh.fit.backend.service;

import com.nimbusds.oauth2.sdk.http.HTTPResponse;
import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.entity.Review;
import iuh.fit.backend.repository.ReviewRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepo reviewRepo;

    public APIResponse<Object> getTopThreeReviews() {
        APIResponse<Object> response = new APIResponse<>();
        response.setData(null);
        response.setStatus(HTTPResponse.SC_OK);
        try {
            List<Review> topThreeRatings = reviewRepo.findTop3ByRoomTypeOrderByRatingDesc();
            response.setData(topThreeRatings);
            response.setSuccess(true);
            response.setMessage("Lấy danh sách đánh giá thành công");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            response.setSuccess(false);
            response.setMessage("Lỗi khi lấy đánh giá");
        }
        return response;
    }

    public APIResponse<List<Review>> getReviewsByRoomType(String roomTypeId) {
        List<Review> reviews = reviewRepo.findReviewsByRoomTypeOrderByCreatedAtDesc(roomTypeId);
        if (reviews.isEmpty()) {
            return new APIResponse<>(false, HTTPResponse.SC_OK, "Không có đánh giá cho loại phòng này", null);
        }
        else {
            return new APIResponse<>(true, HTTPResponse.SC_OK, "Lấy đánh giá thành công", reviews);
        }
    }
}
