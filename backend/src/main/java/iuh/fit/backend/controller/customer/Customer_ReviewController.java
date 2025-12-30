package iuh.fit.backend.controller.customer;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.dto.ReviewRequest;
import iuh.fit.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.nio.file.AccessDeniedException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member/reviews")
public class Customer_ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/customer/{customerId}/booking/{bookingId}")
    public ResponseEntity<APIResponse<?>> createReviewByCustomer(@PathVariable String customerId, @PathVariable String bookingId, @RequestBody @Valid ReviewRequest reviewRequest) throws AccessDeniedException {
        APIResponse<?> response = reviewService.createReviewByCustomer(customerId, bookingId, reviewRequest);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<APIResponse<?>> getReviewDetailByBooking(@PathVariable String bookingId) {
        APIResponse<?> response = reviewService.getReviewByBooking(bookingId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    
}
