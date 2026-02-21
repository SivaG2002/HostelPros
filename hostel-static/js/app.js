// ================= API CONFIG =================
const API_URL = "http://localhost:8000/api";

// ================= AUTH FUNCTIONS =================
function login(email, password) {
  return fetch(`${API_URL}/login/login/`, {
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
  window.location.href = "index.html";
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
  const currentPage = window.location.pathname.split("/").pop();
  const user = getUser();

  // 1️⃣ If not logged in → go to login
  if (!user) {
    if (currentPage !== "index.html") {
      window.location.href = "index.html";
    }
    return;
  }

  // 2️⃣ If logged in and on login page → send to correct dashboard
  if (currentPage === "index.html") {
    if (user.role === "admin") {
      window.location.href = "admin-dashboard.html";
    } else {
      window.location.href = "student-dashboard.html";
    }
    return;
  }

  // 3️⃣ Protect admin page
  if (currentPage === "admin-dashboard.html" && user.role !== "admin") {
    window.location.href = "student-dashboard.html";
    return;
  }

  // 4️⃣ Protect student page
  if (currentPage === "student-dashboard.html" && user.role !== "student") {
    window.location.href = "admin-dashboard.html";
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