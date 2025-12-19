import Razorpay from 'razorpay';
import crypto from 'crypto';
import 'dotenv/config';  // Add this line at the top!

// Debug: Check if keys are loaded
console.log("🔑 Payment service - RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID ? "✅ Found" : "❌ Missing");

// Initialize Razorpay instance (will be created when keys are available)
let razorpay: Razorpay | null = null;

function getRazorpayInstance(): Razorpay {
  if (!razorpay) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials not configured. Check your .env file.');
    }
    
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
}

interface CreateOrderParams {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

interface VerifyPaymentParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Create Razorpay Order
export async function createRazorpayOrder(params: CreateOrderParams) {
  const { amount, currency = 'INR', receipt, notes } = params;

  const options = {
    amount: Math.round(amount * 100), // Convert to paise
    currency,
    receipt: receipt || `receipt_${Date.now()}`,
    notes: notes || {},
  };

  console.log("📦 Creating Razorpay order:", { amount: options.amount, currency });

  try {
    const instance = getRazorpayInstance();
    const order = await instance.orders.create(options);
    console.log("✅ Order created:", order.id);
    return {
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    };
  } catch (error: any) {
    console.error('❌ Razorpay order creation failed:', error.message || error);
    throw new Error(error.message || 'Failed to create payment order');
  }
}

// Verify Razorpay Payment Signature
export function verifyRazorpayPayment(params: VerifyPaymentParams) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;

  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay secret key not configured');
  }

  // Create expected signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  const isValid = expectedSignature === razorpay_signature;

  if (isValid) {
    console.log("✅ Payment verified:", razorpay_payment_id);
    return {
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    };
  } else {
    console.error("❌ Payment verification failed - signature mismatch");
    throw new Error('Payment verification failed - Invalid signature');
  }
}

// Fetch Payment Details
export async function fetchPaymentDetails(paymentId: string) {
  try {
    const instance = getRazorpayInstance();
    const payment = await instance.payments.fetch(paymentId);
    return {
      success: true,
      payment,
    };
  } catch (error) {
    console.error('Failed to fetch payment details:', error);
    throw new Error('Failed to fetch payment details');
  }
}

// Verify Webhook Signature
export function verifyWebhookSignature(body: string, signature: string): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.warn('Webhook secret not configured');
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}

// Process Refund (Optional)
export async function processRefund(paymentId: string, amount?: number) {
  try {
    const instance = getRazorpayInstance();
    const refund = await instance.payments.refund(paymentId, {
      amount: amount ? Math.round(amount * 100) : undefined,
    });
    return {
      success: true,
      refund,
    };
  } catch (error) {
    console.error('Refund failed:', error);
    throw new Error('Failed to process refund');
  }
}