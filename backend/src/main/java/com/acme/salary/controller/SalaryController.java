
package com.acme.salary.controller;

import com.acme.salary.entity.Salary;
import com.acme.salary.service.SalaryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salaries")
@CrossOrigin(origins = "http://localhost:5173")
public class SalaryController {

    private final SalaryService service;

    public SalaryController(SalaryService service) {
        this.service = service;
    }

    @GetMapping
    public List<Salary> getAll() {
        return service.getAllSalaries();
    }

    @GetMapping("/employee/{employeeId}")
    public Salary getByEmployee(@PathVariable Long employeeId) {
        return service.getSalaryByEmployee(employeeId);
    }

    @PostMapping("/employee/{employeeId}")
    public Salary create(@PathVariable Long employeeId,
                         @RequestBody Salary salary) {
        return service.createSalary(employeeId, salary);
    }

    @PutMapping("/employee/{employeeId}")
    public Salary update(@PathVariable Long employeeId,
                         @RequestBody Salary salary) {
        return service.updateSalary(employeeId, salary);
    }
}
