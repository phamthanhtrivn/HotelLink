package iuh.fit.backend.util;

import iuh.fit.backend.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.nio.file.AccessDeniedException;

public class SecurityUtil {

    public static User getCurrentUser() throws AccessDeniedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof User)) {
            throw new AccessDeniedException("Chưa đăng nhập!");
        }

        return (User) auth.getPrincipal();
    }

    public static String getCurrentUserId() throws AccessDeniedException {
        return getCurrentUser().getId();
    }


}
