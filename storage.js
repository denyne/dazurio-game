
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
    user.prestige = Math.max(0, nonNegative(user.prestige));
    user.mysteryBoxes = Math.max(0, nonNegative(user.mysteryBoxes));
    user.lifetimeXP = Math.max(nonNegative(user.lifetimeXP), nonNegative(user.stats.xp));
    user.showcaseAchievements = Array.isArray(user.showcaseAchievements) ? user.showcaseAchievements.slice(0,3) : [];
    user.claimedCollections = Array.isArray(user.claimedCollections) ? user.claimedCollections : [];
    user.lastComebackClaimedAt = user.lastComebackClaimedAt || null;
    user.achievements = Array.isArray(user.achievements) ? user.achievements : [];
    user.claimedWeeklyRewards = Array.isArray(user.claimedWeeklyRewards) ? user.claimedWeeklyRewards : [];
    user.friends = Array.isArray(user.friends) ? Array.from(new Set(user.friends.map(String))) : [];
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
    { id:"first-game",title:"First Steps",description:"Complete your first scored game.",icon:"🌱",rarity:"common",test:s=>s.gamesPlayed>=1 },
    { id:"daily-three",title:"Finding a Rhythm",description:"Reach a 3-day Daily streak.",icon:"🔥",rarity:"common",test:s=>s.bestStreak>=3 },
    { id:"daily-seven",title:"A Week of Wonder",description:"Reach a 7-day Daily streak.",icon:"🌟",rarity:"rare",test:s=>s.bestStreak>=7 },
    { id:"ten-games",title:"Curiosity Habit",description:"Complete 10 scored games.",icon:"🧭",rarity:"common",test:s=>s.gamesPlayed>=10 },
    { id:"twenty-five-games",title:"Dedicated Explorer",description:"Complete 25 scored games.",icon:"🗺️",rarity:"rare",test:s=>s.gamesPlayed>=25 },
    { id:"hundred-answers",title:"Number Explorer",description:"Answer 100 questions.",icon:"🔢",rarity:"rare",test:s=>s.totalAnswers>=100 },
    { id:"high-score",title:"Big Brain Energy",description:"Earn 5,000 points in one game.",icon:"🏆",rarity:"epic",test:s=>s.bestScore>=5000 },
    { id:"accuracy",title:"Close Enough?",description:"Reach 80% average accuracy.",icon:"🎯",rarity:"rare",test:s=>s.gamesPlayed>=3&&s.averageAccuracy>=80 },
    { id:"perfect-game",title:"Flawless Five",description:"Finish a game with 100% accuracy and at least five questions.",icon:"💠",rarity:"epic",test:(s,u)=>(u.history||[]).some(r=>r.questionCount>=5&&r.accuracy===100) },
    { id:"category-explorer",title:"Curiosity Without Borders",description:"Answer questions from five different categories.",icon:"🌈",rarity:"rare",test:(s,u)=>new Set((u.history||[]).flatMap(r=>(r.answers||[]).map(a=>a.category).filter(Boolean))).size>=5 },
    { id:"precision-pro",title:"Precision Pro",description:"Get ten estimates within 5% of the correct answer.",icon:"🪡",rarity:"epic",test:(s,u)=>(u.history||[]).flatMap(r=>r.answers||[]).filter(a=>a.guess!==null&&a.guess!==undefined&&Number(a.answer)!==0&&Number.isFinite(Number(a.difference))&&Math.abs(Number(a.difference))/Math.abs(Number(a.answer))<=.05).length>=10 },
    { id:"boss-first-win",title:"Face the Boss",description:"Complete your first Monthly Boss Challenge.",icon:"♛",rarity:"rare",test:(s,u)=>(u.history||[]).some(r=>r.mode==="boss") },
    { id:"boss-breaker",title:"Boss Breaker",description:"Score at least 4,500 points in a Monthly Boss Challenge.",icon:"⚔️",rarity:"legendary",test:(s,u)=>(u.history||[]).some(r=>r.mode==="boss"&&r.score>=4500) },
    { id:"trophy-curator",title:"Trophy Curator",description:"Pin three unlocked achievements to your Trophy Showcase.",icon:"🏛️",rarity:"epic",test:(s,u)=>(u.showcaseAchievements||[]).length>=3 },
    { id:"secret-answer-42",title:"The Answer to Everything",description:"Some answers are more than just numbers.",icon:"🌌",rarity:"mythic",secret:true,test:(s,u)=>(u.history||[]).some(r=>(r.answers||[]).some(a=>Number(a.answer)===42&&Number(a.guess)===42)) },
    { id:"secret-streak",title:"The Long Game",description:"Keep a 30-day streak alive.",icon:"🌙",rarity:"legendary",secret:true,test:s=>s.bestStreak>=30 },
    { id:"secret-centurion",title:"The Centurion",description:"Answer 1,000 questions.",icon:"💎",rarity:"legendary",secret:true,test:s=>s.totalAnswers>=1000 },
    { id:"secret-million",title:"Point Millionaire",description:"Earn 100,000 lifetime points.",icon:"👑",rarity:"mythic",secret:true,test:s=>s.totalScore>=100000 },
    { id:"plus-lifetime",title:"Lifetime Member",description:"Unlock DAZURIO Plus for life.",icon:"✦",rarity:"epic",test:(s,user)=>Boolean(user?.plus) }
  ];
  const LEVEL_REWARDS=[{level:3,frame:"sage",title:"Rising Explorer"},{level:5,frame:"ocean",title:"Curiosity Seeker"},{level:10,frame:"fire",title:"Knowledge Keeper"},{level:20,frame:"sage",title:"Grand Explorer"},{level:30,frame:"ocean",title:"Prismatic Mind"},{level:50,frame:"fire",title:"Cosmic Scholar"}];
  const STREAK_REWARDS=[{days:3,frame:"fire",title:"On a Roll"},{days:7,frame:"ocean",title:"Seven-Day Spark"},{days:14,frame:"sage",title:"Fortnight Focus"},{days:30,frame:"fire",title:"DAZURIO Devotee"},{days:100,frame:"ocean",title:"Century of Curiosity"}];
  function evaluatePlayerRewards(user){normalizeUser(user);const unlocked=[];ACHIEVEMENTS.forEach(a=>{if(a.test(user.stats,user)&&!user.achievements.includes(a.id)){user.achievements.push(a.id);unlocked.push(a);}});LEVEL_REWARDS.forEach(r=>{if(user.stats.level>=r.level){if(!user.cosmetics.frames.includes(r.frame))user.cosmetics.frames.push(r.frame);if(!user.cosmetics.titles.includes(r.title))user.cosmetics.titles.push(r.title);}});STREAK_REWARDS.forEach(r=>{if(user.stats.bestStreak>=r.days){if(!user.cosmetics.frames.includes(r.frame))user.cosmetics.frames.push(r.frame);if(!user.cosmetics.titles.includes(r.title))user.cosmetics.titles.push(r.title);}});return unlocked;}
  function getPlayerDashboard(){const user=getCurrentUser();if(!user)return null;normalizeUser(user);const history=user.history||[];const categories={};let diffTotal=0,diffCount=0;history.forEach(r=>(r.answers||[]).forEach(a=>{const c=a.category||"Other";categories[c]=(categories[c]||0)+1;const d=Number(a.difference);if(Number.isFinite(d)){diffTotal+=Math.abs(d);diffCount++;}}));const achievements=ACHIEVEMENTS.map(a=>{const unlocked=user.achievements.includes(a.id);return Object.assign({},a,{unlocked, title:a.secret&&!unlocked?"Hidden achievement":a.title, description:a.secret&&!unlocked?"A secret trophy. Its condition is known only to its discoverer.":a.description});});const defs=[["first-steps","First Steps","🌱","Complete your first scored game",user.stats.gamesPlayed>=1],["wildlife","Animal Kingdom","🦉","Answer 5 animal questions",(categories.Animals||0)>=5],["world","World Traveler","🌍","Answer 5 geography questions",(categories.Geography||0)>=5],["history","Ancient Worlds","⌛","Answer 5 history questions",(categories.History||0)>=5],["science","Curious Scientist","🔬","Answer 5 science questions",(categories.Science||0)>=5],["space","Space Explorer","🚀","Answer 5 space questions",(categories.Space||0)>=5],["human-body","Human Body","🫀","Answer 5 human body questions",(categories["Human Body"]||0)>=5],["technology","Future Technology","🤖","Answer 5 technology questions",(categories.Technology||0)>=5],["food","Food for Thought","🍓","Answer 5 food questions",(categories.Food||0)>=5],["sports","Sports Fan","🏅","Answer 5 sports questions",(categories.Sports||0)>=5],["streak","Streak Society","🔥","Reach a 7-day Daily streak",user.stats.bestStreak>=7],["plus","Plus Star","✦","Unlock lifetime Plus",Boolean(user.plus)]];const rewards={"first-steps":"Curious Pioneer",wildlife:"Wildlife Guardian",world:"World Voyager",history:"Keeper of Time",science:"Science Seeker",space:"Cosmic Explorer","human-body":"Body Expert",technology:"Future Thinker",food:"Flavor Scholar",sports:"Arena Legend",streak:"Streak Keeper",plus:"Starlight Collector"};const collections=defs.map(([id,title,icon,description,earned])=>({id,title,icon,description,earned,claimed:user.claimedCollections.includes(id),rewardTitle:rewards[id]}));return{stats:clone(user.stats),achievements,collections,cosmetics:clone(user.cosmetics),isPlus:Boolean(user.plus),totalPoints:history.reduce((sum,r)=>sum+nonNegative(r.score),0),strongestCategory:Object.entries(categories).sort((a,b)=>b[1]-a[1])[0]?.[0]||"—",averageDifference:diffCount?Math.round(diffTotal/diffCount):0,categoryCounts:clone(categories),recentGames:history.length,averageScore:history.length?Math.round(history.reduce((n,r)=>n+nonNegative(r.score),0)/history.length):0};}

  function getDeepInsights() {
    const user = getCurrentUser();
    if (!user) return null;
    normalizeUser(user);
    const history = (user.history || []).filter(r => r && ["daily", "endless"].includes(r.mode || "daily"));
    const categoryMap = {};
    const dailyMap = {};
    let totalAnswers = 0, within5 = 0, within10 = 0, within20 = 0;
    let relativeErrorTotal = 0, relativeErrorCount = 0;
    let bestEstimate = null, largestMiss = null;
    history.forEach(record => {
      const date = record.date || dateKey(record.completedAt || new Date());
      const day = dailyMap[date] || (dailyMap[date] = { games: 0, score: 0, accuracy: 0, answers: 0 });
      day.games += 1; day.score += nonNegative(record.score); day.accuracy += nonNegative(record.accuracy); day.answers += nonNegative(record.questionCount);
      (record.answers || []).forEach(answer => {
        totalAnswers++;
        const category = String(answer.category || "Other");
        const bucket = categoryMap[category] || (categoryMap[category] = { category, answers: 0, within5: 0, within10: 0, within20: 0, errorTotal: 0, errorCount: 0, precisionTotal: 0 });
        bucket.answers++;
        const actual = Math.abs(Number(answer.answer));
        const difference = Math.abs(Number(answer.difference));
        if (Number.isFinite(actual) && actual > 0 && Number.isFinite(difference)) {
          const percent = difference / actual * 100;
          bucket.errorTotal += percent; bucket.errorCount++;
          bucket.precisionTotal += Math.max(0, 100 - percent);
          relativeErrorTotal += percent; relativeErrorCount++;
          if (percent <= 5) { within5++; bucket.within5++; }
          if (percent <= 10) { within10++; bucket.within10++; }
          if (percent <= 20) { within20++; bucket.within20++; }
          const candidate = { questionId: answer.questionId, category, percent, difference, guess: answer.guess, answer: answer.answer };
          if (!bestEstimate || percent < bestEstimate.percent) bestEstimate = candidate;
          if (!largestMiss || percent > largestMiss.percent) largestMiss = candidate;
        }
      });
    });
    const categories = Object.values(categoryMap).map(c => ({
      category: c.category, answers: c.answers,
      precision: c.errorCount ? Math.round(c.precisionTotal / c.errorCount) : null,
      averageError: c.errorCount ? Math.round(c.errorTotal / c.errorCount * 10) / 10 : null,
      within10: c.errorCount ? Math.round(c.within10 / c.errorCount * 100) : null
    })).sort((a,b) => (b.precision ?? -1) - (a.precision ?? -1));
    const today = dateKey(new Date());
    const start = new Date(today + "T12:00:00");
    const dayRows = [];
    for (let i=13;i>=0;i--) {
      const d = new Date(start.getTime() - i*86400000);
      const key = dateKey(d), row = dailyMap[key];
      dayRows.push({ date:key, label:key.slice(5), games:row?.games||0, score:row?.score||0, accuracy:row?.games?Math.round(row.accuracy/row.games):0 });
    }
    const avg = rows => rows.length ? Math.round(rows.reduce((n,r)=>n+nonNegative(r.accuracy),0)/rows.length) : null;
    const last7 = history.filter(r => daysBetween(r.date || today, today) >= 0 && daysBetween(r.date || today, today) < 7);
    const previous7 = history.filter(r => daysBetween(r.date || today, today) >= 7 && daysBetween(r.date || today, today) < 14);
    const currentAvg = avg(last7), previousAvg = avg(previous7);
    const eligible = categories.filter(c => c.answers >= 3 && c.precision !== null);
    const weakest = [...eligible].sort((a,b)=>a.precision-b.precision)[0] || null;
    const strongest = [...eligible].sort((a,b)=>b.precision-a.precision)[0] || null;
    const bestGame = [...history].sort((a,b)=>nonNegative(b.score)-nonNegative(a.score))[0] || null;
    return {
      games: history.length, answers: totalAnswers,
      averageAccuracy: history.length ? Math.round(history.reduce((n,r)=>n+nonNegative(r.accuracy),0)/history.length) : 0,
      averageRelativeError: relativeErrorCount ? Math.round(relativeErrorTotal/relativeErrorCount*10)/10 : null,
      within5: relativeErrorCount ? Math.round(within5/relativeErrorCount*100) : 0,
      within10: relativeErrorCount ? Math.round(within10/relativeErrorCount*100) : 0,
      within20: relativeErrorCount ? Math.round(within20/relativeErrorCount*100) : 0,
      categories, trend: dayRows, bestGame: bestGame ? { score:bestGame.score, date:bestGame.date, accuracy:bestGame.accuracy } : null,
      bestEstimate, largestMiss,
      currentWeekAccuracy: currentAvg, previousWeekAccuracy: previousAvg,
      weekChange: currentAvg !== null && previousAvg !== null ? currentAvg-previousAvg : null,
      strongest, weakest
    };
  }

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
      if (title === "OWNER") user.cosmetics.equippedTitle = "OWNER";
    } else if (kind === "frame" && ["sage", "ocean", "aurora", "gold", "fire", "prism", "starlight", "owner"].includes(value)) {
      if (!user.cosmetics.frames.includes(value)) user.cosmetics.frames.push(value);
      if (value === "owner") user.cosmetics.equippedFrame = "owner";
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
    const input = result || {};
    if (!["daily", "endless", "boss"].includes(input.mode || "daily")) {
      throw new Error("This mode does not save rewarded results.");
    }
    const database = readDatabase();
    const user = getCurrentUserFrom(database);

    if (!user) {
      throw new Error(
        "You must be logged in to save a result."
      );
    }

    normalizeUser(user);

    const bossMonth = input.mode === "boss" ? String(input.bossMonth || dateKey(new Date()).slice(0,7)) : null;
    if (input.mode === "boss" && user.history.some(item => item.mode === "boss" && item.bossMonth === bossMonth)) {
      throw new Error("This month’s Boss Challenge has already been completed.");
    }

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
      bossMonth,
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
    user.lifetimeXP += xp;
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
    if (record.mode === "boss" && score >= 2500) { if (!user.cosmetics.titles.includes("Monthly Champion")) user.cosmetics.titles.push("Monthly Champion"); if (!user.cosmetics.frames.includes("boss")) user.cosmetics.frames.push("boss"); record.bossReward = true; }
    if (stats.gamesPlayed > 0 && stats.gamesPlayed % 10 === 0) user.mysteryBoxes += 1;
    if (record.mode === "daily" && stats.bestStreak > 0 && stats.bestStreak % 7 === 0 && stats.streak === stats.bestStreak) user.mysteryBoxes += 1;
    record.unlockedAchievements = evaluatePlayerRewards(user).map(a=>a.id);

    user.updatedAt = new Date().toISOString();

    writeDatabase(database);

    return clone(record);
  }

  function claimWeeklyReward(weekStart) {
    const database = readDatabase();
    const user = getCurrentUserFrom(database);
    if (!user) throw new Error("Sign in to claim weekly quest rewards.");
    normalizeUser(user);
    const start = String(weekStart || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(start)) throw new Error("Invalid weekly period.");
    if (user.claimedWeeklyRewards.includes(start)) return false;
    const endDate = new Date(start + "T12:00:00");
    endDate.setDate(endDate.getDate() + 7);
    const end = dateKey(endDate.toISOString());
    const records = (user.history || []).filter(record => record.date >= start && record.date < end && ["daily", "endless"].includes(record.mode));
    const dailyCount = records.filter(record => record.mode === "daily").length;
    const answers = records.flatMap(record => record.answers || []);
    const categories = new Set(answers.map(answer => answer.category).filter(Boolean));
    if (dailyCount < 3 || answers.length < 35 || categories.size < 3) {
      throw new Error("Complete all three weekly quests before claiming the reward.");
    }
    user.claimedWeeklyRewards.push(start);
    user.stats.xp += 150;
    user.lifetimeXP += 150;
    user.stats.level = levelFromXP(user.stats.xp);
    evaluatePlayerRewards(user);
    user.updatedAt = new Date().toISOString();
    writeDatabase(database);
    return true;
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


  // LOCAL COMMUNITY TOOLS — profiles are limited to this browser's database.
  function getLocalPlayers() {
    const db = readDatabase();
    return clone(db.users.map(user => {
      normalizeUser(user);
      return { id:user.id, username:user.username, displayName:user.displayName || user.username, level:user.stats.level || 1, score:user.stats.totalScore || 0, plus:Boolean(user.plus), equippedTitle:user.cosmetics.equippedTitle || "Curious Mind", avatarUrl:user.avatarUrl || "" };
    }));
  }
  function addFriend(username) {
    const db = readDatabase();
    const current = getCurrentUserFrom(db);
    if (!current) throw new Error("Sign in to add friends.");
    normalizeUser(current);
    const wanted = normalizeUsername(username);
    if (!wanted) throw new Error("Enter a username.");
    const target = db.users.find(user => normalizeUsername(user.username) === wanted);
    if (!target) throw new Error("That player is not registered in this browser yet.");
    if (target.id === current.id) throw new Error("You cannot add yourself.");
    if (current.friends.includes(target.id)) throw new Error("This player is already your friend.");
    current.friends.push(target.id);
    writeDatabase(db);
    return getFriends();
  }
  function removeFriend(userId) {
    const db = readDatabase();
    const current = getCurrentUserFrom(db);
    if (!current) throw new Error("Sign in first.");
    normalizeUser(current);
    current.friends = current.friends.filter(id => id !== String(userId));
    writeDatabase(db);
    return getFriends();
  }
  function getFriends() {
    const db = readDatabase();
    const current = getCurrentUserFrom(db);
    if (!current) return [];
    normalizeUser(current);
    return clone(current.friends.map(id => db.users.find(user => user.id === id)).filter(Boolean).map(user => {
      normalizeUser(user);
      return { id:user.id, username:user.username, displayName:user.displayName || user.username, level:user.stats.level || 1, score:user.stats.totalScore || 0, plus:Boolean(user.plus), equippedTitle:user.cosmetics.equippedTitle || "Curious Mind" };
    }).sort((a,b)=>b.score-a.score));
  }
  function getAchievementCatalog() {
    return clone(ACHIEVEMENTS.map(({id,title,description,icon}) => ({id,title,description,icon})));
  }
  function grantAchievementToPlayer(userId, achievementId) {
    const db = readDatabase();
    const user = db.users.find(item => item.id === String(userId));
    if (!user) throw new Error("Player not found in this browser.");
    normalizeUser(user);
    const achievement = ACHIEVEMENTS.find(item => item.id === String(achievementId));
    if (!achievement) throw new Error("Choose a valid achievement.");
    const alreadyUnlocked = user.achievements.includes(achievement.id);
    if (!alreadyUnlocked) user.achievements.push(achievement.id);
    writeDatabase(db);
    return {title:achievement.title, alreadyUnlocked};
  }

  function grantCosmeticToPlayer(userId, kind, value) {
    const db = readDatabase();
    const user = db.users.find(item => item.id === String(userId));
    if (!user) throw new Error("Player not found in this browser.");
    normalizeUser(user);
    if (kind === "title") {
      const title = String(value || "").trim().slice(0,32);
      if (title.length < 2) throw new Error("Enter a title with at least 2 characters.");
      if (!user.cosmetics.titles.includes(title)) user.cosmetics.titles.push(title);
      if (title === "OWNER") user.cosmetics.equippedTitle = "OWNER";
    } else if (kind === "frame" && ["sage","ocean","aurora","gold","fire","prism","starlight","owner"].includes(value)) {
      if (!user.cosmetics.frames.includes(value)) user.cosmetics.frames.push(value);
      if (value === "owner") user.cosmetics.equippedFrame = "owner";
    } else throw new Error("Unsupported reward.");
    writeDatabase(db);
    return true;
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

  function redeemPlusCode(code) {
    const database = readDatabase();
    const user = getCurrentUserFrom(database);
    if (!user) throw new Error("You must be logged in.");
    const submitted = String(code || "").trim().toUpperCase();
    // Client-side prototype redemption. A production entitlement must be validated server-side.
    if (submitted !== "DAZURIO-STARLIGHT-FOREVER") throw new Error("That Plus code is not valid.");
    if (user.plus) throw new Error("DAZURIO Plus is already unlocked on this profile.");
    user.plus = true;
    user.plusLifetime = true;
    user.plusUnlockedAt = new Date().toISOString();
    user.cosmetics = Object.assign({frames:["classic"],equippedFrame:"classic",titles:["Curious Mind"],equippedTitle:"Curious Mind"},user.cosmetics||{});
    ["aurora","gold","prism","starlight"].forEach(frame => { if (!user.cosmetics.frames.includes(frame)) user.cosmetics.frames.push(frame); });
    ["DAZURIO LEGEND","STARLIGHT","PLUS ELITE","EARLY ACCESS"].forEach(title => { if (!user.cosmetics.titles.includes(title)) user.cosmetics.titles.push(title); });
    evaluatePlayerRewards(user);
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


  function getLegendsProgress() {
    const user=getCurrentUserFrom(readDatabase()); if(!user)return null; normalizeUser(user);
    const gap=user.stats.lastPlayedDate?daysBetween(user.stats.lastPlayedDate,todayKey()):0;
    return {prestige:user.prestige,mysteryBoxes:user.mysteryBoxes,lifetimeXP:user.lifetimeXP,level:user.stats.level,canPrestige:user.stats.level>=25,comebackAvailable:gap>=3&&user.lastComebackClaimedAt!==todayKey(),showcase:clone(user.showcaseAchievements)};
  }
  function openMysteryBox() {
    const db=readDatabase(),user=getCurrentUserFrom(db); if(!user)throw new Error("Sign in to open mystery boxes."); normalizeUser(user);
    if(user.mysteryBoxes<1)throw new Error("Earn a Mystery Box every 10 rewarded games or 7-day streak.");
    user.mysteryBoxes--; const roll=Math.random()*100; let rarity,reward;
    if(roll<1){rarity="MYTHIC";reward={kind:"title",value:"DAZURIO LEGEND"};}
    else if(roll<6){rarity="LEGENDARY";reward={kind:"frame",value:"prism"};}
    else if(roll<22){rarity="EPIC";reward={kind:"title",value:"Mystery Hunter"};}
    else if(roll<52){rarity="RARE";reward={kind:"frame",value:Math.random()<.5?"ocean":"sage"};}
    else{rarity="COMMON";reward={kind:"xp",value:75};}
    if(reward.kind==="title"&&!user.cosmetics.titles.includes(reward.value))user.cosmetics.titles.push(reward.value);
    if(reward.kind==="frame"&&!user.cosmetics.frames.includes(reward.value))user.cosmetics.frames.push(reward.value);
    if(reward.kind==="xp"){user.stats.xp+=75;user.lifetimeXP+=75;user.stats.level=levelFromXP(user.stats.xp);}
    writeDatabase(db); return {rarity,reward};
  }
  function claimComebackReward() {
    const db=readDatabase(),user=getCurrentUserFrom(db);if(!user)throw new Error("Sign in to claim your comeback reward.");normalizeUser(user);
    const gap=user.stats.lastPlayedDate?daysBetween(user.stats.lastPlayedDate,todayKey()):0;
    if(gap<3||user.lastComebackClaimedAt===todayKey())throw new Error("Return after at least 3 days away to claim this reward.");
    user.lastComebackClaimedAt=todayKey();user.stats.xp+=100;user.lifetimeXP+=100;user.stats.level=levelFromXP(user.stats.xp);user.mysteryBoxes++;evaluatePlayerRewards(user);writeDatabase(db);return true;
  }
  function performPrestige() {
    const db=readDatabase(),user=getCurrentUserFrom(db);if(!user)throw new Error("Sign in to enter Prestige.");normalizeUser(user);
    if(user.stats.level<25)throw new Error("Reach level 25 to unlock Prestige.");
    user.prestige++;user.stats.xp=0;user.stats.level=1;const title="PRESTIGE "+user.prestige;
    if(!user.cosmetics.titles.includes(title))user.cosmetics.titles.push(title);user.cosmetics.equippedTitle=title;
    if(!user.cosmetics.frames.includes("gold"))user.cosmetics.frames.push("gold");user.cosmetics.equippedFrame="gold";writeDatabase(db);return {prestige:user.prestige,title};
  }
  function saveTrophyShowcase(ids) {
    const db=readDatabase(),user=getCurrentUserFrom(db);if(!user)throw new Error("Sign in to edit your trophy showcase.");normalizeUser(user);
    const selected=Array.from(new Set((Array.isArray(ids)?ids:[]).map(String))).slice(0,3);
    user.showcaseAchievements=selected.filter(id=>user.achievements.includes(id)&&ACHIEVEMENTS.some(a=>a.id===id));const unlocked=evaluatePlayerRewards(user);writeDatabase(db);return {showcase:clone(user.showcaseAchievements),unlocked:unlocked.map(a=>a.id)};
  }


  function getMonthlyBossStatus(){const user=getCurrentUser();const monthKey=dateKey(new Date()).slice(0,7);if(!user)return{available:false,played:false,monthKey,bestScore:0,record:null};normalizeUser(user);const records=user.history.filter(r=>r.mode==="boss");const record=records.find(r=>r.bossMonth===monthKey)||null;const best=records.reduce((a,r)=>!a||nonNegative(r.score)>nonNegative(a.score)?r:a,null);return{available:!record,played:Boolean(record),monthKey,bestScore:best?nonNegative(best.score):0,record:record?clone(record):null,rewardUnlocked:Boolean(record&&record.bossReward)};}
  function getPersonalRecords(){const user=getCurrentUser();if(!user)return null;normalizeUser(user);const history=user.history.filter(r=>["daily","endless","boss"].includes(r.mode));const answers=history.flatMap(r=>(r.answers||[]).map(a=>({...a,playedDate:r.date||r.completedAt})));const relative=answers.filter(a=>a.guess!==null&&a.guess!==undefined&&a.difference!==null&&a.difference!==undefined&&Number.isFinite(Number(a.answer))&&Math.abs(Number(a.answer))>0&&Number.isFinite(Number(a.difference))).map(a=>({...a,error:Math.abs(Number(a.difference))/Math.abs(Number(a.answer))*100}));const closest=relative.sort((a,b)=>a.error-b.error)[0]||null;const biggestMiss=[...relative].sort((a,b)=>b.error-a.error)[0]||null;const bestScore=history.reduce((b,r)=>!b||nonNegative(r.score)>nonNegative(b.score)?r:b,null);const bestAccuracy=history.reduce((b,r)=>!b||nonNegative(r.accuracy)>nonNegative(b.accuracy)?r:b,null);const fastest=history.filter(r=>nonNegative(r.duration)>0).sort((a,b)=>nonNegative(a.duration)-nonNegative(b.duration))[0]||null;return{games:history.length,answers:answers.length,bestScore:bestScore?clone(bestScore):null,bestAccuracy:bestAccuracy?clone(bestAccuracy):null,closest,biggestMiss,fastest,bestStreak:nonNegative(user.stats.bestStreak),totalPoints:history.reduce((n,r)=>n+nonNegative(r.score),0)};}
  function getWrappedStats(yearValue){const user=getCurrentUser();if(!user)return null;normalizeUser(user);const year=Math.max(2000,Math.min(9999,Math.floor(Number(yearValue)||new Date().getFullYear())));const records=user.history.filter(r=>["daily","endless","boss"].includes(r.mode)&&String(r.date||r.completedAt||"").slice(0,4)===String(year));const categories={},months={};let answers=0,score=0,xp=0,accuracy=0,best=null;records.forEach(r=>{score+=nonNegative(r.score);xp+=nonNegative(r.xp);accuracy+=nonNegative(r.accuracy);if(!best||nonNegative(r.score)>nonNegative(best.score))best=r;const m=String(r.date||r.completedAt||"").slice(0,7);months[m]=(months[m]||0)+1;(r.answers||[]).forEach(a=>{answers++;const c=a.category||"Other";categories[c]=(categories[c]||0)+1;});});const top=Object.entries(categories).sort((a,b)=>b[1]-a[1])[0]||null;return{year,games:records.length,answers,score,xp,averageAccuracy:records.length?Math.round(accuracy/records.length):0,topCategory:top?top[0]:"—",bestGame:best?{score:best.score,date:best.date,accuracy:best.accuracy,mode:best.mode}:null,busiestMonth:Object.entries(months).sort((a,b)=>b[1]-a[1])[0]?.[0]||null};}
  function claimCollectionReward(collectionId){const db=readDatabase(),user=getCurrentUserFrom(db);if(!user)throw new Error("Sign in to claim collection rewards.");normalizeUser(user);const item=getPlayerDashboard()?.collections?.find(c=>c.id===String(collectionId));if(!item||!item.earned)throw new Error("This collection is not complete yet.");if(user.claimedCollections.includes(item.id))throw new Error("This collection reward has already been claimed.");user.claimedCollections.push(item.id);if(!user.cosmetics.titles.includes(item.rewardTitle))user.cosmetics.titles.push(item.rewardTitle);writeDatabase(db);return{title:item.rewardTitle,id:item.id};}

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
    claimWeeklyReward,
    getLeaderboard,
    getSettings,
    updateSettings,
    isPlus,
    redeemPlusCode,
    exportData,
    resetAll,
    levelFromXP,
    levelProgressFromXP,
    getPlayerDashboard,
    getDeepInsights,
    getMonthlyBossStatus,
    getPersonalRecords,
    getWrappedStats,
    claimCollectionReward,
    equipCosmetic,
    grantCosmetic,
    getLocalPlayers,
    addFriend,
    removeFriend,
    getFriends,
    grantCosmeticToPlayer,
    getAchievementCatalog,
    grantAchievementToPlayer,
    getLegendsProgress,
    openMysteryBox,
    claimComebackReward,
    performPrestige,
    saveTrophyShowcase
  };

  init();
})();
