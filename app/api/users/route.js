import { NextResponse } from 'next/server';

// Users API routes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    switch (action) {
      case 'list':
        return getUsersList(searchParams);
      case 'profile':
        return getUserProfile(searchParams);
      case 'stats':
        return getUserStats(searchParams);
      case 'search':
        return searchUsers(searchParams);
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
      case 'update_profile':
        return updateUserProfile(data);
      case 'update_role':
        return updateUserRole(data);
      case 'toggle_status':
        return toggleUserStatus(data);
      case 'bulk_action':
        return bulkUserAction(data);
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

async function getUsersList(searchParams) {
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 20;
  const role = searchParams.get('role');
  const status = searchParams.get('status');
  const sortBy = searchParams.get('sortBy') || 'created_at';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  
  // Mock users data - would fetch from Supabase
  const mockUsers = [];
  for (let i = 1; i <= 100; i++) {
    mockUsers.push({
      id: `user_${i}`,
      email: `user${i}@example.com`,
      fullName: `User ${i}`,
      phone: `+91 98765${String(i).padStart(5, '0')}`,
      role: i <= 5 ? 'admin' : 'user',
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      emailVerified: Math.random() > 0.2,
      phoneVerified: Math.random() > 0.3,
      createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
      lastLoginAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      testsAttempted: Math.floor(Math.random() * 50),
      totalScore: Math.floor(Math.random() * 5000),
      subscriptions: Math.floor(Math.random() * 5),
      profileCompleteness: Math.floor(Math.random() * 40) + 60
    });
  }
  
  let filteredUsers = mockUsers;
  
  // Apply filters
  if (role) {
    filteredUsers = filteredUsers.filter(user => user.role === role);
  }
  
  if (status) {
    filteredUsers = filteredUsers.filter(user => user.status === status);
  }
  
  // Apply sorting
  filteredUsers.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  return NextResponse.json({
    success: true,
    users: paginatedUsers,
    pagination: {
      page,
      limit,
      total: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / limit)
    }
  });
}

async function getUserProfile(searchParams) {
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }
  
  // Mock user profile - would fetch from Supabase
  const mockProfile = {
    id: userId,
    email: 'user@example.com',
    fullName: 'John Doe',
    phone: '+91 9876543210',
    role: 'user',
    status: 'active',
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-01-15T10:30:00Z',
    profileCompleteness: 85,
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      language: 'english',
      timezone: 'Asia/Kolkata'
    },
    stats: {
      testsAttempted: 25,
      totalScore: 1850,
      averageScore: 74,
      bestScore: 95,
      totalTimeSpent: 3600, // in minutes
      streak: 7,
      rank: 1250,
      subscriptions: 2
    },
    recentActivity: [
      {
        type: 'test_completed',
        description: 'Completed JEE Main Mock Test 1',
        timestamp: '2024-01-15T09:00:00Z',
        score: 85
      },
      {
        type: 'subscription_purchased',
        description: 'Purchased NEET Biology Series',
        timestamp: '2024-01-14T15:30:00Z',
        amount: 199
      }
    ]
  };
  
  return NextResponse.json({
    success: true,
    profile: mockProfile
  });
}

async function getUserStats(searchParams) {
  const period = searchParams.get('period') || 'month';
  
  // Mock user statistics - would calculate from Supabase
  const mockStats = {
    totalUsers: 2500,
    activeUsers: 2200,
    newUsers: {
      today: 15,
      week: 85,
      month: 350
    },
    usersByRole: {
      user: 2485,
      admin: 15
    },
    usersByStatus: {
      active: 2200,
      inactive: 300
    },
    verificationStats: {
      emailVerified: 2100,
      phoneVerified: 1800,
      bothVerified: 1750
    },
    engagementStats: {
      dailyActiveUsers: 450,
      weeklyActiveUsers: 1200,
      monthlyActiveUsers: 2000
    },
    growthData: [
      { date: '2024-01-01', newUsers: 25, totalUsers: 2150 },
      { date: '2024-01-02', newUsers: 30, totalUsers: 2180 },
      { date: '2024-01-03', newUsers: 28, totalUsers: 2208 },
      { date: '2024-01-04', newUsers: 35, totalUsers: 2243 },
      { date: '2024-01-05', newUsers: 32, totalUsers: 2275 }
    ]
  };
  
  return NextResponse.json({
    success: true,
    stats: mockStats,
    period
  });
}

async function searchUsers(searchParams) {
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
      id: `user_${i}`,
      email: `${query.toLowerCase()}${i}@example.com`,
      fullName: `${query} User ${i}`,
      phone: `+91 98765${String(i).padStart(5, '0')}`,
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
      relevanceScore: Math.random()
    });
  }
  
  // Sort by relevance
  mockResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  return NextResponse.json({
    success: true,
    users: mockResults,
    query,
    totalResults: mockResults.length
  });
}

async function updateUserProfile(data) {
  const { userId, ...updateData } = data;
  
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }
  
  // Mock profile update - would update in Supabase
  console.log('User profile updated:', { userId, updateData });
  
  return NextResponse.json({
    success: true,
    message: 'Profile updated successfully'
  });
}

async function updateUserRole(data) {
  const { userId, newRole, updatedBy } = data;
  
  if (!userId || !newRole) {
    return NextResponse.json(
      { error: 'User ID and new role are required' },
      { status: 400 }
    );
  }
  
  if (!['user', 'admin'].includes(newRole)) {
    return NextResponse.json(
      { error: 'Invalid role' },
      { status: 400 }
    );
  }
  
  // Mock role update - would update in Supabase
  console.log('User role updated:', { userId, newRole, updatedBy });
  
  return NextResponse.json({
    success: true,
    message: `User role updated to ${newRole}`
  });
}

async function toggleUserStatus(data) {
  const { userId, updatedBy } = data;
  
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }
  
  // Mock status toggle - would update in Supabase
  console.log('User status toggled:', { userId, updatedBy });
  
  return NextResponse.json({
    success: true,
    message: 'User status updated successfully'
  });
}

async function bulkUserAction(data) {
  const { userIds, action, actionData, performedBy } = data;
  
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return NextResponse.json(
      { error: 'User IDs array is required' },
      { status: 400 }
    );
  }
  
  if (!action) {
    return NextResponse.json(
      { error: 'Action is required' },
      { status: 400 }
    );
  }
  
  // Mock bulk action - would perform bulk operation in Supabase
  console.log('Bulk user action:', { userIds, action, actionData, performedBy });
  
  let message = '';
  switch (action) {
    case 'activate':
      message = `Activated ${userIds.length} users`;
      break;
    case 'deactivate':
      message = `Deactivated ${userIds.length} users`;
      break;
    case 'delete':
      message = `Deleted ${userIds.length} users`;
      break;
    case 'send_notification':
      message = `Sent notification to ${userIds.length} users`;
      break;
    default:
      message = `Performed ${action} on ${userIds.length} users`;
  }
  
  return NextResponse.json({
    success: true,
    affectedCount: userIds.length,
    message
  });
}