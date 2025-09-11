import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, QrCode, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentQRProps {
  amount: number;
  bookingId: string;
  onPaymentSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentQR({
  amount,
  bookingId,
  onPaymentSuccess,
  onCancel,
}: PaymentQRProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const { toast } = useToast();
  
  // Use static QR image from qr folder
  const qrImagePath = "/qr/phonepe-qr.jpg"; // Place your QR image in client/public/qr/phonepe-qr.jpg

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast({
            title: "QR Code Expired",
            description: "Please try again to generate a new QR code.",
            variant: "destructive",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [toast]);

  // Simulate payment success for demo
  const simulatePaymentSuccess = async () => {
    setIsChecking(true);
    try {
      const transactionId = `TX${Date.now()}`;
      const response = await fetch('/api/payment/simulate-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, transactionId }),
      });

      if (response.ok) {
        toast({
          title: "Payment Successful!",
          description: "Your booking has been confirmed.",
        });
        onPaymentSuccess();
      } else {
        throw new Error('Payment simulation failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50" data-testid="payment-qr-modal">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md bg-white">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Smartphone className="h-6 w-6" />
                <h2 className="text-xl font-bold">Pay with PhonePe</h2>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">₹{amount}</p>
                <p className="text-sm text-gray-600">Advance Payment</p>
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                <img 
                  src={qrImagePath} 
                  alt="PhonePe QR Code" 
                  className="w-48 h-48 mx-auto object-contain"
                  data-testid="payment-qr-code"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-orange-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Expires in: {formatTime(timeLeft)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Booking ID: {bookingId}
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg text-left">
                  <h4 className="font-semibold text-blue-900 mb-2">How to pay:</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Open PhonePe, Google Pay, or any UPI app</li>
                    <li>2. Scan the QR code above</li>
                    <li>3. Verify amount (₹{amount}) and complete payment</li>
                    <li>4. Your booking will be confirmed automatically</li>
                  </ol>
                </div>

                {/* Demo button for testing */}
                <Button
                  onClick={simulatePaymentSuccess}
                  disabled={isChecking}
                  className="w-full bg-green-600 hover:bg-green-700"
                  data-testid="simulate-payment-button"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {isChecking ? "Processing..." : "Simulate Payment Success (Demo)"}
                </Button>

                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="w-full"
                  data-testid="cancel-payment-button"
                >
                  Cancel Payment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}