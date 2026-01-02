package iuh.fit.backend.util;

import iuh.fit.backend.repository.BookingRepo;
import iuh.fit.backend.repository.ReviewRepo;
import iuh.fit.backend.repository.ServiceRepo;
import iuh.fit.backend.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
@RequiredArgsConstructor
public class IdUtil {
    private final UserRepo userRepo;
    private final BookingRepo bookingRepo;
    private final ReviewRepo reviewRepo;
    private final ServiceRepo serviceRepo;

    private String randomCode(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    public String generateUniqueCodeForUser() {
        String code;
        do {
            code = "US" + randomCode(10);
        } while (userRepo.existsUserById(code));
        return code;
    }

    public String generateUniqueCodeForBooking() {
        String code;
        do {
            code = "BK" + randomCode(10);
        } while (bookingRepo.existsBookingsById(code));
        return code;
    }

    public String generateUniqueCodeForReview() {
        String code;
        do {
            code = "RV" + randomCode(10);
        } while (reviewRepo.existsReviewsById(code));
        return code;
    }

    public String generateUniqueCodeForService() {
        String code;
        do {
            code = "SV" + randomCode(10);
        } while (serviceRepo.existsServicesById(code));
        return code;
    }
}
