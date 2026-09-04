package com.example.employeemanagement.config;

import com.example.employeemanagement.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            UserDetailsService userDetailsService) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
    }

    // =====================================================
    // PASSWORD ENCODER
    // =====================================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =====================================================
    // AUTHENTICATION PROVIDER
    // =====================================================

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    // =====================================================
    // AUTHENTICATION MANAGER
    // =====================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    // =====================================================
    // SECURITY FILTER CHAIN
    // =====================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {

        http

                // =================================================
                // CSRF
                // =================================================

                .csrf(csrf -> csrf.disable())

                // =================================================
                // CORS
                // =================================================

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                // =================================================
                // STATELESS JWT SESSION
                // =================================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // =================================================
                // AUTHENTICATION PROVIDER
                // =================================================

                .authenticationProvider(
                        authenticationProvider()
                )

                // =================================================
                // AUTHORIZATION
                // =================================================

                .authorizeHttpRequests(auth -> auth

                        // -------------------------------------------------
                        // LOGIN
                        // -------------------------------------------------

                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()

                        // -------------------------------------------------
                        // ERROR
                        // -------------------------------------------------

                        .requestMatchers(
                                "/error"
                        ).permitAll()

                        // -------------------------------------------------
                        // CORS PREFLIGHT
                        // -------------------------------------------------

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // -------------------------------------------------
                        // TEMPORARY:
                        // CREATE FIRST ADMIN
                        //
                        // KEEP THIS ONLY IF YOU STILL NEED TO CREATE
                        // YOUR FIRST ADMIN WITHOUT A JWT.
                        //
                        // AFTER CREATING THE ADMIN, CHANGE THIS TO:
                        //
                        // .requestMatchers(
                        //     HttpMethod.POST,
                        //     "/api/employees"
                        // ).hasRole("ADMIN")
                        // -------------------------------------------------

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/employees"
                        ).hasRole("ADMIN")

                        // -------------------------------------------------
                        // MY PROFILE
                        //
                        // ADMIN + EMPLOYEE
                        // -------------------------------------------------

                        .requestMatchers(
                                "/api/employees/me"
                        ).hasAnyRole(
                                "ADMIN",
                                "EMPLOYEE"
                        )

                        // -------------------------------------------------
                        // ALL EMPLOYEE MANAGEMENT
                        //
                        // ADMIN ONLY
                        // -------------------------------------------------

                        .requestMatchers(
                                "/api/employees/**"
                        ).hasRole("ADMIN")

                        // -------------------------------------------------
                        // TASKS
                        //
                        // ADMIN + EMPLOYEE
                        //
                        // TaskController performs the detailed
                        // ownership checks.
                        // -------------------------------------------------

                        .requestMatchers(
                                "/api/tasks/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "EMPLOYEE"
                        )

                        // -------------------------------------------------
                        // EVERYTHING ELSE
                        // -------------------------------------------------

                        .anyRequest().authenticated()
                )

                // =================================================
                // AUTHENTICATION ERROR HANDLING
                // =================================================
                //
                // Important:
                //
                // Invalid/missing authentication should return
                // HTTP 401 instead of Spring's default 403.
                //
                // This makes the frontend able to distinguish:
                //
                // 401 = not authenticated / bad login
                // 403 = authenticated but not authorized
                // =================================================

                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(
                                authenticationEntryPoint()
                        )
                )

                // =================================================
                // JWT FILTER
                // =================================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // =====================================================
    // AUTHENTICATION ENTRY POINT
    // =====================================================

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {

        return (request, response, authException) -> {

            response.setStatus(
                    HttpStatus.UNAUTHORIZED.value()
            );

            response.setContentType(
                    "application/json"
            );

            response.getWriter().write(
                    """
                    {
                        "error": "Unauthorized",
                        "message": "Authentication required"
                    }
                    """
            );
        };
    }

    // =====================================================
    // CORS CONFIGURATION
    // =====================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        // -------------------------------------------------
        // React / Vite
        // -------------------------------------------------

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173",
                        "http://localhost:3000"
                )
        );

        // -------------------------------------------------
        // HTTP METHODS
        // -------------------------------------------------

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        // -------------------------------------------------
        // HEADERS
        // -------------------------------------------------

        configuration.setAllowedHeaders(
                List.of("*")
        );

        // -------------------------------------------------
        // CREDENTIALS
        // -------------------------------------------------

        configuration.setAllowCredentials(true);

        // -------------------------------------------------
        // REGISTER CORS CONFIGURATION
        // -------------------------------------------------

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}