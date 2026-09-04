package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.TaskRequest;
import com.example.employeemanagement.entity.Employee;
import com.example.employeemanagement.entity.Task;
import com.example.employeemanagement.entity.TaskStatus;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.repository.TaskRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;

    public TaskController(
            TaskRepository taskRepository,
            EmployeeRepository employeeRepository) {

        this.taskRepository = taskRepository;
        this.employeeRepository = employeeRepository;
    }

    // =========================================================
    // GET ALL TASKS
    //
    // ADMIN    -> ALL TASKS
    // EMPLOYEE -> OWN TASKS ONLY
    // =========================================================

    @GetMapping
    public List<Task> getAllTasks(
            Authentication authentication) {

        if (isAdmin(authentication)) {

            return taskRepository.findAll();
        }

        Employee employee =
                getLoggedInEmployee(authentication);

        return taskRepository.findByEmployeeId(
                employee.getId()
        );
    }

    // =========================================================
    // GET TASK BY ID
    //
    // ADMIN    -> ANY TASK
    // EMPLOYEE -> OWN TASK ONLY
    // =========================================================

    @GetMapping("/{id}")
    public Task getTaskById(
            @PathVariable Long id,
            Authentication authentication) {

        Task task = getTask(id);

        if (isAdmin(authentication)) {

            return task;
        }

        Employee employee =
                getLoggedInEmployee(authentication);

        verifyTaskOwnership(
                task,
                employee
        );

        return task;
    }

    // =========================================================
    // CREATE TASK
    //
    // ADMIN ONLY
    // =========================================================

    @PostMapping
    public Task createTask(
            @RequestBody TaskRequest request,
            Authentication authentication) {

        requireAdmin(authentication);

        validateTaskRequest(request);

        if (request.getEmployeeId() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "employeeId is required"
            );
        }

        Employee employee =
                employeeRepository.findById(
                        request.getEmployeeId()
                ).orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Employee not found"
                        )
                );

        TaskStatus status =
                parseStatus(request.getStatus());

        Task task = new Task();

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(status);
        task.setDueDate(request.getDueDate());
        task.setEmployee(employee);

        // PENDING and ACTIVE are counted as active tasks.
        updateEmployeeCounter(
                employee,
                status,
                1
        );

        employeeRepository.save(employee);

        return taskRepository.save(task);
    }

    // =========================================================
    // UPDATE TASK
    //
    // ADMIN ONLY
    //
    // Admin can change:
    // - title
    // - description
    // - due date
    // - employee
    // - status
    // =========================================================

    @PutMapping("/{id}")
    public Task updateTask(
            @PathVariable Long id,
            @RequestBody TaskRequest request,
            Authentication authentication) {

        requireAdmin(authentication);

        validateTaskRequest(request);

        Task task = getTask(id);

        if (request.getEmployeeId() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "employeeId is required"
            );
        }

        Employee oldEmployee =
                task.getEmployee();

        Employee newEmployee =
                employeeRepository.findById(
                        request.getEmployeeId()
                ).orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Employee not found"
                        )
                );

        TaskStatus oldStatus =
                task.getStatus();

        TaskStatus newStatus =
                parseStatus(request.getStatus());

        // -----------------------------------------------------
        // Remove old task from old employee's counters
        // -----------------------------------------------------

        if (oldEmployee != null) {

            updateEmployeeCounter(
                    oldEmployee,
                    oldStatus,
                    -1
            );
        }

        // -----------------------------------------------------
        // Update task
        // -----------------------------------------------------

        task.setTitle(
                request.getTitle()
        );

        task.setDescription(
                request.getDescription()
        );

        task.setDueDate(
                request.getDueDate()
        );

        task.setStatus(
                newStatus
        );

        task.setEmployee(
                newEmployee
        );

        // -----------------------------------------------------
        // Add task to new employee's counters
        // -----------------------------------------------------

        updateEmployeeCounter(
                newEmployee,
                newStatus,
                1
        );

        // -----------------------------------------------------
        // Save employees
        // -----------------------------------------------------

        if (oldEmployee != null
                && !oldEmployee.getId()
                .equals(newEmployee.getId())) {

            employeeRepository.save(
                    oldEmployee
            );
        }

        employeeRepository.save(
                newEmployee
        );

        // -----------------------------------------------------
        // Save task
        // -----------------------------------------------------

        return taskRepository.save(task);
    }

    // =========================================================
    // DELETE TASK
    //
    // ADMIN ONLY
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            Authentication authentication) {

        requireAdmin(authentication);

        Task task = getTask(id);

        Employee employee =
                task.getEmployee();

        if (employee != null) {

            updateEmployeeCounter(
                    employee,
                    task.getStatus(),
                    -1
            );

            employeeRepository.save(employee);
        }

        taskRepository.delete(task);

        return ResponseEntity.noContent().build();
    }

    // =========================================================
    // EMPLOYEE ACCEPT TASK
    //
    // PENDING -> ACTIVE
    //
    // EMPLOYEE CAN ONLY ACCEPT OWN TASK
    // =========================================================

    @PostMapping("/{id}/accept")
    public Task acceptTask(
            @PathVariable Long id,
            Authentication authentication) {

        Employee employee =
                getLoggedInEmployee(authentication);

        Task task = getTask(id);

        verifyTaskOwnership(
                task,
                employee
        );

        if (task.getStatus() != TaskStatus.PENDING) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only PENDING tasks can be accepted"
            );
        }

        // PENDING -> ACTIVE
        task.setStatus(
                TaskStatus.ACTIVE
        );

        /*
         * No counter change here.
         *
         * tasksActive represents both PENDING
         * and ACTIVE tasks.
         */

        return taskRepository.save(task);
    }

    // =========================================================
    // EMPLOYEE COMPLETE TASK
    //
    // ACTIVE -> COMPLETED
    //
    // EMPLOYEE CAN ONLY COMPLETE OWN TASK
    // =========================================================

    @PostMapping("/{id}/complete")
    public Task completeTask(
            @PathVariable Long id,
            Authentication authentication) {

        Employee employee =
                getLoggedInEmployee(authentication);

        Task task = getTask(id);

        verifyTaskOwnership(
                task,
                employee
        );

        if (task.getStatus() != TaskStatus.ACTIVE) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only ACTIVE tasks can be completed"
            );
        }

        // ACTIVE -> COMPLETED
        task.setStatus(
                TaskStatus.COMPLETED
        );

        // Active counter decreases
        employee.setTasksActive(
                Math.max(
                        0,
                        employee.getTasksActive() - 1
                )
        );

        // Completed counter increases
        employee.setTasksCompleted(
                employee.getTasksCompleted() + 1
        );

        employeeRepository.save(employee);

        return taskRepository.save(task);
    }

    // =========================================================
    // EMPLOYEE FAIL TASK
    //
    // ACTIVE -> FAILED
    //
    // EMPLOYEE CAN ONLY FAIL OWN TASK
    // =========================================================

    @PostMapping("/{id}/fail")
    public Task failTask(
            @PathVariable Long id,
            Authentication authentication) {

        Employee employee =
                getLoggedInEmployee(authentication);

        Task task = getTask(id);

        verifyTaskOwnership(
                task,
                employee
        );

        if (task.getStatus() != TaskStatus.ACTIVE) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only ACTIVE tasks can be failed"
            );
        }

        // ACTIVE -> FAILED
        task.setStatus(
                TaskStatus.FAILED
        );

        // Active counter decreases
        employee.setTasksActive(
                Math.max(
                        0,
                        employee.getTasksActive() - 1
                )
        );

        // Failed counter increases
        employee.setTasksFailed(
                employee.getTasksFailed() + 1
        );

        employeeRepository.save(employee);

        return taskRepository.save(task);
    }

    // =========================================================
    // GET TASK
    // =========================================================

    private Task getTask(Long id) {

        return taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Task not found"
                        )
                );
    }

    // =========================================================
    // VERIFY TASK OWNERSHIP
    // =========================================================

    private void verifyTaskOwnership(
            Task task,
            Employee employee) {

        if (task.getEmployee() == null
                || !task.getEmployee()
                .getId()
                .equals(employee.getId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot access this task"
            );
        }
    }

    // =========================================================
    // ADMIN CHECK
    // =========================================================

    private boolean isAdmin(
            Authentication authentication) {

        return authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority()
                                .equals("ROLE_ADMIN")
                );
    }

    // =========================================================
    // REQUIRE ADMIN
    // =========================================================

    private void requireAdmin(
            Authentication authentication) {

        if (!isAdmin(authentication)) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Admin access required"
            );
        }
    }

    // =========================================================
    // GET LOGGED-IN EMPLOYEE
    // =========================================================

    private Employee getLoggedInEmployee(
            Authentication authentication) {

        String email =
                authentication.getName();

        return employeeRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Logged-in employee not found"
                        )
                );
    }

    // =========================================================
    // UPDATE EMPLOYEE COUNTER
    //
    // PENDING + ACTIVE -> tasksActive
    // COMPLETED        -> tasksCompleted
    // FAILED           -> tasksFailed
    // =========================================================

    private void updateEmployeeCounter(
            Employee employee,
            TaskStatus status,
            int amount) {

        if (status == null) {
            return;
        }

        switch (status) {

            case PENDING:
            case ACTIVE:

                employee.setTasksActive(
                        Math.max(
                                0,
                                employee.getTasksActive()
                                        + amount
                        )
                );

                break;

            case COMPLETED:

                employee.setTasksCompleted(
                        Math.max(
                                0,
                                employee.getTasksCompleted()
                                        + amount
                        )
                );

                break;

            case FAILED:

                employee.setTasksFailed(
                        Math.max(
                                0,
                                employee.getTasksFailed()
                                        + amount
                        )
                );

                break;
        }
    }

    // =========================================================
    // PARSE STATUS
    // =========================================================

    private TaskStatus parseStatus(
            String status) {

        if (status == null
                || status.isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Status is required"
            );
        }

        try {

            return TaskStatus.valueOf(
                    status.trim().toUpperCase()
            );

        } catch (IllegalArgumentException exception) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid status. Use PENDING, ACTIVE, COMPLETED, or FAILED"
            );
        }
    }

    // =========================================================
    // VALIDATE TASK REQUEST
    // =========================================================

    private void validateTaskRequest(
            TaskRequest request) {

        if (request == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Task request is required"
            );
        }

        if (request.getTitle() == null
                || request.getTitle().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Title is required"
            );
        }

        if (request.getStatus() == null
                || request.getStatus().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Status is required"
            );
        }
    }
}