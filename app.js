
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

  function styleEquippedTitle(element, title, user) {
    if (!element) return;
    const value = String(title || "").trim();
    const normalized = value.toLowerCase();
    element.classList.remove("title-rank-owner","title-rank-admin","title-rank-plus");
    if (normalized === "owner" || normalized.includes("owner")) {
      element.classList.add("title-rank-owner");
    } else if (normalized === "admin" || normalized.includes("admin")) {
      element.classList.add("title-rank-admin");
    } else if (normalized.includes("plus") || (user?.plus && ["dazurio legend","starlight","early access"].includes(normalized))) {
      element.classList.add("title-rank-plus");
    }
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

    if (target === "profile") { renderProfile(); renderPlusStatus(); }
    if (target === "plus") renderPlusStatus();
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

      const frame = byId("headerAvatarFrame");
      const title = byId("headerEquippedTitle");
      if (avatar) {
        avatar.textContent = user
          ? (user.displayName || user.username).charAt(0).toUpperCase()
          : "👤";
        avatar.style.backgroundImage = user?.avatarUrl ? "url('" + user.avatarUrl + "')" : "";
        avatar.classList.toggle("has-photo", Boolean(user?.avatarUrl));
      }
      if (frame) {
        const equipped = user?.cosmetics?.equippedFrame || "classic";
        frame.className = "profile-avatar-frame frame-" + equipped;
      }
      if (title) { const equippedTitle=user?.cosmetics?.equippedTitle || (user ? "Curious Mind" : "PLAY AS A GUEST"); title.textContent=equippedTitle; styleEquippedTitle(title,equippedTitle,user); }
      const owner = Boolean(user?.cosmetics?.titles?.includes("OWNER") && user?.cosmetics?.frames?.includes("owner"));
      if (byId("headerOwnerBadge")) byId("headerOwnerBadge").hidden = !owner;
    }

    $$("[data-requires-login]").forEach(element => {
      element.hidden = !user;
    });

    $$("[data-requires-logout]").forEach(element => {
      element.hidden = Boolean(user);
    });

    const logout = byId("profileLogoutButton");
    if (logout) logout.hidden = !user;
    const owner = Boolean(user?.cosmetics?.titles?.includes("OWNER") && user?.cosmetics?.frames?.includes("owner"));
    if (byId("profileOwnerBadge")) byId("profileOwnerBadge").hidden = !owner;
    renderPlusStatus();
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
        stats.xp = (stats.xp || 0) + (summary.xp || 0);
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
    const progression = storage().levelProgressFromXP
      ? storage().levelProgressFromXP(xp)
      : (() => {
          let remaining = xp, level = 1, required = 200;
          while (remaining >= required) { remaining -= required; level += 1; required += 50; }
          return { level, current: remaining, required, remaining: required - remaining };
        })();
    const { level, current: currentLevelXP, required: requiredLevelXP, remaining: xpToNextLevel } = progression;

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
      Math.max(0, currentLevelXP / requiredLevelXP * 100)
    );

    const progress = byId("xpProgressFill");
    if (progress) {
      progress.style.width = percentage + "%";
    }

    setText("progressXP", `${currentLevelXP} / ${requiredLevelXP} XP`);
    setText("nextLevelXP", `${xpToNextLevel} XP TO NEXT LEVEL`);

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

    const sharedChallenge = window.dazurioSharedChallenge || null;
    const count = sharedChallenge ? Number(sharedChallenge.count) : (countSelect ? Number(countSelect.value) : 7);
    const isPlus = Boolean(storage()?.isPlus?.());
    const difficulty = sharedChallenge ? String(sharedChallenge.difficulty || "all") : (byId("practiceDifficulty")?.value || "all");
    const category = sharedChallenge ? (sharedChallenge.category || null) : (selectedPracticeCategory === "all" ? null : selectedPracticeCategory);
    if (!isPlus && !sharedChallenge && (count > 20 || difficulty !== "all")) {
      notify("Advanced practice filters and 50/100-question sessions are DAZURIO Plus features.", "warning");
      navigateTo("plus"); return;
    }
    const started=game()?.startGame("practice", { category, difficulty:isPlus||sharedChallenge ? difficulty : "all", count:Number.isFinite(count) ? count : 7, sharedChallenge:Boolean(sharedChallenge) });
    if(started&&sharedChallenge){window.dazurioSharedChallenge=null;notify("Friend challenge accepted. Good luck!","success");}
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
      if (byId("profileOwnerBadge")) byId("profileOwnerBadge").hidden = true;
      renderPlusStatus();

      renderHistory([]);
      return;
    }

    const stats = user.stats || {};

    setText("profileName", user.displayName || user.username);
    setText("profileJoined", user.createdAt || "");
    setText("profileXP", (stats.xp || 0).toLocaleString());
    const profileProgression = storage().levelProgressFromXP
      ? storage().levelProgressFromXP(stats.xp || 0)
      : { level: 1, current: stats.xp || 0, required: 200 };
    setText("profileLevel", profileProgression.level);
    setText("profileStreak", stats.streak || 0);
    setText("profileGames", stats.gamesPlayed || 0);
    setText("profileBestScore", (stats.bestScore || 0).toLocaleString());
    setText("profileBestStreak", stats.bestStreak || 0);
    setText("profileAccuracy", (stats.averageAccuracy || 0) + "%");
    const profileAvatar = byId("profileAvatar");
    if (profileAvatar) {
      profileAvatar.textContent = (user.displayName || user.username || "P").charAt(0).toUpperCase();
      profileAvatar.style.backgroundImage = user.avatarUrl ? "url('" + user.avatarUrl + "')" : "";
      profileAvatar.classList.toggle("has-photo", Boolean(user.avatarUrl));
    }
    const profileFrame = byId("profileAvatarFrame");
    if (profileFrame) profileFrame.className = "profile-card-avatar-frame frame-" + (user.cosmetics?.equippedFrame || "classic");
    const profileTitle=user.cosmetics?.equippedTitle || "Curious Mind";
    setText("profileEquippedTitle", profileTitle.toUpperCase());
    styleEquippedTitle(byId("profileEquippedTitle"),profileTitle,user);
    const owner = Boolean(user.cosmetics?.titles?.includes("OWNER") && user.cosmetics?.frames?.includes("owner"));
    if (byId("profileOwnerBadge")) byId("profileOwnerBadge").hidden = !owner;
    const profileProgress = byId("profileProgressFill");
    const profileLevelXP = profileProgression.current;
    if (profileProgress) profileProgress.style.width = (profileLevelXP / profileProgression.required * 100) + "%";
    setText("profileProgressText", profileLevelXP + " / " + profileProgression.required + " XP");

    renderHistory(storage().getHistory(user.plus ? 500 : 8) || []);
    renderPlusStatus();
    renderPlayerDashboard();
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
    const error = byId("editProfileError");
    if (error) error.textContent = "";

    modal.classList.add("open", "active");
    modal.setAttribute("aria-hidden", "false");
  }

  function saveEditedProfile(event) {
    event?.preventDefault();

    try {
      const username = byId("editUsername")?.value.trim();

      storage().updateProfile({
        username: username || undefined,
        displayName: username || undefined
      });

      closeModal(byId("editProfileModal"));
      updateAccountControls();
      renderProfile();

      notify("Your profile has been updated.", "success");
    } catch (error) {
      notify(error.message || "Profile update failed.", "error");
    }
  }

  function renderPlayerDashboard(){
    const data=storage().getPlayerDashboard?.();if(!data)return;
    setText("insightTotalPoints",data.totalPoints.toLocaleString());setText("insightAnswers",(data.stats.totalAnswers||0).toLocaleString());setText("insightStrongest",data.strongestCategory);setText("insightDifference",data.averageDifference.toLocaleString());setText("insightAverageScore",(data.averageScore||0).toLocaleString());setText("insightRecentGames",data.recentGames||0);setText("insightCategoryCount",Object.keys(data.categoryCounts||{}).length);document.querySelectorAll("[data-plus-feature]").forEach(el=>el.hidden=!data.isPlus);const plusHint=byId("plusInsightsHint");if(plusHint){plusHint.hidden=Boolean(data.isPlus);plusHint.textContent=data.isPlus?"":"Unlock Plus for deeper performance insights.";}
    const grid=byId("achievementGrid");if(grid){grid.replaceChildren();data.achievements.forEach(a=>{const c=document.createElement("article");c.className="achievement-card "+(a.unlocked?"is-unlocked":"is-locked");const i=document.createElement("span");i.textContent=a.unlocked?a.icon:(a.title==="Hidden achievement"?"❔":a.icon);const t=document.createElement("strong");t.textContent=a.title;const d=document.createElement("small");d.textContent=a.description;const s=document.createElement("em");s.textContent=a.unlocked?"UNLOCKED":"LOCKED";c.append(i,t,d,s);grid.appendChild(c);});}
    setText("achievementCount",data.achievements.filter(a=>a.unlocked).length+" / "+data.achievements.length);
    const streakMilestones=[3,7,14,30,100],bestStreak=Number(data.stats.bestStreak||0),nextStreak=streakMilestones.find(n=>n>bestStreak)||100;
    setText("streakRewardProgress",bestStreak>=100?"100+ day legend":bestStreak+" / "+nextStreak+" days");
    setText("streakRewardText",bestStreak>=100?"All streak milestones achieved — incredible consistency!":"Next reward at "+nextStreak+" days · keep your Daily streak going.");
    const streakFill=byId("streakRewardFill");if(streakFill)streakFill.style.width=Math.min(100,bestStreak/nextStreak*100)+"%";
    const collectionGrid=byId("collectionGrid");
    if(collectionGrid){collectionGrid.replaceChildren();(data.collections||[]).forEach(item=>{const card=document.createElement("article");card.className="collection-card "+(item.earned?"is-collected":"");const icon=document.createElement("span");icon.textContent=item.icon;const title=document.createElement("strong");title.textContent=item.title;const desc=document.createElement("small");desc.textContent=item.description;const state=document.createElement("em");state.textContent=item.earned?"COLLECTED":"NOT YET";card.append(icon,title,desc,state);collectionGrid.appendChild(card);});setText("collectionProgress",(data.collections||[]).filter(x=>x.earned).length+" / "+(data.collections||[]).length);}
    renderFriends();
    const names={classic:"Classic",sage:"Sage",ocean:"Ocean",aurora:"Aurora",gold:"Gold",fire:"Fire",prism:"Prism",starlight:"Starlight",owner:"♛ Owner"};const fs=byId("cosmeticFrameSelect"),ts=byId("cosmeticTitleSelect");
    if(fs){fs.replaceChildren();data.cosmetics.frames.forEach(v=>{const o=document.createElement("option");o.value=v;o.textContent=names[v]||v;o.selected=v===data.cosmetics.equippedFrame;fs.appendChild(o);});}
    if(ts){ts.replaceChildren();data.cosmetics.titles.forEach(v=>{const o=document.createElement("option");o.value=v;o.textContent=v;o.selected=v===data.cosmetics.equippedTitle;ts.appendChild(o);});}
    const frame=byId("cosmeticPreviewFrame");if(frame)frame.className="cosmetic-preview-avatar-frame frame-"+(data.cosmetics.equippedFrame||"classic");
    const previewTitle=data.cosmetics.equippedTitle||"Curious Mind";
    setText("cosmeticPreviewTitle",previewTitle);
    styleEquippedTitle(byId("cosmeticPreviewTitle"),previewTitle,storage().getCurrentUser());
    const preview=byId("cosmeticPreviewAvatar"),user=storage().getCurrentUser();if(preview&&user){preview.textContent=(user.displayName||user.username||"P").charAt(0).toUpperCase();preview.style.backgroundImage=user.avatarUrl?"url('"+user.avatarUrl+"')":"";preview.classList.toggle("has-photo",Boolean(user.avatarUrl));}
    if(fs)fs.onchange=()=>{if(frame)frame.className="cosmetic-preview-avatar-frame frame-"+fs.value;};
    if(ts)ts.onchange=()=>{setText("cosmeticPreviewTitle",ts.value);styleEquippedTitle(byId("cosmeticPreviewTitle"),ts.value,storage().getCurrentUser());};
    renderWeeklyQuests();
    renderDailyCalendar();
    renderWeeklyCompetition();
    renderLegendsHub(data);
  }
  function renderLegendsHub(data){
    const p=storage().getLegendsProgress?.();if(!p)return;
    setText("prestigeLevel",p.prestige);setText("prestigeStatus",p.canPrestige?"Prestige ready — level resets to 1.":"Reach level 25 to unlock Prestige.");
    const pb=byId("prestigeButton");if(pb)pb.disabled=!p.canPrestige;
    setText("mysteryBoxCount",p.mysteryBoxes);const mb=byId("openMysteryBoxButton");if(mb)mb.disabled=p.mysteryBoxes<1;
    const cb=byId("comebackRewardButton");if(cb)cb.disabled=!p.comebackAvailable;
    setText("comebackRewardStatus",p.comebackAvailable?"Your return reward is ready!":"Available after 3 days away.");
    const choices=byId("trophyShowcaseChoices");if(choices){choices.replaceChildren();data.achievements.filter(x=>x.unlocked).forEach(item=>{const label=document.createElement("label");label.className="trophy-showcase-choice";const input=document.createElement("input");input.type="checkbox";input.value=item.id;input.checked=p.showcase.includes(item.id);input.addEventListener("change",()=>{if(choices.querySelectorAll("input:checked").length>3){input.checked=false;notify("Choose up to three trophies.","warning");}});const t=document.createElement("span");t.textContent=item.icon+" "+item.title;label.append(input,t);choices.appendChild(label);});}
    const display=byId("trophyShowcaseDisplay");if(display){display.replaceChildren();data.achievements.filter(x=>p.showcase.includes(x.id)).forEach(item=>{const chip=document.createElement("span");chip.className="trophy-showcase-chip";chip.textContent=item.icon+" "+item.title;display.appendChild(chip);});}
    const map=byId("achievementMap");if(map){map.replaceChildren();data.achievements.forEach((item,i)=>{const node=document.createElement("article");node.className="achievement-map-node"+(item.unlocked?" is-done":"");const icon=document.createElement("span");icon.textContent=item.unlocked?item.icon:"🔒";const title=document.createElement("strong");title.textContent=item.title;const step=document.createElement("small");step.textContent="STEP "+(i+1);node.append(icon,title,step);map.appendChild(node);});}
  }
  function renderStudioPlayers() {
    const select=byId("studioPlayerTarget");if(!select)return;
    const players=storage().getLocalPlayers?.()||[];select.replaceChildren();
    const placeholder=document.createElement("option");placeholder.value="";placeholder.textContent="Select local player";select.appendChild(placeholder);
    players.forEach(player=>{const option=document.createElement("option");option.value=player.id;option.textContent=(player.displayName||player.username)+" · L"+player.level+(player.plus?" · PLUS":"");select.appendChild(option);});
    const achievements=storage().getAchievementCatalog?.()||[];
    const achievementSelect=byId("studioPlayerAchievement");
    if(achievementSelect){achievementSelect.replaceChildren();const first=document.createElement("option");first.value="";first.textContent="Choose achievement";achievementSelect.appendChild(first);achievements.forEach(item=>{const option=document.createElement("option");option.value=item.id;option.textContent=item.icon+" "+item.title;achievementSelect.appendChild(option);});}
    setText("studioPlayerManagerStatus",players.length+" local profile(s) found.");
  }

  function renderFriends() {
    const container=byId("friendsList");if(!container)return;
    const friends=storage().getFriends?.()||[];container.replaceChildren();
    if(!friends.length){const empty=document.createElement("p");empty.className="empty-state";empty.textContent="No friends added yet. Add another local demo profile by username.";container.appendChild(empty);return;}
    friends.forEach(friend=>{const row=document.createElement("div");row.className="friend-row";const copy=document.createElement("div");const name=document.createElement("strong");name.textContent=friend.displayName||friend.username;const meta=document.createElement("small");meta.textContent="LEVEL "+friend.level+" · "+friend.score.toLocaleString()+" PTS"+(friend.plus?" · PLUS":"");copy.append(name,meta);const remove=document.createElement("button");remove.type="button";remove.textContent="REMOVE";remove.addEventListener("click",()=>{try{storage().removeFriend(friend.id);renderFriends();}catch(error){setText("friendsStatus",error.message||"Could not remove friend.");}});row.append(copy,remove);container.appendChild(row);});
  }

  function renderDailyCalendar() {
    const grid = byId("dailyCalendarGrid");
    if (!grid) return;
    const history = storage().getHistory?.() || [];
    const played = new Set(history.filter(r => r.mode === "daily").map(r => r.date));
    const today = localDateKey();
    const days = [];
    const date = new Date(today + "T12:00:00");
    date.setDate(date.getDate() - 27);
    for (let i = 0; i < 28; i++) {
      const key = localDateKey(date);
      days.push({ key, played: played.has(key), today: key === today });
      date.setDate(date.getDate() + 1);
    }
    grid.replaceChildren();
    days.forEach(day => {
      const cell = document.createElement("span");
      cell.className = "daily-calendar-day" + (day.played ? " is-played" : "") + (day.today ? " is-today" : "");
      cell.textContent = String(Number(day.key.slice(-2)));
      cell.title = day.key + (day.played ? " · Daily completed" : "");
      grid.appendChild(cell);
    });
    setText("dailyCalendarCount", days.filter(day => day.played).length + " / 28 played");
  }

  function renderWeeklyCompetition() {
    const container = byId("weeklyCompetitionRows");
    if (!container) return;
    container.replaceChildren();
    const rows = storage().getLeaderboard("weekly") || [];
    if (!rows.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "Play a Daily or Endless game to appear here. This preview only includes profiles in this browser.";
      container.appendChild(empty);
      return;
    }
    rows.slice(0, 8).forEach((player, index) => {
      const row = document.createElement("div");
      row.className = "weekly-competition-row" + (player.isCurrentUser ? " is-current-user" : "");
      const rank = document.createElement("span"); rank.className = "competition-rank"; rank.textContent = "#" + (index + 1);
      const name = document.createElement("strong"); name.textContent = player.displayName || player.username || "Player";
      const score = document.createElement("span"); score.className = "competition-score"; score.textContent = Number(player.score || 0).toLocaleString() + " pts";
      row.append(rank, name, score); container.appendChild(row);
    });
  }

  function getCurrentWeekStart() {
    const date = new Date();
    date.setHours(12,0,0,0);
    date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    return localDateKey(date);
  }
  function renderWeeklyQuests() {
    const button = byId("claimWeeklyRewardButton");
    if (!button) return;
    const user = storage().getCurrentUser();
    const start = getCurrentWeekStart();
    const endDate = new Date(start + "T12:00:00");
    endDate.setDate(endDate.getDate() + 7);
    const end = localDateKey(endDate);
    setText("weeklyQuestWeek", start);
    if (!user) {
      setText("weeklyQuestRewardNote", "Sign in to track weekly quests and earn rewards.");
      button.disabled = true;
      return;
    }
    const records = (storage().getHistory() || []).filter(r => r.date >= start && r.date < end && ["daily","endless"].includes(r.mode));
    const daily = records.filter(r => r.mode === "daily").length;
    const answers = records.flatMap(r => r.answers || []);
    const categories = new Set(answers.map(a => a.category).filter(Boolean)).size;
    const progress = [
      ["weeklyDailyProgress","weeklyDailyFill",daily,3],
      ["weeklyAnswerProgress","weeklyAnswerFill",answers.length,35],
      ["weeklyCategoryProgress","weeklyCategoryFill",categories,3]
    ];
    progress.forEach(([label,fill,value,target]) => {
      setText(label, Math.min(value,target) + " / " + target);
      const bar=byId(fill); if(bar) bar.style.width=(Math.min(100,value/target*100))+"%";
    });
    const claimed = (user.claimedWeeklyRewards || []).includes(start);
    const complete = daily >= 3 && answers.length >= 35 && categories >= 3;
    setText("weeklyQuestRewardNote", claimed ? "This week's 150 XP reward has been claimed." : complete ? "All quests complete — your 150 XP reward is ready!" : "Complete all three quests to claim 150 XP.");
    button.disabled = !complete || claimed;
    button.textContent = claimed ? "REWARD CLAIMED" : "CLAIM 150 XP";
    if (!button.dataset.weeklyBound) {
      button.dataset.weeklyBound = "true";
      button.addEventListener("click", () => {
        try {
          const ok = storage().claimWeeklyReward(getCurrentWeekStart());
          if (ok) { notify("150 XP added to your account!", "success"); refreshHome(); renderProfile(); }
        } catch(error) { notify(error.message || "Could not claim weekly reward.", "warning"); }
      });
    }
  }

  function renderSeasonalEvent(){const card=byId("seasonalEventCard");if(!card)return;let e=null;try{e=JSON.parse(localStorage.getItem("dazurio_seasonal_event")||"null");}catch(_){}const today=localDateKey();if(!e||(e.start&&today<e.start)||(e.end&&today>e.end)){card.hidden=true;return;}card.hidden=false;setText("seasonalEventTitle",e.title||"Seasonal event");setText("seasonalEventDescription",e.description||"");const img=byId("seasonalEventImage");if(img&&e.image){img.src=e.image;img.hidden=false;}else if(img)img.hidden=true;}

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

      let archiveDone = false;
      try { archiveDone = localStorage.getItem("dazurio_archive_completed_" + dateString) === "1"; } catch (_) {}
      const archiveFilter=byId("archiveFilterSelect")?.value||"all";
      if((archiveFilter==="played"&&!archiveDone)||(archiveFilter==="available"&&archiveDone))button.classList.add("filter-hidden");
      if (archiveDone) {
        button.disabled = true;
        button.classList.add("is-completed");
        button.setAttribute("aria-label", dateString + " — completed");
        button.title = "Already played";
      } else if (date > todayStart) {
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

  function activatePlus(event) {
    event?.preventDefault?.();
    if (!requireLogin()) return;
    const code = byId("plusCodeInput")?.value || "";
    const status = byId("plusRedeemStatus");
    try {
      storage().redeemPlusCode(code);
      if (status) status.textContent = "Success! DAZURIO Plus is now unlocked for lifetime.";
      if (byId("plusCodeInput")) byId("plusCodeInput").value = "";
      renderPlusStatus();
      renderProfile();
      updateAccountControls();
      notify("DAZURIO Plus lifetime unlocked!", "success");
    } catch (error) {
      if (status) status.textContent = error.message || "Could not unlock Plus.";
      notify(error.message || "Plus unlock failed.", "warning");
    }
  }

  function renderPlusStatus() {
    const active = Boolean(storage()?.isPlus?.());
    const panel = byId("plusUnlockedPanel");
    const form = byId("plusRedeemForm");
    if (panel) panel.hidden = !active;
    if (form) form.hidden = active;
    const button = byId("activatePlusButton");
    if (button) button.textContent = active ? "PLUS UNLOCKED" : "UNLOCK PLUS";
    const profileBadge = byId("profilePlusBadge");
    if (profileBadge) profileBadge.hidden = !active;
    const headerBadge = byId("headerPlusBadge");
    if (headerBadge) headerBadge.hidden = !active;
    const archiveFilter=byId("archiveFilterSelect");
    if(archiveFilter){archiveFilter.disabled=!active;if(!active)archiveFilter.value="all";}
    const archiveHint=byId("archiveFilterHint");
    if(archiveHint){archiveHint.textContent=active?"Plus archive filters are active.":"Unlock Plus for advanced archive filters.";archiveHint.classList.toggle("is-plus",active);}
    const count=byId("practiceCount");
    if(count){[...count.options].forEach(option=>{if(option.dataset.plusOnly!==undefined)option.disabled=!active;});if(!active&&Number(count.value)>20)count.value="20";}
    const difficulty=byId("practiceDifficulty");
    if(difficulty){difficulty.disabled=!active;if(!active)difficulty.value="all";}
    const hint=byId("practicePlusHint");
    if(hint){hint.classList.toggle("is-plus",active);hint.textContent=active?"✦ Plus advanced practice is active: choose any category, difficulty and up to 100 questions.":"Plus unlocks 50/100-question sessions and difficulty filters.";}
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

    $("[data-close-modal]").forEach(button => {
      button.addEventListener("click", () => {
        const modal = button.closest(".modal-backdrop, .modal") || button.closest(".modal-card")?.parentElement || byId("authModal");
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
    byId("addFriendButton")?.addEventListener("click",()=>{try{storage().addFriend(byId("friendUsernameInput")?.value||"");if(byId("friendUsernameInput"))byId("friendUsernameInput").value="";setText("friendsStatus","Friend added to your local list.");renderFriends();}catch(error){setText("friendsStatus",error.message||"Could not add friend.");}});
    byId("openMysteryBoxButton")?.addEventListener("click",()=>{try{const r=storage().openMysteryBox();setText("mysteryBoxResult",r.rarity+" · "+(r.reward.value||("+"+r.reward.value+" XP")));renderProfile();notify("Mystery box opened: "+r.rarity,"success");}catch(e){notify(e.message||"No box available.","warning");}});
    byId("comebackRewardButton")?.addEventListener("click",()=>{try{storage().claimComebackReward();renderProfile();notify("Welcome back! +100 XP and a Mystery Box.","success");}catch(e){notify(e.message||"Not available yet.","warning");}});
    byId("prestigeButton")?.addEventListener("click",()=>{try{const r=storage().performPrestige();renderProfile();notify("Welcome to "+r.title+"!","success");}catch(e){notify(e.message||"Prestige unavailable.","warning");}});
    byId("saveTrophyShowcaseButton")?.addEventListener("click",()=>{try{const ids=Array.from(byId("trophyShowcaseChoices")?.querySelectorAll("input:checked")||[]).map(x=>x.value);storage().saveTrophyShowcase(ids);renderProfile();notify("Trophy showcase saved.","success");}catch(e){notify(e.message||"Could not save showcase.","warning");}});


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
      renderStudioPlayers();
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
    byId("studioAddQuestionButton")?.addEventListener("click", () => {
      const question = byId("studioQuestionText")?.value.trim() || "";
      const description = byId("studioQuestionDescription")?.value.trim() || "";
      const category = byId("studioQuestionCategory")?.value || "Numbers";
      const difficulty = byId("studioQuestionDifficulty")?.value || "medium";
      const answerRaw = byId("studioQuestionAnswer")?.value ?? "";
      const minRaw = byId("studioQuestionMin")?.value ?? "";
      const maxRaw = byId("studioQuestionMax")?.value ?? "";
      const answer = Number(answerRaw);
      const min = Number(minRaw);
      const max = Number(maxRaw);
      const unit = byId("studioQuestionUnit")?.value.trim() || "";
      if (!question || answerRaw === "" || minRaw === "" || maxRaw === "" || !Number.isFinite(answer) || !Number.isFinite(min) || !Number.isFinite(max) || min > answer || answer > max || min >= max) {
        setText("studioQuestionStatus", "Enter a question and valid minimum, exact answer and maximum.");
        return;
      }
      const suggestions = [...new Set([min, answer * 0.8, answer, answer * 1.2, max].map(v => Math.max(min, Math.min(max, v))))].sort((x,y)=>x-y);
      const custom = { id:"custom-" + Date.now().toString(36), category, difficulty, question, description, answer, unit, min, max, suggestions };
      try {
        const saved = JSON.parse(localStorage.getItem("dazurio_custom_questions_v1") || "[]");
        saved.push(custom);
        localStorage.setItem("dazurio_custom_questions_v1", JSON.stringify(saved));
        setText("studioQuestionStatus", "Question added to this browser's question bank.");
        setText("studioQuestionCount", window.QuestionDatabase?.getCount?.() ?? "—");
        renderQuestionLibrary();
        notify("Custom question added.", "success");
      } catch(error) {
        setText("studioQuestionStatus", "Could not save the question in this browser.");
      }
    });
    byId("studioSaveEventButton")?.addEventListener("click",()=>{const title=byId("studioEventTitle")?.value.trim(),description=byId("studioEventDescription")?.value.trim(),image=byId("studioEventImage")?.value.trim(),start=byId("studioEventStart")?.value||"",end=byId("studioEventEnd")?.value||"";if(!title){setText("studioEventStatus","Add an event title first.");return;}if(image&&!/^https:\/\//i.test(image)){setText("studioEventStatus","Artwork must use https://.");return;}if(start&&end&&end<start){setText("studioEventStatus","End date must be after start date.");return;}localStorage.setItem("dazurio_seasonal_event",JSON.stringify({title,description,image,start,end}));setText("studioEventStatus","Event published in this browser preview.");renderSeasonalEvent();});
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
      const shareText = summary.mode === "daily" ? "I scored " + summary.score.toLocaleString() + " points in today’s DAZURIO Daily (" + summary.totalQuestions + " questions). Take the same daily challenge and see if you can beat me! " + window.location.href : "I scored " + summary.score.toLocaleString() + " points in DAZURIO " + String(summary.mode).toUpperCase() + " (" + summary.totalQuestions + " questions). Can you beat me? " + window.location.href;
      try {
        if (navigator.share) await navigator.share({ title: "My DAZURIO result", text: shareText });
        else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(shareText); notify("Result copied to clipboard.", "success"); }
        else notify(shareText, "info");
      } catch (error) { if (error?.name !== "AbortError") notify("Could not share this result.", "error"); }
    });

    byId("endlessModeButton")?.addEventListener("click", startEndless);
    byId("speedRunModeButton")?.addEventListener("click", () => { if (requireAccount("Speed Run")) game()?.startGame("speedrun"); });
    byId("survivalModeButton")?.addEventListener("click", () => { if (requireAccount("Survival")) game()?.startGame("survival"); });
    byId("mysteryModeButton")?.addEventListener("click", () => { if (requireAccount("Mystery Mode")) game()?.startGame("mystery"); });
    byId("worldTourModeButton")?.addEventListener("click", () => { if (requireAccount("World Tour")) game()?.startGame("worldtour"); });
    byId("bossModeButton")?.addEventListener("click", () => { if (requireAccount("Boss Challenge")) game()?.startGame("boss"); });

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

    byId("archiveNextMonth")?.addEventListener("click", () => changeArchiveMonth(1));
    byId("archiveFilterSelect")?.addEventListener("change",renderArchive);
    byId("createChallengeButton")?.addEventListener("click",async()=>{try{if(!storage()?.isPlus?.())throw new Error("Custom challenge links are a Plus feature.");const options={category:byId("practiceCategory")?.value||"all",count:Number(byId("practiceCount")?.value||10),difficulty:byId("practiceDifficulty")?.value||"all"};const url=new URL(window.location.href);url.searchParams.set("dazurioChallenge",JSON.stringify(options));const message="I made a DAZURIO challenge for you. Open this link, sign in and play the same settings: "+url.toString();if(navigator.share)await navigator.share({title:"DAZURIO Challenge",text:message,url:url.toString()});else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url.toString());notify("Challenge link copied!","success");}else notify(url.toString(),"info");}catch(error){if(error?.name!=="AbortError")notify(error.message||"Could not create challenge link.","warning");}});

    byId("profileButton")?.addEventListener("click", () => {
      if (hasAccount()) {
        navigateTo("profile");
      } else {
        openAuthModal("register");
      }
    });

    byId("saveCosmeticsButton")?.addEventListener("click",()=>{try{storage().equipCosmetic("frame",byId("cosmeticFrameSelect")?.value);storage().equipCosmetic("title",byId("cosmeticTitleSelect")?.value);updateAccountControls();renderProfile();notify("Profile look saved.","success");}catch(e){notify(e.message||"Could not save cosmetics.","error");}});
    byId("profileImageInput")?.addEventListener("change",event=>{const file=event.target.files?.[0];if(!file)return;if(!/^image\/(png|jpeg|webp)$/.test(file.type)){notify("Choose a JPG, PNG or WebP image.","error");return;}const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>{const canvas=document.createElement("canvas"),scale=Math.min(1,512/Math.max(img.width,img.height));canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);const dataUrl=canvas.toDataURL("image/jpeg",.78);try{storage().updateProfile({avatarUrl:dataUrl});updateAccountControls();renderProfile();notify("Profile picture updated.","success");}catch(error){notify(error.message||"Could not save this picture.","error");}};img.onerror=()=>notify("Could not read this image.","error");img.src=String(reader.result);};reader.readAsDataURL(file);});
    byId("studioGrantTitleButton")?.addEventListener("click",()=>{try{storage().grantCosmetic("title",byId("studioCustomTitle")?.value||"");renderPlayerDashboard();notify("Title unlocked for the current player.","success");setText("studioRewardStatus","Title added to the current profile.");}catch(error){setText("studioRewardStatus",error.message||"Could not grant title.");}});
    byId("studioGrantFrameButton")?.addEventListener("click",()=>{try{storage().grantCosmetic("frame",byId("studioGrantFrame")?.value||"");renderProfile();updateAccountControls();notify("Frame unlocked for the current player.","success");setText("studioRewardStatus","Frame added to the current profile.");}catch(error){setText("studioRewardStatus",error.message||"Could not grant frame.");}});
    byId("studioGrantOwnerButton")?.addEventListener("click",()=>{try{storage().grantCosmetic("title","OWNER");storage().grantCosmetic("frame","owner");renderProfile();updateAccountControls();setText("studioRewardStatus","Owner visual cosmetics added. This is not an admin permission.");}catch(error){setText("studioRewardStatus",error.message||"Could not grant Owner cosmetics.");}});
    byId("studioRefreshPlayersButton")?.addEventListener("click",renderStudioPlayers);
    byId("studioGrantPlayerRewardButton")?.addEventListener("click",()=>{try{const id=byId("studioPlayerTarget")?.value||"";if(!id)throw new Error("Choose a player first.");const title=byId("studioPlayerRewardTitle")?.value.trim()||"";const frame=byId("studioPlayerRewardFrame")?.value||"";if(!title&&!frame)throw new Error("Enter a title or choose a frame.");if(title)storage().grantCosmeticToPlayer(id,"title",title);if(frame)storage().grantCosmeticToPlayer(id,"frame",frame);setText("studioPlayerManagerStatus","Reward granted to that local profile.");renderStudioPlayers();updateAccountControls();renderProfile();}catch(error){setText("studioPlayerManagerStatus",error.message||"Could not grant reward.");}});
    byId("studioGrantAchievementButton")?.addEventListener("click",()=>{try{const id=byId("studioPlayerTarget")?.value||"";const achievement=byId("studioPlayerAchievement")?.value||"";if(!id)throw new Error("Choose a player first.");if(!achievement)throw new Error("Choose an achievement first.");const result=storage().grantAchievementToPlayer(id,achievement);const player=(storage().getLocalPlayers?.()||[]).find(item=>item.id===id);const name=player?.displayName||player?.username||"player";setText("studioPlayerManagerStatus",result.title+(result.alreadyUnlocked?" was already unlocked for ":" unlocked for ")+name+".");if(storage().getCurrentUser?.()?.id===id)renderPlayerDashboard();}catch(error){setText("studioPlayerManagerStatus",error.message||"Could not unlock achievement.");}});
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

    byId("plusRedeemForm")?.addEventListener("submit", activatePlus);
    renderPlusStatus();

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
        if (event.detail?.mode === "archive") { try { renderArchive(); } catch (_) {} }
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
      try { renderSeasonalEvent(); } catch (error) { console.warn("Seasonal event could not render:", error); }
      let incomingChallenge=false;
      try { const raw=new URLSearchParams(window.location.search).get("dazurioChallenge");if(raw){const opts=JSON.parse(raw);if(opts&&typeof opts==="object"){window.dazurioSharedChallenge={category:opts.category==="all"?null:opts.category,count:Math.max(1,Math.min(100,Number(opts.count)||10)),difficulty:["easy","medium","hard"].includes(opts.difficulty)?opts.difficulty:"all"};if(byId("practiceCategory"))byId("practiceCategory").value=opts.category||"all";if(byId("practiceCount"))byId("practiceCount").value=String(window.dazurioSharedChallenge.count);if(byId("practiceDifficulty"))byId("practiceDifficulty").value=window.dazurioSharedChallenge.difficulty;incomingChallenge=true;}}}catch(error){console.warn("Invalid shared challenge link:",error);}

      const initialHash = window.location.hash;

      try {
        if (incomingChallenge) { navigateTo("practice"); notify("A friend sent you a custom DAZURIO challenge. Sign in and start when ready.","success"); }
        else if (initialHash.startsWith("#page-")) { const requestedPage = initialHash.replace("#page-", ""); navigateTo(requestedPage); }
        else { navigateTo("home"); }
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
