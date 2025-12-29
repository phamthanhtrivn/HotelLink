package iuh.fit.backend.controller.customer;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member/bookings")
public class Customer_BookingController {
    private final BookingService bookingService;

    @GetMapping("/customer-total/{customerId}")
    public ResponseEntity<APIResponse<?>> getTotalBookingsByCustomerId(@PathVariable String customerId) {
        APIResponse<?> response = bookingService.getTotalBookingsByCustomerId(customerId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    
}
