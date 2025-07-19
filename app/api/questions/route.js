import { NextResponse } from 'next/server';

// Questions API routes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    switch (action) {
      case 'list':
        return getQuestionsList(searchParams);
      case 'by_category':
        return getQuestionsByCategory(searchParams);
      case 'by_test':
        return getQuestionsByTest(searchParams);
      case 'search':
        return searchQuestions(searchParams);
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

export async function POST(request) {
  try {
    const { action, ...data } = await request.json();
    
    switch (action) {
      case 'create':
        return createQuestion(data);
      case 'bulk_upload':
        return bulkUploadQuestions(data);
      case 'update':
        return updateQuestion(data);
      case 'delete':
        return deleteQuestion(data);
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

async function getQuestionsList(searchParams) {
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 20;
  const category = searchParams.get('category');
  const subject = searchParams.get('subject');
  const difficulty = searchParams.get('difficulty');
  const topic = searchParams.get('topic');
  
  // Mock questions data - would fetch from Supabase
  const mockQuestions = [];
  for (let i = 1; i <= 100; i++) {
    mockQuestions.push({
      id: i,
      questionText: `Sample question ${i}: What is the correct answer for this problem?`,
      optionA: `Option A for question ${i}`,
      optionB: `Option B for question ${i}`,
      optionC: `Option C for question ${i}`,
      optionD: `Option D for question ${i}`,
      correctAnswer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      explanation: `Detailed explanation for question ${i}`,
      category: ['Engineering', 'Medical', 'Banking'][Math.floor(Math.random() * 3)],
      subject: ['Physics', 'Chemistry', 'Mathematics', 'Biology'][Math.floor(Math.random() * 4)],
      topic: `Topic ${Math.floor(i / 10) + 1}`,
      difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
      usageCount: Math.floor(Math.random() * 50),
      createdAt: new Date().toISOString(),
      createdBy: 'admin_1'
    });
  }
  
  let filteredQuestions = mockQuestions;
  
  // Apply filters
  if (category) {
    filteredQuestions = filteredQuestions.filter(q => q.category.toLowerCase() === category.toLowerCase());
  }
  
  if (subject) {
    filteredQuestions = filteredQuestions.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
  }
  
  if (difficulty) {
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
  }
  
  if (topic) {
    filteredQuestions = filteredQuestions.filter(q => q.topic.toLowerCase().includes(topic.toLowerCase()));
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);
  
  return NextResponse.json({
    success: true,
    questions: paginatedQuestions,
    pagination: {
      page,
      limit,
      total: filteredQuestions.length,
      totalPages: Math.ceil(filteredQuestions.length / limit)
    }
  });
}

async function getQuestionsByCategory(searchParams) {
  const categoryId = searchParams.get('categoryId');
  const limit = parseInt(searchParams.get('limit')) || 50;
  
  if (!categoryId) {
    return NextResponse.json(
      { error: 'Category ID is required' },
      { status: 400 }
    );
  }
  
  // Mock questions by category - would fetch from Supabase
  const mockQuestions = [];
  for (let i = 1; i <= limit; i++) {
    mockQuestions.push({
      id: i,
      questionText: `Category question ${i}: Solve this problem.`,
      optionA: `Option A`,
      optionB: `Option B`,
      optionC: `Option C`,
      optionD: `Option D`,
      correctAnswer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      explanation: `Explanation for question ${i}`,
      categoryId,
      subject: ['Physics', 'Chemistry', 'Mathematics'][Math.floor(Math.random() * 3)],
      difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)]
    });
  }
  
  return NextResponse.json({
    success: true,
    questions: mockQuestions
  });
}

async function getQuestionsByTest(searchParams) {
  const testId = searchParams.get('testId');
  
  if (!testId) {
    return NextResponse.json(
      { error: 'Test ID is required' },
      { status: 400 }
    );
  }
  
  // Mock test questions - would fetch from Supabase
  const mockQuestions = [];
  for (let i = 1; i <= 90; i++) {
    mockQuestions.push({
      id: i,
      questionNumber: i,
      questionText: `Test question ${i}: What is the correct answer?`,
      optionA: `Option A for question ${i}`,
      optionB: `Option B for question ${i}`,
      optionC: `Option C for question ${i}`,
      optionD: `Option D for question ${i}`,
      correctAnswer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      explanation: `Detailed explanation for question ${i}`,
      subject: i <= 30 ? 'Physics' : i <= 60 ? 'Chemistry' : 'Mathematics',
      topic: `Topic ${Math.floor(i / 10) + 1}`,
      difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)]
    });
  }
  
  return NextResponse.json({
    success: true,
    questions: mockQuestions
  });
}

