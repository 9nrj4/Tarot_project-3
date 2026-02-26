package com.tarot.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        long start = System.currentTimeMillis();
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String query = request.getQueryString();
        String path = query == null ? uri : (uri + "?" + query);

        try {
            filterChain.doFilter(request, response);
        } finally {
            long ms = System.currentTimeMillis() - start;
            int status = response.getStatus();

            // Не логируем лишнее для статики
            if (uri.startsWith("/static/") || uri.startsWith("/backend-static/")) {
                return;
            }

            if (status >= 500) {
                log.error("{} {} -> {} ({}ms)", method, path, status, ms);
            } else if (status >= 400) {
                log.warn("{} {} -> {} ({}ms)", method, path, status, ms);
            } else {
                log.info("{} {} -> {} ({}ms)", method, path, status, ms);
            }
        }
    }
}


