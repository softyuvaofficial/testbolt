import { NextResponse } from 'next/server';

// Payments API routes
export async function POST(request) {
  try {
    const { action, ...data } = await request.json();
    
    switch (action) {
      case 'create_order':
        return createPaymentOrder(data);
      case 'verify_payment':
        return verifyPayment(data);
      case 'process_refund':
        return processRefund(data);
      case 'webhook':
        return handleWebhook(data);
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const orderId = searchParams.get('orderId');
    
    if (action === 'status' && orderId) {
      return getPaymentStatus(orderId);
    } else if (action === 'history') {
      return getPaymentHistory(searchParams);
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

async function createPaymentOrder(data) {
  const { userId, testSeriesId, amount, currency = 'INR' } = data;
  
  // Validate required fields
  if (!userId || !testSeriesId || !amount) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  
  // Generate order ID
  const orderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  
  // Mock payment order creation - would integrate with Razorpay/Stripe
  const paymentOrder = {
    orderId,
    amount: amount * 100, // Convert to smallest currency unit
    currency,
    userId,
    testSeriesId,
    status: 'created',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
  };
  
  // Would save to Supabase database
  console.log('Payment order created:', paymentOrder);
  
  return NextResponse.json({
    success: true,
    order: paymentOrder,
    message: 'Payment order created successfully'
  });
}

async function verifyPayment(data) {
  const { orderId, paymentId, signature, userId } = data;
  
  // Validate required fields
  if (!orderId || !paymentId || !signature || !userId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  
  // Mock payment verification - would verify with payment gateway
  const isValid = true; // Mock verification result
  
  if (isValid) {
    // Update payment status in database
    const transaction = {
      id: Date.now(),
      orderId,
      paymentId,
      userId,
      status: 'completed',
      verifiedAt: new Date().toISOString()
    };
    
    console.log('Payment verified:', transaction);
    
    return NextResponse.json({
      success: true,
      transaction,
      message: 'Payment verified successfully'
    });
  } else {
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 400 }
    );
  }
}

async function processRefund(data) {
  const { transactionId, amount, reason } = data;
  
  // Validate required fields
  if (!transactionId || !amount) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  
  // Mock refund processing - would process with payment gateway
  const refund = {
    refundId: `REF${Date.now()}`,
    transactionId,
    amount,
    reason,
    status: 'processing',
    initiatedAt: new Date().toISOString()
  };
  
  console.log('Refund initiated:', refund);
  
  return NextResponse.json({
    success: true,
    refund,
    message: 'Refund initiated successfully'
  });
}

async function handleWebhook(data) {
  const { event, payload } = data;
  
  // Mock webhook handling - would process payment gateway webhooks
  console.log('Webhook received:', { event, payload });
  
  switch (event) {
    case 'payment.captured':
      // Handle successful payment
      console.log('Payment captured:', payload);
      break;
    case 'payment.failed':
      // Handle failed payment
      console.log('Payment failed:', payload);
      break;
    case 'refund.processed':
      // Handle refund completion
      console.log('Refund processed:', payload);
      break;
    default:
      console.log('Unknown webhook event:', event);
  }
  
  return NextResponse.json({
    success: true,
    message: 'Webhook processed successfully'
  });
}

async function getPaymentStatus(orderId) {
  // Mock payment status check - would query payment gateway
  const mockStatus = {
    orderId,
    status: 'completed',
    amount: 19900, // in smallest currency unit
    currency: 'INR',
    paymentId: `PAY${Date.now()}`,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString()
  };
  
  return NextResponse.json({
    success: true,
    payment: mockStatus
  });
}

async function getPaymentHistory(searchParams) {
  const userId = searchParams.get('userId');
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 20;
  const status = searchParams.get('status');
  
  // Mock payment history - would fetch from Supabase
  const mockHistory = [
    {
      id: 1,
      orderId: 'ORD001234',
      paymentId: 'PAY001234',
      userId: 'user_1',
      testSeriesTitle: 'JEE Main Complete Series',
      amount: 299,
      currency: 'INR',
      status: 'completed',
      paymentMethod: 'card',
      createdAt: '2024-01-15T10:00:00Z',
      completedAt: '2024-01-15T10:02:00Z'
    },
    {
      id: 2,
      orderId: 'ORD001235',
      paymentId: 'PAY001235',
      userId: 'user_2',
      testSeriesTitle: 'NEET Biology Practice',
      amount: 199,
      currency: 'INR',
      status: 'failed',
      paymentMethod: 'upi',
      createdAt: '2024-01-14T15:30:00Z',
      completedAt: null
    }
  ];
  
  let filteredHistory = mockHistory;
  
  if (userId) {
    filteredHistory = filteredHistory.filter(p => p.userId === userId);
  }
  
  if (status) {
    filteredHistory = filteredHistory.filter(p => p.status === status);
  }
  
  return NextResponse.json({
    success: true,
    payments: filteredHistory,
    pagination: {
      page,
      limit,
      total: filteredHistory.length,
      totalPages: Math.ceil(filteredHistory.length / limit)
    }
  });
}