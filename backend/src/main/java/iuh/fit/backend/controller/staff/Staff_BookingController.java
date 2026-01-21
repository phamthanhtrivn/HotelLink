package iuh.fit.backend.controller.staff;

import iuh.fit.backend.dto.*;
import iuh.fit.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/staff/bookings")
public class Staff_BookingController {
    private final BookingService bookingService;

    @PostMapping("/search-advance")
    public ResponseEntity<APIResponse<?>> searchAdvance(
            @RequestBody BookingSearchRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        APIResponse<?> response =
                bookingService.searchAdvance(request, PageRequest.of(page, size, Sort.by("checkIn").descending()));

        return ResponseEntity
                .status(response.getStatus())
                .body(response);
    }

    @PostMapping
    public ResponseEntity<APIResponse<?>> createBooking(@RequestBody @Valid StaffBookingRequest bookingRequest) {
        APIResponse<?> response = bookingService.createBookingByStaff(bookingRequest);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PatchMapping("/{bookingId}/booking-status")
    public ResponseEntity<APIResponse<?>> updateBookingStatus(@PathVariable String bookingId, @RequestBody UpdateBookingStatusRequest request) {
        APIResponse<?> response = bookingService.updateBookingStatusByStaff(bookingId, request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PatchMapping("/{bookingId}/check-in")
    public ResponseEntity<APIResponse<?>> checkInBooking(@PathVariable String bookingId, @RequestBody CheckInRequest request) {
        APIResponse<?> response = bookingService.checkInBookingByStaff(bookingId, request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/{bookingId}/add-services")
    public ResponseEntity<APIResponse<?>> addServicesToBooking(@PathVariable String bookingId, @RequestBody @Valid AddBookingServiceRequest request) {
        APIResponse<?> response = bookingService.addServicesToBookingByStaff(bookingId, request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/{bookingId}/preview-checkout")
    public ResponseEntity<APIResponse<?>> previewCheckout(@PathVariable String bookingId) {
        APIResponse<?> response = bookingService.previewCheckoutByStaff(bookingId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/{bookingId}/check-out")
    public ResponseEntity<APIResponse<?>> checkOutBooking(@PathVariable String bookingId, @RequestBody String userId) {
        APIResponse<?> response = bookingService.checkOutBookingByStaff(bookingId, userId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

}
