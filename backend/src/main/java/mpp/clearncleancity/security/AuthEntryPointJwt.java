package mpp.clearncleancity.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import java.io.IOException;

/**
 * Custom entry point for handling unauthenticated access to protected resources.
 * Implements AuthenticationEntryPoint to manage unauthorized access attempts.
 *
 * <p>When a user tries to access a protected resource without being authenticated,
 * it returns a 401 (Unauthorized) response.</p>
 *
 * @see AuthenticationEntryPoint
 */
@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {
    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException, ServletException {
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Error: Unauthorized");
    }
}
