package com.example.employeemanagement.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "employees",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_employee_email",
                        columnNames = "email"
                )
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    /*
     * Password can be received from the frontend,
     * but it will NEVER be returned in JSON responses.
     */
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    /*
     * Task counters.
     *
     * Integer is used instead of int so Jackson can safely
     * deserialize JSON without primitive-null problems.
     */
    @Column(name = "tasks_active", nullable = false)
    private Integer tasksActive = 0;

    @Column(name = "tasks_completed", nullable = false)
    private Integer tasksCompleted = 0;

    @Column(name = "tasks_failed", nullable = false)
    private Integer tasksFailed = 0;

    /*
     * Make sure counters can never remain null.
     * This is useful when the frontend sends null values.
     */
    @PrePersist
    @PreUpdate
    private void initializeTaskCounters() {

        if (tasksActive == null) {
            tasksActive = 0;
        }

        if (tasksCompleted == null) {
            tasksCompleted = 0;
        }

        if (tasksFailed == null) {
            tasksFailed = 0;
        }
    }
}