package iuh.fit.backend.security.jwt;

import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import iuh.fit.backend.entity.User;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private final SecretKey SECRET_KEY;

    private static final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24; // 24h
    private static final long RESET_TOKEN_EXPIRATION  = 1000 * 60 * 15;      // 15 phút

    public JwtService() {
        String key = Dotenv.load().get("JWT_SECRET");
        this.SECRET_KEY = Keys.hmacShaKeyFor(
                key.getBytes(StandardCharsets.UTF_8)
        );
    }

    /* ===================== ACCESS TOKEN ===================== */

    public String generateAccessToken(User user) {
        return Jwts.builder()
                .setSubject(user.getId())                 // userId là chủ thể
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION)
                )
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUserId(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    public boolean isAccessTokenValid(String token) {
        return !isTokenExpired(token);
    }

    /* ===================== RESET PASSWORD TOKEN ===================== */

    public String generateResetPasswordToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("purpose", "password_reset");

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + RESET_TOKEN_EXPIRATION)
                )
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateResetPasswordToken(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return "password_reset".equals(claims.get("purpose"))
                    && !isTokenExpired(token);
        } catch (JwtException e) {
            return false;
        }
    }

    public String extractEmailFromResetToken(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /* ===================== CORE ===================== */

    private <T> T extractClaim(
            String token,
            Function<Claims, T> resolver
    ) {
        return resolver.apply(extractAllClaims(token));
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isTokenExpired(String token) {
        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }
}
