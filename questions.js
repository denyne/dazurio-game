
/*
  DAZURIO — QUESTION DATABASE
  Version: 2.0
  Local prototype — no backend required.

  Each question contains:
  id          Unique question identifier
  category    Category name
  difficulty  easy | medium | hard
  question    Main question
  description Additional explanation
  answer      Correct numerical answer
  unit        Answer unit
  min         Minimum allowed guess
  max         Maximum allowed guess
  suggestions Suggested answer values
*/

(function () {
  "use strict";

  const QUESTIONS = [

    // ==========================================
    // GEOGRAPHY
    // ==========================================

    {
      id: "geo-001",
      category: "Geography",
      difficulty: "easy",
      question: "How many countries are there in the world?",
      description: "Use the commonly cited total of internationally recognized sovereign states.",
      answer: 195,
      unit: "countries",
      min: 0,
      max: 300,
      suggestions: [100, 150, 195, 220]
    },
    {
      id: "geo-002",
      category: "Geography",
      difficulty: "medium",
      question: "How tall is Mount Everest?",
      description: "Estimate the height of the world's highest mountain above sea level.",
      answer: 8849,
      unit: "meters",
      min: 0,
      max: 15000,
      suggestions: [5000, 7000, 8849, 10000]
    },
    {
      id: "geo-003",
      category: "Geography",
      difficulty: "medium",
      question: "How long is the Nile River?",
      description: "Use the commonly cited estimate of its total length.",
      answer: 6650,
      unit: "kilometers",
      min: 0,
      max: 12000,
      suggestions: [3000, 5000, 6650, 9000]
    },
    {
      id: "geo-004",
      category: "Geography",
      difficulty: "easy",
      question: "How many continents are commonly recognized?",
      description: "Use the traditional seven-continent model.",
      answer: 7,
      unit: "continents",
      min: 0,
      max: 20,
      suggestions: [4, 5, 6, 7]
    },
    {
      id: "geo-005",
      category: "Geography",
      difficulty: "hard",
      question: "How large is the Sahara Desert?",
      description: "Estimate its area in square kilometers.",
      answer: 9200000,
      unit: "km²",
      min: 0,
      max: 20000000,
      suggestions: [2000000, 5000000, 9200000, 15000000]
    },
    {
      id: "geo-006",
      category: "Geography",
      difficulty: "medium",
      question: "How deep is the Mariana Trench at its deepest known point?",
      description: "Estimate the depth below sea level.",
      answer: 10935,
      unit: "meters",
      min: 0,
      max: 15000,
      suggestions: [5000, 8000, 10935, 13000]
    },
    {
      id: "geo-007",
      category: "Geography",
      difficulty: "medium",
      question: "What is the approximate circumference of Earth?",
      description: "Measure around the planet at the equator.",
      answer: 40075,
      unit: "kilometers",
      min: 0,
      max: 80000,
      suggestions: [20000, 30000, 40075, 60000]
    },
    {
      id: "geo-008",
      category: "Geography",
      difficulty: "hard",
      question: "How large is Greenland?",
      description: "Estimate its total area.",
      answer: 2166000,
      unit: "km²",
      min: 0,
      max: 5000000,
      suggestions: [500000, 1000000, 2166000, 3500000]
    },

    // ==========================================
    // SCIENCE
    // ==========================================

    {
      id: "sci-001",
      category: "Science",
      difficulty: "easy",
      question: "What is the speed of light?",
      description: "Estimate the speed of light in a vacuum.",
      answer: 299792458,
      unit: "meters per second",
      min: 0,
      max: 500000000,
      suggestions: [100000000, 200000000, 299792458, 400000000]
    },
    {
      id: "sci-002",
      category: "Science",
      difficulty: "easy",
      question: "At what temperature does water boil?",
      description: "Assume normal atmospheric pressure at sea level.",
      answer: 100,
      unit: "°C",
      min: -50,
      max: 200,
      suggestions: [50, 75, 100, 125]
    },
    {
      id: "sci-003",
      category: "Science",
      difficulty: "medium",
      question: "How many bones are in an adult human body?",
      description: "Estimate the usual number in a healthy adult.",
      answer: 206,
      unit: "bones",
      min: 0,
      max: 400,
      suggestions: [106, 156, 206, 256]
    },
    {
      id: "sci-004",
      category: "Science",
      difficulty: "medium",
      question: "How far is Earth from the Sun on average?",
      description: "Estimate the average distance in kilometers.",
      answer: 149600000,
      unit: "kilometers",
      min: 0,
      max: 300000000,
      suggestions: [50000000, 100000000, 149600000, 250000000]
    },
    {
      id: "sci-005",
      category: "Science",
      difficulty: "hard",
      question: "How old is Earth?",
      description: "Estimate the age of our planet.",
      answer: 4540000000,
      unit: "years",
      min: 0,
      max: 10000000000,
      suggestions: [1000000000, 3000000000, 4540000000, 8000000000]
    },
    {
      id: "sci-006",
      category: "Science",
      difficulty: "medium",
      question: "How many chemical elements are officially known?",
      description: "Count the elements currently recognized in the periodic table.",
      answer: 118,
      unit: "elements",
      min: 0,
      max: 200,
      suggestions: [50, 90, 118, 150]
    },
    {
      id: "sci-007",
      category: "Science",
      difficulty: "hard",
      question: "How fast does sound travel through air?",
      description: "Estimate its speed at around 20°C.",
      answer: 343,
      unit: "meters per second",
      min: 0,
      max: 1000,
      suggestions: [100, 250, 343, 600]
    },
    {
      id: "sci-008",
      category: "Science",
      difficulty: "medium",
      question: "How long does Earth take to orbit the Sun?",
      description: "Give the approximate number of days.",
      answer: 365.25,
      unit: "days",
      min: 0,
      max: 1000,
      suggestions: [100, 200, 365, 500]
    },

    // ==========================================
    // HUMAN BODY
    // ==========================================

    {
      id: "body-001",
      category: "Human Body",
      difficulty: "easy",
      question: "How many times does the average adult heart beat per minute at rest?",
      description: "Use a typical resting heart rate. Actual rates vary between people.",
      answer: 70,
      unit: "beats per minute",
      min: 0,
      max: 200,
      suggestions: [40, 60, 70, 100]
    },
    {
      id: "body-002",
      category: "Human Body",
      difficulty: "medium",
      question: "How much blood does an average adult have?",
      description: "Estimate the total blood volume.",
      answer: 5,
      unit: "liters",
      min: 0,
      max: 15,
      suggestions: [2, 4, 5, 8]
    },
    {
      id: "body-003",
      category: "Human Body",
      difficulty: "easy",
      question: "How many teeth does a typical adult have including wisdom teeth?",
      description: "Count a complete set of adult teeth.",
      answer: 32,
      unit: "teeth",
      min: 0,
      max: 60,
      suggestions: [20, 24, 28, 32]
    },
    {
      id: "body-004",
      category: "Human Body",
      difficulty: "medium",
      question: "How long is the small intestine in an adult?",
      description: "Estimate its length when relaxed.",
      answer: 600,
      unit: "centimeters",
      min: 0,
      max: 1500,
      suggestions: [200, 400, 600, 1000]
    },
    {
      id: "body-005",
      category: "Human Body",
      difficulty: "hard",
      question: "How many neurons are in the human brain?",
      description: "Estimate the number of nerve cells.",
      answer: 86000000000,
      unit: "neurons",
      min: 0,
      max: 200000000000,
      suggestions: [10000000000, 40000000000, 86000000000, 150000000000]
    },
    {
      id: "body-006",
      category: "Human Body",
      difficulty: "medium",
      question: "How many liters of air can an average adult lung hold?",
      description: "Estimate total lung capacity. It varies with body size and other factors.",
      answer: 6,
      unit: "liters",
      min: 0,
      max: 15,
      suggestions: [2, 4, 6, 10]
    },

    // ==========================================
    // ANIMALS
    // ==========================================

    {
      id: "animal-001",
      category: "Animals",
      difficulty: "easy",
      question: "How fast can a cheetah run?",
      description: "Estimate its commonly cited peak sprinting speed.",
      answer: 110,
      unit: "km/h",
      min: 0,
      max: 200,
      suggestions: [50, 80, 110, 150]
    },
    {
      id: "animal-002",
      category: "Animals",
      difficulty: "medium",
      question: "How long can an elephant live?",
      description: "Estimate the lifespan of an elephant. It varies by species and conditions.",
      answer: 65,
      unit: "years",
      min: 0,
      max: 150,
      suggestions: [20, 40, 65, 100]
    },
    {
      id: "animal-003",
      category: "Animals",
      difficulty: "easy",
      question: "How many hearts does an octopus have?",
      description: "Count all of its hearts.",
      answer: 3,
      unit: "hearts",
      min: 0,
      max: 10,
      suggestions: [1, 2, 3, 5]
    },
    {
      id: "animal-004",
      category: "Animals",
      difficulty: "hard",
      question: "How long can a blue whale grow?",
      description: "Estimate the maximum length of this giant animal.",
      answer: 30,
      unit: "meters",
      min: 0,
      max: 50,
      suggestions: [10, 20, 30, 40]
    },
    {
      id: "animal-005",
      category: "Animals",
      difficulty: "medium",
      question: "How many hours a day does a koala typically sleep?",
      description: "Estimate its daily sleeping time.",
      answer: 20,
      unit: "hours",
      min: 0,
      max: 24,
      suggestions: [8, 12, 16, 20]
    },
    {
      id: "animal-006",
      category: "Animals",
      difficulty: "medium",
      question: "How many teeth can a garden snail have?",
      description: "Estimate the number of tiny tooth-like structures on its radula.",
      answer: 14000,
      unit: "teeth",
      min: 0,
      max: 50000,
      suggestions: [1000, 5000, 14000, 30000]
    },
    {
      id: "animal-007",
      category: "Animals",
      difficulty: "hard",
      question: "How fast can a peregrine falcon dive?",
      description: "Estimate its maximum speed during a hunting dive.",
      answer: 320,
      unit: "km/h",
      min: 0,
      max: 500,
      suggestions: [100, 200, 320, 450]
    },
    {
      id: "animal-008",
      category: "Animals",
      difficulty: "easy",
      question: "How many legs does a spider have?",
      description: "Count the legs of a typical adult spider.",
      answer: 8,
      unit: "legs",
      min: 0,
      max: 20,
      suggestions: [4, 6, 8, 10]
    },

    // ==========================================
    // SPACE
    // ==========================================

    {
      id: "space-001",
      category: "Space",
      difficulty: "medium",
      question: "How many planets are in our Solar System?",
      description: "Count the officially recognized planets.",
      answer: 8,
      unit: "planets",
      min: 0,
      max: 20,
      suggestions: [5, 6, 8, 9]
    },
    {
      id: "space-002",
      category: "Space",
      difficulty: "hard",
      question: "How long does sunlight take to reach Earth?",
      description: "Estimate the travel time in minutes.",
      answer: 8.3,
      unit: "minutes",
      min: 0,
      max: 30,
      suggestions: [1, 5, 8.3, 15]
    },
    {
      id: "space-003",
      category: "Space",
      difficulty: "medium",
      question: "How many Earths could fit inside the Sun by volume?",
      description: "Estimate the approximate number.",
      answer: 1300000,
      unit: "Earths",
      min: 0,
      max: 3000000,
      suggestions: [100000, 500000, 1300000, 2500000]
    },
    {
      id: "space-004",
      category: "Space",
      difficulty: "hard",
      question: "How far away is the Moon from Earth on average?",
      description: "Estimate the average distance between their centers.",
      answer: 384400,
      unit: "kilometers",
      min: 0,
      max: 1000000,
      suggestions: [100000, 250000, 384400, 700000]
    },
    {
      id: "space-005",
      category: "Space",
      difficulty: "medium",
      question: "How many days does Mars take to orbit the Sun?",
      description: "Estimate one Martian year in Earth days.",
      answer: 687,
      unit: "days",
      min: 0,
      max: 1500,
      suggestions: [200, 365, 687, 1000]
    },
    {
      id: "space-006",
      category: "Space",
      difficulty: "hard",
      question: "How old is the universe?",
      description: "Estimate its age in billions of years.",
      answer: 13.8,
      unit: "billion years",
      min: 0,
      max: 30,
      suggestions: [5, 10, 13.8, 20]
    },

    // ==========================================
    // HISTORY
    // ==========================================

    {
      id: "history-001",
      category: "History",
      difficulty: "easy",
      question: "In what year did the first Moon landing happen?",
      description: "Give the year of the Apollo 11 landing.",
      answer: 1969,
      unit: "year",
      min: 1800,
      max: 2100,
      suggestions: [1900, 1950, 1969, 2000]
    },
    {
      id: "history-002",
      category: "History",
      difficulty: "medium",
      question: "How many years passed between the start of the Roman Empire under Augustus and the fall of the Western Roman Empire?",
      description: "Use 27 BCE as the beginning of the Empire and 476 CE as the fall of the Western Roman Empire. The result is approximate.",
      answer: 503,
      unit: "years",
      min: 0,
      max: 1500,
      suggestions: [200, 400, 503, 1000]
    },
    {
      id: "history-003",
      category: "History",
      difficulty: "medium",
      question: "How many years ago were the pyramids of Giza built?",
      description: "Estimate the age of the Great Pyramid.",
      answer: 4500,
      unit: "years",
      min: 0,
      max: 10000,
      suggestions: [1000, 2500, 4500, 7000]
    },
    {
      id: "history-004",
      category: "History",
      difficulty: "easy",
      question: "In what year did World War II end?",
      description: "Give the year the war ended.",
      answer: 1945,
      unit: "year",
      min: 1800,
      max: 2100,
      suggestions: [1918, 1939, 1945, 1960]
    },
    {
      id: "history-005",
      category: "History",
      difficulty: "hard",
      question: "How many years did the Hundred Years' War actually last?",
      description: "Estimate the period from 1337 to 1453.",
      answer: 116,
      unit: "years",
      min: 0,
      max: 300,
      suggestions: [50, 100, 116, 200]
    },
    {
      id: "history-006",
      category: "History",
      difficulty: "medium",
      question: "In which year was Rome traditionally founded?",
      description: "Use the traditional founding date associated with Romulus.",
      answer: 753,
      unit: "BCE",
      min: 0,
      max: 1500,
      suggestions: [500, 700, 753, 1000]
    },

    // ==========================================
    // TECHNOLOGY
    // ==========================================

    {
      id: "tech-001",
      category: "Technology",
      difficulty: "easy",
      question: "How many keys does a standard full-size piano have?",
      description: "Count all the white and black keys.",
      answer: 88,
      unit: "keys",
      min: 0,
      max: 150,
      suggestions: [49, 61, 76, 88]
    },
    {
      id: "tech-002",
      category: "Technology",
      difficulty: "medium",
      question: "How many pixels are in a 4K UHD image?",
      description: "Use the standard 3840 × 2160 resolution.",
      answer: 8294400,
      unit: "pixels",
      min: 0,
      max: 20000000,
      suggestions: [1000000, 4000000, 8294400, 16000000]
    },
    {
      id: "tech-003",
      category: "Technology",
      difficulty: "medium",
      question: "How many bits are in one byte?",
      description: "Use the standard computing definition.",
      answer: 8,
      unit: "bits",
      min: 0,
      max: 32,
      suggestions: [2, 4, 8, 16]
    },
    {
      id: "tech-004",
      category: "Technology",
      difficulty: "hard",
      question: "How many transistors can a high-end modern processor chip contain?",
      description: "Some advanced chips contain tens of billions of transistors. The exact count varies by model.",
      answer: 50000000000,
      unit: "transistors",
      min: 0,
      max: 150000000000,
      suggestions: [1000000000, 10000000000, 50000000000, 100000000000]
    },
    {
      id: "tech-005",
      category: "Technology",
      difficulty: "easy",
      question: "How many keys does a typical computer keyboard have?",
      description: "Estimate a standard desktop keyboard.",
      answer: 104,
      unit: "keys",
      min: 0,
      max: 200,
      suggestions: [60, 80, 104, 150]
    },
    {
      id: "tech-006",
      category: "Technology",
      difficulty: "medium",
      question: "How many seconds are in one day?",
      description: "Calculate a full 24-hour day.",
      answer: 86400,
      unit: "seconds",
      min: 0,
      max: 200000,
      suggestions: [3600, 43200, 86400, 120000]
    },

    // ==========================================
    // FOOD & EVERYDAY LIFE
    // ==========================================

    {
      id: "food-001",
      category: "Food",
      difficulty: "easy",
      question: "At what temperature does water freeze?",
      description: "Assume normal atmospheric pressure.",
      answer: 0,
      unit: "°C",
      min: -100,
      max: 100,
      suggestions: [-20, -5, 0, 10]
    },
    {
      id: "food-002",
      category: "Food",
      difficulty: "medium",
      question: "How many calories are in one gram of fat?",
      description: "Use the commonly accepted nutritional value.",
      answer: 9,
      unit: "kilocalories",
      min: 0,
      max: 30,
      suggestions: [2, 4, 7, 9]
    },
    {
      id: "food-003",
      category: "Food",
      difficulty: "medium",
      question: "How much water does an average watermelon contain?",
      description: "Estimate the percentage of its weight.",
      answer: 92,
      unit: "%",
      min: 0,
      max: 100,
      suggestions: [50, 70, 92, 99]
    },
    {
      id: "food-004",
      category: "Food",
      difficulty: "easy",
      question: "How many milliliters are in one liter?",
      description: "Use the metric system.",
      answer: 1000,
      unit: "milliliters",
      min: 0,
      max: 3000,
      suggestions: [100, 500, 1000, 2000]
    },
    {
      id: "food-005",
      category: "Food",
      difficulty: "hard",
      question: "How much does an average large chicken egg weigh?",
      description: "Estimate its total weight, including the shell.",
      answer: 50,
      unit: "grams",
      min: 0,
      max: 150,
      suggestions: [20, 35, 50, 80]
    },
    {
      id: "food-006",
      category: "Food",
      difficulty: "medium",
      question: "How many liters of water are recommended as a rough daily intake for an adult?",
      description: "Estimate a general daily fluid intake. Individual needs vary.",
      answer: 2,
      unit: "liters",
      min: 0,
      max: 10,
      suggestions: [0.5, 1, 2, 4]
    },

    // ==========================================
    // SPORTS
    // ==========================================

    {
      id: "sport-001",
      category: "Sports",
      difficulty: "easy",
      question: "How long is a standard marathon?",
      description: "Estimate the official race distance.",
      answer: 42.195,
      unit: "kilometers",
      min: 0,
      max: 100,
      suggestions: [21, 30, 42.195, 50]
    },
    {
      id: "sport-002",
      category: "Sports",
      difficulty: "medium",
      question: "How high is a basketball hoop?",
      description: "Measure from the floor to the rim.",
      answer: 3.05,
      unit: "meters",
      min: 0,
      max: 10,
      suggestions: [2, 2.5, 3.05, 4]
    },
    {
      id: "sport-003",
      category: "Sports",
      difficulty: "easy",
      question: "How many players from one team are on a football pitch?",
      description: "Count the starting players including the goalkeeper.",
      answer: 11,
      unit: "players",
      min: 0,
      max: 30,
      suggestions: [5, 7, 11, 15]
    },
    {
      id: "sport-004",
      category: "Sports",
      difficulty: "hard",
      question: "How fast can a professional tennis serve travel?",
      description: "Estimate the speed of one of the fastest recorded professional serves.",
      answer: 260,
      unit: "km/h",
      min: 0,
      max: 400,
      suggestions: [100, 180, 260, 330]
    },
    {
      id: "sport-005",
      category: "Sports",
      difficulty: "medium",
      question: "How many minutes are in a standard football match?",
      description: "Count regulation time, excluding added time and extra time.",
      answer: 90,
      unit: "minutes",
      min: 0,
      max: 180,
      suggestions: [45, 60, 90, 120]
    },
    {
      id: "sport-006",
      category: "Sports",
      difficulty: "medium",
      question: "How long is an Olympic swimming pool?",
      description: "Estimate the length of a long-course pool.",
      answer: 50,
      unit: "meters",
      min: 0,
      max: 100,
      suggestions: [25, 33, 50, 75]
    },

    // ==========================================
    // NUMBERS & RECORDS
    // ==========================================

    {
      id: "number-001",
      category: "Numbers",
      difficulty: "easy",
      question: "How many minutes are in a week?",
      description: "Calculate seven complete days.",
      answer: 10080,
      unit: "minutes",
      min: 0,
      max: 30000,
      suggestions: [5000, 7500, 10080, 20000]
    },
    {
      id: "number-002",
      category: "Numbers",
      difficulty: "medium",
      question: "How many hours are in a leap year?",
      description: "A leap year has 366 days.",
      answer: 8784,
      unit: "hours",
      min: 0,
      max: 20000,
      suggestions: [5000, 7000, 8784, 12000]
    },
    {
      id: "number-003",
      category: "Numbers",
      difficulty: "medium",
      question: "How many seconds are in one year of 365 days?",
      description: "Calculate using a non-leap year.",
      answer: 31536000,
      unit: "seconds",
      min: 0,
      max: 100000000,
      suggestions: [10000000, 20000000, 31536000, 50000000]
    },
    {
      id: "number-004",
      category: "Numbers",
      difficulty: "hard",
      question: "How many possible standard combinations are there in a six-digit PIN?",
      description: "Assume digits 0–9 and that leading zeros are allowed.",
      answer: 1000000,
      unit: "combinations",
      min: 0,
      max: 10000000,
      suggestions: [10000, 100000, 1000000, 5000000]
    },
    {
      id: "number-005",
      category: "Numbers",
      difficulty: "easy",
      question: "How many sides does a regular hexagon have?",
      description: "Count its straight edges.",
      answer: 6,
      unit: "sides",
      min: 0,
      max: 20,
      suggestions: [3, 4, 5, 6]
    },
    {
      id: "number-006",
      category: "Numbers",
      difficulty: "medium",
      question: "How many centimeters are in one kilometer?",
      description: "Convert kilometers into centimeters.",
      answer: 100000,
      unit: "centimeters",
      min: 0,
      max: 500000,
      suggestions: [1000, 10000, 100000, 250000]
    }

  ];

  // ==========================================
  // CATEGORY INFORMATION
  // ==========================================

  const QUESTION_CATEGORIES = [
    {
      id: "Geography",
      name: "Geography",
      icon: "🌍",
      description: "Our planet, countries, mountains and oceans."
    },
    {
      id: "Science",
      name: "Science",
      icon: "🔬",
      description: "Physics, chemistry, nature and discoveries."
    },
    {
      id: "Human Body",
      name: "Human Body",
      icon: "🧠",
      description: "The incredible numbers inside us."
    },
    {
      id: "Animals",
      name: "Animals",
      icon: "🦁",
      description: "Amazing creatures and their abilities."
    },
    {
      id: "Space",
      name: "Space",
      icon: "🚀",
      description: "Planets, stars and the universe."
    },
    {
      id: "History",
      name: "History",
      icon: "🏛️",
      description: "Events and civilizations from the past."
    },
    {
      id: "Technology",
      name: "Technology",
      icon: "💻",
      description: "Computers, inventions and digital life."
    },
    {
      id: "Food",
      name: "Food & Everyday",
      icon: "🍉",
      description: "Food, measurements and everyday facts."
    },
    {
      id: "Sports",
      name: "Sports",
      icon: "⚽",
      description: "Games, records and athletic performance."
    },
    {
      id: "Numbers",
      name: "Numbers",
      icon: "🔢",
      description: "Surprising numbers and calculations."
    }
  ];

  // ==========================================
  // DATABASE HELPERS
  // ==========================================

  // Return a safe copy so other scripts cannot
  // accidentally modify the original database.
  function cloneQuestion(question) {
    return {
      ...question,
      suggestions: [...question.suggestions]
    };
  }

  function getAllQuestions() {
    return QUESTIONS.map(cloneQuestion);
  }

  function getQuestionById(id) {
    const question = QUESTIONS.find(
      question => question.id === id
    );

    return question ? cloneQuestion(question) : null;
  }

  function getQuestionsByCategory(category) {
    if (!category || category === "all") {
      return getAllQuestions();
    }

    return QUESTIONS
      .filter(question => question.category === category)
      .map(cloneQuestion);
  }

  function getQuestionsByDifficulty(difficulty) {
    if (!difficulty || difficulty === "all") {
      return getAllQuestions();
    }

    return QUESTIONS
      .filter(question => question.difficulty === difficulty)
      .map(cloneQuestion);
  }

  function getRandomQuestions(count, options = {}) {
    options = options || {};

    const amount = Math.max(
      0,
      Math.min(
        Math.floor(Number(count) || 0),
        QUESTIONS.length
      )
    );

    if (amount === 0) {
      return [];
    }

    const category = options.category || "all";
    const difficulty = options.difficulty || "all";
    const excludeIds = Array.isArray(options.excludeIds)
      ? options.excludeIds
      : [];

    const matchesFilters = question => {
      const categoryMatches =
        category === "all" ||
        question.category === category;

      const difficultyMatches =
        difficulty === "all" ||
        question.difficulty === difficulty;

      return categoryMatches && difficultyMatches;
    };

    let pool = QUESTIONS.filter(question => {
      return (
        matchesFilters(question) &&
        !excludeIds.includes(question.id)
      );
    });

    // If exclusions leave too few questions, use the full
    // matching category rather than returning an empty game.
    if (pool.length < amount) {
      pool = QUESTIONS.filter(matchesFilters);
    }

    // Fisher-Yates shuffle.
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    return pool
      .slice(0, amount)
      .map(cloneQuestion);
  }

  function getQuestionCount() {
    return QUESTIONS.length;
  }

  function getCategoryCount(category) {
    return QUESTIONS.filter(
      question => question.category === category
    ).length;
  }

  function getDifficultyCounts() {
    return {
      easy: QUESTIONS.filter(
        question => question.difficulty === "easy"
      ).length,

      medium: QUESTIONS.filter(
        question => question.difficulty === "medium"
      ).length,

      hard: QUESTIONS.filter(
        question => question.difficulty === "hard"
      ).length
    };
  }

  // ==========================================
  // DATABASE VALIDATION
  // ==========================================

  function validateDatabase() {
    const ids = new Set();
    const errors = [];

    QUESTIONS.forEach((question, index) => {
      if (!question.id) {
        errors.push(`Question ${index + 1}: missing ID.`);
      } else if (ids.has(question.id)) {
        errors.push(`Duplicate question ID: ${question.id}.`);
      } else {
        ids.add(question.id);
      }

      if (!Number.isFinite(question.answer)) {
        errors.push(`${question.id}: answer must be a finite number.`);
      }

      if (
        !Number.isFinite(question.min) ||
        !Number.isFinite(question.max) ||
        question.min > question.max
      ) {
        errors.push(`${question.id}: invalid minimum or maximum.`);
      }

      if (
        question.answer < question.min ||
        question.answer > question.max
      ) {
        errors.push(`${question.id}: answer is outside the allowed range.`);
      }

      if (!Array.isArray(question.suggestions)) {
        errors.push(`${question.id}: suggestions must be an array.`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // ==========================================
  // GLOBAL DAZURIO DATABASE
  // ==========================================

  window.DAZURIO_QUESTIONS = QUESTIONS;
  window.DAZURIO_CATEGORIES = QUESTION_CATEGORIES;

  window.QuestionDatabase = {
    getAll: getAllQuestions,
    getById: getQuestionById,
    getByCategory: getQuestionsByCategory,
    getByDifficulty: getQuestionsByDifficulty,
    getRandom: getRandomQuestions,
    getCount: getQuestionCount,
    getCategoryCount: getCategoryCount,
    getDifficultyCounts: getDifficultyCounts,
    validate: validateDatabase
  };

  const validation = validateDatabase();

  if (!validation.valid) {
    console.error(
      "[DAZURIO] Question database validation failed:",
      validation.errors
    );
  }

  console.info(
    `[DAZURIO] Question database loaded: ${QUESTIONS.length} questions, ${QUESTION_CATEGORIES.length} categories.`
  );

})();
