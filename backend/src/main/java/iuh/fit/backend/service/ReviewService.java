package iuh.fit.backend.service;

import com.nimbusds.oauth2.sdk.http.HTTPResponse;
import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.dto.ReviewRequest;
import iuh.fit.backend.entity.Booking;
import iuh.fit.backend.entity.Customer;
import iuh.fit.backend.entity.Review;
import iuh.fit.backend.repository.BookingRepo;
import iuh.fit.backend.repository.CustomerRepo;
import iuh.fit.backend.repository.ReviewRepo;
import iuh.fit.backend.util.IdUtil;
import iuh.fit.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final IdUtil idUtil;
    private final ReviewRepo reviewRepo;
    private final CustomerRepo customerRepo;
    private final BookingRepo bookingRepo;

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
            return new APIResponse<>(true, HTTPResponse.SC_OK, "Không có đánh giá cho loại phòng này", reviews);
        } else {
            return new APIResponse<>(true, HTTPResponse.SC_OK, "Lấy đánh giá thành công", reviews);
        }
    }

    @Transactional
    public APIResponse<Review> createReviewByCustomer(String customerId, String bookingId, ReviewRequest reviewRequest)
            throws AccessDeniedException {
        APIResponse<Review> response = new APIResponse<>();
        response.setSuccess(false);
        response.setData(null);

        String currentId = SecurityUtil.getCurrentUserId();
        if (!currentId.equals(customerId)) {
            response.setStatus(HTTPResponse.SC_UNAUTHORIZED);
            response.setMessage("Chưa đăng nhập");
            return response;
        }

        Optional<Customer> customerOpt = customerRepo.findById(customerId);
        if (customerOpt.isEmpty()) {
            response.setStatus(HTTPResponse.SC_NOT_FOUND);
            response.setMessage("Không tìm thấy người dùng trong hệ thống!");
            return response;
        }

        Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            response.setStatus(HTTPResponse.SC_NOT_FOUND);
            response.setMessage("Không tìm thấy đơn đặt phòng trong hệ thống!");
            return response;
        }

        Customer customer = customerOpt.get();
        customer.setPoints(customer.getPoints() + bookingOpt.get().getNights());
        customerRepo.save(customer);

        Review review = new Review();
        review.setId(idUtil.generateUniqueCodeForReview());
        review.setCleanlinessScore(reviewRequest.getCleanlinessScore());
        review.setServiceScore(reviewRequest.getServiceScore());
        review.setFacilitiesScore(reviewRequest.getFacilitiesScore());
        review.setComments(reviewRequest.getComments());
        review.setBooking(bookingOpt.get());
        review.setCustomer(customerOpt.get());
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(null);
        review.setStatus(true);

        Review savedReview = reviewRepo.save(review);

        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Đánh giá thành công cho đơn đặt phòng " + bookingId);
        response.setData(savedReview);

        return response;
    }

    public APIResponse<Review> getReviewByBooking(String bookingId) {
        APIResponse<Review> response = new APIResponse<>();
        response.setSuccess(false);
        response.setData(null);

        Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            response.setStatus(HTTPResponse.SC_NOT_FOUND);
            response.setMessage("Không tìm thấy đơn đặt phòng");
            return response;
        }

        Review review = reviewRepo.findByBooking(bookingOpt.get());
        response.setSuccess(true);
        response.setData(review);
        if (review == null) {
            response.setStatus(HTTPResponse.SC_OK);
            response.setMessage("Không có đánh giá!");
        } else {
            response.setStatus(HTTPResponse.SC_OK);
            response.setMessage("Lấy đánh giá thành công!");

        }

        return response;
    }

    public APIResponse<Page<Review>> searchReviews(
            Boolean status,
            String customerName,
            String bookingId,
            String keyword,
            LocalDateTime fromDate,
            LocalDateTime toDate,
            Double minScore,
            Double maxScore,
            Pageable pageable) {
        Page<Review> result = reviewRepo.searchAdvance(
                status,
                customerName,
                bookingId,
                keyword,
                fromDate,
                toDate,
                minScore,
                maxScore,
                pageable);

        return new APIResponse<>(
                true,
                HTTPResponse.SC_OK,
                "Lấy danh sách đánh giá thành công",
                result);
    }

    public APIResponse<?> updateStatus(String id, Boolean status) {
    Review review = reviewRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá"));

    review.setStatus(status);
    review.setUpdatedAt(LocalDateTime.now());

    reviewRepo.save(review);

    return new APIResponse<>(
        true,
        HTTPResponse.SC_OK,
        "Cập nhật trạng thái đánh giá thành công",
        null
    );
}

}
