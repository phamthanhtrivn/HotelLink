package iuh.fit.backend.controller.auth;

import iuh.fit.backend.dto.LoginRequest;
import iuh.fit.backend.dto.RegisterRequest;
import iuh.fit.backend.dto.APIResponse;
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
}
