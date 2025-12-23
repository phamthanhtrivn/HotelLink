package iuh.fit.backend.controller;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/top-three")
    public ResponseEntity<APIResponse<?>> getTopThreeReviews() {
        APIResponse<?> response = reviewService.getTopThreeReviews();
        return ResponseEntity
                .status(response.getStatus())
                .body(response);
    }

    @GetMapping("/room-type/{roomTypeId}")
    public ResponseEntity<APIResponse<?>> getReviewsByRoomType(@PathVariable String roomTypeId) {
        APIResponse<?> response = reviewService.getReviewsByRoomType(roomTypeId);
        return ResponseEntity
                .status(response.getStatus())
                .body(response);
    }
}
