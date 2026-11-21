
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
      answer: 8848.86,
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
    },
    {
      id: "sci-new-001",
      category: "Science",
      difficulty: "medium",
      question: "How many chemical elements are officially recognized?",
      description: "Count the elements currently named in the periodic table.",
      answer: 118,
      unit: "elements",
      min: 90,
      max: 130,
      suggestions: [90, 94, 118, 130]
    },
    {
      id: "sci-new-002",
      category: "Science",
      difficulty: "hard",
      question: "What is the exact speed of light in vacuum, in kilometres per second?",
      description: "Use the defined exact value.",
      answer: 299792.458,
      unit: "km/s",
      min: 200000,
      max: 350000,
      suggestions: [200000, 239834, 299792, 350000]
    },
    {
      id: "sci-new-003",
      category: "Science",
      difficulty: "easy",
      question: "At what temperature does water freeze on the Celsius scale at standard pressure?",
      description: "Give the temperature in degrees Celsius.",
      answer: 0,
      unit: "°C",
      min: -20,
      max: 20,
      suggestions: [0, 0, 0, 0]
    },
    {
      id: "sci-new-004",
      category: "Science",
      difficulty: "easy",
      question: "What is the pH of pure neutral water at 25 °C?",
      description: "Use the standard chemistry reference value.",
      answer: 7,
      unit: "pH",
      min: 0,
      max: 14,
      suggestions: [4, 6, 7, 8]
    },
    {
      id: "sci-new-005",
      category: "Science",
      difficulty: "easy",
      question: "How many stable isotopes does carbon have?",
      description: "Count carbon-12 and carbon-13.",
      answer: 2,
      unit: "isotopes",
      min: 0,
      max: 10,
      suggestions: [1, 2, 2, 2]
    },
    {
      id: "sci-new-006",
      category: "Science",
      difficulty: "medium",
      question: "What is the approximate density of liquid water at 4 °C?",
      description: "Give the value in kilograms per cubic metre.",
      answer: 999.97,
      unit: "kg/m³",
      min: 500,
      max: 2000,
      suggestions: [500, 800, 1000, 1200]
    },
    {
      id: "sci-new-007",
      category: "Science",
      difficulty: "medium",
      question: "How many protons does a gold atom have?",
      description: "Use gold's atomic number.",
      answer: 79,
      unit: "protons",
      min: 1,
      max: 120,
      suggestions: [40, 63, 79, 95]
    },
    {
      id: "sci-new-008",
      category: "Science",
      difficulty: "easy",
      question: "What is the approximate acceleration due to gravity on Earth?",
      description: "Give the standard value in metres per second squared.",
      answer: 9.81,
      unit: "m/s²",
      min: 0,
      max: 30,
      suggestions: [5, 8, 9.81, 12]
    },
    {
      id: "sci-new-009",
      category: "Science",
      difficulty: "medium",
      question: "How many bones are in a typical adult human body?",
      description: "Use the commonly cited adult count.",
      answer: 206,
      unit: "bones",
      min: 100,
      max: 300,
      suggestions: [103, 165, 206, 247]
    },
    {
      id: "sci-new-010",
      category: "Science",
      difficulty: "easy",
      question: "How many chambers does the human heart have?",
      description: "Count the atria and ventricles.",
      answer: 4,
      unit: "chambers",
      min: 1,
      max: 8,
      suggestions: [2, 3, 4, 5]
    },
    {
      id: "nat-new-011",
      category: "Animals",
      difficulty: "easy",
      question: "How many legs does a spider have?",
      description: "Count all walking legs.",
      answer: 8,
      unit: "legs",
      min: 0,
      max: 20,
      suggestions: [4, 6, 8, 10]
    },
    {
      id: "nat-new-012",
      category: "Animals",
      difficulty: "easy",
      question: "How many arms does an octopus have?",
      description: "Use the usual biological description.",
      answer: 8,
      unit: "arms",
      min: 0,
      max: 16,
      suggestions: [4, 6, 8, 10]
    },
    {
      id: "nat-new-013",
      category: "Animals",
      difficulty: "easy",
      question: "How many hearts does an octopus have?",
      description: "Count its systemic and branchial hearts.",
      answer: 3,
      unit: "hearts",
      min: 0,
      max: 8,
      suggestions: [2, 2, 3, 4]
    },
    {
      id: "nat-new-014",
      category: "Animals",
      difficulty: "easy",
      question: "How many wings does a bee have?",
      description: "Count both pairs of wings.",
      answer: 4,
      unit: "wings",
      min: 0,
      max: 8,
      suggestions: [2, 3, 4, 5]
    },
    {
      id: "nat-new-015",
      category: "Animals",
      difficulty: "medium",
      question: "How many teeth does a typical adult dog have?",
      description: "Use the full adult dentition.",
      answer: 42,
      unit: "teeth",
      min: 20,
      max: 60,
      suggestions: [21, 34, 42, 50]
    },
    {
      id: "nat-new-016",
      category: "Animals",
      difficulty: "medium",
      question: "How many teeth does a typical adult cat have?",
      description: "Use the full adult dentition.",
      answer: 30,
      unit: "teeth",
      min: 10,
      max: 50,
      suggestions: [15, 24, 30, 36]
    },
    {
      id: "nat-new-017",
      category: "Animals",
      difficulty: "medium",
      question: "How many chromosomes are in a typical human body cell?",
      description: "Count the chromosomes in a diploid cell.",
      answer: 46,
      unit: "chromosomes",
      min: 20,
      max: 80,
      suggestions: [23, 37, 46, 55]
    },
    {
      id: "nat-new-018",
      category: "Animals",
      difficulty: "medium",
      question: "How many chromosomes does a domestic horse usually have?",
      description: "Use the diploid chromosome count.",
      answer: 64,
      unit: "chromosomes",
      min: 20,
      max: 100,
      suggestions: [32, 51, 64, 77]
    },
    {
      id: "nat-new-019",
      category: "Animals",
      difficulty: "easy",
      question: "How many stomach compartments does a cow have?",
      description: "Count the four main compartments.",
      answer: 4,
      unit: "compartments",
      min: 1,
      max: 8,
      suggestions: [2, 3, 4, 5]
    },
    {
      id: "nat-new-020",
      category: "Animals",
      difficulty: "easy",
      question: "How many species of living penguins are commonly recognized?",
      description: "Use the commonly accepted modern species count.",
      answer: 18,
      unit: "species",
      min: 5,
      max: 30,
      suggestions: [9, 14, 18, 22]
    },
    {
      id: "spa-new-021",
      category: "Space",
      difficulty: "easy",
      question: "How many planets are in the Solar System?",
      description: "Count the eight recognized planets, not dwarf planets.",
      answer: 8,
      unit: "planets",
      min: 1,
      max: 15,
      suggestions: [4, 6, 8, 10]
    },
    {
      id: "spa-new-022",
      category: "Space",
      difficulty: "easy",
      question: "How many moons does Earth have?",
      description: "Count its natural permanent satellite.",
      answer: 1,
      unit: "moon",
      min: 0,
      max: 5,
      suggestions: [1, 1, 1, 1]
    },
    {
      id: "spa-new-023",
      category: "Space",
      difficulty: "easy",
      question: "How long does light from the Sun take to reach Earth?",
      description: "Give the approximate time in minutes.",
      answer: 8.3,
      unit: "minutes",
      min: 1,
      max: 30,
      suggestions: [4, 7, 8.3, 10]
    },
    {
      id: "spa-new-024",
      category: "Space",
      difficulty: "hard",
      question: "How many kilometres is one astronomical unit approximately?",
      description: "Use the mean Earth–Sun distance.",
      answer: 149597871,
      unit: "km",
      min: 100000000,
      max: 200000000,
      suggestions: [100000000, 119678297, 149597871, 179517445]
    },
    {
      id: "spa-new-025",
      category: "Space",
      difficulty: "medium",
      question: "How many Earth days does Mars take to orbit the Sun?",
      description: "Give the approximate length of a Martian year in Earth days.",
      answer: 687,
      unit: "days",
      min: 300,
      max: 1000,
      suggestions: [344, 550, 687, 824]
    },
    {
      id: "spa-new-026",
      category: "Space",
      difficulty: "easy",
      question: "How many Earth hours does Jupiter take to rotate once?",
      description: "Use its approximate rotation period.",
      answer: 9.9,
      unit: "hours",
      min: 5,
      max: 20,
      suggestions: [5, 8, 9.9, 12]
    },
    {
      id: "spa-new-027",
      category: "Space",
      difficulty: "hard",
      question: "How many kilometres wide is Earth's diameter at the equator?",
      description: "Use the approximate equatorial diameter.",
      answer: 12756,
      unit: "km",
      min: 10000,
      max: 15000,
      suggestions: [10000, 10205, 12756, 15000]
    },
    {
      id: "spa-new-028",
      category: "Space",
      difficulty: "medium",
      question: "How many kilometres wide is the Moon's diameter?",
      description: "Use its mean diameter.",
      answer: 3475,
      unit: "km",
      min: 1000,
      max: 6000,
      suggestions: [1738, 2780, 3475, 4170]
    },
    {
      id: "spa-new-029",
      category: "Space",
      difficulty: "medium",
      question: "How many minutes does the Moon take to orbit Earth relative to the stars?",
      description: "Give the approximate orbital period in days instead.",
      answer: 27.3,
      unit: "days",
      min: 10,
      max: 50,
      suggestions: [14, 22, 27.3, 33]
    },
    {
      id: "spa-new-030",
      category: "Space",
      difficulty: "easy",
      question: "How many light-years away is Proxima Centauri approximately?",
      description: "Use the commonly cited distance.",
      answer: 4.24,
      unit: "light-years",
      min: 1,
      max: 10,
      suggestions: [2, 3, 4.24, 5]
    },
    {
      id: "his-new-031",
      category: "History",
      difficulty: "medium",
      question: "In which year did the Berlin Wall fall?",
      description: "Give the calendar year.",
      answer: 1989,
      unit: "year",
      min: 1900,
      max: 2000,
      suggestions: [1900, 1900, 1989, 2000]
    },
    {
      id: "his-new-032",
      category: "History",
      difficulty: "medium",
      question: "In which year did the first Moon landing take place?",
      description: "Give the year of Apollo 11's landing.",
      answer: 1969,
      unit: "year",
      min: 1900,
      max: 2000,
      suggestions: [1900, 1900, 1969, 2000]
    },
    {
      id: "his-new-033",
      category: "History",
      difficulty: "medium",
      question: "In which year did the Titanic sink?",
      description: "Give the year of the disaster.",
      answer: 1912,
      unit: "year",
      min: 1800,
      max: 2000,
      suggestions: [1800, 1800, 1912, 2000]
    },
    {
      id: "his-new-034",
      category: "History",
      difficulty: "medium",
      question: "In which year did the First World War begin?",
      description: "Give the year.",
      answer: 1914,
      unit: "year",
      min: 1800,
      max: 2000,
      suggestions: [1800, 1800, 1914, 2000]
    },
    {
      id: "his-new-035",
      category: "History",
      difficulty: "medium",
      question: "In which year did the Second World War end in Europe?",
      description: "Give the year of Germany's surrender.",
      answer: 1945,
      unit: "year",
      min: 1900,
      max: 2000,
      suggestions: [1900, 1900, 1945, 2000]
    },
    {
      id: "his-new-036",
      category: "History",
      difficulty: "medium",
      question: "In which year was the United Nations founded?",
      description: "Give the year the UN officially came into existence.",
      answer: 1945,
      unit: "year",
      min: 1900,
      max: 2000,
      suggestions: [1900, 1900, 1945, 2000]
    },
    {
      id: "his-new-037",
      category: "History",
      difficulty: "medium",
      question: "In which year was the Eiffel Tower completed?",
      description: "Give the year it opened for the 1889 World's Fair.",
      answer: 1889,
      unit: "year",
      min: 1700,
      max: 2000,
      suggestions: [1700, 1700, 1889, 2000]
    },
    {
      id: "his-new-038",
      category: "History",
      difficulty: "medium",
      question: "In which year did the first modern Olympic Games take place?",
      description: "Give the year of the Athens Games.",
      answer: 1896,
      unit: "year",
      min: 1700,
      max: 2000,
      suggestions: [1700, 1700, 1896, 2000]
    },
    {
      id: "his-new-039",
      category: "History",
      difficulty: "medium",
      question: "In which year did the Chernobyl disaster occur?",
      description: "Give the year.",
      answer: 1986,
      unit: "year",
      min: 1900,
      max: 2000,
      suggestions: [1900, 1900, 1986, 2000]
    },
    {
      id: "his-new-040",
      category: "History",
      difficulty: "medium",
      question: "In which year did the Czech Republic become an independent state?",
      description: "Give the year of the dissolution of Czechoslovakia.",
      answer: 1993,
      unit: "year",
      min: 1900,
      max: 2000,
      suggestions: [1900, 1900, 1993, 2000]
    },
    {
      id: "tec-new-041",
      category: "Technology",
      difficulty: "easy",
      question: "How many bits are in one byte?",
      description: "Use the standard modern definition.",
      answer: 8,
      unit: "bits",
      min: 1,
      max: 32,
      suggestions: [4, 6, 8, 10]
    },
    {
      id: "tec-new-042",
      category: "Technology",
      difficulty: "medium",
      question: "How many keys does a standard full-size computer keyboard usually have?",
      description: "Use a common 104-key US layout as the reference.",
      answer: 104,
      unit: "keys",
      min: 50,
      max: 150,
      suggestions: [52, 83, 104, 125]
    },
    {
      id: "tec-new-043",
      category: "Technology",
      difficulty: "hard",
      question: "How many pixels are in a 4K UHD image?",
      description: "Use 3840 × 2160 pixels.",
      answer: 8294400,
      unit: "pixels",
      min: 1000000,
      max: 20000000,
      suggestions: [4147200, 6635520, 8294400, 9953280]
    },
    {
      id: "tec-new-044",
      category: "Technology",
      difficulty: "medium",
      question: "How many bytes are in one kibibyte?",
      description: "Use the binary unit KiB.",
      answer: 1024,
      unit: "bytes",
      min: 100,
      max: 2000,
      suggestions: [512, 819, 1024, 1229]
    },
    {
      id: "tec-new-045",
      category: "Technology",
      difficulty: "hard",
      question: "How many bytes are in one mebibyte?",
      description: "Use the binary unit MiB.",
      answer: 1048576,
      unit: "bytes",
      min: 100000,
      max: 2000000,
      suggestions: [524288, 838861, 1048576, 1258291]
    },
    {
      id: "tec-new-046",
      category: "Technology",
      difficulty: "hard",
      question: "How many bits per second are in one megabit per second?",
      description: "Use decimal networking units.",
      answer: 1000000,
      unit: "bits/s",
      min: 100000,
      max: 2000000,
      suggestions: [500000, 800000, 1000000, 1200000]
    },
    {
      id: "tec-new-047",
      category: "Technology",
      difficulty: "medium",
      question: "How many transistors did the original Intel 4004 contain?",
      description: "Use the commonly cited transistor count.",
      answer: 2300,
      unit: "transistors",
      min: 500,
      max: 5000,
      suggestions: [1150, 1840, 2300, 2760]
    },
    {
      id: "tec-new-048",
      category: "Technology",
      difficulty: "medium",
      question: "In which year was the first iPhone released?",
      description: "Give the year it went on sale.",
      answer: 2007,
      unit: "year",
      min: 1990,
      max: 2020,
      suggestions: [1990, 1990, 2007, 2020]
    },
    {
      id: "tec-new-049",
      category: "Technology",
      difficulty: "medium",
      question: "In which year was the World Wide Web proposed by Tim Berners-Lee?",
      description: "Give the year of the original proposal.",
      answer: 1989,
      unit: "year",
      min: 1970,
      max: 2000,
      suggestions: [1970, 1970, 1989, 2000]
    },
    {
      id: "tec-new-050",
      category: "Technology",
      difficulty: "hard",
      question: "How many colours can a 24-bit RGB image represent?",
      description: "Use 8 bits for each of the three colour channels.",
      answer: 16777216,
      unit: "colours",
      min: 1000000,
      max: 20000000,
      suggestions: [8388608, 13421773, 16777216, 20000000]
    },
    {
      id: "spo-new-051",
      category: "Sports",
      difficulty: "easy",
      question: "How many players from one football team are on the pitch at the start of a match?",
      description: "Count the goalkeeper and outfield players.",
      answer: 11,
      unit: "players",
      min: 5,
      max: 20,
      suggestions: [6, 9, 11, 13]
    },
    {
      id: "spo-new-052",
      category: "Sports",
      difficulty: "medium",
      question: "How many minutes are in regular football match time, excluding stoppage time?",
      description: "Count both halves.",
      answer: 90,
      unit: "minutes",
      min: 45,
      max: 150,
      suggestions: [45, 72, 90, 108]
    },
    {
      id: "spo-new-053",
      category: "Sports",
      difficulty: "medium",
      question: "How high is a basketball hoop above the floor?",
      description: "Give the official height in centimetres.",
      answer: 305,
      unit: "cm",
      min: 200,
      max: 400,
      suggestions: [200, 244, 305, 366]
    },
    {
      id: "spo-new-054",
      category: "Sports",
      difficulty: "easy",
      question: "How many points is a free throw worth in basketball?",
      description: "Use standard FIBA rules.",
      answer: 1,
      unit: "point",
      min: 0,
      max: 5,
      suggestions: [1, 1, 1, 1]
    },
    {
      id: "spo-new-055",
      category: "Sports",
      difficulty: "easy",
      question: "How many players from one volleyball team are on court?",
      description: "Count the players in indoor volleyball.",
      answer: 6,
      unit: "players",
      min: 3,
      max: 12,
      suggestions: [3, 5, 6, 7]
    },
    {
      id: "spo-new-056",
      category: "Sports",
      difficulty: "medium",
      question: "How many metres long is an Olympic swimming pool?",
      description: "Use the long-course pool length.",
      answer: 50,
      unit: "meters",
      min: 20,
      max: 100,
      suggestions: [25, 40, 50, 60]
    },
    {
      id: "spo-new-057",
      category: "Sports",
      difficulty: "easy",
      question: "How many holes are played in a standard full round of golf?",
      description: "Count the holes in a full round.",
      answer: 18,
      unit: "holes",
      min: 9,
      max: 36,
      suggestions: [9, 14, 18, 22]
    },
    {
      id: "spo-new-058",
      category: "Sports",
      difficulty: "easy",
      question: "How many sets must a player win to win a standard men's Grand Slam tennis match?",
      description: "Use best-of-five format.",
      answer: 3,
      unit: "sets",
      min: 1,
      max: 5,
      suggestions: [2, 2, 3, 4]
    },
    {
      id: "spo-new-059",
      category: "Sports",
      difficulty: "easy",
      question: "How many rings are in the Olympic symbol?",
      description: "Count the interlocking rings.",
      answer: 5,
      unit: "rings",
      min: 3,
      max: 10,
      suggestions: [3, 4, 5, 6]
    },
    {
      id: "spo-new-060",
      category: "Sports",
      difficulty: "medium",
      question: "How many squares are on a standard chessboard?",
      description: "Use an 8 by 8 board.",
      answer: 64,
      unit: "squares",
      min: 30,
      max: 100,
      suggestions: [32, 51, 64, 77]
    },
    {
      id: "foo-new-061",
      category: "Food",
      difficulty: "medium",
      question: "At what temperature does water boil at sea level?",
      description: "Give the Celsius temperature at standard atmospheric pressure.",
      answer: 100,
      unit: "°C",
      min: 70,
      max: 130,
      suggestions: [70, 80, 100, 120]
    },
    {
      id: "foo-new-062",
      category: "Food",
      difficulty: "medium",
      question: "How many millilitres are in one litre?",
      description: "Use the metric definition.",
      answer: 1000,
      unit: "ml",
      min: 100,
      max: 2000,
      suggestions: [500, 800, 1000, 1200]
    },
    {
      id: "foo-new-063",
      category: "Food",
      difficulty: "medium",
      question: "How many grams are in one kilogram?",
      description: "Use the metric definition.",
      answer: 1000,
      unit: "grams",
      min: 100,
      max: 2000,
      suggestions: [500, 800, 1000, 1200]
    },
    {
      id: "foo-new-064",
      category: "Food",
      difficulty: "medium",
      question: "How many calories are in one kilocalorie?",
      description: "Distinguish a small calorie from a food Calorie.",
      answer: 1000,
      unit: "calories",
      min: 100,
      max: 2000,
      suggestions: [500, 800, 1000, 1200]
    },
    {
      id: "foo-new-065",
      category: "Food",
      difficulty: "medium",
      question: "How many millilitres are in a standard European espresso single shot?",
      description: "Use an approximate 30 ml serving.",
      answer: 30,
      unit: "ml",
      min: 10,
      max: 100,
      suggestions: [15, 24, 30, 36]
    },
    {
      id: "foo-new-066",
      category: "Food",
      difficulty: "medium",
      question: "How many grams does one large chicken egg typically weigh with its shell?",
      description: "Use an approximate European large egg weight.",
      answer: 63,
      unit: "grams",
      min: 30,
      max: 100,
      suggestions: [32, 50, 63, 76]
    },
    {
      id: "foo-new-067",
      category: "Food",
      difficulty: "medium",
      question: "How many bones are in a chicken's skeleton approximately?",
      description: "Use a typical adult chicken estimate.",
      answer: 120,
      unit: "bones",
      min: 80,
      max: 250,
      suggestions: [80, 96, 120, 144]
    },
    {
      id: "foo-new-068",
      category: "Food",
      difficulty: "easy",
      question: "How many segments does a typical orange usually have?",
      description: "Give a common approximate count.",
      answer: 10,
      unit: "segments",
      min: 5,
      max: 20,
      suggestions: [5, 8, 10, 12]
    },
    {
      id: "foo-new-069",
      category: "Food",
      difficulty: "medium",
      question: "How many grams of water are in one litre of pure water?",
      description: "Use the approximation at ordinary room temperature.",
      answer: 998,
      unit: "grams",
      min: 900,
      max: 1100,
      suggestions: [900, 900, 998, 1100]
    },
    {
      id: "cul-new-070",
      category: "Culture",
      difficulty: "medium",
      question: "How many letters are in the English alphabet?",
      description: "Count the standard modern English alphabet.",
      answer: 26,
      unit: "letters",
      min: 10,
      max: 40,
      suggestions: [13, 21, 26, 31]
    },
    {
      id: "cul-new-071",
      category: "Culture",
      difficulty: "easy",
      question: "How many strings does a standard violin have?",
      description: "Count its strings.",
      answer: 4,
      unit: "strings",
      min: 2,
      max: 8,
      suggestions: [2, 3, 4, 5]
    },
    {
      id: "cul-new-072",
      category: "Culture",
      difficulty: "medium",
      question: "How many keys are on a standard modern piano?",
      description: "Use the full-size piano standard.",
      answer: 88,
      unit: "keys",
      min: 50,
      max: 100,
      suggestions: [50, 70, 88, 100]
    },
    {
      id: "cul-new-073",
      category: "Culture",
      difficulty: "easy",
      question: "How many lines are in a traditional haiku?",
      description: "Count its lines.",
      answer: 3,
      unit: "lines",
      min: 1,
      max: 7,
      suggestions: [2, 2, 3, 4]
    },
    {
      id: "cul-new-074",
      category: "Culture",
      difficulty: "easy",
      question: "How many books are in the original seven-book Harry Potter series?",
      description: "Count the main novels.",
      answer: 7,
      unit: "books",
      min: 1,
      max: 15,
      suggestions: [4, 6, 7, 8]
    },
    {
      id: "cul-new-075",
      category: "Culture",
      difficulty: "easy",
      question: "How many symphonies did Beethoven complete?",
      description: "Count his numbered symphonies.",
      answer: 9,
      unit: "symphonies",
      min: 3,
      max: 15,
      suggestions: [5, 7, 9, 11]
    },
    {
      id: "cul-new-076",
      category: "Culture",
      difficulty: "easy",
      question: "How many sides does a dodecagon have?",
      description: "Use the geometric definition.",
      answer: 12,
      unit: "sides",
      min: 5,
      max: 20,
      suggestions: [6, 10, 12, 14]
    },
    {
      id: "cul-new-077",
      category: "Culture",
      difficulty: "medium",
      question: "How many degrees are in a full circle?",
      description: "Use the standard angle measure.",
      answer: 360,
      unit: "degrees",
      min: 100,
      max: 720,
      suggestions: [180, 288, 360, 432]
    },
    {
      id: "cul-new-078",
      category: "Culture",
      difficulty: "medium",
      question: "How many squares are on a standard Sudoku grid?",
      description: "Use a 9 by 9 grid.",
      answer: 81,
      unit: "squares",
      min: 25,
      max: 100,
      suggestions: [41, 65, 81, 97]
    },
    {
      id: "geo-new-079",
      category: "Geography",
      difficulty: "medium",
      question: "How many kilometres long is the Czech-German border approximately?",
      description: "Use a rounded official geographic estimate.",
      answer: 817,
      unit: "km",
      min: 500,
      max: 1200,
      suggestions: [500, 654, 817, 980]
    },
    {
      id: "geo-new-080",
      category: "Geography",
      difficulty: "medium",
      question: "How many metres above sea level is Sněžka?",
      description: "Use the commonly cited summit elevation.",
      answer: 1603,
      unit: "meters",
      min: 1000,
      max: 2200,
      suggestions: [1000, 1282, 1603, 1924]
    },
    {
      id: "geo-new-081",
      category: "Geography",
      difficulty: "medium",
      question: "How many kilometres long is the Vltava River?",
      description: "Use the approximate total length.",
      answer: 430,
      unit: "km",
      min: 200,
      max: 700,
      suggestions: [215, 344, 430, 516]
    },
    {
      id: "geo-new-082",
      category: "Geography",
      difficulty: "medium",
      question: "How many kilometres long is the Danube River approximately?",
      description: "Use the commonly cited total length.",
      answer: 2850,
      unit: "km",
      min: 1500,
      max: 4000,
      suggestions: [1500, 2280, 2850, 3420]
    },
    {
      id: "geo-new-083",
      category: "Geography",
      difficulty: "medium",
      question: "How many metres high is the Burj Khalifa?",
      description: "Use its architectural height.",
      answer: 828,
      unit: "meters",
      min: 500,
      max: 1200,
      suggestions: [500, 662, 828, 994]
    },
    {
      id: "geo-new-084",
      category: "Geography",
      difficulty: "hard",
      question: "How many kilometres is the Earth's equatorial circumference approximately?",
      description: "Use the equatorial circumference.",
      answer: 40075,
      unit: "km",
      min: 30000,
      max: 50000,
      suggestions: [30000, 32060, 40075, 48090]
    },
    {
      id: "geo-new-085",
      category: "Geography",
      difficulty: "easy",
      question: "How many countries border Germany?",
      description: "Count its neighbouring countries.",
      answer: 9,
      unit: "countries",
      min: 4,
      max: 15,
      suggestions: [5, 7, 9, 11]
    },
    {
      id: "geo-new-086",
      category: "Geography",
      difficulty: "easy",
      question: "How many countries border the Czech Republic?",
      description: "Count its neighbouring countries.",
      answer: 4,
      unit: "countries",
      min: 1,
      max: 8,
      suggestions: [2, 3, 4, 5]
    },
    {
      id: "geo-new-087",
      category: "Geography",
      difficulty: "easy",
      question: "How many federal states does Germany have?",
      description: "Count the Länder.",
      answer: 16,
      unit: "states",
      min: 5,
      max: 25,
      suggestions: [8, 13, 16, 19]
    },
    {
      id: "geo-new-088",
      category: "Geography",
      difficulty: "medium",
      question: "How many cantons does Switzerland have?",
      description: "Use the current number of cantons.",
      answer: 26,
      unit: "cantons",
      min: 10,
      max: 40,
      suggestions: [13, 21, 26, 31]
    },
    {
      id: "bod-new-089",
      category: "Human Body",
      difficulty: "medium",
      question: "What is the average normal human body temperature in degrees Celsius?",
      description: "Use the traditional reference value, not a strict limit.",
      answer: 37,
      unit: "°C",
      min: 34,
      max: 40,
      suggestions: [34, 34, 37, 40]
    },
    {
      id: "bod-new-090",
      category: "Human Body",
      difficulty: "easy",
      question: "How many litres of blood does an average adult have approximately?",
      description: "Give a typical approximate volume.",
      answer: 5,
      unit: "litres",
      min: 2,
      max: 10,
      suggestions: [3, 4, 5, 6]
    },
    {
      id: "bod-new-091",
      category: "Human Body",
      difficulty: "medium",
      question: "How many teeth does a typical adult human have including wisdom teeth?",
      description: "Count a complete adult set.",
      answer: 32,
      unit: "teeth",
      min: 20,
      max: 40,
      suggestions: [20, 26, 32, 38]
    },
    {
      id: "bod-new-092",
      category: "Human Body",
      difficulty: "medium",
      question: "How many muscles are commonly estimated in the human body?",
      description: "Use the often cited approximate count.",
      answer: 600,
      unit: "muscles",
      min: 300,
      max: 1000,
      suggestions: [300, 480, 600, 720]
    },
    {
      id: "bod-new-093",
      category: "Human Body",
      difficulty: "medium",
      question: "How many times does an adult heart beat per minute at a typical resting rate?",
      description: "Use a representative resting rate.",
      answer: 70,
      unit: "beats per minute",
      min: 40,
      max: 120,
      suggestions: [40, 56, 70, 84]
    },
    {
      id: "bod-new-094",
      category: "Human Body",
      difficulty: "easy",
      question: "How many litres of air can an average adult lung hold at total capacity approximately?",
      description: "Use a typical adult total lung capacity.",
      answer: 6,
      unit: "litres",
      min: 2,
      max: 10,
      suggestions: [3, 5, 6, 7]
    },
    {
      id: "bod-new-095",
      category: "Human Body",
      difficulty: "easy",
      question: "How many taste types are commonly recognized in basic human taste science?",
      description: "Count sweet, sour, salty, bitter and umami.",
      answer: 5,
      unit: "types",
      min: 2,
      max: 10,
      suggestions: [3, 4, 5, 6]
    },
    {
      id: "bod-new-096",
      category: "Human Body",
      difficulty: "medium",
      question: "How many bones are in a typical newborn baby's body approximately?",
      description: "Use the common estimate before many bones fuse.",
      answer: 300,
      unit: "bones",
      min: 200,
      max: 400,
      suggestions: [200, 240, 300, 360]
    },
    {
      id: "bod-new-097",
      category: "Human Body",
      difficulty: "easy",
      question: "How many pairs of ribs does a typical human have?",
      description: "Count the pairs in a typical adult.",
      answer: 12,
      unit: "pairs",
      min: 8,
      max: 16,
      suggestions: [8, 10, 12, 14]
    },
    {
      id: "bod-new-098",
      category: "Human Body",
      difficulty: "easy",
      question: "How many chambers does the human stomach have?",
      description: "The human stomach is a single-chamber organ.",
      answer: 1,
      unit: "chamber",
      min: 1,
      max: 5,
      suggestions: [1, 1, 1, 1]
    }
