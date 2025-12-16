package iuh.fit.backend.util;

import iuh.fit.backend.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
@RequiredArgsConstructor
public class IdUtil {
    private final UserRepo userRepo;

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
}
