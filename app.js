
(function () {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const byId = id => document.getElementById(id);

  let currentPage = "home";
  let authMode = "login";
  let archiveDate = new Date();
  let selectedPracticeCategory = "all";
  let initialized = false;

  const storage = () => window.DazurioStorage;
  const effects = () => window.DazurioEffects;
  const game = () => window.DazurioGame;

  function tickDailyClock() {
    const output = document.getElementById("dailyCountdown");
    if (!output) return;
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);
    const remaining = Math.max(0, tomorrow.getTime() - now.getTime());
    const hours = String(Math.floor(remaining / 3600000)).padStart(2, "0");
    const minutes = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
    output.textContent = hours + ":" + minutes + ":" + seconds;
    output.setAttribute("datetime", new Date(now.getTime() + remaining).toISOString());
  }
  function startDailyClock() {
    tickDailyClock();
    if (window.__dazurioDailyClock) clearInterval(window.__dazurioDailyClock);
    window.__dazurioDailyClock = window.setInterval(tickDailyClock, 1000);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startDailyClock, { once: true });
  } else {
    startDailyClock();
  }
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tickDailyClock();
  });

  function setText(id, value) {
    const element = byId(id);
    if (element) element.textContent = String(value ?? "");
  }

  function notify(message, type = "info") {
    if (effects()?.showToast) {
      effects().showToast(message, type);
    } else {
      console.log("[DAZURIO]", message);
    }
  }

  function safeStorage() {
    if (!storage()) {
      notify("Ukládání není dostupné. Zkus obnovit stránku.", "error");
      return false;
    }
    return true;
  }

  // NAVIGACE

  function getNavigationTarget(element) {
    if (!element) return null;

    const dataTarget =
      element.dataset.page ||
      element.dataset.nav ||
      element.dataset.target;

    if (dataTarget) {
      return dataTarget.replace(/^page-/, "");
    }

    const href = element.getAttribute("href");

    if (href?.startsWith("#page-")) {
      return href.replace("#page-", "");
    }

    const text = (element.textContent || "").trim().toLowerCase();

    const map = {
      home: "home",
      "how to play": "how",
      "jak hrát": "how",
      about: "about",
      faq: "faq",
      archive: "archive",
      questions: "questions",
      leaderboard: "leaderboard",
      profile: "profile",
      settings: "settings",
      practice: "practice"
    };

    return map[text] || null;
  }

  function navigateTo(page) {
    const target = String(page || "home")
      .replace(/^#/, "")
      .replace(/^page-/, "");

    const accountPages = new Set([
      "practice", "questions", "leaderboard", "profile", "plus"
    ]);

    // Archive and preferences are intentionally public for guest players.
    // Keep this allow-list explicit so future account gates cannot lock them accidentally.
    const publicPages = new Set(["home", "how", "about", "faq", "archive", "settings", "game", "results"]);
    if (!publicPages.has(target) && !accountPages.has(target)) {
      console.warn("DAZURIO: Unknown page target:", target);
      return;
    }

    if (accountPages.has(target) && !hasAccount()) {
      openAuthModal("register");
      notify("Create a free account to unlock this section.", "info");
      return;
    }

    const pageElement = byId("page-" + target);

    if (!pageElement) {
      console.warn("DAZURIO: Neznámá stránka:", target);
      return;
    }

    const previous = byId("page-" + currentPage);

    if (previous && previous !== pageElement) {
      previous.classList.remove("active");
    }

    pageElement.classList.add("active");

    if (effects()?.transitionPage) {
      effects().transitionPage(previous, pageElement);
    }

    currentPage = target;
    if (target === "game" || target === "results") {
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (window.location.hash !== "#page-" + target) {
      history.replaceState(null, "", "#page-" + target);
    }

    $$(".main-nav [data-page], .main-nav [data-nav], .main-nav a").forEach(item => {
      const destination = getNavigationTarget(item);
      const active = destination === target;

      item.classList.toggle("active", active);

      if (active) {
        item.setAttribute("aria-current", "page");
      } else {
        item.removeAttribute("aria-current");
      }
    });

    closeMobileMenu();

    if (target === "profile") renderProfile();
    if (target === "leaderboard") renderLeaderboard();
    if (target === "archive") renderArchive();
    if (target === "questions") renderQuestionLibrary();
    if (target === "settings") loadSettings();
    if (target === "home") refreshHome();

    if (window.location.hash !== "#page-" + target) {
      history.replaceState(null, "", "#page-" + target);
    }
  }

  // MOBILNÍ MENU

  function closeMobileMenu() {
    const menu = byId("mobileMenu") || $(".main-nav");
    const button = byId("mobileMenuButton");

    menu?.classList.remove("open", "active");

    if (button) {
      button.setAttribute("aria-expanded", "false");
    }
  }

  function toggleMobileMenu() {
    const menu = byId("mobileMenu") || $(".main-nav");
    const button = byId("mobileMenuButton");

    if (!menu) return;

    const open = !menu.classList.contains("open");

    menu.classList.toggle("open", open);

    if (button) {
      button.setAttribute("aria-expanded", String(open));
    }
  }

  // PŘIHLÁŠENÍ A REGISTRACE

  function openAuthModal(mode = "login") {
    if (!safeStorage()) return;

    authMode = mode === "register" ? "register" : "login";

    const modal = byId("authModal");

    if (!modal) {
      notify("Přihlašovací okno nebylo nalezeno.", "error");
      return;
    }

    modal.classList.add("open", "active");
    modal.setAttribute("aria-hidden", "false");

    const title = byId("authTitle");
    const submit = byId("authSubmitButton");
    const error = byId("authError");

    if (title) {
      title.textContent = authMode === "register"
        ? "Create your account"
        : "Welcome back";
    }

    if (submit) {
      submit.textContent = authMode === "register"
        ? "CREATE ACCOUNT"
        : "SIGN IN";
    }

    if (error) {
      error.textContent = "";
      error.hidden = true;
    }

    $$(".auth-tab").forEach(tab => {
      const active = tab.dataset.authTab === authMode;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    window.setTimeout(() => {
      byId("authUsername")?.focus();
    }, 100);
  }

  function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove("open", "active");
    modal.setAttribute("aria-hidden", "true");
  }

  function closeAuthModal() {
    closeModal(byId("authModal"));
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();

    if (!safeStorage()) return;

    const username = byId("authUsername")?.value.trim() || "";
    const password = byId("authPassword")?.value || "";

    const submit = byId("authSubmitButton");
    const errorElement = byId("authError");

    if (submit) submit.disabled = true;

    if (errorElement) {
      errorElement.hidden = true;
      errorElement.textContent = "";
    }

    try {
      if (authMode === "register") {
        await storage().register(username, password);

        notify("Your DAZURIO account is ready. Welcome!", "success");
      } else {
        await storage().login(username, password);

        notify("Welcome back!", "success");
      }

      closeAuthModal();
      updateAccountControls();
      refreshHome();
      updateDailyCountdown();
      renderProfile();
    } catch (error) {
      const message = error?.message || "Something went wrong.";

      if (errorElement) {
        errorElement.textContent = message;
        errorElement.hidden = false;
      } else {
        notify(message, "error");
      }
    } finally {
      if (submit) submit.disabled = false;
    }
  }

  function switchAuthMode(mode) {
    openAuthModal(mode);
  }

  // ÚČET

  function updateAccountControls() {
    if (!safeStorage()) return;

    const user = storage().getCurrentUser();
    const profileButton = byId("profileButton");

    if (profileButton) {
      const username = byId("headerUsername");
      const avatar = byId("headerAvatar");

      if (username) {
        username.textContent = user
          ? user.displayName || user.username
          : "Profile";
      } else if (!avatar) {
        profileButton.textContent = user
          ? user.displayName || user.username
          : "Profile";
      }

      if (avatar) {
        avatar.textContent = user
          ? (user.displayName || user.username).charAt(0).toUpperCase()
          : "👤";
      }
    }

    $$("[data-requires-login]").forEach(element => {
      element.hidden = !user;
    });

    $$("[data-requires-logout]").forEach(element => {
      element.hidden = Boolean(user);
    });

    const logout = byId("profileLogoutButton");
    if (logout) logout.hidden = !user;
  }

  function handleLogout() {
    if (!safeStorage()) return;

    storage().logout();

    game()?.abandonGame?.();

    updateAccountControls();
    refreshHome();
    renderProfile();
    navigateTo("home");

    notify("You have been signed out.", "success");
  }

  // DOMÁCÍ STRÁNKA


  function localDateKey(date = new Date()) {
    return [date.getFullYear(), String(date.getMonth()+1).padStart(2,"0"), String(date.getDate()).padStart(2,"0")].join("-");
  }
  function dailyCompletionKey(key = localDateKey()) { return "dazurio_daily_completed_" + key; }
  function hasCompletedDaily(key = localDateKey()) {
    try {
      if (localStorage.getItem(dailyCompletionKey(key)) === "1") return true;
      if (hasAccount()) return (storage().getHistory() || []).some(record => record.mode === "daily" && record.date === key);
    } catch (error) { console.warn("Daily status unavailable", error); }
    return false;
  }
  function getGuestStats() {
    try { return JSON.parse(localStorage.getItem("dazurio_guest_stats_v1") || '{"streak":0,"xp":0,"gamesPlayed":0,"level":1,"lastPlayedDate":null}'); }
    catch (_) { return {streak:0,xp:0,gamesPlayed:0,level:1,lastPlayedDate:null}; }
  }
  function saveGuestDaily(summary) {
    if (!summary || summary.mode !== "daily") return;
    const today = localDateKey();
    try {
      const stats = getGuestStats();
      if (stats.lastPlayedDate !== today) {
        const previous = stats.lastPlayedDate ? new Date(stats.lastPlayedDate + "T12:00:00") : null;
        const current = new Date(today + "T12:00:00");
        const gap = previous ? Math.round((current - previous) / 86400000) : 0;
        stats.streak = gap === 1 ? (stats.streak || 0) + 1 : 1;
        stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
        stats.xp = (stats.xp || 0) + (summary.score || 0);
        stats.level = Math.floor(stats.xp / 250) + 1;
        stats.lastPlayedDate = today;
        localStorage.setItem("dazurio_guest_stats_v1", JSON.stringify(stats));
      }
      localStorage.setItem(dailyCompletionKey(today), "1");
    } catch (error) { console.warn("Guest progress save failed", error); }
  }
  function updateDailyCountdown() {
    const now = new Date(), tomorrow = new Date(now);
    tomorrow.setHours(24,0,0,0);
    const left = Math.max(0, tomorrow - now);
    const hh = String(Math.floor(left/3600000)).padStart(2,"0");
    const mm = String(Math.floor((left%3600000)/60000)).padStart(2,"0");
    const ss = String(Math.floor((left%60000)/1000)).padStart(2,"0");
    setText("dailyCountdown", hh + ":" + mm + ":" + ss);
    const done = hasCompletedDaily();
    setText("dailyStatusLabel", done ? "COMPLETED TODAY" : "NEW CHALLENGE IN");
    const button = byId("playTodayButton");
    if (button) {
      button.disabled = done;
      const label = button.querySelector("span");
      if (label) label.textContent = done ? "DAILY COMPLETED" : "PLAY TODAY";
    }
    setText("dailyStatusText", done ? "Today's challenge is complete. Come back tomorrow for seven new questions." : "Your seven questions are waiting. A fresh set arrives every day.");
  }
  function refreshHome() {
    if (!safeStorage()) return;

    const user = storage().getCurrentUser();

    const stats = user?.stats || getGuestStats();

    const xp = Math.max(0, Number(stats.xp) || 0);
    const level = Math.floor(xp / 250) + 1;
    const currentLevelXP = xp % 250;

    // XP is the single source of truth. Never trust a stale saved level field.
    if (user?.stats && user.stats.level !== level) user.stats.level = level;
    if (!user) {
      const guest = getGuestStats();
      if (guest.level !== level) {
        guest.level = level;
        try { localStorage.setItem("dazurio_guest_stats_v1", JSON.stringify(guest)); } catch (_) {}
      }
    }

    setText("homeStreak", stats.streak || 0);
    setText("homeXP", xp.toLocaleString());
    setText("homeGames", stats.gamesPlayed || 0);
    setText("homeLevel", level);
    setText("progressLevel", level);
    const percentage = Math.min(
      100,
      Math.max(0, currentLevelXP / 250 * 100)
    );

    const progress = byId("xpProgressFill");
    if (progress) {
      progress.style.width = percentage + "%";
    }

    setText("progressXP", `${currentLevelXP} / 250 XP`);
    setText("nextLevelXP", `${250 - currentLevelXP} XP TO NEXT LEVEL`);

    updateDailyCountdown();
  }

  // SPUŠTĚNÍ HER

  function hasAccount() {
    return Boolean(safeStorage() && storage().getCurrentUser());
  }

  function requireAccount(feature = "this feature") {
    if (hasAccount()) return true;
    openAuthModal("register");
    notify(`Create a free account to unlock ${feature}.`, "info");
    return false;
  }

  function requireLogin() { return requireAccount("this feature"); }

  function startDaily() {
    if (!safeStorage()) return;
    if (hasCompletedDaily()) {
      notify("Dnešní výzvu už máš dokončenou. Nová bude po půlnoci.", "info");
      updateDailyCountdown();
      return;
    }
    game()?.startGame("daily");
  }

  function startEndless() {
    if (!requireAccount("Endless mode")) return;
    game()?.startGame("endless");
  }

  function startPractice() {
    if (!requireAccount("Practice mode")) return;

    const categorySelect = byId("practiceCategory");
    const countSelect = byId("practiceCount");

    selectedPracticeCategory = categorySelect
      ? categorySelect.value
      : selectedPracticeCategory;

    const count = countSelect
      ? Number(countSelect.value)
      : 7;

    game()?.startGame("practice", {
      category: selectedPracticeCategory === "all"
        ? null
        : selectedPracticeCategory,
      count: Number.isFinite(count) ? count : 7
    });
  }

  function startArchiveGame(date) {
    game()?.startGame("archive", { date });
  }

  // PROFIL

  function renderProfile() {
    if (!safeStorage()) return;

    const user = storage().getCurrentUser();

    if (!user) {
      setText("profileAvatar", "G");
      setText("profileName", "Guest");
      setText("profileJoined", "Sign in to see your profile");
      setText("profileXP", "0");
      setText("profileLevel", "1");
      setText("profileStreak", "0");
      setText("profileGames", "0");
      setText("profileBestScore", "0");
      setText("profileBestStreak", "0");
      setText("profileAccuracy", "0%");

      renderHistory([]);
      return;
    }

    const stats = user.stats || {};

    setText("profileName", user.displayName || user.username);
    setText("profileJoined", user.createdAt || "");
    setText("profileXP", (stats.xp || 0).toLocaleString());
    setText("profileLevel", Math.floor(Math.max(0, Number(stats.xp) || 0) / 250) + 1);
    setText("profileStreak", stats.streak || 0);
    setText("profileGames", stats.gamesPlayed || 0);
    setText("profileBestScore", (stats.bestScore || 0).toLocaleString());
    setText("profileBestStreak", stats.bestStreak || 0);
    setText("profileAccuracy", (stats.averageAccuracy || 0) + "%");
    setText("profileAvatar", (user.displayName || user.username || "P").charAt(0).toUpperCase());
    const profileProgress = byId("profileProgressFill");
    const profileLevelXP = (stats.xp || 0) % 250;
    if (profileProgress) profileProgress.style.width = (profileLevelXP / 250 * 100) + "%";
    setText("profileProgressText", profileLevelXP + " / 250 XP");

    renderHistory(storage().getHistory(8) || []);
  }

  function renderHistory(history) {
    const container = byId("profileHistory");
    if (!container) return;

    container.replaceChildren();

    if (!history.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "Your completed games will appear here.";
      container.appendChild(empty);
      return;
    }

    history.forEach(record => {
      const row = document.createElement("div");
      row.className = "history-row";

      const details = document.createElement("div");

      const mode = document.createElement("strong");
      mode.textContent = String(record.mode || "Game").toUpperCase();

      const date = document.createElement("span");
      date.textContent = record.date || record.completedAt || "";

      details.append(mode, date);

      const score = document.createElement("strong");
      score.textContent =
        Number(record.score || 0).toLocaleString() + " pts";

      row.append(details, score);
      container.appendChild(row);
    });
  }

  function openEditProfile() {
    if (!requireLogin()) return;

    const user = storage().getCurrentUser();
    const modal = byId("editProfileModal");

    if (!modal) return;

    const username = byId("editUsername");

    if (username) {
      username.value = user.username || "";
    }

    modal.classList.add("open", "active");
    modal.setAttribute("aria-hidden", "false");
  }

  function saveEditedProfile(event) {
    event?.preventDefault();

    try {
      const username = byId("editUsername")?.value.trim();

      storage().updateProfile({
        username: username || undefined
      });

      closeModal(byId("editProfileModal"));
      updateAccountControls();
      renderProfile();

      notify("Your profile has been updated.", "success");
    } catch (error) {
      notify(error.message || "Profile update failed.", "error");
    }
  }

  // ŽEBŘÍČEK

  function renderLeaderboard(period = "all") {
    if (!safeStorage()) return;

    const container = byId("leaderboardRows");
    if (!container) return;

    const rows = storage().getLeaderboard(period) || [];

    container.replaceChildren();

    if (!rows.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent =
        "No local players yet. Create an account and play a game!";

      container.appendChild(empty);
      return;
    }

    rows.forEach((player, index) => {
      const row = document.createElement("div");
      row.className = "leaderboard-row";

      if (player.isCurrentUser) {
        row.classList.add("is-current-user");
      }

      const rank = document.createElement("span");
      rank.className = "leaderboard-rank";
      rank.textContent = "#" + (index + 1);

      const name = document.createElement("span");
      name.className = "leaderboard-name";
      name.textContent = player.displayName || player.username || "Player";

      const level = document.createElement("span");
      level.className = "leaderboard-level";
      level.textContent = "LVL " + (player.level || 1);

      const score = document.createElement("strong");
      score.className = "leaderboard-score";
      score.textContent =
        Number(player.score || 0).toLocaleString();

      row.append(rank, name, level, score);
      container.appendChild(row);
    });
  }

  // ARCHIV

  function getTodayKey() {
    const date = new Date();

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  }

  function renderArchive() {
    const title = byId("archiveMonthLabel");
    const grid = byId("archiveCalendar");

    if (!grid) return;

    const year = archiveDate.getFullYear();
    const month = archiveDate.getMonth();

    if (title) {
      title.textContent = archiveDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      });
    }

    grid.replaceChildren();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const offset = (firstDay.getDay() + 6) % 7;

    // Dny v týdnu jsou v HTML mimo kalendář.
    for (let i = 0; i < offset; i++) {
      const blank = document.createElement("span");
      blank.className = "calendar-empty";
      grid.appendChild(blank);
    }

    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);

      const dateString = [
        year,
        String(month + 1).padStart(2, "0"),
        String(day).padStart(2, "0")
      ].join("-");

      const button = document.createElement("button");
      button.type = "button";
      button.className = "calendar-day";
      button.textContent = day;

      if (dateString === getTodayKey()) {
        button.classList.add("is-today");
      }

      if (date > todayStart) {
        button.disabled = true;
        button.classList.add("is-disabled");
      } else {
        button.addEventListener("click", () => {
          startArchiveGame(dateString);
        });
      }

      grid.appendChild(button);
    }
  }

  function changeArchiveMonth(amount) {
    archiveDate = new Date(
      archiveDate.getFullYear(),
      archiveDate.getMonth() + amount,
      1
    );

    renderArchive();
  }

  // KNIHOVNA OTÁZEK

  function renderQuestionLibrary() {
    const categories = window.DAZURIO_CATEGORIES || [];
    const container = byId("categoryGrid");
    const database = window.QuestionDatabase;

    // Keep the practice dropdown aligned with the actual question categories.
    const practiceSelect = byId("practiceCategory");
    if (practiceSelect) {
      const currentValue = selectedPracticeCategory || practiceSelect.value || "all";
      practiceSelect.replaceChildren();
      const allOption = document.createElement("option");
      allOption.value = "all";
      allOption.textContent = "All categories";
      practiceSelect.appendChild(allOption);
      categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name || category.id;
        practiceSelect.appendChild(option);
      });
      practiceSelect.value = categories.some(category => category.id === currentValue)
        ? currentValue
        : "all";
      selectedPracticeCategory = practiceSelect.value;
    }

    if (container) {
      container.replaceChildren();

      categories.forEach(category => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "category-card";

        const icon = document.createElement("span");
        icon.className = "category-icon";
        icon.textContent = category.icon || "✦";

        const name = document.createElement("strong");
        name.textContent = category.name || category.id;

        const description = document.createElement("span");
        description.textContent = category.description || "";

        const count = database?.getCategoryCount
          ? database.getCategoryCount(category.id)
          : 0;

        const total = document.createElement("small");
        total.textContent = count + " questions";

        button.append(icon, name, description, total);

        button.addEventListener("click", () => {
          selectedPracticeCategory = category.id;

          const select = byId("practiceCategory");
          if (select) select.value = category.id;

          navigateTo("practice");
        });

        container.appendChild(button);
      });
    }

    const library = byId("questionLibraryList");
    if (library && database?.getAll) {
      library.replaceChildren();
      database.getAll().forEach(question => {
        const item = document.createElement("details");
        item.className = "library-question";
        const summary = document.createElement("summary");
        summary.textContent = question.question;
        const detail = document.createElement("p");
        detail.textContent = (question.description || "") + " Answer: " + question.answer + (question.unit ? " " + question.unit : "") + ".";
        const meta = document.createElement("small");
        meta.textContent = (question.category || "General") + " · " + (question.difficulty || "mixed");
        item.append(summary, detail, meta);
        library.appendChild(item);
      });
    }

    const totalElement = byId("questionCountLabel");

    if (totalElement && database?.getCount) {
      totalElement.textContent = database.getCount();
    }
  }

  // Guest preferences are stored on this device, independently of accounts.
  const GUEST_SETTINGS_KEY = "dazurio_guest_settings_v1";

  function getGuestSettings() {
    const defaults = { darkMode: false, sound: true, animations: true, language: "en", keyboardHints: true, numberFormat: "grouped" };
    try {
      const saved = JSON.parse(localStorage.getItem(GUEST_SETTINGS_KEY) || "{}");
      return Object.assign(defaults, saved && typeof saved === "object" ? saved : {});
    } catch (_) {
      return defaults;
    }
  }

  function saveGuestSettings(settings) {
    try {
      localStorage.setItem(GUEST_SETTINGS_KEY, JSON.stringify(settings));
    } catch (_) {
      notify("Could not save preferences on this device.", "warning");
    }
  }

  // NASTAVENÍ

  function setToggle(id, value) {
    const element = byId(id);
    if (!element) return;

    if (element.type === "checkbox") {
      element.checked = Boolean(value);
    } else {
      element.setAttribute("aria-pressed", String(Boolean(value)));
      element.classList.toggle("active", Boolean(value));
      element.classList.toggle("is-active", Boolean(value));
    }
  }

  function loadSettings() {
    const settings = hasAccount()
      ? (storage().getSettings() || {})
      : getGuestSettings();

    setToggle("themeToggle", settings.darkMode);
    setToggle("soundToggle", settings.sound !== false);
    setToggle("animationToggle", settings.animations !== false);

    const language = byId("languageSelect");
    if (language) language.value = settings.language || "en";
    setToggle("keyboardHintsToggle", settings.keyboardHints !== false);
    const numberFormat = byId("numberFormatSelect");
    if (numberFormat) numberFormat.value = settings.numberFormat || "grouped";
    applySettings(settings);
    applyLanguage(settings.language || "en");
  }

  function applySettings(settings = {}) {
    document.body.classList.toggle(
      "dark-mode",
      Boolean(settings.darkMode)
    );

    effects()?.setSoundEnabled?.(settings.sound !== false);
    effects()?.setAnimationsEnabled?.(settings.animations !== false);

    setToggle("themeToggle", settings.darkMode);
    setToggle("soundToggle", settings.sound !== false);
    setToggle("animationToggle", settings.animations !== false);
    setToggle("keyboardHintsToggle", settings.keyboardHints !== false);
    applyLanguage(settings.language || "en");
  }

  function applyLanguage(language) {
    const cs = language === "cs";
    const dictionary = {
      "Home":"Domů","How to play":"Jak hrát","About":"O nás","FAQ":"Časté dotazy","Archive":"Archiv","Questions":"Otázky","Leaderboard":"Žebříček","Profile":"Profil","Settings":"Nastavení","Log in":"Přihlásit se","Sign in":"Přihlásit se",
      "DAY STREAK":"DENNÍ SÉRIE","TOTAL XP":"CELKEM XP","GAMES PLAYED":"ODEHRANÉ HRY","PLAYER LEVEL":"ÚROVEŇ HRÁČE","Ready when you are.":"Jsi připraven?","A NEW DAY, A NEW CHALLENGE":"NOVÝ DEN, NOVÁ VÝZVA",
      "SIMPLE TO LEARN":"JEDNODUCHÉ NAUČENÍ","How to play.":"Jak hrát.","It's easy. Getting close is the tricky part.":"Je to snadné. Těžké je trefit se co nejblíž.","GOT IT — LET'S PLAY":"ROZUMÍM — POJĎME HRÁT",
      "A GAME FOR CURIOUS MINDS":"HRA PRO ZVÍDAVÉ HLAVY","Small questions.":"Malé otázky.","Big discoveries":"Velká poznání","GOOD TO KNOW":"DOBRÉ VĚDĚT","Questions?":"Otázky?","We've got answers.":"Máme odpovědi.",
      "MAKE IT YOURS":"PŘIZPŮSOB SI HRU","Settings.":"Nastavení.","Dark mode":"Tmavý režim","Change the appearance of DAZURIO.":"Změň vzhled DAZURIO.","Sound effects":"Zvukové efekty","Enable or disable game sounds.":"Zapni nebo vypni zvuky hry.",
      "Animations":"Animace","Enable or reduce visual effects.":"Zapni nebo omez vizuální efekty.","Language":"Jazyk","Interface language.":"Jazyk rozhraní.","Keyboard shortcuts":"Klávesové zkratky","Press Enter to continue after answering.":"Enterem pokračuješ po odeslání odpovědi.",
      "Number format":"Formát čísel","Choose how large numbers are displayed.":"Zvol, jak zobrazovat velká čísla.","Export data":"Export dat","Reset game data":"Resetovat herní data","EXPORT":"EXPORTOVAT","RESET":"RESETOVAT",
      "YOUR RESULT":"TVŮJ VÝSLEDEK","YOUR GUESS":"TVŮJ TIP","ACTUAL ANSWER":"SPRÁVNÁ ODPOVĚĎ","DIFFERENCE":"ROZDÍL","NEXT QUESTION":"DALŠÍ OTÁZKA","LOCK IT IN":"POTVRDIT TIP","TIME REMAINING":"ZBÝVAJÍCÍ ČAS","Trust your instincts.":"Věř svému odhadu.",
      "THAT'S A WRAP":"HOTOVO","Look how far":"Podívej, jak daleko","you've come":"ses dostal","Your challenge is complete.":"Tvoje výzva je dokončena.","YOUR FINAL SCORE":"TVÉ CELKOVÉ SKÓRE","POINTS":"BODY",
      "Read the question.":"Přečti si otázku.","Make your guess.":"Zadej svůj tip.","Get as close as possible.":"Zkus se trefit co nejblíž.","Build your streak.":"Buduj svou sérii.",
      "Each question asks you to estimate a real-world number or value.":"Každá otázka chce odhad skutečného čísla nebo hodnoty.","Enter your best estimate. You have 25 seconds for each question.":"Zadej svůj nejlepší odhad. Na každou otázku máš 25 sekund.","The closer your answer, the more points you earn.":"Čím blíž budeš, tím více bodů získáš.","Come back every day, collect XP and improve your personal record.":"Vracej se každý den, sbírej XP a překonávej své rekordy.",
      "Type your best guess...":"Napiš svůj nejlepší odhad...","CONTINUE AS GUEST":"POKRAČOVAT JAKO HOST","Create your account":"Vytvořit účet","Welcome back":"Vítej zpět","CREATE ACCOUNT":"VYTVOŘIT ÚČET","SIGN IN":"PŘIHLÁSIT SE",
      "Your journey starts here.":"Tvoje cesta začíná tady.","Create a local profile to keep track of your progress.":"Vytvoř si profil a sleduj svůj postup.","USERNAME":"UŽIVATELSKÉ JMÉNO","PASSWORD":"HESLO","At least 4 characters":"Alespoň 4 znaky","Your username":"Tvé uživatelské jméno",
      "DAILY CHALLENGE":"DENNÍ VÝZVA","Daily challenge":"Denní výzva","Endless mode":"Nekonečný režim","Practice mode":"Trénink","Daily archive":"Archiv výzev","See how you compare.":"Podívej se, jak si vedeš.",
      "Category":"Kategorie","All categories":"Všechny kategorie","Start practice":"Spustit trénink","No answer":"Bez odpovědi","Great estimate!":"Skvělý odhad!","Good try!":"Dobrý pokus!","Not quite this time":"Tentokrát to nevyšlo","Time is up!":"Čas vypršel!"
    };
    const translate = value => {
      const key = String(value || "").trim();
      return cs && dictionary[key] ? dictionary[key] : key;
    };
    try {
      const textNodes = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      textNodes.forEach(textNode => {
        if (!textNode.__dazOriginalText) textNode.__dazOriginalText = textNode.nodeValue || "";
        try {
          const originalValue = textNode.__dazOriginalText;
          if (!cs) { textNode.nodeValue = originalValue; return; }
          const key = originalValue.trim();
          const translated = dictionary[key];
          if (!translated) { textNode.nodeValue = originalValue; return; }
          const leadingLength = originalValue.length - originalValue.trimStart().length;
          const trailingLength = originalValue.length - originalValue.trimEnd().length;
          textNode.nodeValue = originalValue.slice(0, leadingLength) + translated +
            (trailingLength ? originalValue.slice(originalValue.length - trailingLength) : "");
        } catch (nodeError) {
          console.debug("DAZURIO skipped one untranslatable text node:", nodeError);
        }
      });
    } catch (translationError) {
      console.warn("DAZURIO language update skipped a text node:", translationError);
    }
    try { document.querySelectorAll("[placeholder],[aria-label],[title]").forEach(el => {
      ["placeholder","aria-label","title"].forEach(attr => {
        const original = el.dataset["i18n"+attr] || el.getAttribute(attr);
        if (!el.dataset["i18n"+attr]) el.dataset["i18n"+attr] = original;
        const value = translate(original);
        if (value !== original) el.setAttribute(attr, value);
        else if (!cs) el.setAttribute(attr, original);
      });
    }); } catch (attributeTranslationError) { console.warn("DAZURIO attribute translation skipped:", attributeTranslationError); }
    document.documentElement.lang = cs ? "cs" : "en";
  }

  function saveSetting(key, value) {
    try {
      const settings = hasAccount()
        ? (storage().getSettings() || {})
        : getGuestSettings();
      settings[key] = value;

      if (hasAccount()) {
        storage().updateSettings(settings);
      } else {
        saveGuestSettings(settings);
      }
      applySettings(settings);
    } catch (error) {
      notify(error.message || "Settings could not be saved.", "error");
    }
  }

  function bindSettingToggle(id, key) {
    const element = byId(id);
    if (!element) return;

    const handler = () => {
      const current = hasAccount()
        ? (storage().getSettings() || {})
        : getGuestSettings();
      const value = element.type === "checkbox"
        ? element.checked
        : !Boolean(current[key]);

      saveSetting(key, value);
    };

    element.addEventListener(
      element.type === "checkbox" ? "change" : "click",
      handler
    );
  }

  // EXPORT A RESET

  function downloadExport() {
    try {
      const data = storage().exportData();

      const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "dazurio-data-export.json";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => URL.revokeObjectURL(url), 1000);

      notify("Your data export is ready.", "success");
    } catch (error) {
      notify(error.message || "Export failed.", "error");
    }
  }

  function resetData() {
    const confirmed = window.confirm(
      "This will permanently delete all DAZURIO accounts and saved progress in this browser. Continue?"
    );

    if (!confirmed) return;

    try {
      storage().resetAll();
      game()?.abandonGame?.();

      updateAccountControls();
      refreshHome();
      renderProfile();
      navigateTo("home");

      notify("Local DAZURIO data has been reset.", "success");
    } catch (error) {
      notify(error.message || "Reset failed.", "error");
    }
  }

  // DAZURIO PLUS

  function activatePlus() {
    if (!requireLogin()) return;

    const confirmed = window.confirm(
      "Activate the local DAZURIO Plus preview? This is a demo feature, not a real subscription."
    );

    if (!confirmed) return;

    try {
      storage().activatePlus();

      notify("DAZURIO Plus preview activated!", "success");

      const button = byId("activatePlusButton");
      if (button) button.textContent = "PLUS ACTIVATED";
    } catch (error) {
      notify(error.message || "Plus activation failed.", "error");
    }
  }


  function renderResults(summary) {
    const container = byId("resultsAnswers");
    if (!container || !summary) return;
    container.replaceChildren();
    (summary.answers || []).forEach((answer, index) => {
      const row = document.createElement("article");
      row.className = "result-answer-row";
      const number = document.createElement("span");
      number.className = "result-answer-number";
      number.textContent = String(index + 1).padStart(2, "0");
      const details = document.createElement("div");
      details.className = "result-answer-details";
      const question = (window.QuestionDatabase?.getById?.(answer.questionId))?.question || "Question";
      const title = document.createElement("strong");
      title.textContent = question;
      const meta = document.createElement("small");
      meta.textContent = answer.guess === null ? "No answer" : "Your guess: " + answer.guess + " · Actual: " + answer.answer;
      details.append(title, meta);
      const points = document.createElement("b");
      points.textContent = answer.points + " pts";
      row.append(number, details, points);
      container.appendChild(row);
    });
    setText("resultsSubtitle", summary.mode === "daily" ? "Today's challenge is complete." : "Your game is complete.");
  }

  // UDÁLOSTI

  function bindNavigation() {
    document.addEventListener("click", event => {
      const target = event.target.closest(
        "[data-page], [data-nav], [data-target], .main-nav a, .main-nav button"
      );

      if (!target) return;

      const page = getNavigationTarget(target);
      if (!page) return;

      event.preventDefault();
      navigateTo(page);
    });

    byId("mobileMenuButton")?.addEventListener(
      "click",
      toggleMobileMenu
    );
  }

  function bindAuth() {
    byId("authForm")?.addEventListener("submit", handleAuthSubmit);

    $$(".auth-tab[data-auth-tab]").forEach(tab => {
      tab.addEventListener("click", () => {
        switchAuthMode(tab.dataset.authTab);
      });
    });

    $$("[data-open-auth]").forEach(button => {
      button.addEventListener("click", () => {
        openAuthModal(button.dataset.openAuth || "login");
      });
    });

    $$("[data-close-modal]").forEach(button => {
      button.addEventListener("click", () => {
        const modal = button.closest(".modal-backdrop, .modal-card, .modal") ||
          byId("authModal");

        closeModal(modal);
      });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        byId("studioOverlay") && (byId("studioOverlay").hidden = true);
        closeAuthModal();
        closeModal(byId("editProfileModal"));
        closeMobileMenu();
      }
    });

    [byId("authModal"), byId("editProfileModal")].forEach(modal => {
      if (!modal) return;

      modal.addEventListener("click", event => {
        if (event.target === modal) {
          closeModal(modal);
        }
      });
    });

    // Přihlášení a odhlášení se ovládá přes profil.
    byId("profileLogoutButton")?.addEventListener("click", handleLogout);
  }

  let studioErrorCount = 0;
  window.addEventListener("error", () => { studioErrorCount += 1; });
  window.addEventListener("unhandledrejection", () => { studioErrorCount += 1; });
  function refreshStudioDiagnostics() {
    const memory = performance && performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) + " MB" : "Not exposed";
    setText("studioMemory", memory);
    setText("studioErrors", String(studioErrorCount));
    setText("studioRuntime", Math.round(performance.now() / 1000) + " s");
    setText("studioMotion", window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "Reduced" : "Standard");
  }

  function bindMainActions() {
    byId("playTodayButton")?.addEventListener("click", startDaily);

    const studio = byId("studioOverlay");
    const openStudio = () => {
      if (!studio) return;
      setText("studioQuestionCount", window.QuestionDatabase?.getCount?.() ?? window.DAZURIO_QUESTIONS?.length ?? "—");
      setText("studioDate", localDateKey());
      setText("studioDailyStatus", hasCompletedDaily() ? "Completed" : "Available");
      refreshStudioDiagnostics();
      const validation = window.QuestionDatabase?.validate?.();
      setText("studioHealth", validation ? (validation.valid ? "Healthy" : "Needs review") : "Unknown");
      studio.hidden = false;
      byId("studioCloseButton")?.focus();
    };
    const closeStudio = () => { if (studio) studio.hidden = true; };
    const passwordModal = byId("studioPasswordModal");
    const passwordForm = byId("studioPasswordForm");
    const closePasswordModal = () => { if (passwordModal) passwordModal.hidden = true; if (byId("studioPasswordInput")) byId("studioPasswordInput").value = ""; };
    byId("studioOpenButton")?.addEventListener("click", () => { if (passwordModal) { passwordModal.hidden = false; byId("studioPasswordInput")?.focus(); } });
    byId("studioPasswordClose")?.addEventListener("click", closePasswordModal);
    passwordModal?.addEventListener("click", event => { if (event.target === passwordModal) closePasswordModal(); });
    passwordForm?.addEventListener("submit", event => {
      event.preventDefault();
      const password = byId("studioPasswordInput")?.value || "";
      if (password !== "DAZURIO-ADMIN") { setText("studioPasswordError", "Incorrect password. Try again."); byId("studioPasswordInput")?.select(); return; }
      closePasswordModal();
      setText("studioPasswordError", "");
      openStudio();
    });
    byId("studioCloseButton")?.addEventListener("click", closeStudio);
    studio?.addEventListener("click", event => { if (event.target === studio) closeStudio(); });
    byId("studioDiagnosticsButton")?.addEventListener("click", refreshStudioDiagnostics);
    byId("studioValidateButton")?.addEventListener("click", () => {
      const validation = window.QuestionDatabase?.validate?.();
      if (!validation) { notify("Question validation is unavailable.", "warning"); return; }
      setText("studioHealth", validation.valid ? "Healthy" : validation.errors.length + " issues");
      notify(validation.valid ? "All questions passed validation." : validation.errors.join(" "), validation.valid ? "success" : "warning");
    });
    byId("studioResetDailyButton")?.addEventListener("click", () => {
      if (hasAccount() && (storage().getHistory() || []).some(record => record.mode === "daily" && record.date === localDateKey())) {
        notify("Account daily results are permanent in this local preview; use a guest profile to test a fresh daily run.", "info");
        return;
      }
      try {
        localStorage.removeItem(dailyCompletionKey());
        updateDailyCountdown();
        setText("studioDailyStatus", "Available");
        notify("Today's local daily lock has been reset.", "success");
      } catch (_) { notify("Could not reset today's local lock.", "error"); }
    });
    byId("clearAnswerButton")?.addEventListener("click", () => { const input = byId("answerInput"); if (input) { input.value = ""; input.focus(); } });
    byId("guestContinueButton")?.addEventListener("click", () => closeAuthModal());
    document.addEventListener("dazurio:login-required", () => openAuthModal("register"));
    byId("gameBackButton")?.addEventListener("click", () => { game()?.abandonGame?.(); navigateTo("home"); });
    byId("shareResultsButton")?.addEventListener("click", async () => {
      const summary = game()?.getSummary?.();
      if (!summary) return;
      const shareText = "DAZURIO — " + summary.score + " points in " + summary.totalQuestions + " questions!";
      try {
        if (navigator.share) await navigator.share({ title: "My DAZURIO result", text: shareText });
        else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(shareText); notify("Result copied to clipboard.", "success"); }
        else notify(shareText, "info");
      } catch (error) { if (error?.name !== "AbortError") notify("Could not share this result.", "error"); }
    });

    byId("endlessModeButton")?.addEventListener("click", startEndless);

    byId("practiceModeButton")?.addEventListener(
      "click",
      () => navigateTo("practice")
    );

    byId("startPracticeButton")?.addEventListener(
      "click",
      startPractice
    );

    byId("archivePrevMonth")?.addEventListener(
      "click",
      () => changeArchiveMonth(-1)
    );

    byId("archiveNextMonth")?.addEventListener(
      "click",
      () => changeArchiveMonth(1)
    );

    byId("profileButton")?.addEventListener("click", () => {
      if (hasAccount()) {
        navigateTo("profile");
      } else {
        openAuthModal("register");
      }
    });

    byId("editProfileButton")?.addEventListener(
      "click",
      openEditProfile
    );

    byId("editProfileForm")?.addEventListener(
      "submit",
      saveEditedProfile
    );

    byId("deleteProfileButton")?.addEventListener("click", () => {
      if (!window.confirm(
        "Delete your local DAZURIO account and all its saved progress?"
      )) return;

      try {
        storage().deleteAccount();

        updateAccountControls();
        refreshHome();
        renderProfile();
        navigateTo("home");

        notify("Your local account has been deleted.", "success");
      } catch (error) {
        notify(error.message || "Account deletion failed.", "error");
      }
    });

    byId("activatePlusButton")?.addEventListener(
      "click",
      activatePlus
    );

    byId("exportDataButton")?.addEventListener(
      "click",
      downloadExport
    );

    byId("resetDataButton")?.addEventListener(
      "click",
      resetData
    );
  }

  function bindSettings() {
    bindSettingToggle("themeToggle", "darkMode");
    bindSettingToggle("soundToggle", "sound");
    bindSettingToggle("animationToggle", "animations");
    bindSettingToggle("keyboardHintsToggle", "keyboardHints");
    byId("numberFormatSelect")?.addEventListener("change", event => saveSetting("numberFormat", event.target.value));

    byId("languageSelect")?.addEventListener("change", event => {
      const language = event.target.value === "cs" ? "cs" : "en";
      saveSetting("language", language);

      notify(
        event.target.value === "en"
          ? "English selected."
          : "Czech preview selected.",
        "info"
      );
    });
  }

  function bindLeaderboardTabs() {
    $$("[data-board]").forEach(button => {
      button.addEventListener("click", () => {
        const period = button.dataset.board || "all";

        $$("[data-board]").forEach(item => {
          item.classList.toggle("active", item === button);
        });

        renderLeaderboard(period);
      });
    });
  }

  // START APLIKACE

  function init() {
    if (initialized) return;
    if (!safeStorage()) return;

    try {
      storage().init();
      initialized = true;

      const bootTasks = [
        ["navigation", bindNavigation],
        ["authentication", bindAuth],
        ["main actions", bindMainActions],
        ["settings", bindSettings],
        ["leaderboard", bindLeaderboardTabs]
      ];
      for (const [label, task] of bootTasks) {
        try { task(); } catch (error) { console.error("DAZURIO " + label + " setup failed:", error); }
      }
      document.addEventListener("dazurio:game-finished", event => {
        if (event.detail?.mode === "daily" && !hasAccount()) saveGuestDaily(event.detail);
        try { renderResults(event.detail); } catch (error) { console.error("Results UI update failed:", error); }
        try { refreshHome(); } catch (error) { console.error("Home stats update failed:", error); }
        try { renderProfile(); } catch (error) { console.error("Profile update failed:", error); }
        try { renderLeaderboard("all"); } catch (error) { console.error("Leaderboard update failed:", error); }
      });

      try { updateAccountControls(); } catch (error) { console.error("Account UI init failed:", error); }
      try { loadSettings(); } catch (error) { console.error("Settings init failed:", error); }
      updateDailyCountdown();
      try { refreshHome(); } catch (error) { console.warn("Home stats could not render:", error); }
      try { renderProfile(); } catch (error) { console.warn("Profile could not render:", error); }
      try { renderArchive(); } catch (error) { console.warn("Archive could not render:", error); }
      try { renderQuestionLibrary(); } catch (error) { console.warn("Question library could not render:", error); }

      const initialHash = window.location.hash;

      try {
        if (initialHash.startsWith("#page-")) {
          const requestedPage = initialHash.replace("#page-", "");
          navigateTo(requestedPage);
        } else {
          navigateTo("home");
        }
      } catch (error) {
        console.error("DAZURIO initial navigation failed:", error);
        document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
        document.getElementById("page-home")?.classList.add("active");
      }

      console.info("DAZURIO initialized successfully.");
    } catch (error) {
      console.error("DAZURIO initialization error:", error);
      console.error("DAZURIO boot details:", error?.stack || error);
      // Keep the home screen usable; detailed diagnostics remain in the console and Studio.
      document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
      document.getElementById("page-home")?.classList.add("active");
      startDailyClock();
    }
  }

  // Veřejné funkce

  window.navigateTo = navigateTo;
  window.openAuthModal = openAuthModal;
  window.closeAuthModal = closeAuthModal;
  window.renderProfile = renderProfile;
  window.renderLeaderboard = renderLeaderboard;
  window.refreshHome = refreshHome;
  window.startDaily = startDaily;
  window.startEndless = startEndless;
  window.startPractice = startPractice;
  window.retryDazurioInit = init;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
