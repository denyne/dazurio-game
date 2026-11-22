
(() => {
  "use strict";

  const QUESTIONS_PER_DAILY = 7;
  const DAILY_SET_PREFIX = "dazurio_daily_set_v6_";
  const ARCHIVE_DONE_PREFIX = "dazurio_archive_completed_";
  const SECONDS_PER_QUESTION = 25;
  const MAX_POINTS_PER_QUESTION = 1000;
  const SURVIVAL_SCORE_LIMIT = 10000;
  const SURVIVAL_XP_LIMIT = 1000;

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

    // New easy/medium expansion is shared by Practice and regular modes.
    // The separate Boss bank is never merged into this pool.
    const expansion = Array.isArray(window.DAZURIO_DAILY_EXPANSION)
      ? window.DAZURIO_DAILY_EXPANSION
      : [];
    questions = questions.concat(expansion);

    // The regular game pool intentionally excludes HARD questions.
    // Specialist-level questions live only in the separate Monthly Boss bank.
    return questions.filter(question =>
      question &&
      typeof question.question === "string" &&
      Number.isFinite(Number(question.answer)) &&
      String(question.difficulty || "medium").toLowerCase() !== "hard" &&
      !String(question.id || "").startsWith("boss-hard-")
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
      // DAZURIO's official daily reset timezone: Europe/Prague.
      // Players in different timezones therefore share one calendar day.
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Prague", year: "numeric", month: "2-digit", day: "2-digit"
      }).formatToParts(new Date());
      const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
      return values.year + "-" + values.month + "-" + values.day;
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
    const db = getDatabase();
    // Freeze the original bank for every historical date through 2026-11-22.
    // From 2026-11-23 onward, Daily/Archive use the expanded shared bank.
    // This preserves today's Daily and every previous Archive entry exactly.
    const dayKey = getDateKey(dateValue);
    const legacyBank = db && typeof db.getBuiltIn === "function"
      ? db.getBuiltIn()
      : getAllQuestions();
    const expandedBank = Array.isArray(window.DAZURIO_DAILY_EXPANSION)
      ? window.DAZURIO_DAILY_EXPANSION
      : [];
    const dailySource = dayKey > "2026-11-22"
      ? legacyBank.concat(expandedBank)
      : legacyBank;
    const all = dailySource.filter(question =>
        question &&
        typeof question.question === "string" &&
        Number.isFinite(Number(question.answer)) &&
        String(question.difficulty || "medium").toLowerCase() !== "hard" &&
        !String(question.id || "").startsWith("boss-hard-")
      );
    if (all.length < QUESTIONS_PER_DAILY) return [];

    const seedVersion = dayKey > "2026-11-22" ? "v7" : "v6";
    const seed = "DAZURIO-DAILY-" + seedVersion + ":" + dayKey;
    // Small deterministic PRNG: same date + same shipped bank = same seven IDs,
    // order and answers on every browser/device, regardless of localStorage.
    let hash = 2166136261;
    for (let i = 0; i < seed.length; i++) {
      hash ^= seed.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const random = () => {
      hash += 0x6D2B79F5;
      let value = hash;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
    return shuffleWithRandom(all, random).slice(0, QUESTIONS_PER_DAILY);
  }

  function shuffleWithRandom(items, random) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function getResumeKey(mode = state.mode, date = null) {
    if (mode !== "daily" && mode !== "archive") return null;
    const day = mode === "archive" ? getDateKey(date || state.options?.date) : getDateKey();
    return "dazurio_in_progress_" + mode + "_" + day;
  }

  function saveInProgress() {
    const key = getResumeKey();
    if (!key || !state.questions.length || !state.active) return;
    const nextIndex = state.answered ? state.currentIndex + 1 : state.currentIndex;
    const payload = {
      version: 1,
      mode: state.mode,
      date: state.mode === "archive" ? getDateKey(state.options?.date) : getDateKey(),
      options: state.options,
      questionIds: state.questions.map(question => question.id),
      currentIndex: nextIndex,
      answers: state.answers,
      lives: state.lives,
      savedAt: Date.now()
    };
    try { localStorage.setItem(key, JSON.stringify(payload)); } catch (error) {
      console.warn("[DAZURIO] Could not save game progress.", error);
    }
  }

  function loadInProgress(mode, options, questions) {
    const key = getResumeKey(mode, mode === "archive" ? safeArchiveDate(options) : null);
    if (!key) return null;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const saved = JSON.parse(raw);
      if (!saved || saved.version !== 1 || saved.mode !== mode) return null;
      const byId = new Map(questions.map(question => [String(question.id), question]));
      const restoredQuestions = (saved.questionIds || []).map(id => byId.get(String(id))).filter(Boolean);
      if (restoredQuestions.length !== questions.length || restoredQuestions.some((question, index) => String(question.id) !== String(saved.questionIds[index]))) return null;
      if (!Array.isArray(saved.answers) || !Number.isInteger(saved.currentIndex) || saved.currentIndex < 0 || saved.currentIndex > restoredQuestions.length) return null;
      return { key, saved, questions: restoredQuestions };
    } catch (_) { return null; }
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
    const difficulty = String(options.difficulty || "all").toLowerCase();

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

    if (difficulty !== "all") pool = pool.filter(question => String(question.difficulty || "").toLowerCase() === difficulty);
    if (difficulty !== "all") pool = pool.filter(question => String(question.difficulty || "").toLowerCase() === difficulty);
    if (!pool.length) return [];

    const safeCount = Math.max(1, Math.min(count, pool.length));

    return shuffle(pool).slice(0, safeCount);
  }

  function getBossQuestions(options = {}) {
    const bank=Array.isArray(window.DAZURIO_BOSS_QUESTIONS)?window.DAZURIO_BOSS_QUESTIONS:[];
    const month=String(options.monthKey||new Date().toISOString().slice(0,7));
    if(bank.length<5){console.error("[DAZURIO] Exclusive Boss question bank is missing.");return [];}
    const hash=value=>{let h=2166136261;for(const ch of String(value))h=Math.imul(h^ch.charCodeAt(0),16777619);return h>>>0;};
    return [...bank].sort((a,b)=>hash(month+":"+a.id)-hash(month+":"+b.id)).slice(0,5).map(q=>Object.assign({},q,{suggestions:[...(q.suggestions||[])]}));
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

  function updateJourneyProgress(feedbackPoints = null) {
    const score = state.answers.reduce((sum, answer) => sum + Number(answer.points || 0), 0);
    const cappedScore = Math.min(7000, Math.max(0, score));
    const progress = cappedScore / 7000 * 100;
    const fill = $("journeyTrackFill");
    const marker = $("journeyMarker");
    const scoreLabel = $("journeyScore");
    const headingLabel = $("journeyHeadingLabel");
    if (headingLabel) headingLabel.textContent = document.documentElement.lang === "cs" ? "CESTA ZA BODY" : "POINTS TRAIL";
    const percentLabel = $("journeyPercent");
    const feedback = $("sceneFeedback");
    if (fill) fill.style.width = progress + "%";
    if (marker) marker.style.left = progress + "%";
    if (scoreLabel) scoreLabel.innerHTML = cappedScore.toLocaleString() + " <small>/ 7,000 PTS</small>";
    if (percentLabel) percentLabel.textContent = Math.round(progress) + "%";
    if (feedback && feedbackPoints !== null) {
      const cs = document.documentElement.lang === "cs";
      const label = feedbackPoints >= 900 ? (cs ? "FANTASTICKÝ ODHAD" : "EXCELLENT ESTIMATE")
        : feedbackPoints >= 700 ? (cs ? "SKVĚLÝ ODHAD" : "GREAT ESTIMATE")
        : feedbackPoints >= 400 ? (cs ? "DOBRÝ ODHAD" : "GOOD ESTIMATE")
        : (cs ? "KAŽDÝ BOD SE POČÍTÁ" : "EVERY POINT COUNTS");
      feedback.textContent = (feedbackPoints > 0 ? "+" + feedbackPoints.toLocaleString() + " PTS  ·  " : "+0 PTS  ·  ") + label;
      feedback.dataset.grade = feedbackPoints >= 900 ? "excellent" : feedbackPoints >= 700 ? "great" : feedbackPoints >= 400 ? "good" : "low";
      feedback.classList.remove("journey-feedback-show");
      void feedback.offsetWidth;
      feedback.classList.add("journey-feedback-show");
    }
    const scene = $("gameScene");
    if (scene) {
      scene.classList.toggle("journey-complete", cappedScore >= 7000);
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
      case "survival": return (document.documentElement.lang === "cs" ? "SURVIVAL · " + state.lives + " ŽIVOTY" : "SURVIVAL · " + state.lives + " LIVES");
      case "mystery": return "MYSTERY MODE";
      case "worldtour": return "WORLD TOUR";
      case "zen": return "ZEN MODE";
      case "boss": return "BOSS CHALLENGE";
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
      const cs = document.documentElement.lang === "cs";
      unitHint.textContent = question.unit
        ? (cs ? `JEDNOTKA ODPOVĚDI: ${czechUnits[question.unit] || question.unit}` : `ANSWER UNIT: ${question.unit}`)
        : (cs ? "Zadej číselný odhad." : "Enter a numeric estimate.");
      unitHint.parentElement?.classList.toggle("has-unit", Boolean(question.unit));
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
    if (answerForm) answerForm.hidden = false;
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
    const timerHud = document.querySelector(".game-timer-hud");
    if (timerHud) { timerHud.hidden = state.mode === "zen"; timerHud.style.display = state.mode === "zen" ? "none" : ""; }
    if (state.mode === "zen") {
      stopTimer();
      state.timeLeft = 0;
      updateTimerDisplay();
    } else {
      startTimer();
    }

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

    const earnsProgress = ["daily", "survival", "boss"].includes(state.mode);
    const rawPoints = earnsProgress ? calculatePoints(guess, answer, question) : 0;
    const currentScore = state.answers.reduce((sum, item) => sum + Number(item.points || 0), 0);
    const points = state.mode === "survival"
      ? Math.min(rawPoints, Math.max(0, SURVIVAL_SCORE_LIMIT - currentScore))
      : rawPoints;

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
    if (state.mode !== "survival") saveInProgress();
    updateJourneyProgress(points);
    if (state.mode === "survival" && rawPoints < 300) state.lives = Math.max(0, state.lives - 1);
    if (state.mode === "survival") { const tag = $("gameModeTag"); if (tag) tag.textContent = getModeLabel(); }

    if (input) input.disabled = true;
    $("answerForm")?.classList.add("answer-form-locked");
    // Replace the input panel with the feedback panel so the result is immediately visible.
    if ($("answerForm")) $("answerForm").hidden = true;

    const submit = $("submitAnswerButton");
    if (submit) submit.disabled = true;

    displayAnswerResult(record, question);
    if (window.DazurioEffects) {
      const resultCard = $("answerResult");
      if (record.difference === 0) window.DazurioEffects.celebrate(resultCard, "great");
      else if (record.points >= 700) window.DazurioEffects.celebrate(resultCard, "success");
      else window.DazurioEffects.sound("miss");
    }

    const next = $("nextQuestionButton");
    if (next) {
      next.hidden = false;
      if (state.mode === "survival" && (state.lives <= 0 || state.answers.reduce((sum, item) => sum + Number(item.points || 0), 0) >= SURVIVAL_SCORE_LIMIT)) {
        next.textContent = document.documentElement.lang === "cs" ? "ZOBRAZIT VÝSLEDKY" : "SEE RESULTS";
      }
    }
    // Bring the complete feedback into view; otherwise it can sit below the fold unnoticed.
    window.setTimeout(() => {
      const resultPanel = $("answerResult");
      if (resultPanel && !resultPanel.hidden) {
        resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
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

    const cs = document.documentElement.lang === "cs";
    const exact = record.difference === 0;
    const resultTimer = $("resultTimerValue");
    const resultTimerCaption = $("resultTimerCaption");
    if (resultTimer) resultTimer.textContent = "00:" + String(Math.max(0, Number(state.timeLeft) || 0)).padStart(2, "0");
    if (resultTimerCaption) resultTimerCaption.textContent = cs ? "ZBÝVAJÍCÍ ČAS" : "TIME LEFT";

    const totalGameScore = state.answers.reduce((sum, answer) => sum + Number(answer.points || 0), 0);
    const victory = $("journeyVictory");
    if (victory) {
      victory.hidden = totalGameScore < 7000;
      const victoryText = $("journeyVictoryText");
      if (victoryText) victoryText.textContent = cs ? "DOKONALÁ JÍZDA · CESTA DOKONČENA" : "PERFECT RUN · JOURNEY COMPLETE";
    }

    const verdict = exact ? "exact" : record.points >= 700 ? "close" : record.points >= 400 ? "near" : "far";
    const verdictLabel = exact ? (cs ? "NAPROSTO PŘESNĚ!" : "BULLSEYE!")
      : verdict === "close" ? (cs ? "SKVĚLÝ ODHAD!" : "GREAT ESTIMATE!")
      : verdict === "near" ? (cs ? "DOBRÝ POKUS!" : "NICE TRY!")
      : (cs ? "TENTOKRÁT TO NEVYŠLO" : "NOT QUITE THIS TIME");
    const verdictNode = $("answerVerdict");
    if (verdictNode) verdictNode.dataset.verdict = record.timedOut ? "far" : verdict;
    const verdictLabelNode = $("answerVerdictLabel");
    if (verdictLabelNode) verdictLabelNode.textContent = record.timedOut ? (cs ? "ČAS VYPRŠEL" : "TIME IS UP") : verdictLabel;
    const verdictSymbol = $("answerVerdictSymbol");
    if (verdictSymbol) verdictSymbol.textContent = exact ? "✓" : verdict === "close" ? "✦" : verdict === "near" ? "≈" : "·";
    const verdictDetail = $("answerVerdictDetail");
    if (verdictDetail) verdictDetail.textContent = exact ? (cs ? "PERFEKTNÍ SHODA" : "PERFECT MATCH") : record.timedOut ? (cs ? "ZKUS TO ZNOVU" : "TRY AGAIN") : (cs ? "ODHAD VYHODNOCEN" : "ESTIMATE CHECKED");
    if (title) title.textContent = record.timedOut
      ? (cs ? "Čas vypršel!" : "Time is up!")
      : exact ? (cs ? "Trefil/a jsi to přesně." : "You got it exactly.")
      : verdict === "close" ? (cs ? "Tohle byl parádní odhad." : "That was a brilliant estimate.")
      : verdict === "near" ? (cs ? "Jsi na dobré cestě." : "You're getting there.")
      : (cs ? "Každý odhad tě něco naučí." : "Every guess teaches you something.");
        if (description) {
      description.textContent = cs
        ? "Správná hodnota je odhalená. Pokračuj na další otázku."
        : "The correct value is revealed. Continue to the next question.";
    }
    const comboNode = $("answerCombo");
    let combo = 0;
    for (let i = state.answers.length - 1; i >= 0; i--) {
      if (Number(state.answers[i]?.points || 0) < 700) break;
      combo++;
    }
    if (comboNode) {
      comboNode.hidden = combo < 2;
      comboNode.textContent = combo < 2 ? "" : (cs ? "SÉRIE ×" : "STREAK ×") + combo;
      comboNode.dataset.combo = combo >= 4 ? "high" : combo >= 3 ? "medium" : "low";
    }
    if (result) {
      result.classList.remove("answer-impact-exact", "answer-impact-great", "answer-impact-soft");
      const impact = record.difference === 0 ? "answer-impact-exact" : record.points >= 700 ? "answer-impact-great" : "answer-impact-soft";
      result.classList.add(impact);
    }

    if (points) {
      points.textContent = ["daily","survival","boss"].includes(state.mode)
        ? `+${record.points.toLocaleString()} PTS`
        : "PRACTICE MODE · NO POINTS";
      points.dataset.grade = record.points >= 900 ? "excellent" : record.points >= 700 ? "great" : record.points >= 400 ? "good" : "low";
    }
    const answerPointsStat = $("answerPointsStat");
    const totalScoreStat = $("answerTotalScoreStat");
    const accuracyStat = $("answerAccuracyStat");
    if (answerPointsStat) answerPointsStat.textContent = "+" + record.points.toLocaleString();
    if (totalScoreStat) totalScoreStat.textContent = state.answers.reduce((sum, item) => sum + Number(item.points || 0), 0).toLocaleString();
    if (accuracyStat) {
      const accuracy = record.guess === null ? 0 : record.answer === 0
        ? (record.difference === 0 ? 100 : 0)
        : Math.max(0, 100 - Math.abs(record.difference / record.answer) * 100);
      accuracyStat.textContent = record.guess === null ? "—" : Math.round(accuracy) + "%";
    }

    if (guess) {
      guess.textContent = record.guess === null
        ? (document.documentElement.lang === "cs" ? "Bez odpovědi" : "No answer")
        : Number(record.guess).toLocaleString();
    }

    if (actual) actual.textContent = Number(record.answer).toLocaleString();
    const actualHero = $("actualAnswerHero");
    if (actualHero) actualHero.textContent = Number(record.answer).toLocaleString();
    const actualLabel = $("actualAnswerLabel");
    if (actualLabel) actualLabel.textContent = cs ? "SPRÁVNÁ ODPOVĚĎ" : "CORRECT ANSWER";
    const accuracyNote = $("answerAccuracyNote");
    if (accuracyNote) {
      const relative = record.answer === 0 ? null : Math.abs(record.difference / record.answer) * 100;
      accuracyNote.textContent = record.timedOut ? (cs ? "TVŮJ ČAS VYPRŠEL" : "TIME RAN OUT")
        : exact ? (cs ? "ODHAD BEZ ODCHYLKY" : "ZERO DIFFERENCE")
        : relative === null ? (cs ? "ODCHYLKA OD SPRÁVNÉ HODNOTY" : "DISTANCE FROM THE ANSWER")
        : (cs ? "ODCHYLKA " : "OFF BY ") + relative.toLocaleString(undefined,{maximumFractionDigits:1}) + "%";
    }
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

    const rawScore = state.answers.reduce(
      (sum, answer) => sum + Number(answer.points || 0),
      0
    );
    const score = state.mode === "survival" ? Math.min(SURVIVAL_SCORE_LIMIT, rawScore) : rawScore;

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
      xp: (state.mode === "daily" || state.mode === "boss") ? Math.floor(score / 10) : state.mode === "survival" ? Math.min(SURVIVAL_XP_LIMIT, Math.floor(score / 10)) : 0,
      endReason: state.mode === "survival" ? (state.lives <= 0 ? "lives" : score >= SURVIVAL_SCORE_LIMIT ? "score-limit" : "questions-complete") : null,
      bossMonth: state.mode === "boss" ? String(state.options.monthKey || new Date().toISOString().slice(0,7)) : null,
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
    const resumeKey = getResumeKey();
    if (resumeKey) { try { localStorage.removeItem(resumeKey); } catch (_) {} }
    const storage = getStorage();
    if (state.mode === "daily" || state.mode === "archive" || ["survival", "zen", "speedrun"].includes(state.mode)) {
      const key = getDateKey();
      try {
        if (state.mode === "daily") localStorage.setItem("dazurio_daily_completed_" + key, "1");
        else if (state.mode === "archive") localStorage.setItem(archiveCompletionKey(state.options.date || key), "1");
        else localStorage.setItem("dazurio_once_" + state.mode + "_" + key, "1");
      } catch (_) {}
    }

    if ((state.mode === "daily" || state.mode === "survival" || state.mode === "boss") && isLoggedIn() && storage && typeof storage.saveGameResult === "function") {
      try {
        storage.saveGameResult(summary);
      } catch (error) {
        console.error("Nepodařilo se uložit výsledek:", error);
      }
    }

    if (window.DazurioEffects) {
      window.DazurioEffects.sound("finish");
      const scoreCard = $("page-results")?.querySelector(".results-score-card");
      if (scoreCard && summary.score >= 5000) window.DazurioEffects.createParticles(scoreCard, summary.score >= 7000 ? 48 : 24, summary.score >= 7000 ? 1.35 : 1);
    }
    setResultField("finalScore", summary.score);
    $("page-results")?.classList.toggle("results-perfect-run", summary.score >= 7000);
    const resultsIntro = $("resultsSubtitle");
    if (resultsIntro && state.mode === "survival") {
      const cs = document.documentElement.lang === "cs";
      resultsIntro.textContent = summary.endReason === "lives"
        ? (cs ? "Došly ti všechny životy. Zkus to znovu a překonej svůj rekord!" : "You used all your lives. Try again and beat your record!")
        : summary.endReason === "score-limit"
          ? (cs ? "Skvělé! Dosáhl/a jsi limitu 10 000 bodů." : "Amazing! You reached the 10,000-point limit.")
          : (cs ? "Doběhl celý balíček otázek. Tady je tvůj výsledek!" : "You completed the question pool. Here is your result!");
    } else if (resultsIntro && summary.score >= 7000) {
      resultsIntro.textContent = document.documentElement.lang === "cs"
        ? "Dokonalá jízda. Dosáhl/a jsi maximálního skóre!"
        : "A perfect run. You reached the maximum score!";
    }

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
    if (mode === "daily" || mode === "archive" || ["survival", "zen", "speedrun"].includes(mode)) {
      const key = getDateKey();
      try {
        if (mode === "daily" && localStorage.getItem("dazurio_daily_completed_" + key) === "1") {
          showToast("Dnešní výzvu už máš dokončenou. Vrať se zítra!", "info");
          return false;
        }
        if (["survival", "zen", "speedrun"].includes(mode) && localStorage.getItem("dazurio_once_" + mode + "_" + key) === "1") {
          const labels = { survival: "Survival", zen: "Zen Mode", speedrun: "Speed Run" };
          showToast((labels[mode] || mode) + " už máš dnes odehraný. Zkus to znovu zítra!", "info");
          return false;
        }
        if (mode === "archive" && hasCompletedArchive(safeArchiveDate(options))) {
          showToast("Tuto archivní výzvu už máš odehranou.", "info");
          return false;
        }
      } catch (_) {}
    }
    if (mode === "boss" && getStorage()?.getMonthlyBossStatus?.().played) { showToast("This month’s Boss Challenge is already complete. A new boss arrives next month.", "info"); return false; }
    if (mode === "practice" && !options?.sharedChallenge && !getStorage()?.isPlus?.() && (Number(options?.count || 10) > 20 || (options?.difficulty && options.difficulty !== "all"))) {
      showToast("Advanced practice is a DAZURIO Plus feature.", "warning");
      return false;
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

    if (!["daily", "practice", "endless", "archive", "speedrun", "survival", "mystery", "worldtour", "boss", "zen"].includes(mode)) {
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
    } else if (mode === "zen") {
      questions = shuffle(getAllQuestions()).slice(0, 10);
    } else if (mode === "speedrun") {
      questions = getSpeedRunQuestions();
    } else if (mode === "survival") {
      questions = getSurvivalQuestions();
    } else if (mode === "mystery") {
      questions = getMysteryQuestions();
    } else if (mode === "worldtour") {
      questions = getWorldTourQuestions();
    } else if (mode === "boss") {
      questions = getBossQuestions(safeOptions);
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

    const resumed = loadInProgress(mode, safeOptions, questions);
    state.mode = mode;
    state.options = resumed ? { ...safeOptions, ...(resumed.saved.options || {}) } : safeOptions;
    state.questions = resumed ? resumed.questions : questions;
    state.currentIndex = resumed ? resumed.saved.currentIndex : 0;
    state.answers = resumed ? resumed.saved.answers : [];
    state.startedAt = resumed?.saved?.savedAt || Date.now();
    state.active = true;
    state.answered = false;
    state.lives = resumed ? Math.max(0, Number(resumed.saved.lives) || 0) : 3;
    updateJourneyProgress();

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

    if (resumed && state.currentIndex >= state.questions.length) {
      finishGame();
      return true;
    }
    showQuestion();
    if (resumed) showToast(document.documentElement.lang === "cs" ? "Pokračuješ tam, kde jsi skončil/a." : "Resuming where you left off.", "info");

    return true;
  }

  function nextQuestion() {
    if (!state.active || !state.answered) return;

    if (state.mode === "survival" && (state.lives <= 0 || state.answers.reduce((sum, item) => sum + Number(item.points || 0), 0) >= SURVIVAL_SCORE_LIMIT)) { finishGame(); return; }
    state.currentIndex++;
    showQuestion();
  }

  function abandonGame() {
    if (state.active) saveInProgress();
    stopTimer();

    state.active = false;
    state.answered = false;
  }

  function init() {
    if (!window.__dazurioResumeBound) {
      window.__dazurioResumeBound = true;
      window.addEventListener("pagehide", () => { if (state.active) saveInProgress(); });
      document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden" && state.active) saveInProgress(); });
    }
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
