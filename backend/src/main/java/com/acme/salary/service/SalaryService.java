
package com.acme.salary.service;

import com.acme.salary.entity.Employee;
import com.acme.salary.entity.Salary;
import com.acme.salary.repository.EmployeeRepository;
import com.acme.salary.repository.SalaryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SalaryService {

    private final SalaryRepository salaryRepository;
    private final EmployeeRepository employeeRepository;

    public SalaryService(SalaryRepository salaryRepository,
                         EmployeeRepository employeeRepository) {
        this.salaryRepository = salaryRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<Salary> getAllSalaries() {
        return salaryRepository.findAll();
    }

    public Salary getSalaryByEmployee(Long employeeId) {
        return salaryRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Salary not found"));
    }

    public Salary createSalary(Long employeeId, Salary salary) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Employee not found"));

        if (salaryRepository.findByEmployeeId(employeeId).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Salary already exists for this employee");
        }

        salary.setEmployee(employee);
        return salaryRepository.save(salary);
    }

    public Salary updateSalary(Long employeeId, Salary updated) {
        Salary salary = getSalaryByEmployee(employeeId);
        salary.setAmount(updated.getAmount());
        salary.setCurrency(updated.getCurrency());
        salary.setPayFrequency(updated.getPayFrequency());
        salary.setEffectiveDate(updated.getEffectiveDate());
        return salaryRepository.save(salary);
    }
}
