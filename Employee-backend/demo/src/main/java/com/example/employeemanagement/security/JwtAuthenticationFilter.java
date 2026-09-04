package com.example.employeemanagement.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserDetailsService userDetailsService) {

        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // =====================================================
        // GET AUTHORIZATION HEADER
        // =====================================================

        String authHeader =
                request.getHeader("Authorization");

        // =====================================================
        // NO JWT TOKEN
        // =====================================================

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        // =====================================================
        // EXTRACT JWT TOKEN
        // =====================================================

        String token = authHeader.substring(7);

        try {

            // =================================================
            // EXTRACT EMAIL/USERNAME FROM JWT
            // =================================================

            String username =
                    jwtService.extractUsername(token);

            // =================================================
            // ONLY AUTHENTICATE IF USER IS NOT ALREADY
            // AUTHENTICATED
            // =================================================

            if (username != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                // =============================================
                // LOAD USER FROM DATABASE
                // =============================================

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(username);

                // =============================================
                // VALIDATE JWT
                // =============================================

                if (jwtService.isTokenValid(
                        token,
                        userDetails)) {

                    // =========================================
                    // CREATE AUTHENTICATION
                    //
                    // IMPORTANT:
                    // Use authorities from UserDetails.
                    //
                    // CustomUserDetailsService creates:
                    // ROLE_ADMIN
                    // ROLE_EMPLOYEE
                    // =========================================

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    // =========================================
                    // SET AUTHENTICATION IN SECURITY CONTEXT
                    // =========================================

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);
                }
            }

        } catch (Exception e) {

            // =================================================
            // INVALID / EXPIRED JWT
            // OR USER NO LONGER EXISTS
            // =================================================

            SecurityContextHolder.clearContext();
        }

        // =====================================================
        // CONTINUE FILTER CHAIN
        // =====================================================

        filterChain.doFilter(request, response);
    }
}