
(() => {
  "use strict";

  const QUESTIONS_PER_DAILY = 7;
  const DAILY_SET_PREFIX = "dazurio_daily_set_v3_";
  const ARCHIVE_DONE_PREFIX = "dazurio_archive_completed_";
  const SECONDS_PER_QUESTION = 25;
  const MAX_POINTS_PER_QUESTION = 1000;

  let state = {
    mode: "daily",
    options: {},
    questions: [],
    currentIndex: 0,
    answers: [],
    timeLeft: SECONDS_PER_QUESTION,
    timer: null,
    active: false,
    answered: false,
    startedAt: null,
    lives: 3
  };

  const $ = (id) => document.getElementById(id);

  function getDatabase() {
    return window.QuestionDatabase || window.DazurioQuestions;
  }

  function getStorage() {
    return window.DazurioStorage;
  }

  function getEffects() {
    return window.DazurioEffects;
  }

  function getAllQuestions() {
    const db = getDatabase();
    if (!db) return [];

    let questions = [];

    if (typeof db.getAll === "function") {
      questions = db.getAll();
    } else if (Array.isArray(db.questions)) {
      questions = db.questions;
    }

    return questions.filter(question =>
      question &&
      typeof question.question === "string" &&
      Number.isFinite(Number(question.answer))
    );
  }

  function shuffle(items) {
    const result = [...items];

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  function getDateKey(dateValue) {
    if (!dateValue) {
      const now = new Date();

      return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
      ].join("-");
    }

    if (dateValue instanceof Date && !Number.isNaN(dateValue.getTime())) {
      return [
        dateValue.getFullYear(),
        String(dateValue.getMonth() + 1).padStart(2, "0"),
        String(dateValue.getDate()).padStart(2, "0")
      ].join("-");
    }

    const match = String(dateValue).match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }

    return getDateKey();
  }

  function getDailyQuestions(dateValue) {
    const all = getAllQuestions();
    if (!all.length) return [];
    const seed = getDateKey(dateValue);
    const cacheKey = DAILY_SET_PREFIX + seed;
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
      if (Array.isArray(cached)) {
        const byId = new Map(all.map(question => [question.id, question]));
        const restored = cached.map(id => byId.get(id)).filter(Boolean);
        if (restored.length === QUESTIONS_PER_DAILY) return restored;
      }
    } catch (_) {}

    // Deterministic daily schedule. Each date is generated from its own seed,
    // excluding all seven questions from the previous day before selecting.
    // This guarantees zero question repeats between consecutive daily sets.
    const epoch = new Date("2026-01-01T12:00:00");
    const requested = new Date(seed + "T12:00:00");
    const daysFromEpoch = Math.floor((requested - epoch) / 86400000);
    let previousIds = new Set();
    let selected = [];
    if (daysFromEpoch >= 0 && daysFromEpoch < 20000) {
      for (let offset = 0; offset <= daysFromEpoch; offset++) {
        const currentDate = new Date(epoch.getTime() + offset * 86400000);
        const dayKey = getDateKey(currentDate);
        let hash = 216 * 31;
        for (const char of dayKey) hash = (hash * 31 + char.charCodeAt(0)) | 0;
        const random = () => {
          hash = (hash * 1664525 + 1013904223) | 0;
          return (hash >>> 0) / 4294967296;
        };
        const available = shuffleWithRandom(all, random).filter(question => !previousIds.has(question.id));
        selected = available.slice(0, Math.min(QUESTIONS_PER_DAILY, available.length));
        previousIds = new Set(selected.map(question => question.id));
      }
    } else {
      let hash = 216 * 31;
      for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;
      const random = () => { hash = (hash * 1664525 + 1013904223) | 0; return (hash >>> 0) / 4294967296; };
      selected = shuffleWithRandom(all, random).slice(0, Math.min(QUESTIONS_PER_DAILY, all.length));
    }
    try { localStorage.setItem(cacheKey, JSON.stringify(selected.map(question => question.id))); } catch (_) {}
    return selected;
  }

  function shuffleWithRandom(items, random) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function archiveCompletionKey(date) { return ARCHIVE_DONE_PREFIX + getDateKey(date); }
  function hasCompletedArchive(date) {
    const key = getDateKey(date);
    try {
      if (localStorage.getItem(archiveCompletionKey(key)) === "1") return true;
    } catch (_) {}
    const history = getStorage()?.getHistory?.() || [];
    return history.some(record => record.mode === "archive" && record.date === key);
  }

  function getPracticeQuestions(options = {}) {
    const all = getAllQuestions();

    const category = String(options.category || "").trim();
    const count = Math.floor(Number(options.count) || QUESTIONS_PER_DAILY);

    let pool = all;

    if (
      category &&
      !["all", "vše", "všechny", "všechny kategorie"].includes(
        category.toLowerCase()
      )
    ) {
      const normalizedCategory = category.toLowerCase();

      pool = all.filter(question =>
        String(question.category || "").toLowerCase() === normalizedCategory
      );
    }

    if (!pool.length) return [];

    const safeCount = Math.max(1, Math.min(count, pool.length));

    return shuffle(pool).slice(0, safeCount);
  }

  function getEndlessQuestions() {
    return shuffle(getAllQuestions());
  }
  function getSpeedRunQuestions() { return shuffle(getAllQuestions()).slice(0, Math.min(20, getAllQuestions().length)); }
  function getSurvivalQuestions() { return shuffle(getAllQuestions()); }
  function getMysteryQuestions() { return shuffle(getAllQuestions()).slice(0, QUESTIONS_PER_DAILY); }
  function getWorldTourQuestions() {
    const all = getAllQuestions();
    const categories = [...new Set(all.map(q => q.category).filter(Boolean))];
    return shuffle(categories.map(category => shuffle(all.filter(q => q.category === category))[0]).filter(Boolean)).slice(0, QUESTIONS_PER_DAILY);
  }

  function showToast(message, type = "info") {
    const effects = getEffects();

    if (effects && typeof effects.showToast === "function") {
      effects.showToast(message, type);
    } else {
      console.log("[DAZURIO]", message);
    }
  }

  function isLoggedIn() {
    const storage = getStorage();

    if (!storage || typeof storage.getCurrentUser !== "function") {
      return false;
    }

    try {
      return Boolean(storage.getCurrentUser());
    } catch (error) {
      console.error("Nepodařilo se ověřit přihlášení:", error);
      return false;
    }
  }

  function stopTimer() {
    if (state.timer) {
      clearInterval(state.timer);
      state.timer = null;
    }
  }

  function startTimer() {
    stopTimer();

    const seconds = state.mode === "speedrun" ? 15 : SECONDS_PER_QUESTION;
    state.timeLeft = seconds;
    updateTimerDisplay();

    state.timer = setInterval(() => {
      if (!state.active || state.answered) return;

      state.timeLeft--;
      updateTimerDisplay();

      if (state.timeLeft <= 0) {
        stopTimer();
        submitAnswer(null, true);
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const value = $("timerValue");
    const fill = $("timerFill");

    if (value) value.textContent = state.timeLeft;

    if (fill) {
      const duration = state.mode === "speedrun" ? 15 : SECONDS_PER_QUESTION;
      const percentage = (state.timeLeft / duration) * 100;

      fill.style.width = `${percentage}%`;
      fill.classList.toggle("timer-warning", state.timeLeft <= 10);
      fill.classList.toggle("timer-critical", state.timeLeft <= 5);
    }
  }

  function updateProgress() {
    const current = state.currentIndex + 1;

    const total = state.mode === "endless"
      ? state.questions.length
      : state.questions.length;

    const number = $("questionNumber");
    const totalElement = $("questionTotal");
    const progress = $("questionProgressFill");

    if (number) number.textContent = String(current).padStart(2, "0");
    if (totalElement) totalElement.textContent = total;

    if (progress) {
      progress.style.width = `${Math.min(100, (current / total) * 100)}%`;
    }
  }

  function getModeLabel() {
    switch (state.mode) {
      case "endless":
        return "NEKONEČNÝ REŽIM";
      case "practice":
        return "TRÉNINK";
      case "archive":
        return "ARCHIVNÍ VÝZVA";
      case "speedrun": return "SPEED RUN";
      case "survival": return "SURVIVAL";
      case "mystery": return "MYSTERY MODE";
      case "worldtour": return "WORLD TOUR";
      default:
        return "DENNÍ VÝZVA";
    }
  }

  function showQuestion() {
    if (!state.active) return;

    if (state.currentIndex >= state.questions.length) {
      if (state.mode === "endless") {
        const all = getAllQuestions();

        if (!all.length) {
          finishGame();
          return;
        }

        state.questions = [
          ...state.questions,
          ...shuffle(all)
        ];
      } else {
        finishGame();
        return;
      }
    }

    const question = state.questions[state.currentIndex];

    if (!question) {
      finishGame();
      return;
    }

    state.answered = false;

    const fields = {
      questionTitle: question.question,
      questionDescription: question.description || "",
      questionCategory: state.mode === "mystery" ? "MYSTERY" : (question.category || ""),
      questionDifficulty: question.difficulty || "",
      targetValue: "?",
      targetUnit: question.unit || ""
    };

    Object.entries(fields).forEach(([id, value]) => {
      const element = $(id);
      if (element) element.textContent = value;
    });

    const unitHint = $("answerUnitHint");
    if (unitHint) {
      const czechUnits = { meters: "metry (m)", kilometers: "kilometry (km)", "km²": "kilometry čtvereční (km²)", "meters per second": "metry za sekundu (m/s)", "km/h": "kilometry za hodinu (km/h)", centimeters: "centimetry (cm)", grams: "gramy (g)", liters: "litry (l)", milliliters: "mililitry (ml)", "°C": "stupně Celsia (°C)", minutes: "minuty", seconds: "sekundy", hours: "hodiny", days: "dny", years: "roky", "billion years": "miliardy let", "beats per minute": "údery za minutu", kilocalories: "kilokalorie (kcal)", players: "hráči", countries: "státy", continents: "světadíly", bones: "kosti", teeth: "zuby", neurons: "neurony", elements: "prvky", planets: "planety", combinations: "kombinace", sides: "strany", pixels: "pixely", bits: "bity", transistors: "tranzistory", keys: "klávesy", hearts: "srdce", legs: "nohy", Earths: "Země", BCE: "př. n. l.", year: "rok", "%": "procenta" };
      unitHint.textContent = question.unit
        ? (document.documentElement.lang === "cs" ? `Odpovídej v jednotkách: ${czechUnits[question.unit] || question.unit}.` : `Answer using ${question.unit}.`)
        : (document.documentElement.lang === "cs" ? "Zadej číselný odhad." : "Enter a numeric estimate.");
    }

    const input = $("answerInput");

    if (input) {
      input.value = "";
      input.disabled = false;
      input.readOnly = false;
      input.readOnly = false;
      input.removeAttribute("readonly");
      input.removeAttribute("disabled");
    }

    const result = $("answerResult");
    if (result) result.hidden = true;
    const targetDisplay = $("targetDisplay");
    if (targetDisplay) targetDisplay.hidden = true;

    const submit = $("submitAnswerButton");
    if (submit) submit.disabled = false;
    const answerForm = $("answerForm");
    answerForm?.classList.remove("answer-form-locked");
    const questionPanel = $("questionTitle")?.closest(".question-panel, .game-question-card");
    questionPanel?.classList.remove("question-enter");
    if (questionPanel) { void questionPanel.offsetWidth; questionPanel.classList.add("question-enter"); }
    if (input) window.setTimeout(() => input.focus({ preventScroll: true }), 80);

    const next = $("nextQuestionButton");
    if (next) next.hidden = true;

    const suggestions = $("answerSuggestions");
    if (suggestions) suggestions.replaceChildren();

    const modeTag = $("gameModeTag");
    if (modeTag) modeTag.textContent = getModeLabel();

    updateProgress();
    startTimer();

    if (input) input.focus();
  }

  function calculatePoints(guess, answer, question) {
    if (guess === null || !Number.isFinite(guess)) return 0;

    const difference = Math.abs(guess - answer);

    const min = Number.isFinite(Number(question.min))
      ? Number(question.min)
      : answer - 1;

    const max = Number.isFinite(Number(question.max))
      ? Number(question.max)
      : answer + 1;

    const scale = Math.max(
      Math.abs(answer) * 0.5,
      Math.abs(max - min) * 0.1,
      1
    );

    const relativeError = difference / scale;

    const points = MAX_POINTS_PER_QUESTION *
      Math.exp(-2.5 * relativeError);

    return Math.max(
      0,
      Math.min(MAX_POINTS_PER_QUESTION, Math.round(points))
    );
  }

  function parseGuess(value) {
    if (typeof value === "number") return value;
    let raw = String(value ?? "").trim().replace(/[\s\u00a0]/g, "");
    if (raw.includes(",") && !raw.includes(".")) {
      const parts = raw.split(",");
      raw = parts.length === 2 && parts[1].length <= 2
        ? parts[0].replace(/,/g, "") + "." + parts[1]
        : raw.replace(/,/g, "");
    } else {
      raw = raw.replace(/,/g, "");
    }
    raw = raw.replace(/_/g, "");
    return raw === "" ? NaN : Number(raw);
  }

  function submitAnswer(value, timedOut = false) {
    if (!state.active || state.answered) return;

    const question = state.questions[state.currentIndex];
    if (!question) return;

    const input = $("answerInput");

    let guess = value;

    if (guess == null && !timedOut) {
      guess = input ? input.value.trim() : "";
    }

    if (
      !timedOut &&
      (guess === "" || !Number.isFinite(parseGuess(guess)))
    ) {
      showToast(document.documentElement.lang === "cs" ? "Zadej platný číselný odhad." : "Enter a valid numeric estimate.", "warning");
      if (input) input.focus();
      return;
    }

    guess = timedOut ? null : parseGuess(guess);

    if (guess !== null) {
      const min = Number(question.min);
      const max = Number(question.max);

      if (Number.isFinite(min) && guess < min) {
        showToast(document.documentElement.lang === "cs" ? `Minimum je ${min}.` : `Minimum is ${min}.`, "warning");
        return;
      }

      if (Number.isFinite(max) && guess > max) {
        showToast(document.documentElement.lang === "cs" ? `Maximum je ${max}.` : `Maximum is ${max}.`, "warning");
        return;
      }
    }

    state.answered = true;
    stopTimer();

    const answer = Number(question.answer);

    const difference = guess === null
      ? null
      : Math.abs(guess - answer);

    const points = calculatePoints(guess, answer, question);

    const record = {
      questionId: question.id,
      guess,
      answer,
      difference,
      points,
      timedOut,
      category: question.category || ""
    };

    state.answers.push(record);
    if (state.mode === "survival" && points < 300) state.lives = Math.max(0, state.lives - 1);

    if (input) input.disabled = true;
    $("answerForm")?.classList.add("answer-form-locked");

    const submit = $("submitAnswerButton");
    if (submit) submit.disabled = true;

    displayAnswerResult(record, question);

    const next = $("nextQuestionButton");
    if (next) { next.hidden = false; if (state.mode === "survival" && state.lives <= 0) next.textContent = "SEE RESULTS"; }
    const resultPanel = $("answerResult");
    resultPanel?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function displayAnswerResult(record, question) {
    const result = $("answerResult");
    if (result) {
      result.hidden = false;
      result.classList.remove("answer-result-enter");
      void result.offsetWidth;
      result.classList.add("answer-result-enter");
    }
    const targetDisplay = $("targetDisplay");
    if (targetDisplay) targetDisplay.hidden = true;

    const title = $("answerResultTitle");
    const description = $("answerResultText");
    const points = $("answerResultPoints");
    const guess = $("yourGuess");
    const actual = $("actualAnswer");
    const difference = $("answerDifference");

    if (title) {
      const cs = document.documentElement.lang === "cs";
      title.textContent = record.timedOut
        ? (cs ? "Čas vypršel!" : "Time is up!")
        : record.points >= 800
          ? (cs ? "Skvělý odhad!" : "Great estimate!")
          : record.points >= 500
            ? (cs ? "Dobrý pokus!" : "Good try!")
            : (cs ? "Tentokrát to nevyšlo" : "Not quite this time");
    }

    if (description) {
      description.textContent = question.explanation ||
        (document.documentElement.lang === "cs" ? "Podívej se na správnou hodnotu a zkus další otázku." : "Check the correct value and try the next question.");
    }

    if (points) points.textContent = ["daily","endless"].includes(state.mode)
      ? `+${record.points.toLocaleString()} PTS`
      : "PRACTICE ONLY · NO POINTS OR XP";

    if (guess) {
      guess.textContent = record.guess === null
        ? (document.documentElement.lang === "cs" ? "Bez odpovědi" : "No answer")
        : Number(record.guess).toLocaleString();
    }

    if (actual) actual.textContent = Number(record.answer).toLocaleString();
    const targetLabel = document.querySelector("#targetDisplay .target-label");
    if (targetLabel) targetLabel.textContent = document.documentElement.lang === "cs" ? "SPRÁVNÁ ODPOVĚĎ" : "CORRECT ANSWER";
    const targetValue = $("targetValue");
    if (targetValue) targetValue.textContent = Number(record.answer).toLocaleString();

    if (difference) {
      difference.textContent = record.difference === null
        ? "—"
        : Number(record.difference).toLocaleString();
    }

    const effects = getEffects();

    if (
      effects &&
      record.points >= 800 &&
      typeof effects.celebrate === "function"
    ) {
      effects.celebrate();
    }
  }

  function getSummary() {
    const total = state.answers.length;

    const score = state.answers.reduce(
      (sum, answer) => sum + answer.points,
      0
    );

    const average = total
      ? Math.round(score / total)
      : 0;

    const answered = state.answers.filter(
      answer => answer.guess !== null
    );

    const accuracy = answered.length
      ? Math.round(
          answered.reduce((sum, answer) => {
            return sum + Math.max(
              0,
              100 - (
                answer.difference /
                Math.max(Math.abs(answer.answer), 1)
              ) * 100
            );
          }, 0) / answered.length
        )
      : 0;

    const differences = answered.map(answer => answer.difference);

    return {
      mode: state.mode,
      date: state.options.date || null,
      category: state.options.category || null,
      score,
      xp: (state.mode === "daily" || state.mode === "endless") ? Math.floor(score / 10) : 0,
      totalQuestions: total,
      correctAnswers: state.answers.filter(
        answer => answer.points >= 700
      ).length,
      accuracy,
      averagePoints: average,
      averageDifference: differences.length
        ? differences.reduce((a, b) => a + b, 0) / differences.length
        : 0,
      answers: state.answers,
      duration: state.startedAt
        ? Math.round((Date.now() - state.startedAt) / 1000)
        : 0,
      completedAt: new Date().toISOString()
    };
  }

  function setResultField(id, value) {
    const element = $(id);
    if (element) element.textContent = value;
  }

  function finishGame() {
    if (!state.active) return;

    state.active = false;
    stopTimer();

    const summary = getSummary();
    const storage = getStorage();
    if (state.mode === "daily" || state.mode === "archive") {
      const now = new Date();
      const key = [now.getFullYear(), String(now.getMonth()+1).padStart(2,"0"), String(now.getDate()).padStart(2,"0")].join("-");
      try {
        if (state.mode === "daily") localStorage.setItem("dazurio_daily_completed_" + key, "1");
        else localStorage.setItem(archiveCompletionKey(state.options.date || key), "1");
      } catch (_) {}
    }

    if ((state.mode === "daily" || state.mode === "endless") && isLoggedIn() && storage && typeof storage.saveGameResult === "function") {
      try {
        storage.saveGameResult(summary);
      } catch (error) {
        console.error("Nepodařilo se uložit výsledek:", error);
      }
    }

    setResultField("finalScore", summary.score);
    setResultField("finalXP", summary.xp);
    setResultField("finalAccuracy", `${summary.accuracy}%`);
    setResultField("finalAverage", summary.averagePoints);

    setResultField(
      "finalBest",
      Math.max(0, ...state.answers.map(answer => answer.points))
    );

    setResultField("finalAnswers", summary.totalQuestions);

    document.querySelectorAll(".page").forEach(page => {
      page.classList.remove("active");
    });

    if (typeof window.navigateTo === "function") {
      window.navigateTo("results");
    } else {
      document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
      $("page-results")?.classList.add("active");
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    document.dispatchEvent(new CustomEvent("dazurio:game-finished", {
      detail: summary
    }));
  }

  function safeArchiveDate(options) { return options && options.date ? options.date : new Date(); }

  function startGame(mode = "daily", options = {}) {
    if (mode === "daily" || mode === "archive") {
      const now = new Date();
      const key = [now.getFullYear(), String(now.getMonth()+1).padStart(2,"0"), String(now.getDate()).padStart(2,"0")].join("-");
      try {
        if (mode === "daily" && localStorage.getItem("dazurio_daily_completed_" + key) === "1") {
          showToast("Dnešní výzvu už máš dokončenou. Vrať se zítra!", "info");
          return false;
        }
        if (mode === "archive" && hasCompletedArchive(safeArchiveDate(options))) {
          showToast("Tuto archivní výzvu už máš odehranou.", "info");
          return false;
        }
      } catch (_) {}
    }
    // Guests may play the daily challenge; all extended modes require an account.
    if (!isLoggedIn() && mode !== "daily" && mode !== "archive") {
      showToast("Tento režim je dostupný po vytvoření účtu.", "warning");
      document.dispatchEvent(new CustomEvent("dazurio:login-required"));
      window.openAuthModal?.("register");
      return false;
    }

    const all = getAllQuestions();

    if (!all.length) {
      showToast("Nepodařilo se načíst otázky.", "error");
      return false;
    }

    if (!["daily", "practice", "endless", "archive", "speedrun", "survival", "mystery", "worldtour"].includes(mode)) {
      mode = "daily";
    }

    const safeOptions = options && typeof options === "object"
      ? { ...options }
      : {};

    let questions = [];

    if (mode === "daily" || mode === "archive") {
      questions = getDailyQuestions(safeOptions.date);
    } else if (mode === "practice") {
      questions = getPracticeQuestions(safeOptions);
    } else if (mode === "speedrun") {
      questions = getSpeedRunQuestions();
    } else if (mode === "survival") {
      questions = getSurvivalQuestions();
    } else if (mode === "mystery") {
      questions = getMysteryQuestions();
    } else if (mode === "worldtour") {
      questions = getWorldTourQuestions();
    } else {
      questions = getEndlessQuestions();
    }

    if (!questions.length) {
      showToast(
        mode === "practice"
          ? "V této kategorii nejsou dostupné žádné otázky."
          : "Pro tento režim nejsou dostupné otázky.",
        "warning"
      );

      return false;
    }

    stopTimer();

    state.mode = mode;
    state.options = safeOptions;
    state.questions = questions;
    state.currentIndex = 0;
    state.answers = [];
    state.startedAt = Date.now();
    state.active = true;
    state.answered = false;
    state.lives = 3;

    document.querySelectorAll(".page").forEach(page => {
      page.classList.remove("active");
    });

    if (typeof window.navigateTo === "function") {
      window.navigateTo("game");
    } else {
      document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
      $("page-game")?.classList.add("active");
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    showQuestion();

    return true;
  }

  function nextQuestion() {
    if (!state.active || !state.answered) return;

    if (state.mode === "survival" && state.lives <= 0) { finishGame(); return; }
    state.currentIndex++;
    showQuestion();
  }

  function abandonGame() {
    stopTimer();

    state.active = false;
    state.answered = false;
  }

  function init() {
    const form = $("answerForm");

    const answerInput = $("answerInput");
    const formatHint = $("answerFormatHint");
    if (answerInput && formatHint && !answerInput.dataset.formatBound) {
      answerInput.dataset.formatBound = "true";
      const refreshHint = () => {
        const parsed = parseGuess(answerInput.value);
        if (!Number.isFinite(parsed) || !answerInput.value.trim()) {
          formatHint.textContent = "Example: 1 000 000 = 1M";
          return;
        }
        const magnitude = Math.abs(parsed);
        const compact = magnitude >= 1e9
          ? (parsed / 1e9).toFixed(2).replace(/\\.?0+$/, "") + "B"
          : magnitude >= 1e6
            ? (parsed / 1e6).toFixed(2).replace(/\\.?0+$/, "") + "M"
            : magnitude >= 1e3
              ? (parsed / 1e3).toFixed(2).replace(/\\.?0+$/, "") + "K"
              : String(parsed);
        const grouped = parsed.toLocaleString();
        const format = $("numberFormatSelect")?.value || "grouped";
        formatHint.textContent = format === "compact"
          ? compact + "  ≈  " + grouped
          : grouped + "  ≈  " + compact;
      };
      answerInput.addEventListener("input", () => {
        const raw = answerInput.value;
        if (/^[0-9]+$/.test(raw.replace(/[\s\u00a0]/g, ""))) {
          const digits = raw.replace(/[\s\u00a0]/g, "");
          const groupedInput = digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
          if (groupedInput !== raw) {
            const oldEnd = answerInput.selectionStart === raw.length;
            answerInput.value = groupedInput;
            if (oldEnd) answerInput.setSelectionRange(groupedInput.length, groupedInput.length);
          }
        }
        refreshHint();
      });
      $("numberFormatSelect")?.addEventListener("change", refreshHint);
      refreshHint();
    }

    if (!document.body.dataset.gameKeyboardBound) {
      document.body.dataset.gameKeyboardBound = "true";
      document.addEventListener("keydown", event => {
        if (event.key !== "Enter" || !state.active || !state.answered) return;
        const keyboardToggle = $("keyboardHintsToggle");
        if (keyboardToggle && !keyboardToggle.classList.contains("active") && !keyboardToggle.classList.contains("is-active")) return;
        event.preventDefault();
        nextQuestion();
      });
    }

    if (form && !form.dataset.gameBound) {
      form.dataset.gameBound = "true";

      form.addEventListener("submit", event => {
        event.preventDefault();
        submitAnswer();
      });
    }

    const next = $("nextQuestionButton");

    if (next && !next.dataset.gameBound) {
      next.dataset.gameBound = "true";
      next.addEventListener("click", nextQuestion);
    }

    const home = $("resultsHomeButton");

    if (home && !home.dataset.gameBound) {
      home.dataset.gameBound = "true";

      home.addEventListener("click", () => {
        abandonGame();

        if (typeof window.navigateTo === "function") {
          window.navigateTo("home");
        } else {
          document.querySelectorAll(".page").forEach(page => {
            page.classList.remove("active");
          });
          $("page-home")?.classList.add("active");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    }

    const playAgain = $("playAgainButton");

    if (playAgain && !playAgain.dataset.gameBound) {
      playAgain.dataset.gameBound = "true";

      playAgain.addEventListener("click", () => {
        startGame(state.mode, state.options);
      });
    }
  }

  window.DazurioGame = {
    startGame,
    submitAnswer,
    nextQuestion,
    finishGame,
    abandonGame,
    getState: () => ({
      ...state,
      questions: [...state.questions],
      answers: [...state.answers],
      options: { ...state.options }
    }),
    getSummary
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
