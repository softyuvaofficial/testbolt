import { NextResponse } from 'next/server';

// Live Tests API routes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const testId = searchParams.get('testId');
    
    if (action === 'list') {
      return getLiveTestsList(searchParams);
    } else if (action === 'details' && testId) {
      return getLiveTestDetails(testId);
    } else if (action === 'leaderboard' && testId) {
      return getLiveTestLeaderboard(testId);
    } else {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { action, ...data } = await request.json();
    
    switch (action) {
      case 'create':
        return createLiveTest(data);
      case 'register':
        return registerForLiveTest(data);
      case 'start':
        return startLiveTest(data);
      case 'submit':
        return submitLiveTest(data);
      case 'update_progress':
        return updateLiveTestProgress(data);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getLiveTestsList(searchParams) {
  const status = searchParams.get('status') || 'all';
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  
  // Mock live tests data - would fetch from Supabase
  const mockLiveTests = [
    {
      id: 1,
      title: "JEE Main Live Mock Test 2024",
      description: "National level live mock test for JEE Main aspirants",
      startTime: "2024-01-20T10:00:00Z",
      duration: 180,
      totalQuestions: 90,
      registeredUsers: 2500,
      maxParticipants: 5000,
      category: "Engineering",
      difficulty: "high",
      status: "upcoming",
      prizePool: 50000,
      isLive: false,
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      title: "NEET Biology Championship",
      description: "Live biology test with instant ranking and analysis",
      startTime: "2024-01-18T14:00:00Z",
      duration: 120,
      totalQuestions: 45,
      registeredUsers: 1800,
      maxParticipants: 3000,
      category: "Medical",
      difficulty: "medium",
      status: "live",
      prizePool: 25000,
      isLive: true,
      createdAt: "2024-01-02T00:00:00Z"
    },
    {
      id: 3,
      title: "Banking Aptitude Live Challenge",
      description: "Competitive banking exam preparation with live leaderboard",
      startTime: "2024-01-15T16:00:00Z",
      duration: 90,
      totalQuestions: 50,
      registeredUsers: 1200,
      maxParticipants: 2000,
      category: "Banking",
      difficulty: "medium",
      status: "completed",
      prizePool: 15000,
      isLive: false,
      createdAt: "2024-01-03T00:00:00Z"
    }
  ];
  
  let filteredTests = mockLiveTests;
  
  // Apply status filter
  if (status !== 'all') {
    filteredTests = filteredTests.filter(test => test.status === status);
  }
  
  // Apply category filter
  if (category) {
    filteredTests = filteredTests.filter(test => 
      test.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  return NextResponse.json({
    success: true,
    tests: filteredTests,
    pagination: {
      page,
      limit,
      total: filteredTests.length,
      totalPages: Math.ceil(filteredTests.length / limit)
    }
  });
}

async function getLiveTestDetails(testId) {
  // Mock test details - would fetch from Supabase
  const mockTest = {
    id: parseInt(testId),
    title: "JEE Main Live Mock Test 2024",
    description: "National level live mock test for JEE Main aspirants with real-time ranking",
    startTime: "2024-01-20T10:00:00Z",
    duration: 180,
    totalQuestions: 90,
    registeredUsers: 2500,
    maxParticipants: 5000,
    category: "Engineering",
    difficulty: "high",
    prizePool: 50000,
    status: "upcoming",
    instructions: [
      "This is a live test with real-time ranking updates",
      "Test will start exactly at the scheduled time",
      "Late entries are not allowed once the test begins",
      "All participants will see live leaderboard during the test",
      "Results and rankings will be available immediately after submission"
    ],
    syllabus: [
      "Physics: Mechanics, Thermodynamics, Optics, Modern Physics",
      "Chemistry: Organic, Inorganic, Physical Chemistry",
      "Mathematics: Algebra, Calculus, Coordinate Geometry"
    ],
    prizes: [
      { rank: "1st", amount: 25000 },
      { rank: "2nd", amount: 15000 },
      { rank: "3rd", amount: 10000 }
    ]
  };
  
  return NextResponse.json({
    success: true,
    test: mockTest
  });
}

async function getLiveTestLeaderboard(testId) {
  // Mock leaderboard data - would fetch from Supabase
  const mockLeaderboard = [];
  for (let i = 1; i <= 50; i++) {
    mockLeaderboard.push({
      rank: i,
      userId: `user_${i}`,
      name: `Student ${i}`,
      score: 300 - (i * 2) + Math.floor(Math.random() * 10),
      accuracy: 95 - (i * 0.5) + Math.floor(Math.random() * 5),
      timeTaken: 120 + Math.floor(Math.random() * 60),
      correctAnswers: Math.floor((300 - (i * 2)) / 4),
      totalQuestions: 90
    });
  }
  
  return NextResponse.json({
    success: true,
    leaderboard: mockLeaderboard,
    totalParticipants: mockLeaderboard.length
  });
}

async function createLiveTest(data) {
  const {
    title,
    description,
    categoryId,
    difficulty,
    duration,
    totalQuestions,
    startDateTime,
    maxParticipants,
    prizePool,
    createdBy
  } = data;
  
  // Validate required fields
  if (!title || !categoryId || !startDateTime) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  
  // Mock creation - would save to Supabase
  const newLiveTest = {
    id: Date.now(),
    title,
    description,
    categoryId,
    difficulty,
    duration,
    totalQuestions,
    startDateTime,
    maxParticipants,
    prizePool,
    registeredUsers: 0,
    status: 'upcoming',
    createdBy,
    createdAt: new Date().toISOString()
  };
  
  console.log('Live test created:', newLiveTest);
  
  return NextResponse.json({
    success: true,
    liveTest: newLiveTest,
    message: 'Live test scheduled successfully'
  });
}

async function registerForLiveTest(data) {
  const { testId, userId } = data;
  
  if (!testId || !userId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  
  // Mock registration - would save to Supabase
  console.log('User registered for live test:', { testId, userId });
  
  return NextResponse.json({
    success: true,
    message: 'Successfully registered for live test'
  });
}

async function startLiveTest(data) {
  const { testId, userId } = data;
  
  if (!testId || !userId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  
  // Mock start - would update Supabase
  const startTime = new Date().toISOString();
  
  console.log('Live test started:', { testId, userId, startTime });
  
  return NextResponse.json({
    success: true,
    startTime,
    message: 'Live test started successfully'
  });
}

async function submitLiveTest(data) {
  const { testId, userId, answers, timeTaken } = data;
  
  if (!testId || !userId || !answers) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  
  // Calculate results (mock calculation)
  const totalQuestions = 90;
  const correctAnswers = Math.floor(Math.random() * 50) + 30;
  const score = (correctAnswers * 4) - ((Object.keys(answers).length - correctAnswers) * 1);
  const percentage = (correctAnswers / totalQuestions) * 100;
  const rank = Math.floor(Math.random() * 1000) + 1;
  
  const result = {
    testId,
    userId,
    answers,
    correctAnswers,
    totalQuestions,
    score,
    percentage: percentage.toFixed(1),
    timeTaken,
    rank,
    totalParticipants: 2500,
    submittedAt: new Date().toISOString()
  };
  
  // Would save to Supabase database
  console.log('Live test submission:', result);
  
  return NextResponse.json({
    success: true,
    result
  });
}

async function updateLiveTestProgress(data) {
  const { testId, userId, currentQuestion, answers } = data;
  
  // Save live progress to database
  console.log('Live test progress update:', {
    testId,
    userId,
    currentQuestion,
    answersCount: Object.keys(answers || {}).length
  });
  
  return NextResponse.json({
    success: true,
    message: 'Progress updated successfully'
  });
}