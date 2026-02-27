// ================= API CONFIG =================
const API_URL = "http://localhost:8000/api";

// ================= AUTH FUNCTIONS =================
function login(email, password) {
  // Correct API endpoint: /api/login/ (single "login", not "login/login")
  return fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.role) {
        // Store entire user object
        localStorage.setItem("user", JSON.stringify(data));
        return data;
      } else {
        throw new Error(data.message || "Login failed");
      }
    });
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "/login/";
}

function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function isAuthenticated() {
  return getUser() !== null;
}

function getUserRole() {
  const user = getUser();
  return user ? user.role : null;
}

function getUserId() {
  const user = getUser();
  return user ? user.user_id : null;
}

// ================= SAFE PAGE PROTECTION =================
function checkAuthAndRedirect() {
  const path = window.location.pathname;
  const user = getUser();

  // not logged in → go to login (unless already there)
  if (!user) {
    if (path !== "/login/") {
      window.location.href = "/login/";
    }
    return;
  }

  // logged in & on login page → redirect to correct dashboard
  if (path === "/login/") {
    if (user.role === "admin") {
      window.location.href = "/dashboard/admin_dashboard/";
    } else {
      window.location.href = `/student/dashboard/${user.user_id}/`;
    }
    return;
  }

  // enforce role-specific paths
  if (user.role === "admin" && !path.startsWith("/dashboard/admin_dashboard")) {
    window.location.href = "/dashboard/admin_dashboard/";
    return;
  }
  if (user.role === "student" && !path.startsWith(`/student/dashboard/${user.user_id}`)) {
    window.location.href = `/student/dashboard/${user.user_id}/`;
    return;
  }
}

// ================= API FUNCTIONS =================
function fetchDashboardData() {
  return fetch(`${API_URL}/dashboard/admin_dashboard/`)
    .then(res => res.json())
    .catch(() => null);
}

function fetchStudents() {
  return fetch(`${API_URL}/students/list_all/`)
    .then(res => res.json())
    .catch(() => []);
}

function fetchRooms() {
  return fetch(`${API_URL}/rooms/`)
    .then(res => res.json())
    .catch(() => []);
}

function fetchNotices() {
  return fetch(`${API_URL}/notices/`)
    .then(res => res.json())
    .catch(() => []);
}

function fetchComplaints() {
  return fetch(`${API_URL}/complaints/`)
    .then(res => res.json())
    .catch(() => []);
}

function fetchFees() {
  return fetch(`${API_URL}/fees/`)
    .then(res => res.json())
    .catch(() => []);
}

// ================= UI HELPERS =================
function showError(message, containerId = "error-container") {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `<div class="alert alert-error">${message}</div>`;
  }
}

function showSuccess(message, containerId = "success-container") {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `<div class="alert alert-success">${message}</div>`;
    setTimeout(() => (container.innerHTML = ""), 3000);
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);
}

// ================= NAVIGATION =================
function setActiveNavLink(pageName) {
  document.querySelectorAll(".navbar-menu a").forEach(link => {
    link.classList.remove("active");
  });

  const currentLink = document.querySelector(
    `.navbar-menu a[data-page="${pageName}"]`
  );

  if (currentLink) {
    currentLink.classList.add("active");
  }
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-IN", options);
}


function fetchLatestNotice() {
  return fetch(`${API_URL}/notices/latest/`)
    .then(res => res.json())
    .catch(() => null);
}

function fetchLatestComplaint(userId) {
  return fetch(`${API_URL}/complaints/latest/?user_id=${userId}`)
    .then(res => res.json())
    .catch(() => null);
}



