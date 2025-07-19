import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase Client with Service Role Key for server-side actions
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'login':
        return await handleLogin(data);
      case 'signup':
        return await handleSignup(data);
      case 'logout':
        return await handleLogout();
      case 'refresh':
        return await handleRefreshToken(data);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleLogin({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const user = data.user;

  // profiles टेबल से role चेक करें
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 403 });
  }

  if (profile.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
  }

  return NextResponse.json({
    success: true,
    user,
    role: profile.role,
    token: data.session.access_token
  });
}

async function handleSignup({ email, password, fullName }) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const user = data.user;

  // profiles टेबल में डिफ़ॉल्ट role 'user' के साथ profile बनाएँ
  const { error: profileError } = await supabase.from('profiles').insert({
    id: user.id,
    full_name: fullName,
    role: 'user',
    created_at: new Date().toISOString()
  });

  if (profileError) {
    return NextResponse.json({ error: 'Profile creation failed' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    user,
    message: 'Signup successful'
  });
}

async function handleLogout() {
  // Supabase में logout client side होता है, इसलिए server से बस success message भेजें
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });
}

async function handleRefreshToken({ refreshToken }) {
  // Token refresh logic अगर implement हो तो यहाँ लिखें
  return NextResponse.json({
    success: true,
    token: 'new-mock-jwt-token'
  });
}
