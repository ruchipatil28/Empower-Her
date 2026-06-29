// EmpowerHer Shared Nav & Footer Manager
document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Toggle Logic
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close menu when clicking links
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  // 2. Set Active Nav Link
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // 3. Dynamic Auth & Portal State
  const authContainer = document.getElementById("nav-auth-container");
  if (authContainer && window.EH_DB) {
    const currentUser = window.EH_DB.getCurrentUser();
    if (currentUser) {
      // Determine dashboard link based on role
      let dashboardUrl = "applications.html"; // Default
      if (currentUser.role === "investor") {
        dashboardUrl = "investor.html";
      } else if (currentUser.role === "admin") {
        dashboardUrl = "admin.html";
      }

      authContainer.innerHTML = `
        <a href="${dashboardUrl}" class="btn-login" style="margin-right: 0.5rem;">Dashboard</a>
        <button id="logoutBtn" class="btn-logout">Logout</button>
      `;

      // Attach logout listener
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          window.EH_DB.logout();
          window.location.href = "index.html";
        });
      }
    }
  }

  // 4. Inject Dynamic Footer (if footer is missing)
  if (!document.querySelector("footer")) {
    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="footer-container">
        <div class="footer-brand">
          <div class="footer-logo">
            <img src="Empower her.png" alt="EmpowerHer Logo">
            <span>EmpowerHer</span>
          </div>
          <p class="footer-desc">Empowering women entrepreneurs across India with accessible, zero-hassle microloans and community support networks.</p>
        </div>
        <div class="footer-links-grid">
          <div class="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="About.html">About Us</a></li>
              <li><a href="Process.html">Our Process</a></li>
              <li><a href="Stories.html">Success Stories</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Portals</h4>
            <ul>
              <li><a href="login.html?role=user">Entrepreneur Portal</a></li>
              <li><a href="login.html?role=investor">Investor Portal</a></li>
              <li><a href="login.html?role=admin">Admin Dashboard</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Contact Info</h4>
            <p>📍 Delhi & Mumbai, India</p>
            <p>✉️ support@empowerher.org</p>
            <p>📞 +91 98765 43210</p>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} EmpowerHer Foundation. All rights reserved.</p>
      </div>
    `;
    document.body.appendChild(footer);
  }
});
