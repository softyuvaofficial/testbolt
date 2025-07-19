import { NextResponse } from 'next/server';

// Authentication API routes
export async function POST(request) {
  try {
    const { action, ...data } = await request.json();
    
    switch (action) {
      case 'login':
        return handleLogin(data);
      case 'signup':
        return handleSignup(data);
      case 'logout':
        return handleLogout();
      case 'refresh':
        return handleRefreshToken(data);
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

async function handleLogin({ email, password }) {
  // This would integrate with Supabase Auth
  // For demo purposes, returning mock response
  
  if (email === 'demo@testyukti.com' && password === 'demo123') {
    return NextResponse.json({
      success: true,
      user: {
        id: '1',
        email: 'demo@testyukti.com',
        name: 'Demo User'
      },
      token: 'mock-jwt-token'
    });
  }
  
  return NextResponse.json(
    { error: 'Invalid credentials' },
    { status: 401 }
  );
}

async function handleSignup({ email, password, fullName }) {
  // This would integrate with Supabase Auth
  // For demo purposes, returning mock response
  
  return NextResponse.json({
    success: true,
    user: {
      id: Date.now().toString(),
      email,
      name: fullName
    },
    message: 'Account created successfully'
  });
}

async function handleLogout() {
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });
}

async function handleRefreshToken({ refreshToken }) {
  // This would refresh the JWT token
  return NextResponse.json({
    success: true,
    token: 'new-mock-jwt-token'
  });
}