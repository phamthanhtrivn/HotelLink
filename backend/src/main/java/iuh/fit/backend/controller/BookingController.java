package iuh.fit.backend.controller;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.dto.BookingRequest;
import iuh.fit.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/bookings")
public class BookingController {
    private final BookingService bookingService;

    @PostMapping("/create-by-customer")
    public ResponseEntity<APIResponse<?>> createBookingByCustomer(@RequestBody @Valid BookingRequest bookingRequest) {
        APIResponse<?> response = bookingService.createBookingByCustomer(bookingRequest);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    
    @GetMapping("/{bookingId}")
    public ResponseEntity<APIResponse<?>> getBookingById(@PathVariable String bookingId) {
        APIResponse<?> response = bookingService.getBookingById(bookingId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    
}
