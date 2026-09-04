package com.example.employeemanagement.config;

import com.example.employeemanagement.entity.Employee;
import com.example.employeemanagement.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createAdmin(
            EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (!employeeRepository
                    .existsByEmail("admin@example.com")) {

                Employee admin = new Employee();

                admin.setName("Admin");
                admin.setEmail("admin@example.com");

                admin.setPassword(
                        passwordEncoder.encode("admin123")
                );

                admin.setRole("ADMIN");

                admin.setTasksCompleted(0);
                admin.setTasksFailed(0);
                admin.setTasksActive(0);

                employeeRepository.save(admin);

                System.out.println(
                        "===================================="
                );

                System.out.println(
                        "ADMIN CREATED"
                );

                System.out.println(
                        "Email: admin@example.com"
                );

                System.out.println(
                        "Password: admin123"
                );

                System.out.println(
                        "===================================="
                );
            }
        };
    }
}