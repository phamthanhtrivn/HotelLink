package iuh.fit.backend.security.oauth2;

import io.github.cdimascio.dotenv.Dotenv;
import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.entity.User;
import iuh.fit.backend.repository.UserRepo;
import iuh.fit.backend.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final OAuth2Service oAuth2Service;
    private final String frontendUrl = Dotenv.load().get("FRONTEND_URL");

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        APIResponse<String> apiResponse = oAuth2Service.processOAuthPostLogin(email, name);

        if (!apiResponse.isSuccess()) {
            String errorUrl = frontendUrl + "/oauth2/failed?message=" +
                    URLEncoder.encode(apiResponse.getMessage(), StandardCharsets.UTF_8);

            response.sendRedirect(errorUrl);
            return;
        }

        String redirectUrl = frontendUrl + "/oauth2/success?token=" +
                URLEncoder.encode(apiResponse.getData(), StandardCharsets.UTF_8);
        response.sendRedirect(redirectUrl);
    }
}
