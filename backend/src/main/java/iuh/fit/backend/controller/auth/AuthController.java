package iuh.fit.backend.controller.auth;

import iuh.fit.backend.dto.LoginRequest;
import iuh.fit.backend.dto.RegisterRequest;
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
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> register(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    
    @GetMapping("/verify-token")
    public ResponseEntity<?> verifyToken(@RequestHeader ("Authorization") String authHeader) {
        return ResponseEntity.ok(authService.verifyToken(authHeader));
    }
}
