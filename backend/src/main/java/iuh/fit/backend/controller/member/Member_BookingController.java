package iuh.fit.backend.controller.member;

import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.entity.BookingStatus;
import iuh.fit.backend.service.BookingService;
import lombok.RequiredArgsConstructor;

import java.nio.file.AccessDeniedException;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member/bookings")
public class Member_BookingController {
    private final BookingService bookingService;

    @GetMapping("/customer-total/{customerId}")
    public ResponseEntity<APIResponse<?>> getTotalBookingsByCustomerId(@PathVariable String customerId) {
        APIResponse<?> response = bookingService.getTotalBookingsByCustomerId(customerId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<APIResponse<?>> getBookingsByCustomerId(
            @PathVariable String customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) BookingStatus status
    ) throws AccessDeniedException {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        APIResponse<?> response =
                bookingService.getBookingByCustomer(customerId, status, pageable);

        return ResponseEntity.status(response.getStatus()).body(response);
    }
    
}
