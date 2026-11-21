
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
      question: "What is the speed of light in vacuum, in kilometres per second?",
      description: "Use the defined exact value, rounded to the nearest whole kilometre per second.",
      answer: 299792,
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
      answer: 1000,
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
      category: "Nature",
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
      category: "Nature",
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
      category: "Nature",
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
      category: "Nature",
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
      category: "Nature",
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
      category: "Nature",
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
      category: "Nature",
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
      category: "Nature",
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
      category: "Nature",
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
      category: "Nature",
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
      category: "Sport",
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
      category: "Sport",
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
      category: "Sport",
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
      category: "Sport",
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
      category: "Sport",
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
      category: "Sport",
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
      category: "Sport",
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
      category: "Sport",
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
      category: "Sport",
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
      category: "Sport",
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
      category: "Body",
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
      category: "Body",
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
      category: "Body",
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
      category: "Body",
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
      category: "Body",
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
      category: "Body",
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
      category: "Body",
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
      category: "Body",
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
      category: "Body",
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
      category: "Body",
      difficulty: "easy",
      question: "How many chambers does the human stomach have?",
      description: "The human stomach is a single-chamber organ.",
      answer: 1,
      unit: "chamber",
      min: 1,
      max: 5,
      suggestions: [1, 1, 1, 1]
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