async function searchQuestions(searchParams) {
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit')) || 20;
  
  if (!query) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    );
  }
  
  // Mock search results - would search in Supabase
  const mockResults = [];
  for (let i = 1; i <= limit; i++) {
    mockResults.push({
      id: i,
      questionText: `Search result ${i}: Question containing "${query}"`,
      optionA: `Option A`,
      optionB: `Option B`,
      optionC: `Option C`,
      optionD: `Option D`,
      correctAnswer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      category: 'Engineering',
      subject: 'Physics',
      difficulty: 'medium',
      relevanceScore: Math.random()
    });
  }
  
  // Sort by relevance
  mockResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  return NextResponse.json({
    success: true,
    questions: mockResults,
    query,
    totalResults: mockResults.length
  });
}

async function createQuestion(data) {
  const {
    questionText,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    explanation,
    categoryId,
    subject,
    topic,
    difficulty,
    createdBy
  } = data;
  
  // Validate required fields
  if (!questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  
  // Validate correct answer
  if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
    return NextResponse.json(
      { error: 'Invalid correct answer' },
      { status: 400 }
    );
  }
  
  // Mock question creation - would save to Supabase
  const newQuestion = {
    id: Date.now(),
    questionText,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    explanation,
    categoryId,
    subject,
    topic,
    difficulty: difficulty || 'medium',
    usageCount: 0,
    createdBy,
    createdAt: new Date().toISOString()
  };
  
  console.log('Question created:', newQuestion);
  
  return NextResponse.json({
    success: true,
    question: newQuestion,
    message: 'Question created successfully'
  });
}

async function bulkUploadQuestions(data) {
  const { questions, categoryId, createdBy } = data;
  
  // Validate required fields
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return NextResponse.json(
      { error: 'Questions array is required' },
      { status: 400 }
    );
  }
  
  // Validate each question
  const validQuestions = [];
  const errors = [];
  
  questions.forEach((question, index) => {
    if (!question.questionText || !question.optionA || !question.optionB || 
        !question.optionC || !question.optionD || !question.correctAnswer) {
      errors.push(`Question ${index + 1}: Missing required fields`);
    } else if (!['A', 'B', 'C', 'D'].includes(question.correctAnswer)) {
      errors.push(`Question ${index + 1}: Invalid correct answer`);
    } else {
      validQuestions.push({
        ...question,
        id: Date.now() + index,
        categoryId,
        usageCount: 0,
        createdBy,
        createdAt: new Date().toISOString()
      });
    }
  });
  
  if (errors.length > 0) {
    return NextResponse.json({
      success: false,
      errors,
      validCount: validQuestions.length,
      totalCount: questions.length
    });
  }
  
  // Mock bulk upload - would save to Supabase
  console.log('Bulk upload:', { count: validQuestions.length, categoryId });
  
  return NextResponse.json({
    success: true,
    uploadedCount: validQuestions.length,
    message: `Successfully uploaded ${validQuestions.length} questions`
  });
}

async function updateQuestion(data) {
  const { questionId, ...updateData } = data;
  
  if (!questionId) {
    return NextResponse.json(
      { error: 'Question ID is required' },
      { status: 400 }
    );
  }
  
  // Mock question update - would update in Supabase
  console.log('Question updated:', { questionId, updateData });
  
  return NextResponse.json({
    success: true,
    message: 'Question updated successfully'
  });
}

async function deleteQuestion(data) {
  const { questionId } = data;
  
  if (!questionId) {
    return NextResponse.json(
      { error: 'Question ID is required' },
      { status: 400 }
    );
  }
  
  // Mock question deletion - would delete from Supabase
  console.log('Question deleted:', questionId);
  
  return NextResponse.json({
    success: true,
    message: 'Question deleted successfully'
  });
}