package iuh.fit.backend.controller.staff;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.dto.AddBookingServiceRequest;
import iuh.fit.backend.dto.StaffBookingRequest;
import iuh.fit.backend.dto.UpdateBookingStatusRequest;
import iuh.fit.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/staff/bookings")
public class Staff_BookingController {
    private final BookingService bookingService;

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
    public ResponseEntity<APIResponse<?>> checkInBooking(@PathVariable String bookingId, @RequestBody String userId) {
        APIResponse<?> response = bookingService.checkInBookingByStaff(bookingId, userId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/{bookingId}/add-services")
    public ResponseEntity<APIResponse<?>> addServicesToBooking(@PathVariable String bookingId, @RequestBody @Valid AddBookingServiceRequest request) {
        APIResponse<?> response = bookingService.addServicesToBookingByStaff(bookingId, request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

}