,
    {
      id: "exp-new-001",
      category: "Geography",
      difficulty: "medium",
      question: "How many kilometres long is the Rhine River approximately?",
      description: "Use the commonly cited total length from its source to the North Sea.",
      answer: 1230,
      unit: "km",
      min: 700,
      max: 1800,
      suggestions: [700, 984, 1230, 1476]
    },
    {
      id: "exp-new-002",
      category: "Geography",
      difficulty: "medium",
      question: "How many metres above sea level is the summit of Mont Blanc?",
      description: "Use the commonly cited elevation of the highest Alpine peak.",
      answer: 4808,
      unit: "meters",
      min: 3500,
      max: 6000,
      suggestions: [3500, 3846.4, 4808, 5769.599999999999]
    },
    {
      id: "exp-new-003",
      category: "Geography",
      difficulty: "hard",
      question: "How many kilometres long is the Great Wall of China including branches?",
      description: "Use the official survey total, approximately.",
      answer: 21196,
      unit: "km",
      min: 10000,
      max: 30000,
      suggestions: [10598, 16956.8, 21196, 25435.2]
    },
    {
      id: "exp-new-004",
      category: "Geography",
      difficulty: "hard",
      question: "How many square kilometres is the area of the Czech Republic?",
      description: "Use the country's total area.",
      answer: 78871,
      unit: "km²",
      min: 50000,
      max: 100000,
      suggestions: [50000, 63096.8, 78871, 94645.2]
    },
    {
      id: "exp-new-005",
      category: "Geography",
      difficulty: "hard",
      question: "How many square kilometres is the area of Slovakia?",
      description: "Use the country's total area.",
      answer: 49035,
      unit: "km²",
      min: 30000,
      max: 70000,
      suggestions: [30000, 39228, 49035, 58842]
    },
    {
      id: "exp-new-006",
      category: "Geography",
      difficulty: "hard",
      question: "How many square kilometres is the area of Austria?",
      description: "Use the country's total area.",
      answer: 83879,
      unit: "km²",
      min: 50000,
      max: 110000,
      suggestions: [50000, 67103.2, 83879, 100654.8]
    },
    {
      id: "exp-new-007",
      category: "Geography",
      difficulty: "hard",
      question: "How many square kilometres is the area of Portugal?",
      description: "Include mainland Portugal and its Atlantic island regions.",
      answer: 92212,
      unit: "km²",
      min: 50000,
      max: 130000,
      suggestions: [50000, 73769.6, 92212, 110654.4]
    },
    {
      id: "exp-new-008",
      category: "Geography",
      difficulty: "hard",
      question: "How many square kilometres is the area of Iceland?",
      description: "Use the country's total area.",
      answer: 103000,
      unit: "km²",
      min: 70000,
      max: 150000,
      suggestions: [70000, 82400, 103000, 123600]
    },
    {
      id: "exp-new-009",
      category: "Geography",
      difficulty: "medium",
      question: "How many kilometres long is the Amazon River approximately?",
      description: "Use a commonly cited estimate of its length.",
      answer: 6400,
      unit: "km",
      min: 4000,
      max: 8000,
      suggestions: [4000, 5120, 6400, 7680]
    },
    {
      id: "exp-new-010",
      category: "Geography",
      difficulty: "medium",
      question: "How many metres deep is Lake Baikal at its deepest point?",
      description: "Use its maximum recorded depth.",
      answer: 1642,
      unit: "meters",
      min: 800,
      max: 2500,
      suggestions: [821, 1313.6000000000001, 1642, 1970.3999999999999]
    },
    {
      id: "exp-new-011",
      category: "Geography",
      difficulty: "medium",
      question: "How many metres above sea level is the Dead Sea shoreline approximately?",
      description: "Use the approximate elevation below sea level.",
      answer: -430,
      unit: "meters",
      min: -600,
      max: -200,
      suggestions: [-215, -344, -430, -516]
    },
    {
      id: "exp-new-012",
      category: "Geography",
      difficulty: "easy",
      question: "How many islands make up the Hawaiian island chain's main islands?",
      description: "Count the eight main islands.",
      answer: 8,
      unit: "islands",
      min: 3,
      max: 15,
      suggestions: [4, 6.4, 8, 9.6]
    },
    {
      id: "exp-new-013",
      category: "Geography",
      difficulty: "easy",
      question: "How many time zones does Russia span?",
      description: "Use the current number of standard time zones.",
      answer: 11,
      unit: "time zones",
      min: 5,
      max: 15,
      suggestions: [5.5, 8.8, 11, 13.2]
    },
    {
      id: "exp-new-014",
      category: "Geography",
      difficulty: "medium",
      question: "How many countries are members of the European Union?",
      description: "Use the current membership count.",
      answer: 27,
      unit: "countries",
      min: 15,
      max: 35,
      suggestions: [15, 21.6, 27, 32.4]
    },
    {
      id: "exp-new-015",
      category: "Geography",
      difficulty: "easy",
      question: "How many official languages does Switzerland have?",
      description: "Count German, French, Italian and Romansh.",
      answer: 4,
      unit: "languages",
      min: 1,
      max: 8,
      suggestions: [2, 3.2, 4, 4.8]
    },
    {
      id: "exp-new-016",
      category: "Science",
      difficulty: "easy",
      question: "What is the atomic number of oxygen?",
      description: "Use the number of protons in an oxygen atom.",
      answer: 8,
      unit: "",
      min: 1,
      max: 20,
      suggestions: [4, 6.4, 8, 9.6]
    },
    {
      id: "exp-new-017",
      category: "Science",
      difficulty: "medium",
      question: "What is the atomic number of iron?",
      description: "Use iron's number of protons.",
      answer: 26,
      unit: "",
      min: 1,
      max: 60,
      suggestions: [13, 20.8, 26, 31.2]
    },
    {
      id: "exp-new-018",
      category: "Science",
      difficulty: "medium",
      question: "What is the atomic number of uranium?",
      description: "Use uranium's number of protons.",
      answer: 92,
      unit: "",
      min: 50,
      max: 120,
      suggestions: [50, 73.60000000000001, 92, 110.39999999999999]
    },
    {
      id: "exp-new-019",
      category: "Science",
      difficulty: "easy",
      question: "How many valence electrons does a neutral carbon atom have?",
      description: "Count the electrons in its outer shell.",
      answer: 4,
      unit: "electrons",
      min: 1,
      max: 8,
      suggestions: [2, 3.2, 4, 4.8]
    },
    {
      id: "exp-new-020",
      category: "Science",
      difficulty: "medium",
      question: "What is the approximate melting point of iron in degrees Celsius?",
      description: "Use the standard atmospheric pressure value.",
      answer: 1538,
      unit: "°C",
      min: 1000,
      max: 2000,
      suggestions: [1000, 1230.4, 1538, 1845.6]
    },
    {
      id: "exp-new-021",
      category: "Science",
      difficulty: "medium",
      question: "What is the approximate melting point of aluminium in degrees Celsius?",
      description: "Use the standard atmospheric pressure value.",
      answer: 660,
      unit: "°C",
      min: 300,
      max: 1000,
      suggestions: [330, 528, 660, 792]
    },
    {
      id: "exp-new-022",
      category: "Science",
      difficulty: "easy",
      question: "How many sides does a regular hexagon have?",
      description: "Count its straight sides.",
      answer: 6,
      unit: "sides",
      min: 3,
      max: 12,
      suggestions: [3, 4.800000000000001, 6, 7.199999999999999]
    },
    {
      id: "exp-new-023",
      category: "Science",
      difficulty: "medium",
      question: "How many degrees are in the interior angles of a triangle combined?",
      description: "Use Euclidean geometry.",
      answer: 180,
      unit: "degrees",
      min: 90,
      max: 360,
      suggestions: [90, 144, 180, 216]
    },
    {
      id: "exp-new-024",
      category: "Science",
      difficulty: "medium",
      question: "How many degrees are in the interior angles of a quadrilateral combined?",
      description: "Use Euclidean geometry.",
      answer: 360,
      unit: "degrees",
      min: 180,
      max: 540,
      suggestions: [180, 288, 360, 432]
    },
    {
      id: "exp-new-025",
      category: "Science",
      difficulty: "easy",
      question: "How many centimetres are in one inch?",
      description: "Use the exact international inch definition.",
      answer: 2.54,
      unit: "cm",
      min: 1,
      max: 5,
      suggestions: [1.27, 2.032, 2.54, 3.048]
    },
    {
      id: "exp-new-026",
      category: "Science",
      difficulty: "medium",
      question: "How many metres are in one nautical mile?",
      description: "Use the exact international nautical mile definition.",
      answer: 1852,
      unit: "meters",
      min: 1000,
      max: 2500,
      suggestions: [1000, 1481.6000000000001, 1852, 2222.4]
    },
    {
      id: "exp-new-027",
      category: "Science",
      difficulty: "hard",
      question: "How many seconds are in one day?",
      description: "Calculate 24 hours in seconds.",
      answer: 86400,
      unit: "seconds",
      min: 50000,
      max: 120000,
      suggestions: [50000, 69120, 86400, 103680]
    },
    {
      id: "exp-new-028",
      category: "Science",
      difficulty: "hard",
      question: "How many seconds are in one week?",
      description: "Calculate seven 24-hour days in seconds.",
      answer: 604800,
      unit: "seconds",
      min: 300000,
      max: 900000,
      suggestions: [302400, 483840, 604800, 725760]
    },
    {
      id: "exp-new-029",
      category: "Science",
      difficulty: "hard",
      question: "How many minutes are in one leap year of 366 days?",
      description: "Use 24 hours per day.",
      answer: 527040,
      unit: "minutes",
      min: 400000,
      max: 600000,
      suggestions: [400000, 421632, 527040, 600000]
    },
    {
      id: "exp-new-030",
      category: "Science",
      difficulty: "medium",
      question: "How many metres per second is 100 kilometres per hour?",
      description: "Convert 100 km/h to m/s.",
      answer: 27.7777777778,
      unit: "m/s",
      min: 10,
      max: 50,
      suggestions: [13.8889, 22.22224, 27.7778, 33.33336]
    },
    {
      id: "exp-new-031",
      category: "Space",
      difficulty: "medium",
      question: "How many Earth days does Venus take to orbit the Sun?",
      description: "Use its sidereal orbital period.",
      answer: 224.7,
      unit: "days",
      min: 100,
      max: 400,
      suggestions: [112.35, 179.76, 224.7, 269.64]
    },
    {
      id: "exp-new-032",
      category: "Space",
      difficulty: "medium",
      question: "How many Earth days does Mercury take to orbit the Sun?",
      description: "Use its orbital period.",
      answer: 88,
      unit: "days",
      min: 30,
      max: 150,
      suggestions: [44, 70.4, 88, 105.6]
    },
    {
      id: "exp-new-033",
      category: "Space",
      difficulty: "medium",
      question: "How many Earth years does Neptune take to orbit the Sun?",
      description: "Use its approximate orbital period.",
      answer: 164.8,
      unit: "years",
      min: 100,
      max: 250,
      suggestions: [100, 131.84, 164.8, 197.76000000000002]
    },
    {
      id: "exp-new-034",
      category: "Space",
      difficulty: "hard",
      question: "How many kilometres is the average distance from Earth to the Moon?",
      description: "Use the mean centre-to-centre distance.",
      answer: 384400,
      unit: "km",
      min: 250000,
      max: 500000,
      suggestions: [250000, 307520, 384400, 461280]
    },
    {
      id: "exp-new-035",
      category: "Space",
      difficulty: "hard",
      question: "How many kilometres is the average distance from Earth to the Sun?",
      description: "Use one astronomical unit.",
      answer: 149597870.7,
      unit: "km",
      min: 100000000,
      max: 200000000,
      suggestions: [100000000, 119678296.56, 149597870.7, 179517444.83999997]
    },
    {
      id: "exp-new-036",
      category: "Space",
      difficulty: "easy",
      question: "How many Earth days does the International Space Station take to orbit Earth?",
      description: "Use its approximate orbital period.",
      answer: 0.0646,
      unit: "days",
      min: 0.03,
      max: 0.1,
      suggestions: [0.0323, 0.051680000000000004, 0.0646, 0.07752]
    },
    {
      id: "exp-new-037",
      category: "Space",
      difficulty: "medium",
      question: "How many minutes does sunlight take to reach Jupiter on average?",
      description: "Use the approximate one-way light travel time.",
      answer: 43,
      unit: "minutes",
      min: 20,
      max: 80,
      suggestions: [21.5, 34.4, 43, 51.6]
    },
    {
      id: "exp-new-038",
      category: "Space",
      difficulty: "easy",
      question: "How many kilometres per second does the International Space Station travel?",
      description: "Use its approximate orbital speed.",
      answer: 7.66,
      unit: "km/s",
      min: 4,
      max: 12,
      suggestions: [4, 6.128, 7.66, 9.192]
    },
    {
      id: "exp-new-039",
      category: "History",
      difficulty: "medium",
      question: "In which year did the Czech lands join the European Union?",
      description: "Give the year of EU enlargement.",
      answer: 2004,
      unit: "year",
      min: 1990,
      max: 2020,
      suggestions: [1990, 1990, 2004, 2020]
    },
    {
      id: "exp-new-040",
      category: "History",
      difficulty: "medium",
      question: "In which year did Czechoslovakia split into two independent countries?",
      description: "Give the year the Czech Republic and Slovakia were established.",
      answer: 1993,
      unit: "year",
      min: 1980,
      max: 2000,
      suggestions: [1980, 1980, 1993, 2000]
    },
    {
      id: "exp-new-041",
      category: "History",
      difficulty: "medium",
      question: "In which year did the French Revolution begin?",
      description: "Give the year of the Estates-General and the storming of the Bastille.",
      answer: 1789,
      unit: "year",
      min: 1600,
      max: 1900,
      suggestions: [1600, 1600, 1789, 1900]
    },
    {
      id: "exp-new-042",
      category: "History",
      difficulty: "medium",
      question: "In which year was the United States Declaration of Independence adopted?",
      description: "Give the year.",
      answer: 1776,
      unit: "year",
      min: 1600,
      max: 1900,
      suggestions: [1600, 1600, 1776, 1900]
    },
    {
      id: "exp-new-043",
      category: "History",
      difficulty: "medium",
      question: "In which year did the first powered Wright brothers flight take place?",
      description: "Give the year at Kitty Hawk.",
      answer: 1903,
      unit: "year",
      min: 1800,
      max: 2000,
      suggestions: [1800, 1800, 1903, 2000]
    },
    {
      id: "exp-new-044",
      category: "History",
      difficulty: "medium",
      question: "In which year did the first successful telephone patent by Alexander Graham Bell date from?",
      description: "Give the patent year.",
      answer: 1876,
      unit: "year",
      min: 1800,
      max: 1950,
      suggestions: [1800, 1800, 1876, 1950]
    },
    {
      id: "exp-new-045",
      category: "History",
      difficulty: "medium",
      question: "In which year did the first FIFA World Cup take place?",
      description: "Give the year of the tournament in Uruguay.",
      answer: 1930,
      unit: "year",
      min: 1900,
      max: 2000,
      suggestions: [1900, 1900, 1930, 2000]
    },
    {
      id: "exp-new-046",
      category: "History",
      difficulty: "medium",
      question: "In which year did the Prague Spring take place?",
      description: "Give the year of the political reform movement and invasion.",
      answer: 1968,
      unit: "year",
      min: 1900,
      max: 2000,
      suggestions: [1900, 1900, 1968, 2000]
    },
    {
      id: "exp-new-047",
      category: "History",
      difficulty: "medium",
      question: "In which year did the Velvet Revolution begin?",
      description: "Give the year of the demonstrations in Czechoslovakia.",
      answer: 1989,
      unit: "year",
      min: 1970,
      max: 2000,
      suggestions: [1970, 1970, 1989, 2000]
    },
    {
      id: "exp-new-048",
      category: "History",
      difficulty: "medium",
      question: "In which year was the first printed Gutenberg Bible completed?",
      description: "Use the commonly cited completion year.",
      answer: 1455,
      unit: "year",
      min: 1300,
      max: 1600,
      suggestions: [1300, 1300, 1455, 1600]
    },
    {
      id: "exp-new-049",
      category: "Technology",
      difficulty: "medium",
      question: "How many characters can one byte represent in basic ASCII?",
      description: "ASCII defines 128 code points.",
      answer: 128,
      unit: "characters",
      min: 50,
      max: 256,
      suggestions: [64, 102.4, 128, 153.6]
    },
    {
      id: "exp-new-050",
      category: "Technology",
      difficulty: "medium",
      question: "How many bits are in a 32-bit word?",
      description: "Use the word size stated in the question.",
      answer: 32,
      unit: "bits",
      min: 8,
      max: 64,
      suggestions: [16, 25.6, 32, 38.4]
    },
    {
      id: "exp-new-051",
      category: "Technology",
      difficulty: "medium",
      question: "How many bits are in a 64-bit word?",
      description: "Use the word size stated in the question.",
      answer: 64,
      unit: "bits",
      min: 16,
      max: 128,
      suggestions: [32, 51.2, 64, 76.8]
    },
    {
      id: "exp-new-052",
      category: "Technology",
      difficulty: "easy",
      question: "How many megapixels are in a 1920 × 1080 Full HD image?",
      description: "Calculate the pixel count and express it in megapixels.",
      answer: 2.0736,
      unit: "megapixels",
      min: 1,
      max: 5,
      suggestions: [1.0368, 1.65888, 2.0736, 2.48832]
    },
    {
      id: "exp-new-053",
      category: "Technology",
      difficulty: "medium",
      question: "How many pixels wide is a 4K UHD screen?",
      description: "Use the horizontal pixel count of 3840 × 2160 UHD.",
      answer: 3840,
      unit: "pixels",
      min: 2000,
      max: 6000,
      suggestions: [2000, 3072, 3840, 4608]
    },
    {
      id: "exp-new-054",
      category: "Technology",
      difficulty: "medium",
      question: "How many pixels wide is an 8K UHD screen?",
      description: "Use the horizontal pixel count of 7680 × 4320 UHD.",
      answer: 7680,
      unit: "pixels",
      min: 4000,
      max: 10000,
      suggestions: [4000, 6144, 7680, 9216]
    },
    {
      id: "exp-new-055",
      category: "Technology",
      difficulty: "medium",
      question: "In which year was the first email sent on ARPANET?",
      description: "Use the commonly cited year of Ray Tomlinson's network email.",
      answer: 1971,
      unit: "year",
      min: 1950,
      max: 1990,
      suggestions: [1950, 1950, 1971, 1990]
    },
    {
      id: "exp-new-056",
      category: "Technology",
      difficulty: "medium",
      question: "In which year was the first Android phone released?",
      description: "Give the year the HTC Dream/T-Mobile G1 launched.",
      answer: 2008,
      unit: "year",
      min: 1995,
      max: 2020,
      suggestions: [1995, 1995, 2008, 2020]
    },
    {
      id: "exp-new-057",
      category: "Technology",
      difficulty: "medium",
      question: "In which year was Wikipedia launched?",
      description: "Give the year the online encyclopedia began.",
      answer: 2001,
      unit: "year",
      min: 1990,
      max: 2020,
      suggestions: [1990, 1990, 2001, 2020]
    },
    {
      id: "exp-new-058",
      category: "Technology",
      difficulty: "easy",
      question: "How many keys does a standard numeric keypad have including its operators?",
      description: "Count digits, decimal point, arithmetic operators and enter on a common keypad.",
      answer: 17,
      unit: "keys",
      min: 10,
      max: 25,
      suggestions: [10, 13.600000000000001, 17, 20.4]
    },
    {
      id: "exp-new-059",
      category: "Sports",
      difficulty: "easy",
      question: "How many players are on the court for both teams combined in a basketball game?",
      description: "Count five players per team.",
      answer: 10,
      unit: "players",
      min: 6,
      max: 16,
      suggestions: [6, 8, 10, 12]
    },
    {
      id: "exp-new-060",
      category: "Sports",
      difficulty: "easy",
      question: "How many points is a successful three-point shot worth in basketball?",
      description: "Use standard basketball rules.",
      answer: 3,
      unit: "points",
      min: 1,
      max: 5,
      suggestions: [1.5, 2.4000000000000004, 3, 3.5999999999999996]
    },
    {
      id: "exp-new-061",
      category: "Sports",
      difficulty: "hard",
      question: "How many metres long is a standard marathon?",
      description: "Use the official race distance.",
      answer: 42195,
      unit: "meters",
      min: 30000,
      max: 50000,
      suggestions: [30000, 33756, 42195, 50000]
    },
    {
      id: "exp-new-062",
      category: "Sports",
      difficulty: "medium",
      question: "How many minutes are in a standard rugby union match, excluding stoppage time?",
      description: "Count two 40-minute halves.",
      answer: 80,
      unit: "minutes",
      min: 40,
      max: 120,
      suggestions: [40, 64, 80, 96]
    },
    {
      id: "exp-new-063",
      category: "Sports",
      difficulty: "easy",
      question: "How many players are on court per team in handball?",
      description: "Count six court players and one goalkeeper.",
      answer: 7,
      unit: "players",
      min: 4,
      max: 10,
      suggestions: [4, 5.6000000000000005, 7, 8.4]
    },
    {
      id: "exp-new-064",
      category: "Sports",
      difficulty: "easy",
      question: "How many players are on the field per team in baseball on defense?",
      description: "Count the standard defensive positions.",
      answer: 9,
      unit: "players",
      min: 6,
      max: 12,
      suggestions: [6, 7.2, 9, 10.799999999999999]
    },
    {
      id: "exp-new-065",
      category: "Sports",
      difficulty: "easy",
      question: "How many innings are in a standard professional baseball game?",
      description: "Use the regulation number.",
      answer: 9,
      unit: "innings",
      min: 5,
      max: 15,
      suggestions: [5, 7.2, 9, 10.799999999999999]
    },
    {
      id: "exp-new-066",
      category: "Sports",
      difficulty: "easy",
      question: "How many points does a touchdown score in American football before the extra point?",
      description: "Use the standard scoring value.",
      answer: 6,
      unit: "points",
      min: 3,
      max: 10,
      suggestions: [3, 4.800000000000001, 6, 7.199999999999999]
    },
    {
      id: "exp-new-067",
      category: "Sports",
      difficulty: "medium",
      question: "How many metres is a standard Olympic athletics track lap?",
      description: "Use the standard outdoor track distance.",
      answer: 400,
      unit: "meters",
      min: 200,
      max: 800,
      suggestions: [200, 320, 400, 480]
    },
    {
      id: "exp-new-068",
      category: "Sports",
      difficulty: "easy",
      question: "How many players are on the court for one team in water polo?",
      description: "Count six field players and one goalkeeper.",
      answer: 7,
      unit: "players",
      min: 4,
      max: 10,
      suggestions: [4, 5.6000000000000005, 7, 8.4]
    },
    {
      id: "exp-new-069",
      category: "Food",
      difficulty: "easy",
      question: "How many kilocalories of energy does one gram of carbohydrate provide?",
      description: "Use the standard nutritional energy conversion.",
      answer: 4,
      unit: "kcal",
      min: 1,
      max: 8,
      suggestions: [2, 3.2, 4, 4.8]
    },
    {
      id: "exp-new-070",
      category: "Food",
      difficulty: "easy",
      question: "How many kilocalories does one gram of fat provide approximately?",
      description: "Use the standard nutrition conversion.",
      answer: 9,
      unit: "kcal",
      min: 4,
      max: 15,
      suggestions: [4.5, 7.2, 9, 10.799999999999999]
    },
    {
      id: "exp-new-071",
      category: "Food",
      difficulty: "easy",
      question: "How many kilocalories does one gram of protein provide approximately?",
      description: "Use the standard nutrition conversion.",
      answer: 4,
      unit: "kcal",
      min: 1,
      max: 8,
      suggestions: [2, 3.2, 4, 4.8]
    },
    {
      id: "exp-new-072",
      category: "Food",
      difficulty: "easy",
      question: "At what temperature should a refrigerator ideally be kept in degrees Celsius?",
      description: "Use the common food-safety recommendation of around 4 °C.",
      answer: 4,
      unit: "°C",
      min: 0,
      max: 10,
      suggestions: [2, 3.2, 4, 4.8]
    },
    {
      id: "exp-new-073",
      category: "Food",
      difficulty: "medium",
      question: "How many millilitres are in a US cup?",
      description: "Use the US customary cup definition.",
      answer: 236.588,
      unit: "ml",
      min: 100,
      max: 400,
      suggestions: [118.294, 189.2704, 236.588, 283.9056]
    },
    {
      id: "exp-new-074",
      category: "Food",
      difficulty: "hard",
      question: "How many grams are in a metric tonne?",
      description: "Use the metric definition.",
      answer: 1000000,
      unit: "grams",
      min: 500000,
      max: 1500000,
      suggestions: [500000, 800000, 1000000, 1200000]
    },
    {
      id: "exp-new-075",
      category: "Food",
      difficulty: "easy",
      question: "How many millilitres are in one tablespoon in the metric system?",
      description: "Use the 15 ml metric tablespoon.",
      answer: 15,
      unit: "ml",
      min: 5,
      max: 30,
      suggestions: [7.5, 12, 15, 18]
    },
    {
      id: "exp-new-076",
      category: "Food",
      difficulty: "easy",
      question: "How many millilitres are in one teaspoon in the metric system?",
      description: "Use the 5 ml metric teaspoon.",
      answer: 5,
      unit: "ml",
      min: 1,
      max: 15,
      suggestions: [2.5, 4, 5, 6]
    },
    {
      id: "exp-new-077",
      category: "Culture",
      difficulty: "medium",
      question: "How many frets does a common four-string bass guitar have?",
      description: "Use a common 20-fret bass guitar as the reference.",
      answer: 20,
      unit: "frets",
      min: 12,
      max: 30,
      suggestions: [12, 16, 20, 24]
    },
    {
      id: "exp-new-078",
      category: "Culture",
      difficulty: "easy",
      question: "How many players are in a string quartet?",
      description: "Count the musicians.",
      answer: 4,
      unit: "players",
      min: 2,
      max: 8,
      suggestions: [2, 3.2, 4, 4.8]
    },
    {
      id: "exp-new-079",
      category: "Culture",
      difficulty: "easy",
      question: "How many notes are in a standard chromatic octave in Western music?",
      description: "Count all semitones including the starting note.",
      answer: 12,
      unit: "notes",
      min: 7,
      max: 24,
      suggestions: [7, 9.600000000000001, 12, 14.399999999999999]
    },
    {
      id: "exp-new-080",
      category: "Culture",
      difficulty: "easy",
      question: "How many colours are traditionally named in a rainbow?",
      description: "Use the traditional seven-colour description.",
      answer: 7,
      unit: "colours",
      min: 3,
      max: 12,
      suggestions: [3.5, 5.6000000000000005, 7, 8.4]
    },
    {
      id: "exp-new-081",
      category: "Culture",
      difficulty: "medium",
      question: "How many letters are in the Czech alphabet when the digraph Ch is counted as one letter?",
      description: "Count the standard Czech alphabet including letters with diacritics and Ch.",
      answer: 38,
      unit: "letters",
      min: 20,
      max: 60,
      suggestions: [21, 33.6, 42, 50.4]
    },
    {
      id: "exp-new-082",
      category: "Culture",
      difficulty: "easy",
      question: "How many faces does a standard cube have?",
      description: "Count its square faces.",
      answer: 6,
      unit: "faces",
      min: 4,
      max: 12,
      suggestions: [4, 4.800000000000001, 6, 7.199999999999999]
    },
    {
      id: "exp-new-083",
      category: "Culture",
      difficulty: "easy",
      question: "How many edges does a standard cube have?",
      description: "Count its straight edges.",
      answer: 12,
      unit: "edges",
      min: 6,
      max: 20,
      suggestions: [6, 9.600000000000001, 12, 14.399999999999999]
    },
    {
      id: "exp-new-084",
      category: "Culture",
      difficulty: "easy",
      question: "How many vertices does a standard cube have?",
      description: "Count its corners.",
      answer: 8,
      unit: "vertices",
      min: 4,
      max: 16,
      suggestions: [4, 6.4, 8, 9.6]
    },
    {
      id: "exp-new-085",
      category: "Culture",
      difficulty: "easy",
      question: "How many sides does a standard octagon have?",
      description: "Use the geometric definition.",
      answer: 8,
      unit: "sides",
      min: 4,
      max: 16,
      suggestions: [4, 6.4, 8, 9.6]
    },
    {
      id: "exp-new-086",
      category: "Culture",
      difficulty: "medium",
      question: "How many degrees are in the sum of the interior angles of a pentagon?",
      description: "Use the polygon angle-sum formula.",
      answer: 540,
      unit: "degrees",
      min: 180,
      max: 900,
      suggestions: [270, 432, 540, 648]
    },
    {
      id: "exp-new-087",
      category: "Human Body",
      difficulty: "medium",
      question: "How many pairs of chromosomes does a typical human body cell contain?",
      description: "Count 23 pairs.",
      answer: 23,
      unit: "pairs",
      min: 10,
      max: 30,
      suggestions: [11.5, 18.400000000000002, 23, 27.599999999999998]
    },
    {
      id: "exp-new-088",
      category: "Human Body",
      difficulty: "easy",
      question: "How many litres of saliva does a human produce per day approximately?",
      description: "Use a typical daily range midpoint.",
      answer: 1.5,
      unit: "litres",
      min: 0.5,
      max: 3,
      suggestions: [0.75, 1.2000000000000002, 1.5, 1.7999999999999998]
    },
    {
      id: "exp-new-089",
      category: "Human Body",
      difficulty: "easy",
      question: "How many times does an average adult breathe per minute at rest?",
      description: "Use a representative resting respiratory rate.",
      answer: 16,
      unit: "breaths per minute",
      min: 8,
      max: 30,
      suggestions: [8, 12.8, 16, 19.2]
    },
    {
      id: "exp-new-090",
      category: "Human Body",
      difficulty: "easy",
      question: "How many millimetres long is a typical human red blood cell diameter?",
      description: "Use the approximate diameter in millimetres.",
      answer: 0.0075,
      unit: "mm",
      min: 0.003,
      max: 0.015,
      suggestions: [0.00375, 0.006, 0.0075, 0.009]
    },
    {
      id: "exp-new-091",
      category: "Human Body",
      difficulty: "medium",
      question: "How many litres of water does an average adult human body contain approximately?",
      description: "Use an approximate 60% of a 70 kg adult's mass.",
      answer: 42,
      unit: "litres",
      min: 20,
      max: 60,
      suggestions: [21, 33.6, 42, 50.4]
    },
    {
      id: "exp-new-092",
      category: "Human Body",
      difficulty: "medium",
      question: "How many bones are in a typical human hand including the wrist?",
      description: "Count the bones in one hand.",
      answer: 27,
      unit: "bones",
      min: 15,
      max: 40,
      suggestions: [15, 21.6, 27, 32.4]
    },
    {
      id: "exp-new-093",
      category: "Human Body",
      difficulty: "medium",
      question: "How many bones are in one human foot?",
      description: "Count the bones in one foot.",
      answer: 26,
      unit: "bones",
      min: 15,
      max: 40,
      suggestions: [15, 20.8, 26, 31.2]
    },
    {
      id: "exp-new-094",
      category: "Human Body",
      difficulty: "easy",
      question: "How many pairs of cranial nerves does a human have?",
      description: "Count the twelve pairs.",
      answer: 12,
      unit: "pairs",
      min: 6,
      max: 20,
      suggestions: [6, 9.600000000000001, 12, 14.399999999999999]
    },
    {
      id: "exp-new-095",
      category: "Human Body",
      difficulty: "easy",
      question: "How many litres of urine does a typical adult produce per day?",
      description: "Use an approximate healthy adult daily volume.",
      answer: 1.5,
      unit: "litres",
      min: 0.3,
      max: 3,
      suggestions: [0.75, 1.2000000000000002, 1.5, 1.7999999999999998]
    },
    {
      id: "exp-new-096",
      category: "Human Body",
      difficulty: "medium",
      question: "How many taste buds does a human tongue have approximately?",
      description: "Use a broad commonly cited estimate.",
      answer: 10000,
      unit: "taste buds",
      min: 1000,
      max: 30000,
      suggestions: [5000, 8000, 10000, 12000]
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
      id: "Culture",
      name: "Culture",
      icon: "🎭",
      description: "Arts, language, music and curious facts."
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

  function getCustomQuestions() {
    try {
      const saved = JSON.parse(localStorage.getItem("dazurio_custom_questions_v1") || "[]");
      return Array.isArray(saved) ? saved.filter(item => item && typeof item.id === "string" && typeof item.question === "string" && Number.isFinite(Number(item.answer)) && Number.isFinite(Number(item.min)) && Number.isFinite(Number(item.max)) && item.min <= item.answer && item.answer <= item.max).map(cloneQuestion) : [];
    } catch (_) { return []; }
  }

  function getAllQuestions() {
    return [...QUESTIONS.map(cloneQuestion), ...getCustomQuestions()];
  }

  function getQuestionById(id) {
    const question = getAllQuestions().find(
      question => question.id === id
    );

    return question ? cloneQuestion(question) : null;
  }

  function getQuestionsByCategory(category) {
    if (!category || category === "all") {
      return getAllQuestions();
    }

    return getAllQuestions()
      .filter(question => question.category === category)
      .map(cloneQuestion);
  }

  function getQuestionsByDifficulty(difficulty) {
    if (!difficulty || difficulty === "all") {
      return getAllQuestions();
    }

    return getAllQuestions()
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

    let pool = getAllQuestions().filter(question => {
      return (
        matchesFilters(question) &&
        !excludeIds.includes(question.id)
      );
    });

    // If exclusions leave too few questions, use the full
    // matching category rather than returning an empty game.
    if (pool.length < amount) {
      pool = getAllQuestions().filter(matchesFilters);
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
    return getAllQuestions().length;
  }

  function getCategoryCount(category) {
    return getAllQuestions().filter(
      question => question.category === category
    ).length;
  }

  function getDifficultyCounts() {
    return {
      easy: getAllQuestions().filter(
        question => question.difficulty === "easy"
      ).length,

      medium: getAllQuestions().filter(
        question => question.difficulty === "medium"
      ).length,

      hard: getAllQuestions().filter(
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

    getAllQuestions().forEach((question, index) => {
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
