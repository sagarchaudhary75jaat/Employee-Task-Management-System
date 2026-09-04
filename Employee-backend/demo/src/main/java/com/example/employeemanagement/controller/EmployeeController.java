package com.example.employeemanagement.controller;

import com.example.employeemanagement.entity.Employee;
import com.example.employeemanagement.repository.EmployeeRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeController(
            EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder) {

        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =====================================================
    // GET MY PROFILE
    // ADMIN + EMPLOYEE
    // =====================================================

    @GetMapping("/me")
    public Employee getMyProfile(Authentication authentication) {

        if (authentication == null ||
                authentication.getName() == null) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "User is not authenticated"
            );
        }

        String email = authentication.getName();

        return employeeRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Employee not found"
                        )
                );
    }

    // =====================================================
    // GET ALL EMPLOYEES
    // ADMIN ONLY
    // =====================================================

    @GetMapping
    public List<Employee> getAllEmployees() {

        return employeeRepository.findAll();
    }

    // =====================================================
    // GET EMPLOYEE BY ID
    // ADMIN ONLY
    // =====================================================

    @GetMapping("/{id}")
    public Employee getEmployeeById(
            @PathVariable Long id) {

        return employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Employee not found"
                        )
                );
    }

    // =====================================================
    // CREATE EMPLOYEE
    // ADMIN ONLY
    // =====================================================

    @PostMapping
    public Employee createEmployee(
            @RequestBody Employee employee) {

        // -------------------------------------------------
        // Validate name
        // -------------------------------------------------

        if (employee.getName() == null ||
                employee.getName().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Name is required"
            );
        }

        // -------------------------------------------------
        // Validate email
        // -------------------------------------------------

        if (employee.getEmail() == null ||
                employee.getEmail().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email is required"
            );
        }

        String email = employee.getEmail().trim();

        // -------------------------------------------------
        // Validate password
        // -------------------------------------------------

        if (employee.getPassword() == null ||
                employee.getPassword().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password is required"
            );
        }

        // -------------------------------------------------
        // Validate role
        // -------------------------------------------------

        if (employee.getRole() == null ||
                employee.getRole().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Role is required"
            );
        }

        // -------------------------------------------------
        // Check duplicate email BEFORE saving
        // -------------------------------------------------

        if (employeeRepository.findByEmail(email).isPresent()) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists"
            );
        }

        employee.setEmail(email);

        // -------------------------------------------------
        // Never allow client to choose the counters
        // when creating a new employee.
        // -------------------------------------------------

        employee.setTasksActive(0);
        employee.setTasksCompleted(0);
        employee.setTasksFailed(0);

        // -------------------------------------------------
        // Encode password before storing it
        // -------------------------------------------------

        employee.setPassword(
                passwordEncoder.encode(
                        employee.getPassword()
                )
        );

        return employeeRepository.save(employee);
    }

    // =====================================================
    // UPDATE EMPLOYEE
    // ADMIN ONLY
    // =====================================================

    @PutMapping("/{id}")
    public Employee updateEmployee(
            @PathVariable Long id,
            @RequestBody Employee employee) {

        // -------------------------------------------------
        // Find existing employee
        // -------------------------------------------------

        Employee existingEmployee =
                employeeRepository.findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Employee not found"
                                )
                        );

        // -------------------------------------------------
        // Validate name
        // -------------------------------------------------

        if (employee.getName() == null ||
                employee.getName().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Name is required"
            );
        }

        // -------------------------------------------------
        // Validate email
        // -------------------------------------------------

        if (employee.getEmail() == null ||
                employee.getEmail().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email is required"
            );
        }

        String newEmail = employee.getEmail().trim();

        // -------------------------------------------------
        // Check whether another employee already uses
        // the new email.
        // -------------------------------------------------

        employeeRepository.findByEmail(newEmail)
                .ifPresent(employeeWithSameEmail -> {

                    if (!employeeWithSameEmail.getId()
                            .equals(existingEmployee.getId())) {

                        throw new ResponseStatusException(
                                HttpStatus.CONFLICT,
                                "Email already exists"
                        );
                    }
                });

        // -------------------------------------------------
        // Update basic information
        // -------------------------------------------------

        existingEmployee.setName(
                employee.getName().trim()
        );

        existingEmployee.setEmail(
                newEmail
        );

        // -------------------------------------------------
        // Update role
        // -------------------------------------------------

        if (employee.getRole() != null &&
                !employee.getRole().isBlank()) {

            existingEmployee.setRole(
                    employee.getRole().trim()
            );
        }

        // -------------------------------------------------
        // Update password ONLY if supplied
        // -------------------------------------------------

        if (employee.getPassword() != null &&
                !employee.getPassword().isBlank()) {

            existingEmployee.setPassword(
                    passwordEncoder.encode(
                            employee.getPassword()
                    )
            );
        }

        // -------------------------------------------------
        // IMPORTANT:
        // Do NOT update task counters from the frontend.
        //
        // tasksActive
        // tasksCompleted
        // tasksFailed
        //
        // should be controlled by your task-management
        // logic, not by employee profile updates.
        // -------------------------------------------------

        return employeeRepository.save(
                existingEmployee
        );
    }

    // =====================================================
    // RESET PASSWORD
    // ADMIN ONLY
    //
    // TEMPORARY TESTING ENDPOINT
    // =====================================================

    @PutMapping("/{id}/reset-password")
    public Employee resetPassword(
            @PathVariable Long id,
            @RequestParam String password) {

        // -------------------------------------------------
        // Validate password
        // -------------------------------------------------

        if (password == null ||
                password.isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password is required"
            );
        }

        // -------------------------------------------------
        // Find employee
        // -------------------------------------------------

        Employee employee =
                employeeRepository.findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Employee not found"
                                )
                        );

        // -------------------------------------------------
        // Encode new password
        // -------------------------------------------------

        employee.setPassword(
                passwordEncoder.encode(password)
        );

        return employeeRepository.save(employee);
    }

    // =====================================================
    // DELETE EMPLOYEE
    // ADMIN ONLY
    // =====================================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEmployee(
            @PathVariable Long id) {

        // -------------------------------------------------
        // Check employee exists
        // -------------------------------------------------

        if (!employeeRepository.existsById(id)) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Employee not found"
            );
        }

        employeeRepository.deleteById(id);
    }
}