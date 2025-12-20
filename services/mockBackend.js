// Mock Database
const USERS = [
  { _id: 'u1', username: 'QuizMaster99', email: 'qm@test.com', password: 'password', role: 'Teacher', organization: 'Tech University', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', totalScore: 1250, badgesArray: ['Veteran'] },
  { _id: 'u2', username: 'ReactNinja', email: 'rn@test.com', password: 'password', role: 'Student', organization: 'Code High', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', totalScore: 980, badgesArray: ['Speedster'] },
  { _id: 'u3', username: 'AI_Explorer', email: 'ai@test.com', password: 'password', role: 'Student', organization: 'Future Academy', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack', totalScore: 850, badgesArray: [] },
  { _id: 'u4', username: 'FullStackDev', email: 'fsd@test.com', password: 'password', role: 'Teacher', organization: 'Dev Bootcamp', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Midnight', totalScore: 1100, badgesArray: ['Sharpshooter'] },
  { _id: 'u5', username: 'Newbie', email: 'nb@test.com', password: 'password', role: 'Student', organization: 'Primary School', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Coco', totalScore: 200, badgesArray: [] },
];

let QUIZZES = [
  {
    _id: 'q1',
    title: 'React Fundamentals',
    description: 'Test your knowledge of React hooks and components.',
    difficulty: 'Medium',
    category: 'Programming',
    questionsArray: [
      {
        questionText: 'Which hook is used to handle side effects?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correctAnswerIndex: 1,
      },
      {
        questionText: 'What is the virtual DOM?',
        options: [
          'A direct copy of the HTML DOM',
          'A lightweight copy of the DOM kept in memory',
          'A browser extension',
          'A database for React',
        ],
        correctAnswerIndex: 1,
      },
      {
        questionText: 'How do you pass data to child components?',
        options: ['State', 'Props', 'Redux', 'Context'],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    _id: 'q2',
    title: 'General Science',
    description: 'Basic science questions for everyone.',
    difficulty: 'Easy',
    category: 'Science',
    questionsArray: [
      {
        questionText: 'What is the chemical symbol for Gold?',
        options: ['Go', 'Gd', 'Au', 'Ag'],
        correctAnswerIndex: 2,
      },
      {
        questionText: 'Which planet is known as the Red Planet?',
        options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswerIndex: 1,
      },
    ],
  },
];

const RESULTS = [];

// Session State
let currentUser = null;

// Simulate API Latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Auth Services ---

export const login = async (email, password) => {
  await delay(800);
  const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) throw new Error('User not found');
  if (user.password !== password) throw new Error('Invalid credentials');
  
  currentUser = user;
  return user;
};

export const loginAsGuest = async () => {
  await delay(600);
  const guestUser = {
    _id: `guest_${Date.now()}`,
    username: 'Guest Explorer',
    email: '',
    password: '',
    role: 'Guest',
    organization: 'Guest Session',
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=Guest_${Date.now()}`,
    totalScore: 0,
    badgesArray: []
  };
  currentUser = guestUser;
  return guestUser;
};

export const register = async (username, email, password, role, organization) => {
  await delay(1000);
  
  if (USERS.find(u => u.email === email)) {
    throw new Error('Email already registered');
  }

  const newUser = {
    _id: `u_${Date.now()}`,
    username,
    email,
    password,
    role,
    organization,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    totalScore: 0,
    badgesArray: []
  };

  USERS.push(newUser);
  currentUser = newUser;
  return newUser;
};

export const logout = async () => {
  await delay(200);
  currentUser = null;
};

export const checkSession = async () => {
  await delay(400);
  return currentUser;
};

export const updateUserProfile = async (userId, updates) => {
  await delay(600);
  const userIndex = USERS.findIndex(u => u._id === userId);
  
  // If updating a guest user, just update the session object locally
  if (currentUser && currentUser.role === 'Guest' && currentUser._id === userId) {
      currentUser = { ...currentUser, ...updates };
      return currentUser;
  }

  if (userIndex === -1) throw new Error("User not found");
  
  USERS[userIndex] = { ...USERS[userIndex], ...updates };
  currentUser = USERS[userIndex]; // Update session
  return currentUser;
};

// --- Data Services ---

export const getQuizzes = async () => {
  await delay(500);
  return [...QUIZZES];
};

export const getLeaderboard = async () => {
  await delay(500);
  return [...USERS].sort((a, b) => b.totalScore - a.totalScore).slice(0, 10);
};

// Simulate Server-Side Scoring Logic
export const submitQuiz = async (userId, quizId, userAnswers, timeTaken) => {
  await delay(800);
  
  const quiz = QUIZZES.find(q => q._id === quizId);
  if (!quiz) throw new Error('Quiz not found');

  let score = 0;
  const feedback = [];

  // Securely calculate score on "server"
  quiz.questionsArray.forEach((q, index) => {
    const isCorrect = userAnswers[index] === q.correctAnswerIndex;
    feedback.push(isCorrect);
    if (isCorrect) {
      score += 10; // 10 points per question
    }
  });

  const result = {
    _id: `r${Date.now()}`,
    userId,
    quizId,
    score,
    totalQuestions: quiz.questionsArray.length,
    timeTaken,
    date: new Date().toISOString(),
  };

  RESULTS.push(result);

  // Update user total score atomically
  const userIndex = USERS.findIndex(u => u._id === userId);
  if (userIndex !== -1) {
    USERS[userIndex].totalScore += score;
  } else if (currentUser && currentUser.role === 'Guest') {
    // Update local guest score
    currentUser.totalScore += score;
  }

  return { result, feedback };
};

// Handle both creation (new ID) and update (existing ID)
export const saveQuiz = (quiz) => {
  const existingIndex = QUIZZES.findIndex(q => q._id === quiz._id);
  if (existingIndex !== -1) {
    QUIZZES[existingIndex] = quiz;
  } else {
    QUIZZES = [quiz, ...QUIZZES];
  }
};

export const getCurrentUser = () => {
  if (!currentUser) throw new Error("No session");
  return currentUser; 
};