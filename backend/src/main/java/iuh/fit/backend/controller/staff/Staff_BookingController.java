package iuh.fit.backend.controller.staff;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.dto.StaffBookingRequest;
import iuh.fit.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
