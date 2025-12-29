package iuh.fit.backend.scheduler;

import iuh.fit.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingScheduler {
    private final BookingService bookingService;

    @Scheduled(fixedRate = 60 * 1000)
    public void handleExpiredBookings() {
        bookingService.cancelExpiredPendingBookings();
    }
}
