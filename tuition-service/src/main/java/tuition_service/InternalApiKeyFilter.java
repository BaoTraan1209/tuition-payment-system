package tuition_service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class InternalApiKeyFilter extends OncePerRequestFilter {

    @Value("${internal.api.key}")
    private String internalApiKey;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getServletPath();

        boolean isReserve = path.matches(
                "/api/tuition/[0-9]+/reserve"
        );

        boolean isConfirm = path.matches(
                "/api/tuition/[0-9]+/confirm"
        );

        return !(isReserve || isConfirm);
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String providedKey =
                request.getHeader("X-Internal-API-Key");

        if (internalApiKey == null || internalApiKey.isBlank()
                || providedKey == null
                || !MessageDigest.isEqual(
                        internalApiKey.getBytes(StandardCharsets.UTF_8),
                        providedKey.getBytes(StandardCharsets.UTF_8))) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            response.getWriter().write(
                    "{\"message\":\"Unauthorized internal API request\"}"
            );

            return;
        }

        filterChain.doFilter(request, response);
    }
}