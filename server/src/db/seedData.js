// Fictional demo data only. Kept separate from seed logic so the dataset
// can be edited without touching the insertion code.

export const demoStudent = {
  name: 'Javahar',
  email: 'javaharreddy20@gmail.com',
  password: 'edutrack123',
  program: 'B.Tech Computer Science',
  year: 'Graduate',
  location: 'Bengaluru, India',
  bio: 'B.Tech Computer Science graduate passionate about frontend engineering and applied AI. I like building clean, usable products.',
  interests: ['Frontend Engineering', 'Artificial Intelligence', 'Product Design'],
  learning_goals: 'Become a well-rounded full-stack engineer and ship a polished portfolio project every quarter.',
  profile_image: null,
};

export const courses = [
  {
    key: 'react',
    title: 'React & Modern Frontend Development',
    description:
      'A hands-on course covering modern React: components, hooks, state management, and building production-ready interfaces.',
    category: 'Coding',
    instructor: 'Ananya Rao',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    difficulty: 'Intermediate',
    duration: '6 weeks',
    modules: [
      { title: 'Introduction', lessons: ['Welcome to the Course', 'Getting Started with React'] },
      {
        title: 'Fundamentals',
        lessons: ['Components & Props', 'State & Events', 'Hooks Deep Dive', 'Effects & Data Fetching'],
      },
      { title: 'Advanced Patterns', lessons: ['Context & Global State', 'Performance Optimization'] },
      { title: 'Project', lessons: ['Building the Dashboard Project'] },
    ],
    completedCount: 7,
  },
  {
    key: 'uiux',
    title: 'UI/UX Design Fundamentals',
    description:
      'Learn the principles of great product design — visual hierarchy, usability, wireframing, and building consistent design systems.',
    category: 'Design',
    instructor: 'Rohan Kapoor',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    difficulty: 'Beginner',
    duration: '5 weeks',
    modules: [
      { title: 'Design Foundations', lessons: ['Principles of Visual Design', 'Color & Typography'] },
      { title: 'User Research', lessons: ['Understanding Users', 'Wireframing Basics', 'Prototyping'] },
      { title: 'Design Systems', lessons: ['Building a Design System', 'Case Study Workshop'] },
      { title: 'Final Review', lessons: ['Design Critique Session'] },
    ],
    completedCount: 5,
  },
  {
    key: 'ai',
    title: 'Introduction to Artificial Intelligence',
    description:
      'A foundational course on AI concepts — search, machine learning basics, and neural networks — with practical examples.',
    category: 'AI',
    instructor: 'Dr. Neha Sharma',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    difficulty: 'Beginner',
    duration: '4 weeks',
    modules: [
      { title: 'Foundations', lessons: ['What is Artificial Intelligence?', 'History & Applications'] },
      { title: 'Machine Learning', lessons: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation'] },
      { title: 'Neural Networks', lessons: ['Perceptrons & Layers'] },
    ],
    completedCount: 8,
  },
];

// Assignments reference courses by the `key` above.
export const assignments = [
  {
    courseKey: 'react',
    title: 'React Fundamentals Quiz',
    description: 'A short quiz covering components, props, state, and hooks.',
    dueInDays: -10,
    maxMarks: 100,
    submission: {
      status: 'graded',
      submittedDaysAgo: 11,
      text: 'Completed all 20 questions covering component lifecycle, hooks, and state management patterns.',
      marks: 91,
      feedback: 'Excellent understanding of hooks and component lifecycle. Minor gaps in memoization patterns.',
    },
  },
  {
    courseKey: 'react',
    title: 'React Dashboard Project',
    description: 'Build a small analytics dashboard using React, including at least three connected components and client-side routing.',
    dueInDays: 4,
    maxMarks: 100,
    submission: null,
  },
  {
    courseKey: 'react',
    title: 'React Component Library',
    description: 'Design and implement a reusable component library with documented props for at least six components.',
    dueInDays: 18,
    maxMarks: 100,
    submission: null,
  },
  {
    courseKey: 'uiux',
    title: 'Wireframe Assignment',
    description: 'Submit low-fidelity wireframes for a mobile app of your choice, covering three key user flows.',
    dueInDays: -14,
    maxMarks: 100,
    submission: {
      status: 'graded',
      submittedDaysAgo: 15,
      text: 'Submitted wireframes for onboarding, checkout, and profile settings flows with annotations.',
      marks: 87,
      feedback: 'Solid wireframes overall; refine spacing consistency and annotate edge cases more clearly.',
    },
  },
  {
    courseKey: 'uiux',
    title: 'Design System Case Study',
    description: 'Write a case study documenting the design system you built, including tokens, components, and usage guidelines.',
    dueInDays: 6,
    maxMarks: 100,
    submission: {
      status: 'submitted',
      submittedDaysAgo: 1,
      text: 'Case study covering our color and type tokens, spacing scale, and core component set with usage guidelines.',
      marks: null,
      feedback: null,
    },
  },
  {
    courseKey: 'uiux',
    title: 'Usability Testing Report',
    description: 'Run a usability test with three participants and summarize findings with prioritized recommendations.',
    dueInDays: 12,
    maxMarks: 100,
    submission: null,
  },
  {
    courseKey: 'ai',
    title: 'AI Fundamentals Quiz',
    description: 'A quiz covering the foundational concepts of artificial intelligence and machine learning.',
    dueInDays: -20,
    maxMarks: 100,
    submission: {
      status: 'graded',
      submittedDaysAgo: 21,
      text: 'Completed the quiz covering search algorithms, supervised vs unsupervised learning, and neural network basics.',
      marks: 94,
      feedback: 'Outstanding grasp of core AI concepts. Keep exploring neural network architectures.',
    },
  },
  {
    courseKey: 'ai',
    title: 'Neural Network Basics Essay',
    description: 'A short essay explaining perceptrons, activation functions, and how a basic feed-forward network learns.',
    dueInDays: -3,
    maxMarks: 100,
    submission: null,
  },
];

export const notifications = [
  {
    title: 'Assignment due soon',
    message: 'Your React Dashboard Project is due soon.',
    type: 'assignment',
    daysAgo: 0,
    isRead: false,
  },
  {
    title: 'Submission received',
    message: 'Your Design System Case Study has been reviewed.',
    type: 'assignment',
    daysAgo: 1,
    isRead: false,
  },
  {
    title: 'Course completed',
    message: 'Congratulations! You completed Introduction to Artificial Intelligence.',
    type: 'course',
    daysAgo: 2,
    isRead: true,
  },
  {
    title: 'New grade available',
    message: 'Your grade for React Fundamentals Quiz is now available: 91%.',
    type: 'grade',
    daysAgo: 11,
    isRead: true,
  },
  {
    title: 'New grade available',
    message: 'Your grade for Wireframe Assignment is now available: 87%.',
    type: 'grade',
    daysAgo: 15,
    isRead: true,
  },
  {
    title: 'Welcome to Student MS',
    message: 'Welcome, Javahar! Explore your courses and pick up where you left off.',
    type: 'general',
    daysAgo: 30,
    isRead: true,
  },
];
