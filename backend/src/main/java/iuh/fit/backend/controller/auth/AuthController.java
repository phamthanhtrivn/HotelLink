package iuh.fit.backend.controller.auth;

import iuh.fit.backend.dto.*;
import iuh.fit.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<APIResponse<?>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        APIResponse<?> response = authService.register(request);
        return ResponseEntity
                .status(response.getStatus())
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<APIResponse<?>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        APIResponse<?> response = authService.login(request);
        return ResponseEntity
                .status(response.getStatus())
                .body(response);
    }

    @GetMapping("/verify-token")
    public ResponseEntity<APIResponse<?>> verifyToken(
            @RequestHeader("Authorization") String authHeader
    ) {
        APIResponse<?> response = authService.verifyToken(authHeader);
        return ResponseEntity
                .status(response.getStatus())
                .body(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<APIResponse<?>> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        APIResponse<?> response = authService.sendResetPasswordEmail(request.getEmail());
        return ResponseEntity
                .status(response.getStatus())
                .body(response);
    }

    @GetMapping("/validate-reset-password-token")
    public ResponseEntity<APIResponse<?>> validateResetToken(@RequestParam String token) {
        APIResponse<?> response = authService.validateResetToken(token);
        return ResponseEntity
                .status(response.getStatus())
                .body(authService.validateResetToken(token));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody @Valid ResetPasswordRequest request
    ) {
        return ResponseEntity.ok(authService.resetPassword(request.getToken(), request.getNewPassword()));
    }

}
