package com.example.employeemanagement.repository;

import com.example.employeemanagement.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository
        extends JpaRepository<Task, Long> {

    List<Task> findByEmployeeId(Long employeeId);
}