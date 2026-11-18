
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:8080/api";

const emptyEmployee = {
  employeeCode: "",
  firstName: "",
  lastName: "",
  email: "",
  department: "",
  designation: "",
  country: "",
  employmentStatus: "ACTIVE"
};

const emptySalary = {
  employeeId: "",
  amount: "",
  currency: "INR",
  payFrequency: "MONTHLY",
  effectiveDate: new Date().toISOString().slice(0, 10)
};

function App() {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [employee, setEmployee] = useState(emptyEmployee);
  const [salary, setSalary] = useState(emptySalary);

  async function loadData() {
    setLoading(true);
    setMessage("");

    try {
      const firstResponse = await fetch(
        `${API}/employees?page=0&size=2000`
      );

      const salaryResponse = await fetch(`${API}/salaries`);

      if (!firstResponse.ok || !salaryResponse.ok) {
        throw new Error("Could not load dashboard data");
      }

      const firstPage = await firstResponse.json();
      const salaryData = await salaryResponse.json();

      const remainingPages = await Promise.all(
        Array.from(
          { length: Math.max(0, firstPage.totalPages - 1) },
          (_, index) =>
            fetch(`${API}/employees?page=${index + 1}&size=2000`)
              .then(response => {
                if (!response.ok) {
                  throw new Error("Employee loading failed");
                }
                return response.json();
              })
        )
      );

      const allEmployees = [
        ...(firstPage.content || []),
        ...remainingPages.flatMap(page => page.content || [])
      ];

      setEmployees(allEmployees);
      setSalaries(salaryData || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function addEmployee(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail ||
          errorData?.message ||
          "Employee could not be added"
        );
      }

      setEmployee({ ...emptyEmployee });
      setMessage("Employee added successfully!");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function addSalary(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        `${API}/salaries/employee/${salary.employeeId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(salary.amount),
            currency: salary.currency,
            payFrequency: salary.payFrequency,
            effectiveDate: salary.effectiveDate
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail ||
          errorData?.message ||
          "Salary could not be added. Check employee ID or existing salary."
        );
      }

      setSalary({ ...emptySalary });
      setMessage("Salary added successfully!");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  const filteredEmployees = employees.filter(item =>
    `${item.firstName} ${item.lastName} ${item.employeeCode} ${item.department} ${item.country}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const activeEmployees = employees.filter(
    item => item.employmentStatus === "ACTIVE"
  ).length;

  const departments = new Set(
    employees.map(item => item.department).filter(Boolean)
  ).size;

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>ACME HR</h2>
        <p>Salary Management</p>

        <div className="nav-item">Dashboard</div>
        <div className="nav-item">Employees</div>
        <div className="nav-item">Salaries</div>

        <div className="sidebar-footer">
          Global Employee Management
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h1>HR Dashboard</h1>
            <p>Manage employees and salaries across countries</p>
          </div>
          <span className="admin">HR Manager</span>
        </header>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        <section className="stats">
          <div className="stat-card">
            <span>Total Employees</span>
            <h2>{employees.length.toLocaleString()}</h2>
          </div>

          <div className="stat-card">
            <span>Salary Records</span>
            <h2>{salaries.length.toLocaleString()}</h2>
          </div>

          <div className="stat-card">
            <span>Active Employees</span>
            <h2>{activeEmployees.toLocaleString()}</h2>
          </div>

          <div className="stat-card">
            <span>Departments</span>
            <h2>{departments}</h2>
          </div>
        </section>

        <section className="forms">
          <form className="panel" onSubmit={addEmployee}>
            <h2>Add Employee</h2>

            <input
              placeholder="Employee Code"
              value={employee.employeeCode}
              required
              onChange={e =>
                setEmployee({ ...employee, employeeCode: e.target.value })
              }
            />

            <input
              placeholder="First Name"
              value={employee.firstName}
              required
              onChange={e =>
                setEmployee({ ...employee, firstName: e.target.value })
              }
            />

            <input
              placeholder="Last Name"
              value={employee.lastName}
              required
              onChange={e =>
                setEmployee({ ...employee, lastName: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={employee.email}
              onChange={e =>
                setEmployee({ ...employee, email: e.target.value })
              }
            />

            <input
              placeholder="Department"
              value={employee.department}
              onChange={e =>
                setEmployee({ ...employee, department: e.target.value })
              }
            />

            <input
              placeholder="Designation"
              value={employee.designation}
              onChange={e =>
                setEmployee({ ...employee, designation: e.target.value })
              }
            />

            <input
              placeholder="Country"
              value={employee.country}
              required
              onChange={e =>
                setEmployee({ ...employee, country: e.target.value })
              }
            />

            <select
              value={employee.employmentStatus}
              onChange={e =>
                setEmployee({
                  ...employee,
                  employmentStatus: e.target.value
                })
              }
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            <button type="submit">Add Employee</button>
          </form>

          <form className="panel" onSubmit={addSalary}>
            <h2>Add Salary</h2>

            <input
              type="number"
              placeholder="Employee ID"
              value={salary.employeeId}
              required
              min="1"
              onChange={e =>
                setSalary({ ...salary, employeeId: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Salary Amount"
              value={salary.amount}
              required
              min="0.01"
              step="0.01"
              onChange={e =>
                setSalary({ ...salary, amount: e.target.value })
              }
            />

            <select
              value={salary.currency}
              onChange={e =>
                setSalary({ ...salary, currency: e.target.value })
              }
            >
              <option value="INR">INR - Indian Rupee</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="SGD">SGD - Singapore Dollar</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>

            <select
              value={salary.payFrequency}
              onChange={e =>
                setSalary({ ...salary, payFrequency: e.target.value })
              }
            >
              <option value="MONTHLY">Monthly</option>
              <option value="WEEKLY">Weekly</option>
              <option value="YEARLY">Yearly</option>
              <option value="HOURLY">Hourly</option>
            </select>

            <input
              type="date"
              value={salary.effectiveDate}
              required
              onChange={e =>
                setSalary({ ...salary, effectiveDate: e.target.value })
              }
            />

            <button type="submit">Save Salary</button>
          </form>
        </section>

        {/* Salary Records */}
        <section className="panel employee-list">
          <h2>Salary Records</h2>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Salary Amount</th>
                  <th>Currency</th>
                  <th>Pay Frequency</th>
                </tr>
              </thead>

              <tbody>
                {salaries.map(item => (
                  <tr key={item.id}>
                    <td>{item.employee?.id}</td>
                    <td>
                      {item.employee?.firstName} {item.employee?.lastName}
                    </td>
                    <td>{item.amount}</td>
                    <td>{item.currency}</td>
                    <td>{item.payFrequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {salaries.length === 0 && (
              <p>No salary records found.</p>
            )}
          </div>
        </section>

        {/* Employee Directory */}
        <section className="panel employee-list">
          <div className="directory-header">
            <div>
              <h2>Employee Directory</h2>
              <p>
                {filteredEmployees.length.toLocaleString()} employees found
              </p>
            </div>

            <button
              type="button"
              className="refresh-button"
              onClick={loadData}
            >
              Refresh
            </button>
          </div>

          <input
            placeholder="Search by name, code, department or country..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee Code</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Country</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.employeeCode}</td>
                    <td>{item.firstName} {item.lastName}</td>
                    <td>{item.department}</td>
                    <td>{item.designation}</td>
                    <td>{item.country}</td>
                    <td>
                      <span className={
                        item.employmentStatus === "ACTIVE"
                          ? "status-active"
                          : "status-inactive"
                      }>
                        {item.employmentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loading && <p>Loading employees...</p>}

            {!loading && filteredEmployees.length === 0 && (
              <p>No employees found.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
