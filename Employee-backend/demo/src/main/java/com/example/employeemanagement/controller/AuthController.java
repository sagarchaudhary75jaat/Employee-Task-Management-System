package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.LoginRequest;
import com.example.employeemanagement.dto.LoginResponse;
import com.example.employeemanagement.entity.Employee;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.security.JwtService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final EmployeeRepository employeeRepository;

    private final JwtService jwtService;

    public AuthController(
            AuthenticationManager authenticationManager,
            EmployeeRepository employeeRepository,
            JwtService jwtService) {

        this.authenticationManager = authenticationManager;
        this.employeeRepository = employeeRepository;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        Employee employee =
                employeeRepository.findByEmail(
                        request.getEmail()
                ).orElseThrow();

        String token =
                jwtService.generateToken(userDetails);

        LoginResponse response =
                new LoginResponse(
                        token,
                        employee.getId(),
                        employee.getName(),
                        employee.getEmail(),
                        employee.getRole()
                );

        return ResponseEntity.ok(response);
    }
}