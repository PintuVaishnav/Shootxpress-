// PhonePe Payment Gateway Integration with Dynamic QR Code
import crypto from 'crypto';

interface PhonePeQRResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    merchantId: string;
    transactionId: string;
    amount: number;
    qrString: string;
  };
}

interface CreateQRParams {
  amount: number;
  merchantOrderId: string;
  userId?: string;
}

export class PaymentService {
  private merchantId: string;
  private saltKey: string;
  private saltIndex: string;
  private baseUrl: string;

  constructor() {
    this.merchantId = process.env.PHONEPE_MERCHANT_ID || "";
    this.saltKey = process.env.PHONEPE_SALT_KEY || "";
    this.saltIndex = process.env.PHONEPE_SALT_INDEX || "1";
    this.baseUrl = process.env.PHONEPE_BASE_URL || "https://mercury-uat.phonepe.com/enterprise-sandbox";
    
    if (!this.merchantId || !this.saltKey) {
      console.warn("PhonePe credentials not configured. Payment functionality will be limited.");
    }
  }

  generateSignature(payload: string): string {
    const stringToSign = payload + this.saltKey;
    return crypto.createHash('sha256').update(stringToSign).digest('hex');
  }

  async createDynamicQR(params: CreateQRParams): Promise<PhonePeQRResponse | null> {
    if (!this.merchantId || !this.saltKey) {
      console.warn("PhonePe credentials not configured");
      return null;
    }

    try {
      const transactionId = `TX${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      const payload = {
        merchantId: this.merchantId,
        transactionId: transactionId,
        amount: params.amount * 100, // Convert to paise
        expiresIn: 1800 // 30 minutes
      };

      const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
      const signature = this.generateSignature(base64Payload);
      
      const headers = {
        'Content-Type': 'application/json',
        'X-VERIFY': `${signature}###${this.saltIndex}`,
      };

      // For demo purposes, return a mock response with UPI QR string
      // In real implementation, you would make API call to PhonePe
      const mockResponse: PhonePeQRResponse = {
        success: true,
        code: "SUCCESS",
        message: "QR generated successfully",
        data: {
          merchantId: this.merchantId,
          transactionId: transactionId,
          amount: params.amount,
          qrString: `upi://pay?pa=${this.merchantId}@ybl&pn=ShootXpress&am=${params.amount}&tr=${transactionId}&tn=Payment for ${params.merchantOrderId}&mc=5311&mode=04&purpose=00`
        }
      };
      
      return mockResponse;
    } catch (error) {
      console.error('Error creating PhonePe QR:', error);
      return null;
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<boolean> {
    if (!this.merchantId || !this.saltKey) {
      console.warn("PhonePe credentials not configured");
      return false;
    }

    try {
      // For demo purposes, return true after 30 seconds
      // In real implementation, you would check payment status via PhonePe API
      console.log(`Checking payment status for transaction: ${transactionId}`);
      return true;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return false;
    }
  }

  generateUPIQRCode(amount: number, transactionId: string, orderDescription: string): string {
    // Generate UPI QR string that can be scanned by any UPI app including PhonePe
    const upiString = `upi://pay?pa=shootxpress@paytm&pn=ShootXpress&am=${amount}&tr=${transactionId}&tn=${encodeURIComponent(orderDescription)}&mc=5311&mode=04&purpose=00`;
    return upiString;
  }
}

export const paymentService = new PaymentService();
