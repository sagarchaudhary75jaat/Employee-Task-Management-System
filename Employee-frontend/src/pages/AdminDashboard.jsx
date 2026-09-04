
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employeeMessage, setEmployeeMessage] = useState("");
  const [taskMessage, setTaskMessage] = useState("");
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "PENDING",
    dueDate: "",
    employeeId: "",
  });

  // =====================================================
  // AUTH CONFIG
  // =====================================================

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const config = getAuthConfig();

      const [employeesResponse, tasksResponse] =
        await Promise.all([
          axios.get(`${API_URL}/employees`, config),
          axios.get(`${API_URL}/tasks`, config),
        ]);

      setEmployees(employeesResponse.data || []);
      setTasks(tasksResponse.data || []);
    } catch (err) {
      console.error("Admin dashboard loading error:", err);

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      navigate("/login");
      return;
    }

    loadData();
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // =====================================================
  // EMPLOYEE FORM
  // =====================================================

  const handleEmployeeChange = (event) => {
    const { name, value } = event.target;

    setEmployeeForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const createEmployee = async (event) => {
    event.preventDefault();

    setEmployeeMessage("");
    setError("");

    try {
      const config = getAuthConfig();

      await axios.post(
        `${API_URL}/employees`,
        employeeForm,
        config
      );

      setEmployeeMessage(
        "Employee created successfully."
      );

      setEmployeeForm({
        name: "",
        email: "",
        password: "",
        role: "EMPLOYEE",
      });

      await loadData();
    } catch (err) {
      console.error("Create employee error:", err);

      setEmployeeMessage(
        err.response?.data?.message ||
          "Failed to create employee."
      );
    }
  };

  // =====================================================
  // DELETE EMPLOYEE
  // =====================================================

  const deleteEmployee = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingEmployee(id);
      setError("");

      const config = getAuthConfig();

      await axios.delete(
        `${API_URL}/employees/${id}`,
        config
      );

      await loadData();
    } catch (err) {
      console.error("Delete employee error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete employee."
      );
    } finally {
      setDeletingEmployee(null);
    }
  };

  // =====================================================
  // TASK FORM
  // =====================================================

  const handleTaskChange = (event) => {
    const { name, value } = event.target;

    setTaskForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const createTask = async (event) => {
    event.preventDefault();

    setTaskMessage("");
    setError("");

    if (!taskForm.employeeId) {
      setTaskMessage("Please select an employee.");
      return;
    }

    try {
      const config = getAuthConfig();

      await axios.post(
        `${API_URL}/tasks`,
        {
          title: taskForm.title,
          description: taskForm.description,
          status: taskForm.status,
          dueDate: taskForm.dueDate,
          employeeId: Number(taskForm.employeeId),
        },
        config
      );

      setTaskMessage(
        "Task created and assigned successfully."
      );

      setTaskForm({
        title: "",
        description: "",
        status: "PENDING",
        dueDate: "",
        employeeId: "",
      });

      await loadData();
    } catch (err) {
      console.error("Create task error:", err);

      setTaskMessage(
        err.response?.data?.message ||
          "Failed to create task."
      );
    }
  };

  // =====================================================
  // DELETE TASK
  // =====================================================

  const deleteTask = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingTask(id);
      setError("");

      const config = getAuthConfig();

      await axios.delete(
        `${API_URL}/tasks/${id}`,
        config
      );

      await loadData();
    } catch (err) {
      console.error("Delete task error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete task."
      );
    } finally {
      setDeletingTask(null);
    }
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const employeeOnlyList = useMemo(
    () =>
      employees.filter(
        (employee) => employee.role === "EMPLOYEE"
      ),
    [employees]
  );

  const totalEmployees = employeeOnlyList.length;
  const totalTasks = tasks.length;

  const activeTasks = tasks.filter(
    (task) =>
      task.status === "PENDING" ||
      task.status === "ACTIVE"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const failedTasks = tasks.filter(
    (task) => task.status === "FAILED"
  ).length;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingSpinner}></div>
          <h2 style={styles.loadingTitle}>
            Loading Admin Workspace
          </h2>
          <p style={styles.loadingText}>
            Please wait while we load your dashboard.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* =================================================
            HEADER
        ================================================= */}

        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.brandIcon}>
              A
            </div>

            <div>
              <p style={styles.eyebrow}>
                EMPLOYEE MANAGEMENT
              </p>

              <h1 style={styles.title}>
                Admin Workspace
              </h1>

              <p style={styles.subtitle}>
                Manage employees, assign tasks, and monitor
                progress.
              </p>
            </div>
          </div>

          <div style={styles.headerRight}>
            <div style={styles.adminProfile}>
              <div style={styles.avatar}>
                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : "A"}
              </div>

              <div style={styles.profileText}>
                <strong style={styles.profileName}>
                  {user?.name || "Admin"}
                </strong>

                <span style={styles.profileEmail}>
                  {user?.email || ""}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              style={styles.logoutButton}
            >
              <span style={styles.logoutIcon}>↪</span>
              Logout
            </button>
          </div>
        </header>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div style={styles.errorBox}>
            <span style={styles.alertIcon}>!</span>

            <div>
              <strong style={styles.alertTitle}>
                Something went wrong
              </strong>

              <p style={styles.alertText}>
                {error}
              </p>
            </div>

            <button
              onClick={() => setError("")}
              style={styles.closeAlert}
            >
              ×
            </button>
          </div>
        )}

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section style={styles.statsGrid}>

          <StatCard
            icon="👥"
            label="Total Employees"
            value={totalEmployees}
            description="Active team members"
          />

          <StatCard
            icon="📋"
            label="Total Tasks"
            value={totalTasks}
            description="Tasks in workspace"
          />

          <StatCard
            icon="⚡"
            label="Active Tasks"
            value={activeTasks}
            description="Pending or active"
          />

          <StatCard
            icon="✓"
            label="Completed"
            value={completedTasks}
            description="Successfully finished"
          />

          <StatCard
            icon="!"
            label="Failed"
            value={failedTasks}
            description="Tasks marked failed"
          />

        </section>

        {/* =================================================
            CREATE EMPLOYEE
        ================================================= */}

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionEyebrow}>
                TEAM
              </p>

              <h2 style={styles.sectionTitle}>
                Create Employee
              </h2>

              <p style={styles.sectionDescription}>
                Add a new employee to your organization.
              </p>
            </div>

            <div style={styles.sectionIcon}>
              +
            </div>
          </div>

          <form
            onSubmit={createEmployee}
            style={styles.formGrid}
          >
            <div style={styles.field}>
              <label style={styles.label}>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="e.g. Sagar Kumar"
                value={employeeForm.name}
                onChange={handleEmployeeChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="employee@example.com"
                value={employeeForm.email}
                onChange={handleEmployeeChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={employeeForm.password}
                onChange={handleEmployeeChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Role
              </label>

              <select
                name="role"
                value={employeeForm.role}
                onChange={handleEmployeeChange}
                style={styles.select}
              >
                <option value="EMPLOYEE">
                  Employee
                </option>

                <option value="ADMIN">
                  Admin
                </option>
              </select>
            </div>

            <div style={styles.formButtonWrapper}>
              <button
                type="submit"
                style={styles.primaryButton}
              >
                <span>+</span>
                Create Employee
              </button>
            </div>
          </form>

          {employeeMessage && (
            <div style={styles.successBox}>
              <span>✓</span>
              {employeeMessage}
            </div>
          )}
        </section>

        {/* =================================================
            EMPLOYEES
        ================================================= */}

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionEyebrow}>
                TEAM DIRECTORY
              </p>

              <h2 style={styles.sectionTitle}>
                Employees
              </h2>

              <p style={styles.sectionDescription}>
                View employee accounts and task progress.
              </p>
            </div>

            <div style={styles.countBadge}>
              {totalEmployees}{" "}
              {totalEmployees === 1
                ? "Employee"
                : "Employees"}
            </div>
          </div>

          {employeeOnlyList.length === 0 ? (
            <EmptyState
              icon="👥"
              title="No employees yet"
              text="Create your first employee using the form above."
            />
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>EMPLOYEE</th>
                    <th style={styles.th}>ROLE</th>
                    <th style={styles.thCenter}>ACTIVE</th>
                    <th style={styles.thCenter}>
                      COMPLETED
                    </th>
                    <th style={styles.thCenter}>FAILED</th>
                    <th style={styles.thRight}>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {employeeOnlyList.map((employee) => (
                    <tr
                      key={employee.id}
                      style={styles.tableRow}
                    >
                      <td style={styles.td}>
                        <div style={styles.employeeCell}>
                          <div style={styles.employeeAvatar}>
                            {employee.name
                              ? employee.name
                                  .charAt(0)
                                  .toUpperCase()
                              : "E"}
                          </div>

                          <div>
                            <span
                              style={
                                styles.employeeName
                              }
                            >
                              {employee.name}
                            </span>

                            <span
                              style={
                                styles.employeeEmail
                              }
                            >
                              {employee.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td style={styles.td}>
                        <span style={styles.roleBadge}>
                          {employee.role}
                        </span>
                      </td>

                      <td
                        style={styles.tdCenter}
                      >
                        <span
                          style={styles.numberBadge}
                        >
                          {employee.tasksActive ?? 0}
                        </span>
                      </td>

                      <td
                        style={styles.tdCenter}
                      >
                        <span
                          style={{
                            ...styles.numberBadge,
                            ...styles.completedNumber,
                          }}
                        >
                          {employee.tasksCompleted ?? 0}
                        </span>
                      </td>

                      <td
                        style={styles.tdCenter}
                      >
                        <span
                          style={{
                            ...styles.numberBadge,
                            ...styles.failedNumber,
                          }}
                        >
                          {employee.tasksFailed ?? 0}
                        </span>
                      </td>

                      <td style={styles.tdRight}>
                        <button
                          onClick={() =>
                            deleteEmployee(
                              employee.id
                            )
                          }
                          disabled={
                            deletingEmployee ===
                            employee.id
                          }
                          style={{
                            ...styles.deleteButton,
                            ...(deletingEmployee ===
                            employee.id
                              ? styles.disabledButton
                              : {}),
                          }}
                        >
                          {deletingEmployee ===
                          employee.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* =================================================
            CREATE TASK
        ================================================= */}

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionEyebrow}>
                TASK MANAGEMENT
              </p>

              <h2 style={styles.sectionTitle}>
                Create Task
              </h2>

              <p style={styles.sectionDescription}>
                Create a task and assign it directly to an
                employee.
              </p>
            </div>

            <div style={styles.sectionIcon}>
              ✓
            </div>
          </div>

          <form
            onSubmit={createTask}
            style={styles.taskForm}
          >
            <div style={styles.field}>
              <label style={styles.label}>
                Task Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="e.g. Complete React video"
                value={taskForm.title}
                onChange={handleTaskChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Description
              </label>

              <textarea
                name="description"
                placeholder="Describe what the employee needs to do..."
                value={taskForm.description}
                onChange={handleTaskChange}
                rows="4"
                style={{
                  ...styles.input,
                  ...styles.textarea,
                }}
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.field}>
                <label style={styles.label}>
                  Status
                </label>

                <select
                  name="status"
                  value={taskForm.status}
                  onChange={handleTaskChange}
                  style={styles.select}
                >
                  <option value="PENDING">
                    PENDING
                  </option>

                  <option value="ACTIVE">
                    ACTIVE
                  </option>

                  <option value="COMPLETED">
                    COMPLETED
                  </option>

                  <option value="FAILED">
                    FAILED
                  </option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Due Date
                </label>

                <div style={styles.dateWrapper}>
                  <input
                    type="date"
                    name="dueDate"
                    value={taskForm.dueDate}
                    onChange={handleTaskChange}
                    style={styles.dateInput}
                  />

                  <span style={styles.calendarIcon}>
                    📅
                  </span>
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Assign Employee
                </label>

                <select
                  name="employeeId"
                  value={taskForm.employeeId}
                  onChange={handleTaskChange}
                  required
                  style={styles.select}
                >
                  <option value="">
                    Select Employee
                  </option>

                  {employeeOnlyList.map(
                    (employee) => (
                      <option
                        key={employee.id}
                        value={employee.id}
                      >
                        {employee.name} -{" "}
                        {employee.email}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div style={styles.taskFormActions}>
              <button
                type="submit"
                style={styles.primaryButton}
              >
                <span>+</span>
                Create & Assign Task
              </button>
            </div>
          </form>

          {taskMessage && (
            <div style={styles.successBox}>
              <span>✓</span>
              {taskMessage}
            </div>
          )}
        </section>

        {/* =================================================
            ALL TASKS
        ================================================= */}

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionEyebrow}>
                WORKSPACE
              </p>

              <h2 style={styles.sectionTitle}>
                All Tasks
              </h2>

              <p style={styles.sectionDescription}>
                Monitor every task and its current status.
              </p>
            </div>

            <div style={styles.countBadge}>
              {totalTasks}{" "}
              {totalTasks === 1 ? "Task" : "Tasks"}
            </div>
          </div>

          {tasks.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No tasks found"
              text="Create a task above to get started."
            />
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>TASK</th>
                    <th style={styles.th}>STATUS</th>
                    <th style={styles.th}>DUE DATE</th>
                    <th style={styles.th}>
                      ASSIGNED EMPLOYEE
                    </th>
                    <th style={styles.thRight}>
                      ACTION
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.map((task) => (
                    <tr
                      key={task.id}
                      style={styles.tableRow}
                    >
                      <td style={styles.td}>
                        <div style={styles.taskCell}>
                          <span
                            style={
                              styles.taskCellTitle
                            }
                          >
                            {task.title}
                          </span>

                          {task.description && (
                            <span
                              style={
                                styles.taskCellDescription
                              }
                            >
                              {task.description}
                            </span>
                          )}
                        </div>
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            ...getStatusStyle(
                              task.status
                            ),
                          }}
                        >
                          <span
                            style={
                              styles.statusDot
                            }
                          ></span>
                          {task.status}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <div
                          style={styles.dueDateCell}
                        >
                          <span
                            style={
                              styles.smallCalendar
                            }
                          >
                            📅
                          </span>

                          <span>
                            {task.dueDate ||
                              "No due date"}
                          </span>
                        </div>
                      </td>

                      <td style={styles.td}>
                        {task.employee ? (
                          <div
                            style={
                              styles.assignedEmployee
                            }
                          >
                            <div
                              style={
                                styles.smallAvatar
                              }
                            >
                              {task.employee.name
                                ? task.employee.name
                                    .charAt(0)
                                    .toUpperCase()
                                : "E"}
                            </div>

                            <div
                              style={
                                styles.assignedEmployeeText
                              }
                            >
                              <span
                                style={
                                  styles.assignedName
                                }
                              >
                                {task.employee.name}
                              </span>

                              <span
                                style={
                                  styles.assignedEmail
                                }
                              >
                                {task.employee.email}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span
                            style={
                              styles.unassigned
                            }
                          >
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td style={styles.tdRight}>
                        <button
                          onClick={() =>
                            deleteTask(task.id)
                          }
                          disabled={
                            deletingTask === task.id
                          }
                          style={{
                            ...styles.deleteButton,
                            ...(deletingTask ===
                            task.id
                              ? styles.disabledButton
                              : {}),
                          }}
                        >
                          {deletingTask === task.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer style={styles.footer}>
          Employee Management System
          <span style={styles.footerDot}>•</span>
          Admin Workspace
        </footer>
      </div>
    </div>
  );
}

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  icon,
  label,
  value,
  description,
}) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statTop}>
        <div style={styles.statIcon}>
          {icon}
        </div>

        <span style={styles.statLabel}>
          {label}
        </span>
      </div>

      <div style={styles.statValue}>
        {value}
      </div>

      <div style={styles.statDescription}>
        {description}
      </div>
    </div>
  );
}

// =====================================================
// EMPTY STATE
// =====================================================

function EmptyState({ icon, title, text }) {
  return (
    <div style={styles.emptyState}>
      <div style={styles.emptyIcon}>
        {icon}
      </div>

      <h3 style={styles.emptyTitle}>
        {title}
      </h3>

      <p style={styles.emptyText}>
        {text}
      </p>
    </div>
  );
}

// =====================================================
// STATUS STYLE
// =====================================================

function getStatusStyle(status) {
  switch (status) {
    case "PENDING":
      return {
        background: "#fff7df",
        color: "#946200",
        border: "1px solid #f5d77a",
      };

    case "ACTIVE":
      return {
        background: "#e8f1ff",
        color: "#1757a6",
        border: "1px solid #b9d2ff",
      };

    case "COMPLETED":
      return {
        background: "#e7f7ee",
        color: "#177245",
        border: "1px solid #b8e4ca",
      };

    case "FAILED":
      return {
        background: "#ffebee",
        color: "#b42332",
        border: "1px solid #f3bcc3",
      };

    default:
      return {
        background: "#f2f4f7",
        color: "#475467",
        border: "1px solid #d0d5dd",
      };
  }
}

// =====================================================
// STYLES
// =====================================================

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f6f8fc 0%, #eef2f8 100%)",
    padding: "28px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#172033",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: "1450px",
    margin: "0 auto",
  },

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #f6f8fc 0%, #eef2f8 100%)",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, sans-serif",
  },

  loadingCard: {
    width: "360px",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "40px",
    textAlign: "center",
    boxShadow:
      "0 20px 60px rgba(31, 41, 55, 0.12)",
  },

  loadingSpinner: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "4px solid #e8edf5",
    borderTop: "4px solid #4f46e5",
    margin: "0 auto 20px",
    boxSizing: "border-box",
  },

  loadingTitle: {
    margin: "0 0 8px",
    fontSize: "20px",
  },

  loadingText: {
    margin: 0,
    color: "#667085",
  },

  header: {
    background:
      "linear-gradient(135deg, #171c33 0%, #252d4a 100%)",
    color: "#ffffff",
    padding: "28px 32px",
    borderRadius: "22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
    marginBottom: "24px",
    boxShadow:
      "0 18px 50px rgba(23, 28, 51, 0.18)",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  brandIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "17px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #7c6cff, #5c50e8)",
    fontSize: "25px",
    fontWeight: "800",
    boxShadow:
      "0 10px 25px rgba(92, 80, 232, 0.35)",
  },

  eyebrow: {
    margin: "0 0 4px",
    fontSize: "11px",
    letterSpacing: "1.7px",
    fontWeight: "800",
    color: "#aeb7d5",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    lineHeight: 1.15,
    letterSpacing: "-0.6px",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#bfc6dc",
    fontSize: "14px",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  adminProfile: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
  },

  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "#ffffff",
    color: "#242b46",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "18px",
  },

  profileText: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  profileName: {
    fontSize: "14px",
  },

  profileEmail: {
    color: "#bfc6dc",
    fontSize: "12px",
  },

  logoutButton: {
    padding: "11px 17px",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "11px",
    cursor: "pointer",
    fontWeight: "700",
    background: "rgba(255,255,255,0.10)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },

  logoutIcon: {
    fontSize: "17px",
  },

  errorBox: {
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    color: "#9f1239",
    padding: "14px 17px",
    borderRadius: "13px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  alertIcon: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#e11d48",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  alertTitle: {
    display: "block",
    fontSize: "14px",
  },

  alertText: {
    margin: "3px 0 0",
    fontSize: "13px",
  },

  closeAlert: {
    marginLeft: "auto",
    border: "none",
    background: "transparent",
    color: "#9f1239",
    fontSize: "22px",
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(5, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },

  statCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "20px",
    border: "1px solid #e7eaf0",
    boxShadow:
      "0 8px 28px rgba(31, 41, 55, 0.06)",
  },

  statTop: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  statIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "11px",
    background: "#f1f3ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
  },

  statLabel: {
    fontSize: "13px",
    color: "#667085",
    fontWeight: "700",
  },

  statValue: {
    fontSize: "34px",
    lineHeight: 1,
    fontWeight: "800",
    marginTop: "17px",
    color: "#151a2d",
  },

  statDescription: {
    color: "#98a2b3",
    fontSize: "12px",
    marginTop: "8px",
  },

  section: {
    background: "#ffffff",
    padding: "27px",
    borderRadius: "20px",
    border: "1px solid #e7eaf0",
    marginBottom: "24px",
    boxShadow:
      "0 8px 28px rgba(31, 41, 55, 0.055)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "23px",
  },

  sectionEyebrow: {
    margin: "0 0 5px",
    color: "#667085",
    fontSize: "10px",
    letterSpacing: "1.4px",
    fontWeight: "800",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "21px",
    letterSpacing: "-0.2px",
    color: "#171b2e",
  },

  sectionDescription: {
    margin: "5px 0 0",
    color: "#7b8495",
    fontSize: "13px",
  },

  sectionIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: "#f1f3ff",
    color: "#5146d8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
    fontWeight: "800",
  },

  countBadge: {
    background: "#f2f4f8",
    color: "#475467",
    padding: "8px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },

  taskForm: {
    display: "grid",
    gap: "18px",
  },

  formRow: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "18px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#344054",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    border: "1px solid #d9dee8",
    borderRadius: "11px",
    background: "#fbfcfe",
    color: "#172033",
    outline: "none",
    fontSize: "14px",
    fontFamily: "inherit",
  },

  textarea: {
    resize: "vertical",
    minHeight: "105px",
    lineHeight: "1.5",
  },

  select: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    border: "1px solid #d9dee8",
    borderRadius: "11px",
    background: "#fbfcfe",
    color: "#172033",
    outline: "none",
    fontSize: "14px",
    fontFamily: "inherit",
    cursor: "pointer",
  },

  dateWrapper: {
    position: "relative",
    width: "100%",
  },

  dateInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 45px 13px 14px",
    border: "1px solid #d9dee8",
    borderRadius: "11px",
    background: "#fbfcfe",
    color: "#172033",
    outline: "none",
    fontSize: "14px",
    fontFamily: "inherit",
    minHeight: "45px",
    cursor: "pointer",
    colorScheme: "light",
  },

  calendarIcon: {
    position: "absolute",
    right: "13px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    fontSize: "17px",
  },

  formButtonWrapper: {
    display: "flex",
    alignItems: "flex-end",
  },

  primaryButton: {
    minHeight: "45px",
    padding: "0 19px",
    border: "none",
    borderRadius: "11px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "13px",
    background:
      "linear-gradient(135deg, #5b52e8, #453bd0)",
    color: "#ffffff",
    boxShadow:
      "0 8px 18px rgba(79, 70, 229, 0.22)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  taskFormActions: {
    display: "flex",
    justifyContent: "flex-start",
  },

  successBox: {
    marginTop: "17px",
    padding: "12px 15px",
    borderRadius: "10px",
    background: "#ecfdf3",
    border: "1px solid #abefc6",
    color: "#067647",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    fontSize: "13px",
    fontWeight: "700",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    border: "1px solid #eaecf0",
    borderRadius: "14px",
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    minWidth: "850px",
  },

  th: {
    background: "#f8f9fc",
    color: "#667085",
    fontSize: "10px",
    letterSpacing: "0.8px",
    fontWeight: "800",
    textAlign: "left",
    padding: "13px 15px",
    borderBottom: "1px solid #eaecf0",
    whiteSpace: "nowrap",
  },

  thCenter: {
    background: "#f8f9fc",
    color: "#667085",
    fontSize: "10px",
    letterSpacing: "0.8px",
    fontWeight: "800",
    textAlign: "center",
    padding: "13px 15px",
    borderBottom: "1px solid #eaecf0",
    whiteSpace: "nowrap",
  },

  thRight: {
    background: "#f8f9fc",
    color: "#667085",
    fontSize: "10px",
    letterSpacing: "0.8px",
    fontWeight: "800",
    textAlign: "right",
    padding: "13px 15px",
    borderBottom: "1px solid #eaecf0",
    whiteSpace: "nowrap",
  },

  tableRow: {
    background: "#ffffff",
  },

  td: {
    padding: "16px 15px",
    borderBottom: "1px solid #f0f1f4",
    verticalAlign: "middle",
    fontSize: "13px",
    color: "#344054",
  },

  tdCenter: {
    padding: "16px 15px",
    borderBottom: "1px solid #f0f1f4",
    verticalAlign: "middle",
    textAlign: "center",
    fontSize: "13px",
  },

  tdRight: {
    padding: "16px 15px",
    borderBottom: "1px solid #f0f1f4",
    verticalAlign: "middle",
    textAlign: "right",
  },

  employeeCell: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
  },

  employeeAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "11px",
    background: "#eef0ff",
    color: "#5146d8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "14px",
    flexShrink: 0,
  },

  employeeName: {
    display: "block",
    fontWeight: "800",
    color: "#1d2435",
    marginBottom: "3px",
  },

  employeeEmail: {
    display: "block",
    color: "#8a94a6",
    fontSize: "12px",
  },

  roleBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 9px",
    borderRadius: "8px",
    background: "#f2f4f7",
    color: "#475467",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },

  numberBadge: {
    display: "inline-flex",
    minWidth: "28px",
    height: "28px",
    padding: "0 7px",
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    background: "#fff7df",
    color: "#946200",
    fontWeight: "800",
    fontSize: "12px",
  },

  completedNumber: {
    background: "#e7f7ee",
    color: "#177245",
  },

  failedNumber: {
    background: "#ffebee",
    color: "#b42332",
  },

  deleteButton: {
    padding: "8px 12px",
    border: "1px solid #f0b9c0",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#fff5f6",
    color: "#c0273b",
    fontWeight: "800",
    fontSize: "11px",
  },

  disabledButton: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  taskCell: {
    maxWidth: "340px",
  },

  taskCellTitle: {
    display: "block",
    fontWeight: "800",
    color: "#1d2435",
    marginBottom: "4px",
  },

  taskCellDescription: {
    display: "block",
    color: "#8a94a6",
    fontSize: "12px",
    lineHeight: "1.4",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 9px",
    borderRadius: "8px",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "0.4px",
  },

  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "currentColor",
  },

  dueDateCell: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    whiteSpace: "nowrap",
  },

  smallCalendar: {
    fontSize: "14px",
  },

  assignedEmployee: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },

  smallAvatar: {
    width: "31px",
    height: "31px",
    borderRadius: "9px",
    background: "#eef0ff",
    color: "#5146d8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "800",
    flexShrink: 0,
  },

  assignedEmployeeText: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  assignedName: {
    fontWeight: "700",
    color: "#344054",
    fontSize: "12px",
  },

  assignedEmail: {
    color: "#98a2b3",
    fontSize: "11px",
  },

  unassigned: {
    color: "#98a2b3",
    fontStyle: "italic",
    fontSize: "12px",
  },

  emptyState: {
    padding: "55px 20px",
    textAlign: "center",
    border: "1px dashed #d9dee8",
    borderRadius: "14px",
    background: "#fbfcfe",
  },

  emptyIcon: {
    fontSize: "32px",
    marginBottom: "10px",
  },

  emptyTitle: {
    margin: "0 0 6px",
    fontSize: "16px",
    color: "#344054",
  },

  emptyText: {
    margin: 0,
    color: "#98a2b3",
    fontSize: "13px",
  },

  footer: {
    textAlign: "center",
    padding: "10px 0 20px",
    color: "#98a2b3",
    fontSize: "12px",
  },

  footerDot: {
    margin: "0 7px",
  },
};

export default AdminDashboard;

