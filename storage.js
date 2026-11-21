
(function () {
  "use strict";

  const STORAGE_KEY = "dazurio_local_v1";
  const VERSION = 1;
  const MAX_HISTORY = 500;

  let memoryFallback = null;

  function createEmptyDatabase() {
    return {
      version: VERSION,
      users: [],
      currentUserId: null
    };
  }

  function clone(value) {
    return value == null
      ? value
      : JSON.parse(JSON.stringify(value));
  }

  function toNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function nonNegative(value, fallback = 0) {
    return Math.max(0, toNumber(value, fallback));
  }

  function createDefaultStats() {
    return {
      xp: 0,
      level: 1,
      streak: 0,
      bestStreak: 0,
      gamesPlayed: 0,
      totalScore: 0,
      bestScore: 0,
      totalAnswers: 0,
      correctAnswers: 0,
      averageAccuracy: 0,
      lastPlayedDate: null,
      achievements: [],
      cosmetics: { frames: ["classic"], equippedFrame: "classic", titles: ["Curious Mind"], equippedTitle: "Curious Mind" }
    };
  }

  function createDefaultSettings() {
    return {
      darkMode: false,
      sound: true,
      animations: true,
      language: "en"
    };
  }

  function normalizeUser(user) {
    if (!user || typeof user !== "object") {
      return user;
    }

    user.stats = Object.assign(
      createDefaultStats(),
      user.stats || {}
    );

    user.settings = Object.assign(
      createDefaultSettings(),
      user.settings || {}
    );

    user.history = Array.isArray(user.history)
      ? user.history.filter(record =>
          record && typeof record === "object"
        )
      : [];

    user.plus = Boolean(user.plus);
    user.achievements = Array.isArray(user.achievements) ? user.achievements : [];
    user.cosmetics = Object.assign({ frames: ["classic"], equippedFrame: "classic", titles: ["Curious Mind"], equippedTitle: "Curious Mind" }, user.cosmetics || {});
    if (!Array.isArray(user.cosmetics.frames)) user.cosmetics.frames = ["classic"];
    if (!Array.isArray(user.cosmetics.titles)) user.cosmetics.titles = ["Curious Mind"];
    user.cosmetics.frames = Array.from(new Set(["classic", ...user.cosmetics.frames]));
    user.cosmetics.titles = Array.from(new Set(["Curious Mind", ...user.cosmetics.titles]));

    const stats = user.stats;

    stats.xp = nonNegative(stats.xp);
    stats.gamesPlayed = nonNegative(stats.gamesPlayed);
    stats.totalScore = nonNegative(stats.totalScore);
    stats.bestScore = nonNegative(stats.bestScore);
    stats.totalAnswers = nonNegative(stats.totalAnswers);
    stats.correctAnswers = nonNegative(stats.correctAnswers);
    stats.streak = nonNegative(stats.streak);
    stats.bestStreak = nonNegative(stats.bestStreak);

    stats.averageAccuracy = Math.max(
      0,
      Math.min(100, toNumber(stats.averageAccuracy))
    );

    stats.level = levelFromXP(stats.xp);

    return user;
  }

  function createDatabaseFromFallback() {
    return memoryFallback
      ? clone(memoryFallback)
      : createEmptyDatabase();
  }

  function readDatabase() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return createDatabaseFromFallback();
      }

      const parsed = JSON.parse(raw);

      if (!parsed || !Array.isArray(parsed.users)) {
        console.warn(
          "DAZURIO: Invalid local database. Using fallback."
        );

        return createDatabaseFromFallback();
      }

      parsed.version = VERSION;

      if (!("currentUserId" in parsed)) {
        parsed.currentUserId = null;
      }

      parsed.users = parsed.users.filter(
        user => user && typeof user === "object"
      );

      parsed.users.forEach(normalizeUser);

      const currentUserExists = parsed.users.some(
        user => user.id === parsed.currentUserId
      );

      if (!currentUserExists) {
        parsed.currentUserId = null;
      }

      return parsed;
    } catch (error) {
      console.warn(
        "DAZURIO: Local storage unavailable. Using memory fallback.",
        error
      );

      return createDatabaseFromFallback();
    }
  }

  function writeDatabase(database) {
    memoryFallback = clone(database);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(database)
      );

      return true;
    } catch (error) {
      console.warn(
        "DAZURIO: Could not persist data to local storage.",
        error
      );

      return false;
    }
  }

  function makeId() {
    if (
      window.crypto &&
      typeof window.crypto.randomUUID === "function"
    ) {
      return window.crypto.randomUUID();
    }

    return "user-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).slice(2, 10);
  }

  function normalizeUsername(username) {
    return String(username || "")
      .trim()
      .toLowerCase();
  }

  function displayUsername(username) {
    return String(username || "").trim();
  }

  function todayKey() {
    return dateKey(new Date());
  }

  function dateKey(dateValue) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return todayKey();
    }

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  }

  function daysBetween(first, second) {
    const a = new Date(first + "T12:00:00");
    const b = new Date(second + "T12:00:00");

    if (
      Number.isNaN(a.getTime()) ||
      Number.isNaN(b.getTime())
    ) {
      return 0;
    }

    return Math.round((b - a) / 86400000);
  }

  function randomSalt() {
    const bytes = new Uint8Array(16);

    if (
      window.crypto &&
      typeof window.crypto.getRandomValues === "function"
    ) {
      window.crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
    }

    return Array.from(
      bytes,
      byte => byte.toString(16).padStart(2, "0")
    ).join("");
  }

  function fallbackHash(value) {
    // Nouzový hash pouze pro lokální demo.
    let hashA = 2166136261;
    let hashB = 2246822519;

    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i);

      hashA = Math.imul(hashA ^ code, 16777619);
      hashB = Math.imul(hashB ^ code, 3266489917);
    }

    return "demo-" +
      (hashA >>> 0).toString(16).padStart(8, "0") +
      (hashB >>> 0).toString(16).padStart(8, "0");
  }

  async function hashPassword(password, salt) {
    const value = `${salt}:${password}`;

    if (
      window.crypto &&
      window.crypto.subtle &&
      window.TextEncoder
    ) {
      try {
        const bytes = new TextEncoder().encode(value);

        const digest = await window.crypto.subtle.digest(
          "SHA-256",
          bytes
        );

        const hash = Array.from(
          new Uint8Array(digest)
        )
          .map(byte =>
            byte.toString(16).padStart(2, "0")
          )
          .join("");

        return "sha256-" + hash;
      } catch (error) {
        console.warn(
          "DAZURIO: Secure hashing unavailable; using demo fallback."
        );
      }
    }

    return fallbackHash(value);
  }

  function levelProgressFromXP(xp) {
    let remaining = nonNegative(xp);
    let level = 1;
    let required = 200;
    while (remaining >= required) {
      remaining -= required;
      level += 1;
      required += 50;
      // Safety cap for extremely large/corrupt values.
      if (level > 100000) break;
    }
    return { level, current: remaining, required, remaining: Math.max(0, required - remaining) };
  }

  function levelFromXP(xp) {
    return levelProgressFromXP(xp).level;
  }

  const ACHIEVEMENTS = [
    { id:"first-game",title:"First Steps",description:"Complete your first game.",icon:"🌱",test:s=>s.gamesPlayed>=1 },
    { id:"daily-three",title:"Finding a Rhythm",description:"Reach a 3-day daily streak.",icon:"🔥",test:s=>s.bestStreak>=3 },
    { id:"daily-seven",title:"A Week of Wonder",description:"Reach a 7-day daily streak.",icon:"🌟",test:s=>s.bestStreak>=7 },
    { id:"ten-games",title:"Curiosity Habit",description:"Complete 10 games.",icon:"🧭",test:s=>s.gamesPlayed>=10 },
    { id:"hundred-answers",title:"Number Explorer",description:"Answer 100 questions.",icon:"🔢",test:s=>s.totalAnswers>=100 },
    { id:"high-score",title:"Big Brain Energy",description:"Earn 5,000 points in one game.",icon:"🏆",test:s=>s.bestScore>=5000 },
    { id:"accuracy",title:"Close Enough?",description:"Reach 80% average accuracy.",icon:"🎯",test:s=>s.gamesPlayed>=3&&s.averageAccuracy>=80 }
  ];
  const LEVEL_REWARDS=[{level:3,frame:"sage",title:"Rising Explorer"},{level:5,frame:"ocean",title:"Curiosity Seeker"},{level:10,frame:"aurora",title:"Knowledge Keeper"},{level:20,frame:"gold",title:"DAZURIO Legend"}];
  function evaluatePlayerRewards(user){normalizeUser(user);const unlocked=[];ACHIEVEMENTS.forEach(a=>{if(a.test(user.stats)&&!user.achievements.includes(a.id)){user.achievements.push(a.id);unlocked.push(a);}});LEVEL_REWARDS.forEach(r=>{if(user.stats.level>=r.level){if(!user.cosmetics.frames.includes(r.frame))user.cosmetics.frames.push(r.frame);if(!user.cosmetics.titles.includes(r.title))user.cosmetics.titles.push(r.title);}});return unlocked;}
  function getPlayerDashboard(){const user=getCurrentUser();if(!user)return null;normalizeUser(user);const history=user.history||[];const categories={};let diffTotal=0,diffCount=0;history.forEach(r=>(r.answers||[]).forEach(a=>{const c=a.category||"Other";categories[c]=(categories[c]||0)+1;const d=Number(a.difference);if(Number.isFinite(d)){diffTotal+=Math.abs(d);diffCount++;}}));return{stats:clone(user.stats),achievements:ACHIEVEMENTS.map(a=>Object.assign({},a,{unlocked:user.achievements.includes(a.id)})),cosmetics:clone(user.cosmetics),totalPoints:history.reduce((sum,r)=>sum+nonNegative(r.score),0),strongestCategory:Object.entries(categories).sort((a,b)=>b[1]-a[1])[0]?.[0]||"—",averageDifference:diffCount?Math.round(diffTotal/diffCount):0};}
  function equipCosmetic(kind,value){const db=readDatabase();const user=getCurrentUserFrom(db);if(!user)throw new Error("Sign in to customize your profile.");normalizeUser(user);if(kind==="frame"&&user.cosmetics.frames.includes(value))user.cosmetics.equippedFrame=value;else if(kind==="title"&&user.cosmetics.titles.includes(value))user.cosmetics.equippedTitle=value;else throw new Error("That cosmetic has not been unlocked yet.");writeDatabase(db);return clone(user.cosmetics);}

  function grantCosmetic(kind, value) {
    const database = readDatabase();
    const user = getCurrentUserFrom(database);
    if (!user) throw new Error("Sign in before granting a reward.");
    normalizeUser(user);
    if (kind === "title") {
      const title = String(value || "").trim().slice(0, 32);
      if (title.length < 2) throw new Error("Enter a title with at least 2 characters.");
      if (!user.cosmetics.titles.includes(title)) user.cosmetics.titles.push(title);
    } else if (kind === "frame" && ["sage", "ocean", "aurora", "gold"].includes(value)) {
      if (!user.cosmetics.frames.includes(value)) user.cosmetics.frames.push(value);
    } else {
      throw new Error("That reward is not supported.");
    }
    writeDatabase(database);
    return clone(user.cosmetics);
  }

  function getCurrentUserFrom(database) {
    return database.users.find(
      user => user.id === database.currentUserId
    ) || null;
  }

  function updateStreak(user, playedDate) {
    const previous = user.stats.lastPlayedDate;

    const difference = previous
      ? daysBetween(previous, playedDate)
      : null;

    if (difference === 0) {
      // Další hra ve stejný den sérii nezvyšuje.
    } else if (difference === 1) {
      user.stats.streak += 1;
    } else {
      user.stats.streak = 1;
    }

    user.stats.bestStreak = Math.max(
      user.stats.bestStreak || 0,
      user.stats.streak
    );

    user.stats.lastPlayedDate = playedDate;
  }

  function init() {
    const database = readDatabase();
    writeDatabase(database);
    return true;
  }

  // REGISTRACE

  async function register(username, password) {
    const cleanName = displayUsername(username);
    const normalized = normalizeUsername(username);

    if (cleanName.length < 3) {
      throw new Error(
        "Username must contain at least 3 characters."
      );
    }

    if (cleanName.length > 20) {
      throw new Error(
        "Username can contain at most 20 characters."
      );
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(cleanName)) {
      throw new Error(
        "Use only letters, numbers, dots, dashes or underscores."
      );
    }

    if (String(password || "").length < 6) {
      throw new Error(
        "Password must contain at least 6 characters."
      );
    }

    const database = readDatabase();

    const exists = database.users.some(user =>
      normalizeUsername(user.username) === normalized
    );

    if (exists) {
      throw new Error("This username is already taken.");
    }

    const salt = randomSalt();

    const passwordHash = await hashPassword(
      String(password),
      salt
    );

    const now = new Date().toISOString();

    const user = {
      id: makeId(),
      username: cleanName,
      displayName: cleanName,
      passwordSalt: salt,
      passwordHash,
      createdAt: now,
      updatedAt: now,
      stats: createDefaultStats(),
      history: [],
      settings: createDefaultSettings(),
      plus: false
    };

    database.users.push(user);
    database.currentUserId = user.id;

    writeDatabase(database);

    return clone(user);
  }

  // PŘIHLÁŠENÍ

  async function login(username, password) {
    const normalized = normalizeUsername(username);
    const database = readDatabase();

    const user = database.users.find(item =>
      normalizeUsername(item.username) === normalized
    );

    if (!user) {
      throw new Error(
        "Account not found. Check your username or register."
      );
    }

    const suppliedHash = await hashPassword(
      String(password || ""),
      user.passwordSalt
    );

    if (suppliedHash !== user.passwordHash) {
      throw new Error(
        "Incorrect password. Please try again."
      );
    }

    database.currentUserId = user.id;
    user.updatedAt = new Date().toISOString();

    writeDatabase(database);

    return clone(user);
  }

  function logout() {
    const database = readDatabase();

    database.currentUserId = null;
    writeDatabase(database);

    return true;
  }

  function getCurrentUser() {
    return clone(
      getCurrentUserFrom(readDatabase())
    );
  }

  // PROFIL

  function updateProfile(data) {
    const database = readDatabase();
    const user = getCurrentUserFrom(database);

    if (!user) {
      throw new Error("You must be logged in.");
    }

    const updates = data || {};

    if (updates.displayName !== undefined) {
      const name = String(updates.displayName).trim();

      if (name.length < 2 || name.length > 24) {
        throw new Error(
          "Display name must be between 2 and 24 characters."
        );
      }

      user.displayName = name;
    }

    if (updates.avatarUrl !== undefined) {
      const avatar = String(updates.avatarUrl || "");
      if (avatar && (!avatar.startsWith("data:image/") || avatar.length > 900000)) {
        throw new Error("Please choose a valid image under 700 KB.");
      }
      user.avatarUrl = avatar || null;
    }

    if (updates.username !== undefined) {
      const username = displayUsername(updates.username);
      const normalized = normalizeUsername(username);

      if (
        username.length < 3 ||
        username.length > 20 ||
        !/^[a-zA-Z0-9_.-]+$/.test(username)
      ) {
        throw new Error("Please enter a valid username.");
      }

      const exists = database.users.some(item =>
        item.id !== user.id &&
        normalizeUsername(item.username) === normalized
      );

      if (exists) {
        throw new Error("This username is already taken.");
      }

      user.username = username;
    }

    user.updatedAt = new Date().toISOString();

    writeDatabase(database);

    return clone(user);
  }

  function deleteAccount() {
    const database = readDatabase();
    const user = getCurrentUserFrom(database);

    if (!user) {
      throw new Error("No account is currently signed in.");
    }

    database.users = database.users.filter(
      item => item.id !== user.id
    );

    database.currentUserId = null;

    writeDatabase(database);

    return true;
  }

  // VÝSLEDKY HER

  function saveGameResult(result) {
    const database = readDatabase();
    const user = getCurrentUserFrom(database);

    if (!user) {
      throw new Error(
        "You must be logged in to save a result."
      );
    }

    normalizeUser(user);

    const input = result || {};

    const score = Math.round(
      nonNegative(input.score)
    );

    const xp = Math.round(
      nonNegative(
        input.xp !== undefined ? input.xp : score
      )
    );

    const answers = Array.isArray(input.answers)
      ? clone(input.answers)
      : [];

    const questionCount = Math.round(
      nonNegative(
        input.questionCount ??
        input.totalQuestions ??
        answers.length
      )
    );

    const accuracy = Math.max(
      0,
      Math.min(100, toNumber(input.accuracy))
    );

    const playedAt = input.completedAt ||
      new Date().toISOString();

    const playedDate = dateKey(playedAt);

    const correctAnswers = Math.round(
      nonNegative(input.correctAnswers)
    );

    const record = {
      id: makeId(),
      date: playedDate,
      completedAt: playedAt,
      mode: input.mode || "daily",
      score,
      xp,
      accuracy: Math.round(accuracy),
      questionCount,
      correctAnswers,
      averageDifference: nonNegative(
        input.averageDifference
      ),
      duration: Math.round(
        nonNegative(input.duration)
      ),
      answers
    };

    user.history.unshift(record);

    if (user.history.length > MAX_HISTORY) {
      user.history.length = MAX_HISTORY;
    }

    const stats = user.stats;

    const previousAnswerCount = nonNegative(
      stats.totalAnswers
    );

    const previousAccuracy = Math.max(
      0,
      Math.min(100, toNumber(stats.averageAccuracy))
    );

    stats.gamesPlayed += 1;
    stats.xp += xp;
    stats.level = levelFromXP(stats.xp);

    stats.totalScore += score;

    stats.bestScore = Math.max(
      stats.bestScore,
      score
    );

    stats.totalAnswers += questionCount;
    stats.correctAnswers += correctAnswers;

    // Vážený průměr: hra se 7 otázkami má větší váhu
    // než hra, ve které hráč odpověděl jen na 2 otázky.
    const newAnswerCount =
      previousAnswerCount + questionCount;

    if (newAnswerCount > 0) {
      stats.averageAccuracy = Math.round(
        (
          previousAccuracy * previousAnswerCount +
          accuracy * questionCount
        ) / newAnswerCount
      );
    }

    if (record.mode === "daily") updateStreak(user, playedDate);
    record.unlockedAchievements = evaluatePlayerRewards(user).map(a=>a.id);

    user.updatedAt = new Date().toISOString();

    writeDatabase(database);

    return clone(record);
  }

  function getHistory(limit) {
    const user = getCurrentUserFrom(readDatabase());

    if (!user) return [];

    const history = user.history || [];

    return clone(
      typeof limit === "number"
        ? history.slice(0, Math.max(0, limit))
        : history
    );
  }

  // ŽEBŘÍČEK

  function getLeaderboard(period = "all") {
    const database = readDatabase();
    const today = todayKey();

    const rows = database.users.map(user => {
      normalizeUser(user);

      const history = user.history || [];

      let matching = history;

      if (period === "daily" || period === "today") {
        matching = history.filter(
          record => record.date === today
        );
      } else if (
        period === "weekly" ||
        period === "week"
      ) {
        matching = history.filter(record => {
          const difference = daysBetween(
            record.date,
            today
          );

          return difference >= 0 && difference < 7;
        });
      } else if (
        period === "monthly" ||
        period === "month"
      ) {
        matching = history.filter(record => {
          const date = new Date(
            record.date + "T12:00:00"
          );

          const current = new Date();

          return (
            date.getFullYear() === current.getFullYear() &&
            date.getMonth() === current.getMonth()
          );
        });
      }

      const score = period === "all"
        ? user.stats.totalScore || 0
        : matching.reduce(
            (sum, record) =>
              sum + nonNegative(record.score),
            0
          );

      const games = period === "all"
        ? user.stats.gamesPlayed || 0
        : matching.length;

      return {
        id: user.id,
        username: user.username,
        displayName: user.displayName || user.username,
        score,
        games,
        level: user.stats.level || 1,
        isCurrentUser:
          user.id === database.currentUserId
      };
    });

    rows.sort((a, b) =>
      b.score - a.score || b.games - a.games
    );

    return clone(rows);
  }

  // NASTAVENÍ

  function getSettings() {
    const user = getCurrentUserFrom(readDatabase());

    return clone(
      user
        ? user.settings
        : createDefaultSettings()
    );
  }

  function updateSettings(settings) {
    const database = readDatabase();
    const user = getCurrentUserFrom(database);

    if (!user) {
      throw new Error("You must be logged in.");
    }

    user.settings = Object.assign(
      {},
      createDefaultSettings(),
      user.settings || {},
      settings || {}
    );

    user.updatedAt = new Date().toISOString();

    writeDatabase(database);

    return clone(user.settings);
  }

  // PLUS

  function isPlus() {
    const user = getCurrentUserFrom(readDatabase());

    return Boolean(user && user.plus);
  }

  function activatePlus() {
    const database = readDatabase();
    const user = getCurrentUserFrom(database);

    if (!user) {
      throw new Error("You must be logged in.");
    }

    // Pouze lokální demo, nikoliv skutečné předplatné.
    user.plus = true;
    user.updatedAt = new Date().toISOString();

    writeDatabase(database);

    return true;
  }

  // EXPORT

  function exportData() {
    const database = readDatabase();
    const user = getCurrentUserFrom(database);

    if (!user) {
      throw new Error("You must be logged in.");
    }

    const safeUser = clone(user);

    delete safeUser.passwordHash;
    delete safeUser.passwordSalt;

    return {
      app: "DAZURIO",
      version: VERSION,
      exportedAt: new Date().toISOString(),
      user: safeUser
    };
  }

  // RESET

  function resetAll() {
    const database = createEmptyDatabase();

    writeDatabase(database);

    return true;
  }

  // VEŘEJNÉ API

  window.DazurioStorage = {
    init,
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    deleteAccount,
    saveGameResult,
    getHistory,
    getLeaderboard,
    getSettings,
    updateSettings,
    isPlus,
    activatePlus,
    exportData,
    resetAll,
    levelFromXP,
    levelProgressFromXP,
    getPlayerDashboard,
    equipCosmetic,
    grantCosmetic
  };

  init();
})();
