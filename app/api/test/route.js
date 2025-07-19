import { NextResponse } from 'next/server';

// Test management API routes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');
    const action = searchParams.get('action');
    
    if (testId && action === 'details') {
      return getTestDetails(testId);
    } else if (action === 'list') {
      return getTestList(searchParams);
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
      case 'submit_answers':
        return submitTestAnswers(data);
      case 'save_progress':
        return saveTestProgress(data);
      case 'start_test':
        return startTest(data);
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

async function getTestDetails(testId) {
  // Mock test details - would fetch from Supabase
  const mockTest = {
    id: testId,
    title: 'JEE Main Mock Test 1',
    description: 'Comprehensive mock test for JEE Main preparation',
    duration: 180,
    total_questions: 90,
    category: 'Engineering',
    difficulty: 'high',
    questions: generateMockQuestions(90)
  };
  
  return NextResponse.json({
    success: true,
    test: mockTest
  });
}

async function getTestList(searchParams) {
  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  
  // Mock test list - would fetch from Supabase with filters
  const mockTests = [
    {
      id: 1,
      title: 'JEE Main Mock Test 1',
      description: 'Comprehensive mock test',
      duration: 180,
      total_questions: 90,
      category: 'Engineering',
      difficulty: 'high',
      is_free: false,
      price: 199
    },
    // Add more mock tests...
  ];
  
  return NextResponse.json({
    success: true,
    tests: mockTests,
    pagination: {
      page,
      limit,
      total: mockTests.length,
      totalPages: Math.ceil(mockTests.length / limit)
    }
  });
}

async function submitTestAnswers({ testId, answers, userId, timeTaken }) {
  // Calculate results
  const correctAnswers = Math.floor(Math.random() * 50) + 30; // Mock calculation
  const totalQuestions = 90;
  const score = (correctAnswers * 4) - ((Object.keys(answers).length - correctAnswers) * 1);
  const percentage = (correctAnswers / totalQuestions) * 100;
  
  const result = {
    testId,
    userId,
    answers,
    correctAnswers,
    totalQuestions,
    score,
    percentage: percentage.toFixed(1),
    timeTaken,
    rank: Math.floor(Math.random() * 1000) + 1,
    submittedAt: new Date().toISOString()
  };
  
  // Would save to Supabase database
  console.log('Test submission:', result);
  
  return NextResponse.json({
    success: true,
    result
  });
}

async function saveTestProgress({ testId, answers, userId, currentQuestion }) {
  // Save progress to database
  console.log('Saving progress:', { testId, userId, currentQuestion, answersCount: Object.keys(answers).length });
  
  return NextResponse.json({
    success: true,
    message: 'Progress saved'
  });
}

async function startTest({ testId, userId }) {
  // Record test start time
  const startTime = new Date().toISOString();
  
  console.log('Test started:', { testId, userId, startTime });
  
  return NextResponse.json({
    success: true,
    startTime
  });
}

function generateMockQuestions(count) {
  const questions = [];
  const subjects = ['Physics', 'Chemistry', 'Mathematics'];
  
  for (let i = 1; i <= count; i++) {
    questions.push({
      id: i,
      question_number: i,
      question_text: `Sample question ${i} - What is the correct answer?`,
      option_a: 'Option A',
      option_b: 'Option B',
      option_c: 'Option C',
      option_d: 'Option D',
      correct_answer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      subject: subjects[Math.floor(i / 30)],
      topic: `Topic ${Math.floor(i / 10) + 1}`
    });
  }
  
  return questions;
}