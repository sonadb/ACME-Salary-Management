
package com.acme.salary.service;

import com.acme.salary.entity.Employee;
import com.acme.salary.repository.EmployeeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;

    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }

    public Page<Employee> getAllEmployees(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Employee getEmployee(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Employee not found"));
    }

    public Employee createEmployee(Employee employee) {
        if (repository.existsByEmployeeCode(employee.getEmployeeCode())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Employee code already exists");
        }

        if (employee.getEmail() != null &&
                repository.existsByEmail(employee.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Email already exists");
        }

        return repository.save(employee);
    }

    public Employee updateEmployee(Long id, Employee updated) {
        Employee employee = getEmployee(id);

        employee.setFirstName(updated.getFirstName());
        employee.setLastName(updated.getLastName());
        employee.setEmail(updated.getEmail());
        employee.setDepartment(updated.getDepartment());
        employee.setDesignation(updated.getDesignation());
        employee.setCountry(updated.getCountry());
        employee.setEmploymentStatus(updated.getEmploymentStatus());

        return repository.save(employee);
    }

    public void deleteEmployee(Long id) {
        Employee employee = getEmployee(id);
        repository.delete(employee);
    }
}
