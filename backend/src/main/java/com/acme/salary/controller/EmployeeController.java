
package com.acme.salary.controller;

import com.acme.salary.entity.Employee;
import com.acme.salary.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    @GetMapping
    public Page<Employee> getAll(Pageable pageable) {
        return service.getAllEmployees(pageable);
    }

    @GetMapping("/{id}")
    public Employee getById(@PathVariable Long id) {
        return service.getEmployee(id);
    }

    @PostMapping
    public Employee create(@Valid @RequestBody Employee employee) {
        return service.createEmployee(employee);
    }

    @PutMapping("/{id}")
    public Employee update(
            @PathVariable Long id,
            @Valid @RequestBody Employee employee) {
        return service.updateEmployee(id, employee);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteEmployee(id);
    }
}
