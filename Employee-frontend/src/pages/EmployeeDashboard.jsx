
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/api";

function EmployeeDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
  // LOAD DASHBOARD
  // =====================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const config = getAuthConfig();

      const [profileResponse, tasksResponse] =
        await Promise.all([
          axios.get(
            `${API_URL}/employees/me`,
            config
          ),

          axios.get(
            `${API_URL}/tasks`,
            config
          ),
        ]);

      setUser(profileResponse.data);
      setTasks(tasksResponse.data);
    } catch (err) {
      console.error(
        "Employee dashboard error:",
        err
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (!storedUser) {
      navigate("/login");
      return;
    }

    if (storedUser.role !== "EMPLOYEE") {
      navigate("/login");
      return;
    }

    loadDashboard();
  }, []);

  // =====================================================
  // ACCEPT TASK
  // =====================================================

  const acceptTask = async (taskId) => {
    try {
      setActionLoading(taskId);
      setError("");
      setMessage("");

      const config = getAuthConfig();

      await axios.post(
        `${API_URL}/tasks/${taskId}/accept`,
        {},
        config
      );

      setMessage(
        "Task accepted successfully."
      );

      await loadDashboard();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to accept task."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // COMPLETE TASK
  // =====================================================

  const completeTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this task as completed?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(taskId);
      setError("");
      setMessage("");

      const config = getAuthConfig();

      await axios.post(
        `${API_URL}/tasks/${taskId}/complete`,
        {},
        config
      );

      setMessage(
        "Task completed successfully."
      );

      await loadDashboard();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to complete task."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // FAIL TASK
  // =====================================================

  const failTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this task as failed?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(taskId);
      setError("");
      setMessage("");

      const config = getAuthConfig();

      await axios.post(
        `${API_URL}/tasks/${taskId}/fail`,
        {},
        config
      );

      setMessage(
        "Task marked as failed."
      );

      await loadDashboard();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update task."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <h2>Loading Employee Workspace</h2>
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // STATISTICS
  // =====================================================

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
  // DASHBOARD
  // =====================================================

  return (
    <div style={styles.page}>

      {/* ===============================================
          TOP NAVBAR
      ================================================ */}

      <header style={styles.header}>

        <div style={styles.brandArea}>

          <div style={styles.brandIcon}>
            EW
          </div>

          <div>
            <h1 style={styles.brandTitle}>
              Employee Workspace
            </h1>

            <p style={styles.brandSubtitle}>
              Your personal task center
            </p>
          </div>

        </div>

        <div style={styles.headerRight}>

          <div style={styles.employeeProfile}>

            <div style={styles.avatar}>
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "E"}
            </div>

            <div>
              <strong style={styles.profileName}>
                {user?.name || "Employee"}
              </strong>

              <span style={styles.profileRole}>
                Employee
              </span>
            </div>

          </div>

          <button
            onClick={logout}
            style={styles.logoutButton}
          >
            Logout
          </button>

        </div>

      </header>

      {/* ===============================================
          MAIN
      ================================================ */}

      <main style={styles.container}>

        {/* HERO */}

        <section style={styles.hero}>

          <div>

            <span style={styles.heroLabel}>
              MY WORKSPACE
            </span>

            <h2 style={styles.heroTitle}>
              Welcome back, {user?.name}
            </h2>

            <p style={styles.heroText}>
              Stay on top of your assigned tasks,
              track progress and complete your work.
            </p>

          </div>

          <div style={styles.profileCard}>

            <div style={styles.largeAvatar}>
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "E"}
            </div>

            <div>
              <strong>
                {user?.name}
              </strong>

              <span>
                {user?.email}
              </span>
            </div>

          </div>

        </section>

        {/* ERROR */}

        {error && (
          <div style={styles.error}>
            <span style={styles.alertIcon}>
              !
            </span>

            <div>
              <strong>
                Something went wrong
              </strong>

              <p>{error}</p>
            </div>
          </div>
        )}

        {/* SUCCESS */}

        {message && (
          <div style={styles.success}>
            <span style={styles.successIcon}>
              ✓
            </span>

            {message}
          </div>
        )}

        {/* ============================================
            STATISTICS
        ============================================= */}

        <section style={styles.statsGrid}>

          <StatCard
            label="Active Tasks"
            value={activeTasks}
            icon="⚡"
            description="Pending or in progress"
          />

          <StatCard
            label="Completed Tasks"
            value={completedTasks}
            icon="✓"
            description="Successfully completed"
          />

          <StatCard
            label="Failed Tasks"
            value={failedTasks}
            icon="!"
            description="Tasks needing attention"
          />

        </section>

        {/* ============================================
            TASKS
        ============================================= */}

        <section style={styles.section}>

          <div style={styles.sectionHeader}>

            <div>
              <span style={styles.sectionLabel}>
                WORK QUEUE
              </span>

              <h2 style={styles.sectionTitle}>
                My Tasks
              </h2>

              <p style={styles.sectionSubtitle}>
                Tasks assigned to you by the administrator.
              </p>
            </div>

            <div style={styles.taskCount}>
              {tasks.length}{" "}
              {tasks.length === 1
                ? "Task"
                : "Tasks"}
            </div>

          </div>

          {tasks.length === 0 ? (

            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                ✓
              </div>

              <h3>
                You're all caught up!
              </h3>

              <p>
                No tasks have been assigned to you yet.
              </p>

            </div>

          ) : (

            <div style={styles.taskGrid}>

              {tasks.map((task) => {

                const isLoading =
                  actionLoading === task.id;

                return (
                  <article
                    key={task.id}
                    style={styles.taskCard}
                  >

                    {/* CARD TOP */}

                    <div style={styles.taskCardTop}>

                      <div style={styles.taskNumber}>
                        #{task.id}
                      </div>

                      <StatusBadge
                        status={task.status}
                      />

                    </div>

                    {/* TITLE */}

                    <h3 style={styles.taskTitle}>
                      {task.title}
                    </h3>

                    {/* DESCRIPTION */}

                    <p style={styles.description}>
                      {task.description ||
                        "No description provided for this task."}
                    </p>

                    {/* DETAILS */}

                    <div style={styles.details}>

                      <div style={styles.detailItem}>

                        <span style={styles.detailIcon}>
                          📅
                        </span>

                        <div>
                          <span style={styles.detailLabel}>
                            Due Date
                          </span>

                          <strong>
                            {task.dueDate ||
                              "No due date"}
                          </strong>
                        </div>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div style={styles.actions}>

                      {/* PENDING */}

                      {task.status === "PENDING" && (

                        <button
                          onClick={() =>
                            acceptTask(task.id)
                          }
                          disabled={isLoading}
                          style={{
                            ...styles.acceptButton,
                            ...(isLoading
                              ? styles.disabledButton
                              : {}),
                          }}
                        >
                          {isLoading
                            ? "Processing..."
                            : "Accept Task"}
                        </button>

                      )}

                      {/* ACTIVE */}

                      {task.status === "ACTIVE" && (

                        <>
                          <button
                            onClick={() =>
                              completeTask(
                                task.id
                              )
                            }
                            disabled={isLoading}
                            style={{
                              ...styles.completeButton,
                              ...(isLoading
                                ? styles.disabledButton
                                : {}),
                            }}
                          >
                            {isLoading
                              ? "Processing..."
                              : "✓ Complete"}
                          </button>

                          <button
                            onClick={() =>
                              failTask(task.id)
                            }
                            disabled={isLoading}
                            style={{
                              ...styles.failButton,
                              ...(isLoading
                                ? styles.disabledButton
                                : {}),
                            }}
                          >
                            {isLoading
                              ? "Processing..."
                              : "✕ Fail"}
                          </button>
                        </>

                      )}

                      {/* COMPLETED */}

                      {task.status ===
                        "COMPLETED" && (

                        <div
                          style={
                            styles.completedMessage
                          }
                        >
                          <span>✓</span>
                          Task completed successfully
                        </div>

                      )}

                      {/* FAILED */}

                      {task.status ===
                        "FAILED" && (

                        <div
                          style={
                            styles.failedMessage
                          }
                        >
                          <span>✕</span>
                          Task marked as failed
                        </div>

                      )}

                    </div>

                  </article>
                );
              })}

            </div>

          )}

        </section>

        <footer style={styles.footer}>
          Employee Management System
          <span>•</span>
          Employee Workspace
        </footer>

      </main>
    </div>
  );
}

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  label,
  value,
  icon,
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

      <strong style={styles.statNumber}>
        {value}
      </strong>

      <span style={styles.statDescription}>
        {description}
      </span>

    </div>
  );
}

// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({ status }) {

  const statusStyles = {
    PENDING: styles.pendingBadge,
    ACTIVE: styles.activeBadge,
    COMPLETED: styles.completedBadge,
    FAILED: styles.failedBadge,
  };

  return (
    <span
      style={{
        ...styles.statusBadge,
        ...(statusStyles[status] ||
          styles.pendingBadge),
      }}
    >
      <span style={styles.statusDot}></span>
      {status}
    </span>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    color: "#172033",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
  },

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f7fb",
  },

  loadingCard: {
    background: "#ffffff",
    padding: "45px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow:
      "0 15px 50px rgba(15, 23, 42, 0.10)",
  },

  spinner: {
    width: "38px",
    height: "38px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    margin: "0 auto 20px",
  },

  header: {
    background:
      "linear-gradient(135deg, #111827 0%, #1e293b 100%)",
    color: "#ffffff",
    minHeight: "82px",
    padding: "0 42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "25px",
    boxShadow:
      "0 8px 30px rgba(15, 23, 42, 0.18)",
  },

  brandArea: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  brandIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #3b82f6, #6366f1)",
    color: "#ffffff",
    fontWeight: "900",
    fontSize: "13px",
    boxShadow:
      "0 8px 20px rgba(59, 130, 246, 0.30)",
  },

  brandTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    color: "#ffffff",
  },

  brandSubtitle: {
    margin: "3px 0 0",
    color: "#cbd5e1",
    fontSize: "12px",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "22px",
  },

  employeeProfile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#334155",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    color: "#ffffff",
  },

  profileName: {
    display: "block",
    color: "#ffffff",
    fontSize: "13px",
  },

  profileRole: {
    display: "block",
    color: "#94a3b8",
    fontSize: "11px",
    marginTop: "2px",
  },

  logoutButton: {
    border:
      "1px solid rgba(255,255,255,0.16)",
    background:
      "rgba(255,255,255,0.08)",
    color: "#ffffff",
    padding: "10px 17px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },

  container: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "35px 28px 50px",
  },

  hero: {
    background:
      "linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)",
    color: "#ffffff",
    borderRadius: "20px",
    padding: "30px 34px",
    marginBottom: "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "25px",
    boxShadow:
      "0 15px 35px rgba(37, 99, 235, 0.20)",
  },

  heroLabel: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    color: "#bfdbfe",
    marginBottom: "9px",
  },

  heroTitle: {
    margin: 0,
    fontSize: "30px",
    letterSpacing: "-0.8px",
  },

  heroText: {
    margin: "8px 0 0",
    color: "#dbeafe",
    maxWidth: "650px",
    lineHeight: 1.6,
  },

  profileCard: {
    minWidth: "245px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px 17px",
    background:
      "rgba(255,255,255,0.10)",
    border:
      "1px solid rgba(255,255,255,0.15)",
    borderRadius: "13px",
  },

  largeAvatar: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#ffffff",
    color: "#3730a3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },

  profileCardSpan: {
    display: "block",
  },

  error: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    color: "#9f1239",
    padding: "16px 18px",
    borderRadius: "13px",
    marginBottom: "20px",
  },

  alertIcon: {
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    background: "#e11d48",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  success: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#ecfdf5",
    border: "1px solid #bbf7d0",
    color: "#166534",
    padding: "13px 16px",
    borderRadius: "11px",
    marginBottom: "20px",
    fontWeight: "700",
  },

  successIcon: {
    width: "23px",
    height: "23px",
    borderRadius: "50%",
    background: "#16a34a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "25px",
  },

  statCard: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "17px",
    border: "1px solid #e7ebf2",
    boxShadow:
      "0 8px 25px rgba(15, 23, 42, 0.05)",
  },

  statTop: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  statIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "#eef4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
  },

  statLabel: {
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "700",
  },

  statNumber: {
    display: "block",
    fontSize: "34px",
    marginTop: "16px",
    color: "#0f172a",
  },

  statDescription: {
    display: "block",
    marginTop: "3px",
    color: "#94a3b8",
    fontSize: "12px",
  },

  section: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "27px",
    marginBottom: "25px",
    border: "1px solid #e7ebf2",
    boxShadow:
      "0 8px 30px rgba(15, 23, 42, 0.045)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "23px",
  },

  sectionLabel: {
    color: "#2563eb",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1.4px",
  },

  sectionTitle: {
    margin: "4px 0 3px",
    fontSize: "21px",
    color: "#172033",
  },

  sectionSubtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  taskCount: {
    background: "#eef4ff",
    color: "#1d4ed8",
    padding: "8px 12px",
    borderRadius: "9px",
    fontSize: "12px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  taskGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(310px, 1fr))",
    gap: "18px",
  },

  taskCard: {
    background: "#ffffff",
    border: "1px solid #e4e9f1",
    borderRadius: "15px",
    padding: "20px",
    boxShadow:
      "0 7px 20px rgba(15, 23, 42, 0.035)",
  },

  taskCardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },

  taskNumber: {
    color: "#94a3b8",
    fontSize: "12px",
    fontWeight: "800",
  },

  taskTitle: {
    margin: "18px 0 8px",
    fontSize: "18px",
    color: "#172033",
  },

  description: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.6,
    fontSize: "13px",
    minHeight: "42px",
  },

  details: {
    borderTop: "1px solid #eef2f7",
    borderBottom: "1px solid #eef2f7",
    marginTop: "18px",
    padding: "14px 0",
  },

  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  detailIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  detailLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    marginBottom: "3px",
  },

  actions: {
    display: "flex",
    gap: "9px",
    marginTop: "17px",
    flexWrap: "wrap",
  },

  acceptButton: {
    flex: 1,
    border: "none",
    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "#ffffff",
    padding: "11px 15px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "13px",
    boxShadow:
      "0 6px 15px rgba(37, 99, 235, 0.18)",
  },

  completeButton: {
    flex: 1,
    border: "none",
    background: "#16a34a",
    color: "#ffffff",
    padding: "11px 15px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "13px",
  },

  failButton: {
    border: "1px solid #fecdd3",
    background: "#fff1f2",
    color: "#be123c",
    padding: "11px 15px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "13px",
  },

  disabledButton: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  completedMessage: {
    width: "100%",
    boxSizing: "border-box",
    background: "#ecfdf5",
    border: "1px solid #bbf7d0",
    color: "#15803d",
    padding: "11px 13px",
    borderRadius: "9px",
    fontWeight: "800",
    fontSize: "12px",
  },

  failedMessage: {
    width: "100%",
    boxSizing: "border-box",
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    color: "#be123c",
    padding: "11px 13px",
    borderRadius: "9px",
    fontWeight: "800",
    fontSize: "12px",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 10px",
    borderRadius: "8px",
    fontWeight: "800",
    fontSize: "10px",
    whiteSpace: "nowrap",
  },

  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "currentColor",
  },

  pendingBadge: {
    background: "#fff7ed",
    color: "#c2410c",
  },

  activeBadge: {
    background: "#eff6ff",
    color: "#1d4ed8",
  },

  completedBadge: {
    background: "#ecfdf5",
    color: "#15803d",
  },

  failedBadge: {
    background: "#fff1f2",
    color: "#be123c",
  },

  emptyState: {
    padding: "60px 20px",
    textAlign: "center",
    border: "1px dashed #d9e0ea",
    borderRadius: "14px",
  },

  emptyIcon: {
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    background: "#ecfdf5",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontSize: "22px",
    fontWeight: "900",
  },

  footer: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "12px",
    padding: "5px 0 15px",
    display: "flex",
    justifyContent: "center",
    gap: "8px",
  },
};

export default EmployeeDashboard;

