
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

    window.scrollTo({ top: 0, behavior: "smooth" });

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

  function refreshHome() {
    if (!safeStorage()) return;

    const user = storage().getCurrentUser();

    const stats = user?.stats || {};

    setText("homeStreak", stats.streak || 0);
    setText("homeXP", (stats.xp || 0).toLocaleString());
    setText("homeGames", stats.gamesPlayed || 0);
    setText("homeLevel", stats.level || 1);

    const xp = stats.xp || 0;
    const level = stats.level || 1;
    const currentLevelXP = xp - (level - 1) * 250;
    const percentage = Math.min(
      100,
      Math.max(0, currentLevelXP / 250 * 100)
    );

    const progress = byId("xpProgressFill");
    if (progress) {
      progress.style.width = percentage + "%";
    }

    setText("progressXP", currentLevelXP);
    setText("nextLevelXP", 250);

    const dailyStatus = byId("dailyStatusText");

    if (dailyStatus) {
      dailyStatus.textContent = user
        ? "Ready for today's challenge?"
        : "Sign in to save your progress.";
    }
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

  function startDaily() {
    if (!safeStorage()) return;
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
    if (!requireAccount("the daily archive")) return;
    game()?.startGame("archive", { date });
  }

  // PROFIL

  function renderProfile() {
    if (!safeStorage()) return;

    const user = storage().getCurrentUser();

    if (!user) {
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
    setText("profileLevel", stats.level || 1);
    setText("profileStreak", stats.streak || 0);
    setText("profileGames", stats.gamesPlayed || 0);
    setText("profileBestScore", (stats.bestScore || 0).toLocaleString());
    setText("profileBestStreak", stats.bestStreak || 0);
    setText("profileAccuracy", (stats.averageAccuracy || 0) + "%");

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

    const totalElement = byId("questionCountLabel");

    if (totalElement && database?.getCount) {
      totalElement.textContent = database.getCount();
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
    if (!safeStorage()) return;

    const settings = storage().getSettings() || {};

    setToggle("themeToggle", settings.darkMode);
    setToggle("soundToggle", settings.sound !== false);
    setToggle("animationToggle", settings.animations !== false);

    const language = byId("languageSelect");
    if (language) language.value = settings.language || "en";

    applySettings(settings);
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
  }

  function saveSetting(key, value) {
    try {
      const settings = storage().getSettings() || {};
      settings[key] = value;

      storage().updateSettings(settings);
      applySettings(settings);
    } catch (error) {
      notify(error.message || "Settings could not be saved.", "error");
    }
  }

  function bindSettingToggle(id, key) {
    const element = byId(id);
    if (!element) return;

    const handler = () => {
      const current = storage().getSettings() || {};
      const value = element.type === "checkbox"
        ? element.checked
        : !(current[key] !== false && current[key] !== undefined);

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

  function bindMainActions() {
    byId("playTodayButton")?.addEventListener("click", startDaily);
    byId("guestContinueButton")?.addEventListener("click", () => closeAuthModal());

    byId("endlessModeButton")?.addEventListener("click", startEndless);

    byId("practiceModeButton")?.addEventListener(
      "click",
      () => navigateTo("practice")
    );

    byId("archiveModeButton")?.addEventListener(
      "click",
      () => { if (requireAccount("the daily archive")) navigateTo("archive"); }
    );

    byId("leaderboardModeButton")?.addEventListener(
      "click",
      () => { if (requireAccount("the leaderboard")) navigateTo("leaderboard"); }
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

    byId("languageSelect")?.addEventListener("change", event => {
      saveSetting("language", event.target.value);

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

      bindNavigation();
      bindAuth();
      bindMainActions();
      bindSettings();
      bindLeaderboardTabs();
      document.addEventListener("dazurio:game-finished", () => {
        refreshHome();
        renderProfile();
        renderLeaderboard("all");
      });

      updateAccountControls();
      loadSettings();
      refreshHome();
      renderProfile();
      renderArchive();
      renderQuestionLibrary();

      const initialHash = window.location.hash;

      if (initialHash.startsWith("#page-")) {
        const requestedPage = initialHash.replace("#page-", "");
        navigateTo(requestedPage);
      } else {
        navigateTo("home");
      }

      console.info("DAZURIO initialized successfully.");
    } catch (error) {
      console.error("DAZURIO initialization error:", error);
      notify("Aplikaci se nepodařilo správně spustit.", "error");
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
