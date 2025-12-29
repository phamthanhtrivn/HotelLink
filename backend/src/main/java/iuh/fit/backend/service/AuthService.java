package iuh.fit.backend.service;

import com.nimbusds.oauth2.sdk.http.HTTPResponse;
import io.github.cdimascio.dotenv.Dotenv;
import iuh.fit.backend.dto.*;
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

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final PasswordEncoder passwordEncoder;
    private final IdUtil idUtil;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepo userRepo;
    private final CustomerRepo customerRepo;
    private final PersonRepo personRepo;
    @Value("${app.frontend.url}")
    private String frontendUrl;
    private final EmailService emailService;

    @Transactional
    public APIResponse<Object> register(RegisterRequest request) {
        APIResponse<Object> response = new APIResponse<>();
        response.setSuccess(false);
        response.setData(null);
        response.setStatus(HTTPResponse.SC_OK);

        if (userRepo.findUserByEmail(request.getEmail()) != null) {
            response.setMessage("Email đã tồn tại!");
            return response;
        }
        if (customerRepo.findCustomersByPhone(request.getPhone()) != null) {
            response.setMessage("Số điện thoại đã tồn tại!");
            return response;
        }

        User user = new User();
        user.setId(idUtil.generateUniqueCodeForUser());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.MEMBER);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(null);
        user.setStatus(true);

        user = userRepo.save(user);

        Customer customer = new Customer();
        customer.setUser(user);
        customer.setFullName(request.getFullName());
        customer.setPhone(request.getPhone());
        customer.setPoints(0);

        customerRepo.save(customer);

        response.setSuccess(true);
        response.setMessage("Đăng ký thành công!");

        return response;
    }

    public APIResponse<LoginResponse> login(LoginRequest request) {
        APIResponse<LoginResponse> response = new APIResponse<>();
        response.setSuccess(false);
        response.setData(null);
        response.setStatus(HTTPResponse.SC_OK);

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userRepo.findUserByEmail(request.getEmail());

            if (user == null) {
                response.setMessage("Tài khoản không tồn tại!");
                response.setStatus(HTTPResponse.SC_BAD_REQUEST);
                return response;
            }

            if (!user.isStatus()) {
                response.setMessage("Tài khoản đã bị khóa!");
                response.setStatus(HTTPResponse.SC_FORBIDDEN);
                return response;
            }

            String token = jwtService.generateAccessToken(user);

            LoginResponse loginResponse = new LoginResponse(user.getRole().name(), token);

            response.setSuccess(true);
            response.setMessage("Đăng nhập thành công!");
            response.setData(loginResponse);

        } catch (DisabledException e) {
            response.setMessage("Tài khoản chưa được kích hoạt!");
            response.setStatus(HTTPResponse.SC_FORBIDDEN);
        } catch (BadCredentialsException e) {
            response.setMessage("Email hoặc mật khẩu không đúng!");
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
        } catch (Exception e) {
            response.setMessage("Lỗi hệ thống!");
            response.setStatus(HTTPResponse.SC_SERVER_ERROR);
        }

        return response;
    }

    public APIResponse<InforResponse> verifyToken(String authHeader) {
        APIResponse<InforResponse> response = new APIResponse<>();
        response.setSuccess(false);
        response.setData(null);
        response.setStatus(HTTPResponse.SC_OK);

        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.setMessage("Thiếu token hoặc token không hợp lệ");
                response.setStatus(HTTPResponse.SC_BAD_REQUEST);
                return response;
            }

            String token = authHeader.substring(7);

            if (!jwtService.isAccessTokenValid(token)) {
                response.setMessage("Token không hợp lệ hoặc đã hết hạn");
                response.setStatus(HTTPResponse.SC_BAD_REQUEST);
                return response;
            }

            String userId = jwtService.extractUserId(token);

            Optional<User> optUser = userRepo.findById(userId);
            if (optUser.isEmpty()) {
                response.setMessage("Không tìm thấy tài khoản");
                response.setStatus(HTTPResponse.SC_BAD_REQUEST);
                return response;
            }
            User user = optUser.get();

            Optional<Person> optPerson = personRepo.findById(user.getId());
            if (optPerson.isEmpty()) {
                response.setMessage("Không tìm thấy thông tin cá nhân");
                response.setStatus(HTTPResponse.SC_BAD_REQUEST);
                return response;
            }
            Person person = optPerson.get();

            InforResponse inforResponse = new InforResponse(user.getId(), person.getFullName(), user.getEmail() ,person.getPhone(), user.getRole().name());

            response.setSuccess(true);
            response.setMessage("Token hợp lệ");
            response.setData(inforResponse);

            return response;

        } catch (Exception e) {
            response.setMessage("Lỗi xác thực token: " + e.getMessage());
            response.setStatus(HTTPResponse.SC_SERVER_ERROR);
            return response;
        }
    }

    public APIResponse<Object> sendResetPasswordEmail(String email) {
        APIResponse<Object> response = new APIResponse<>();
        response.setSuccess(false);
        response.setData(null);
        response.setStatus(HTTPResponse.SC_OK);

        User user = userRepo.findUserByEmail(email);
        if (user == null) {
            response.setMessage("Email không tồn tại trong hệ thống!");
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            return response;
        }

        String token = jwtService.generateResetPasswordToken(email);
        String link = frontendUrl + "/reset-password?token=" + token;

        emailService.sendResetPasswordEmail(email, link);
        response.setSuccess(true);
        response.setMessage("Link đặt lại mật khẩu đã được gửi đến email của bạn!");
        return response;
    }

    public APIResponse<Object> validateResetToken(String token) {
        try {
            if (!jwtService.validateResetPasswordToken(token)) {
                return new APIResponse<>(false, HTTPResponse.SC_NOT_FOUND, "Token không hợp lệ hoặc đã hết hạn", null);
            }
            return new APIResponse<>(true, HTTPResponse.SC_OK, "Token hợp lệ", null);
        } catch (Exception e) {
            return new APIResponse<>(false, HTTPResponse.SC_SERVER_ERROR, "Lỗi khi kiểm tra token: " + e.getMessage(), null);
        }
    }

    public APIResponse<Void> resetPassword(String token, String newPassword) {
        try {
            if (!jwtService.validateResetPasswordToken(token)) {
                return new APIResponse<>(false, HTTPResponse.SC_NOT_FOUND, "Token không hợp lệ hoặc đã hết hạn", null);
            }

            String email = jwtService.extractEmailFromResetToken(token);
            User user = userRepo.findUserByEmail(email);
            if (user == null) {
                return new APIResponse<>(false, HTTPResponse.SC_NOT_FOUND, "Không tìm thấy người dùng", null);
            }

            user.setPassword(passwordEncoder.encode(newPassword));
            user.setUpdatedAt(LocalDateTime.now());
            userRepo.save(user);

            return new APIResponse<>(true, HTTPResponse.SC_OK, "Đặt lại mật khẩu thành công", null);

        } catch (Exception e) {
            return new APIResponse<>(false, HTTPResponse.SC_SERVER_ERROR, "Lỗi khi đặt lại mật khẩu: " + e.getMessage(), null);
        }
    }

}
