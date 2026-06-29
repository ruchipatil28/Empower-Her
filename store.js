// EmpowerHer Local Storage DB Store
(function () {
  const DEFAULT_APPLICATIONS = [
    {
      id: "app_seema",
      name: "Seema Devi",
      location: "Rajasthan",
      age: 32,
      funds: 25000,
      idea: "Handicrafts",
      description: "Traditional Rajasthani handicraft business employing local rural women.",
      videoUrl: "uploads/seema_pitch.mp4",
      status: "pending", // pending | verified | funded | rejected
      appliedOn: "12 Sep 2025",
      investorId: null,
      investorName: null
    },
    {
      id: "app_ayesha",
      name: "Ayesha Khan",
      location: "Karnataka",
      age: 28,
      funds: 40000,
      idea: "Dairy Farm Expansion",
      description: "Expanding local dairy farm and purchasing high-yield cows.",
      videoUrl: "uploads/ayesha_pitch.mp4",
      status: "funded",
      appliedOn: "05 Aug 2025",
      investorId: "investor_b",
      investorName: "Investor B"
    },
    {
      id: "app_kavita",
      name: "Kavita Patil",
      location: "Maharashtra",
      age: 30,
      funds: 30000,
      idea: "Vegetable Supply",
      description: "Transitioning from vegetable stall to wholesale regional distributor.",
      videoUrl: "uploads/kavita_pitch.mp4",
      status: "funded",
      appliedOn: "18 Jul 2025",
      investorId: "investor_c",
      investorName: "Investor C"
    },
    {
      id: "app_meena",
      name: "Meena Kumari",
      location: "Uttar Pradesh",
      age: 26,
      funds: 15000,
      idea: "Tailoring Shop",
      description: "Purchase stitching machines to start a local boutique and train girls.",
      videoUrl: "uploads/meena_pitch.mp4",
      status: "verified", // verified by admin, ready for investor funding
      appliedOn: "28 Sep 2025",
      investorId: null,
      investorName: null
    }
  ];

  const DEFAULT_INVESTORS = [
    { id: "investor_a", name: "Anita Sharma", focus: "Handicrafts & Rural Artisans" },
    { id: "investor_b", name: "Vikram Nair", focus: "Agriculture & Dairy Farming" },
    { id: "investor_c", name: "Priya Menon", focus: "Fashion, Tailoring & Retail" }
  ];

  // New repayment schema — one record per funded loan
  const DEFAULT_REPAYMENTS = [
    {
      id: "repay_ayesha",
      applicantName: "Ayesha Khan",
      ventureName: "Dairy Farm Expansion",
      investorName: "Vikram Nair",
      amount: 40000,
      interest: 1600,         // 4% flat
      paid: 4167,             // one installment already paid
      installments: [
        {
          date: "31 Aug 2025",
          desc: "Installment Repayment",
          debit: "-",
          credit: 4167,
          balance: 37433
        }
      ]
    },
    {
      id: "repay_kavita",
      applicantName: "Kavita Patil",
      ventureName: "Vegetable Supply",
      investorName: "Priya Menon",
      amount: 30000,
      interest: 1200,
      paid: 0,
      installments: []
    }
  ];

  const DEFAULT_USERS = [
    { email: "user@example.com",     name: "Sania",        role: "user" },
    { email: "investor@example.com", name: "Anita Sharma", role: "investor" },
    { email: "admin@example.com",    name: "System Admin", role: "admin" }
  ];

  // ── Helpers ────────────────────────────────────────────────────────────────
  function get(key, defaultValue) {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  }
  function set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  // ── Initial seeding (runs once) ────────────────────────────────────────────
  if (!localStorage.getItem("eh_seeded_v2")) {
    set("eh_applications", DEFAULT_APPLICATIONS);
    set("eh_investors",    DEFAULT_INVESTORS);
    set("eh_repayments",   DEFAULT_REPAYMENTS);
    set("eh_users",        DEFAULT_USERS);
    set("eh_seeded_v2",    true);
    // Clear old seed flag so fresh data is loaded
    localStorage.removeItem("eh_seeded");
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  window.EH_DB = {
    // Applications
    getApplications:       () => get("eh_applications", []),
    saveApplications:      (apps) => set("eh_applications", apps),
    addApplication: (app) => {
      const apps = get("eh_applications", []);
      app.id       = "app_" + Date.now();
      app.status   = "pending";
      app.appliedOn = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      apps.push(app);
      set("eh_applications", apps);
      return app;
    },
    updateApplicationStatus: (id, status) => {
      const apps = get("eh_applications", []);
      const idx  = apps.findIndex(a => a.id === id);
      if (idx !== -1) { apps[idx].status = status; set("eh_applications", apps); }
    },
    fundApplication: (id, investorName) => {
      const apps = get("eh_applications", []);
      const idx  = apps.findIndex(a => a.id === id);
      if (idx !== -1) {
        apps[idx].status       = "funded";
        apps[idx].investorName = investorName;
        set("eh_applications", apps);
      }
    },

    // Investors list (for entrepreneur portal sidebar)
    getInvestors: () => get("eh_investors", []),

    // Repayment loan records
    getRepayments:  () => get("eh_repayments", []),
    saveRepayments: (r)  => set("eh_repayments", r),
    addRepayment: (record) => {
      const repays = get("eh_repayments", []);
      repays.push(record);
      set("eh_repayments", repays);
    },

    // Users
    getUsers:       () => get("eh_users", []),
    addUser: (user) => {
      const users = get("eh_users", []);
      users.push(user);
      set("eh_users", users);
    },
    getCurrentUser: () => get("eh_current_user", null),
    setCurrentUser: (user) => set("eh_current_user", user),
    logout:         () => localStorage.removeItem("eh_current_user"),

    // Utility: reset all data (useful for dev)
    resetAll: () => {
      ["eh_applications","eh_investors","eh_repayments","eh_users","eh_current_user","eh_seeded_v2"].forEach(k => localStorage.removeItem(k));
      location.reload();
    }
  };
})();
