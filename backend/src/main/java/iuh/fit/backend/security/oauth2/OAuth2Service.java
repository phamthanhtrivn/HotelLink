package iuh.fit.backend.security.oauth2;

import com.nimbusds.oauth2.sdk.http.HTTPResponse;
import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.entity.Customer;
import iuh.fit.backend.entity.Person;
import iuh.fit.backend.entity.User;
import iuh.fit.backend.entity.UserRole;
import iuh.fit.backend.repository.CustomerRepo;
import iuh.fit.backend.repository.PersonRepo;
import iuh.fit.backend.repository.UserRepo;
import iuh.fit.backend.security.jwt.JwtService;
import iuh.fit.backend.util.IdUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OAuth2Service {
    private final UserRepo userRepo;
    private final CustomerRepo customerRepo;
    private final IdUtil idUtil;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public APIResponse<String> processOAuthPostLogin(String email, String name) {
        User user = userRepo.findUserByEmail(email);

        if (user != null) {
            if (!user.isStatus()) {
                return new APIResponse<>(
                        false,
                        HTTPResponse.SC_FORBIDDEN,
                        "Tài khoản đã bị khóa, không thể đăng nhập",
                        null
                );
            }

            if (user.getRole() != UserRole.MEMBER) {
                return new APIResponse<>(
                        false,
                        HTTPResponse.SC_FORBIDDEN,
                        "Tài khoản này không được phép đăng nhập bằng OAuth2",
                        null
                );
            }
        } else {
            user = createNewUser(email, name);
        }

        String token = jwtService.generateAccessToken(user);

        return new APIResponse<>(true, HTTPResponse.SC_OK,"Lấy token thành công", token);
    }

    @Transactional
    public User createNewUser(String email, String name) {
        User user = new User();
        user.setId(idUtil.generateUniqueCodeForUser());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("123456"));
        user.setRole(UserRole.MEMBER);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(null);
        user.setStatus(true);

        user = userRepo.save(user);

        Customer customer = new Customer();
        customer.setUser(user);
        customer.setFullName(name);
        customer.setPhone("");
        customer.setPoints(0);

        customerRepo.save(customer);

        return user;
    }
}
