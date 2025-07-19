// Payment processing utilities

export const paymentHelper = {
  // Initialize payment gateway (Razorpay/Stripe)
  initializePayment: (amount, currency = 'INR') => {
    return {
      amount: amount * 100, // Convert to smallest currency unit
      currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    };
  },

  // Process payment
  processPayment: async (paymentData) => {
    try {
      // This would integrate with actual payment gateway
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  },

  // Verify payment
  verifyPayment: async (paymentId, orderId, signature) => {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_id: paymentId,
          order_id: orderId,
          signature: signature
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  },

  // Format currency
  formatCurrency: (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  },

  // Calculate discount
  calculateDiscount: (originalPrice, discountPercent) => {
    const discount = (originalPrice * discountPercent) / 100;
    return {
      discount,
      finalPrice: originalPrice - discount,
      savings: discount
    };
  },

  // Generate order ID
  generateOrderId: () => {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};

export default paymentHelper;