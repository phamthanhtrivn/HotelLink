package iuh.fit.backend.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/reviews")
public class Admin_ReviewController {
  private final ReviewService reviewService;

  @GetMapping
  public ResponseEntity<APIResponse<?>> searchReviews(
      @RequestParam(required = false) Boolean status,
      @RequestParam(required = false) String customerName,
      @RequestParam(required = false) String bookingId,
      @RequestParam(required = false) String keyword,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
      @RequestParam(required = false) Double minScore,
      @RequestParam(required = false) Double maxScore,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    APIResponse<?> response = reviewService.searchReviews(status, customerName, bookingId, keyword, fromDate, toDate,
        minScore, maxScore, PageRequest.of(page, size, Sort.by("createdAt").descending()));
    return ResponseEntity.status(response.getStatus()).body(response);
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<APIResponse<?>> updateReviewStatus(
      @PathVariable String id,
      @RequestParam Boolean status) {
    APIResponse<?> response = reviewService.updateStatus(id, status);
    return ResponseEntity.status(response.getStatus()).body(response);
  }

}
