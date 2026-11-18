
package com.acme.salary.config;

import com.acme.salary.entity.Employee;
import com.acme.salary.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class SeedData implements CommandLineRunner {

    private final EmployeeRepository repository;

    public SeedData(EmployeeRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        long existing = repository.count();

        if (existing >= 10000) {
            return;
        }

        String[] countries = {
            "India", "USA", "UK", "Germany", "Canada",
            "Australia", "Singapore", "Japan"
        };

        String[] departments = {
            "IT", "HR", "Finance", "Marketing", "Sales",
            "Operations", "Engineering"
        };

        List<Employee> employees = new ArrayList<>();

        for (long i = existing + 1; i <= 10000; i++) {
            Employee employee = new Employee();

            employee.setEmployeeCode(String.format("EMP%05d", i));
            employee.setFirstName("Employee");
            employee.setLastName(String.valueOf(i));
            employee.setEmail(String.format("employee%05d@example.com", i));
            employee.setDepartment(departments[(int)(i % departments.length)]);
            employee.setDesignation("Associate");
            employee.setCountry(countries[(int)(i % countries.length)]);
            employee.setEmploymentStatus("ACTIVE");

            employees.add(employee);
        }

        repository.saveAll(employees);

        System.out.println("Seeded employees. Total: " + repository.count());
    }
}
