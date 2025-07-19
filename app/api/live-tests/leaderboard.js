import { NextResponse } from 'next/server';

// Live Test Leaderboard API
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');
    const type = searchParams.get('type') || 'live'; // live, final
    const limit = parseInt(searchParams.get('limit')) || 50;
    
    if (!testId) {
      return NextResponse.json(
        { error: 'Test ID is required' },
        { status: 400 }
      );
    }
    
    if (type === 'live') {
      return getLiveLeaderboard(testId, limit);
    } else if (type === 'final') {
      return getFinalLeaderboard(testId, limit);
    } else {
      return NextResponse.json(
        { error: 'Invalid leaderboard type' },
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
      case 'update_live_score':
        return updateLiveScore(data);
      case 'export_rankings':
        return exportRankings(data);
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

async function getLiveLeaderboard(testId, limit) {
  // Mock live leaderboard data - would fetch from Supabase with real-time updates
  const mockLeaderboard = [];
  
  for (let i = 1; i <= limit; i++) {
    mockLeaderboard.push({
      rank: i,
      userId: `user_${i}`,
      name: `Student ${i}`,
      score: 300 - (i * 3) + Math.floor(Math.random() * 15),
      accuracy: 95 - (i * 0.8) + Math.floor(Math.random() * 8),
      timeTaken: 90 + Math.floor(Math.random() * 60), // Time taken so far
      questionsAnswered: 45 + Math.floor(Math.random() * 20),
      totalQuestions: 90,
      isOnline: Math.random() > 0.1, // 90% online
      lastActivity: new Date(Date.now() - Math.random() * 300000).toISOString() // Last 5 minutes
    });
  }
  
  // Sort by score descending
  mockLeaderboard.sort((a, b) => b.score - a.score);
  
  // Update ranks
  mockLeaderboard.forEach((student, index) => {
    student.rank = index + 1;
  });
  
  return NextResponse.json({
    success: true,
    leaderboard: mockLeaderboard,
    totalParticipants: 2847,
    lastUpdated: new Date().toISOString(),
    testStatus: 'live'
  });
}

async function getFinalLeaderboard(testId, limit) {
  // Mock final leaderboard data - would fetch from Supabase
  const mockLeaderboard = [];
  
  for (let i = 1; i <= limit; i++) {
    const correctAnswers = Math.floor((300 - (i * 2)) / 4);
    const totalQuestions = 90;
    const accuracy = (correctAnswers / totalQuestions) * 100;
    
    mockLeaderboard.push({
      rank: i,
      userId: `user_${i}`,
      name: `Student ${i}`,
      score: 300 - (i * 2) + Math.floor(Math.random() * 5),
      accuracy: accuracy.toFixed(1),
      timeTaken: 150 + Math.floor(Math.random() * 30),
      correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers - Math.floor(Math.random() * 10),
      unattempted: Math.floor(Math.random() * 10),
      totalQuestions,
      submissionTime: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      subjectWise: {
        Physics: {
          correct: Math.floor(correctAnswers * 0.4),
          total: 30,
          percentage: (Math.floor(correctAnswers * 0.4) / 30 * 100).toFixed(1)
        },
        Chemistry: {
          correct: Math.floor(correctAnswers * 0.3),
          total: 30,
          percentage: (Math.floor(correctAnswers * 0.3) / 30 * 100).toFixed(1)
        },
        Mathematics: {
          correct: Math.floor(correctAnswers * 0.3),
          total: 30,
          percentage: (Math.floor(correctAnswers * 0.3) / 30 * 100).toFixed(1)
        }
      }
    });
  }
  
  return NextResponse.json({
    success: true,
    leaderboard: mockLeaderboard,
    totalParticipants: 2847,
    testStatus: 'completed',
    generatedAt: new Date().toISOString()
  });
}

async function updateLiveScore(data) {
  const { testId, userId, currentScore, questionsAnswered } = data;
  
  if (!testId || !userId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  
  // Mock update - would update Supabase in real-time
  console.log('Live score updated:', {
    testId,
    userId,
    currentScore,
    questionsAnswered,
    timestamp: new Date().toISOString()
  });
  
  return NextResponse.json({
    success: true,
    message: 'Live score updated successfully'
  });
}

async function exportRankings(data) {
  const { testId, format = 'csv' } = data;
  
  if (!testId) {
    return NextResponse.json(
      { error: 'Test ID is required' },
      { status: 400 }
    );
  }
  
  // Mock export - would generate actual file from Supabase data
  const exportData = {
    testId,
    format,
    fileName: `live_test_${testId}_rankings.${format}`,
    downloadUrl: `https://example.com/exports/live_test_${testId}_rankings.${format}`,
    generatedAt: new Date().toISOString(),
    totalRecords: 2847
  };
  
  console.log('Rankings export requested:', exportData);
  
  return NextResponse.json({
    success: true,
    export: exportData,
    message: 'Rankings export generated successfully'
  });
}