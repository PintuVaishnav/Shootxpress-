import { useState, useEffect, useCallback } from "react";
import { X, CreditCard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

// API URL - empty for local dev (uses Vite proxy), full URL for production
const API_URL = import.meta.env.VITE_API_URL || '';

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventDate: string;
  eventTime: string;
  eventType: string;
  eventLocation: string;
  packageType: string;
  addOns: string[];
  specialRequirements: string;
  totalAmount: number;
  advanceAmount: number;
  termsAccepted: boolean;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayError {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const packagePrices: Record<string, number> = {
  'smart-shot': 1499,
  'xpress-pro': 2499,
  'xpress-pro+': 3999,
  'xpress-max': 4999,
};

const packageNames: Record<string, string> = {
  'smart-shot': 'Smart Shot',
  'xpress-pro': 'Xpress Pro',
  'xpress-pro+': 'Xpress Pro+',
  'xpress-max': 'Xpress Max',
};

const addOnPrices: Record<string, number> = {
  'extra-video': 700,
  'traditional-photos': 1000,
  'extra-hour': 900,
};

export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [formData, setFormData] = useState<BookingData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    eventDate: "",
    eventTime: "",
    eventType: "",
    eventLocation: "",
    packageType: 'smart-shot',
    addOns: [],
    specialRequirements: "",
    totalAmount: 1499,
    advanceAmount: 750,
    termsAccepted: false,
  });

  const { toast } = useToast();

  // Load Razorpay script
  useEffect(() => {
    // Check if already loaded
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setRazorpayLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
      console.log('✅ Razorpay SDK loaded');
    };
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay SDK');
      toast({
        title: "Error",
        description: "Failed to load payment gateway. Please refresh the page.",
        variant: "destructive",
      });
    };
    document.body.appendChild(script);
  }, [toast]);

  // Calculate pricing
  const calculatePricing = useCallback(() => {
    const basePrice = packagePrices[formData.packageType] || 1499;
    const addOnsTotal = formData.addOns.reduce((sum, addon) => {
      return sum + (addOnPrices[addon] || 0);
    }, 0);
    const total = basePrice + addOnsTotal;
    const advance = Math.round(total * 0.5);

    setFormData(prev => ({
      ...prev,
      totalAmount: total,
      advanceAmount: advance,
    }));
  }, [formData.packageType, formData.addOns]);

  useEffect(() => {
    calculatePricing();
  }, [formData.packageType, formData.addOns, calculatePricing]);

  // Modal event listeners
  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true);
    const handleSelectPackage = (event: CustomEvent) => {
      setFormData(prev => ({ ...prev, packageType: event.detail }));
      setIsOpen(true);
    };

    window.addEventListener('openBookingModal', handleOpenModal);
    window.addEventListener('selectPackage', handleSelectPackage as EventListener);

    return () => {
      window.removeEventListener('openBookingModal', handleOpenModal);
      window.removeEventListener('selectPackage', handleSelectPackage as EventListener);
    };
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
    setIsLoading(false);
    document.body.style.overflow = 'auto';
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      eventDate: "",
      eventTime: "",
      eventType: "",
      eventLocation: "",
      packageType: 'smart-shot',
      addOns: [],
      specialRequirements: "",
      totalAmount: 1499,
      advanceAmount: 750,
      termsAccepted: false,
    });
  };

  // Create Razorpay Order
  const createRazorpayOrder = async () => {
    const response = await fetch(`${API_URL}/api/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: formData.advanceAmount,
        currency: 'INR',
        receipt: `booking_${Date.now()}`,
        notes: {
          customerName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          packageType: formData.packageType,
          eventDate: formData.eventDate,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create order' }));
      throw new Error(error.message || 'Failed to create order');
    }

    return response.json();
  };

  // Verify Payment
  const verifyPayment = async (paymentData: RazorpayResponse) => {
    const response = await fetch(`${API_URL}/api/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Payment verification failed' }));
      throw new Error(error.message || 'Payment verification failed');
    }

    return response.json();
  };

  // Save booking to database
  const saveBooking = async (paymentId: string, orderId: string) => {
    const response = await fetch(`${API_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        eventType: formData.eventType,
        eventLocation: formData.eventLocation,
        packageType: formData.packageType,
        addOns: formData.addOns,
        specialRequirements: formData.specialRequirements,
        totalAmount: formData.totalAmount,
        advanceAmount: formData.advanceAmount,
        paymentId,
        orderId,
        paymentStatus: 'completed',
        status: 'confirmed',
        termsAccepted: formData.termsAccepted,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to save booking' }));
      throw new Error(error.message || 'Failed to save booking');
    }

    return response.json();
  };

  // Send confirmation emails via EmailJS
  const sendConfirmationEmails = async () => {
    try {
      // Send to customer
      await emailjs.send(
        import.meta.env.VITE_EMAIL_SERVICE_ID,
        import.meta.env.VITE_EMAIL_TEMPLATE_ID,
        {
          to_name: `${formData.firstName} ${formData.lastName}`,
          to_email: formData.email,
          package_name: packageNames[formData.packageType] || formData.packageType,
          advance_amount: formData.advanceAmount.toLocaleString('en-IN'),
          total_amount: formData.totalAmount.toLocaleString('en-IN'),
          balance_amount: (formData.totalAmount - formData.advanceAmount).toLocaleString('en-IN'),
          phone: formData.phone,
          event_date: new Date(formData.eventDate).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          event_time: formData.eventTime,
          event_type: formData.eventType,
          event_location: formData.eventLocation,
          add_ons: formData.addOns.length > 0 ? formData.addOns.join(", ") : "None",
          special_requirements: formData.specialRequirements || "None",
        },
        import.meta.env.VITE_EMAIL_PUBLIC_KEY
      );
      console.log("✅ Confirmation email sent to customer!");

      // Send notification to owner
      await emailjs.send(
        import.meta.env.VITE_EMAIL_SERVICE_ID,
        import.meta.env.VITE_EMAIL_OWNER_TEMPLATE_ID || import.meta.env.VITE_EMAIL_TEMPLATE_ID,
        {
          to_name: "ShootXPress Team",
          to_email: "shootxpress27@gmail.com",
          customer_name: `${formData.firstName} ${formData.lastName}`,
          customer_email: formData.email,
          customer_phone: formData.phone,
          package_name: packageNames[formData.packageType] || formData.packageType,
          advance_amount: formData.advanceAmount.toLocaleString('en-IN'),
          total_amount: formData.totalAmount.toLocaleString('en-IN'),
          event_date: formData.eventDate,
          event_time: formData.eventTime,
          event_type: formData.eventType,
          event_location: formData.eventLocation,
          add_ons: formData.addOns.length > 0 ? formData.addOns.join(", ") : "None",
          special_requirements: formData.specialRequirements || "None",
        },
        import.meta.env.VITE_EMAIL_PUBLIC_KEY
      );
      console.log("📩 Notification email sent to owner!");
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      // Don't throw - emails are not critical for booking success
    }
  };

  // Handle Razorpay Payment
  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded || !window.Razorpay) {
      toast({
        title: "Payment Gateway Loading",
        description: "Please wait a moment and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Create order on backend
      const order = await createRazorpayOrder();
      console.log('📦 Order created:', order.id);

      // Step 2: Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'ShootXPress',
        description: `${packageNames[formData.packageType]} Package - Advance Payment`,
        image: '/logo.png',
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            console.log('💳 Payment received:', response.razorpay_payment_id);

            // Step 3: Verify payment on backend
            await verifyPayment(response);
            console.log('✅ Payment verified');

            // Step 4: Save booking
            const booking = await saveBooking(
              response.razorpay_payment_id,
              response.razorpay_order_id
            );
            console.log('📝 Booking saved:', booking.id);

            // Step 5: Send confirmation emails
            await sendConfirmationEmails();

            // Step 6: Show success message
            toast({
              title: "🎉 Booking Confirmed!",
              description: "Your booking has been confirmed. Check your email for details.",
            });

            closeModal();
            resetForm();
          } catch (error: any) {
            console.error('Post-payment error:', error);
            toast({
              title: "Booking Error",
              description: `Payment received but booking failed. Contact support with Payment ID: ${response.razorpay_payment_id}`,
              variant: "destructive",
            });
            setIsLoading(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone.replace(/\D/g, ''),
        },
        notes: {
          packageType: formData.packageType,
          eventDate: formData.eventDate,
          eventType: formData.eventType,
          customerName: `${formData.firstName} ${formData.lastName}`,
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            toast({
              title: "Payment Cancelled",
              description: "You closed the payment window. Your booking is not confirmed.",
            });
          },
          escape: true,
          animation: true,
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', function (response: RazorpayError) {
        console.error('Payment failed:', response.error);
        toast({
          title: "Payment Failed",
          description: response.error.description || "Payment could not be processed. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      });

      razorpay.open();
    } catch (error: any) {
      console.error('Order creation failed:', error);
      toast({
        title: "Error",
        description: error.message || "Unable to initiate payment. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate terms
    if (!formData.termsAccepted) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive",
      });
      return;
    }

    // Validate personal info
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast({
        title: "Missing Name",
        description: "Please enter your first and last name.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    // Validate event details
    if (!formData.eventDate || !formData.eventTime || !formData.eventType || !formData.eventLocation.trim()) {
      toast({
        title: "Missing Event Details",
        description: "Please fill in all event details.",
        variant: "destructive",
      });
      return;
    }

    // Check if date is in the future
    const selectedDate = new Date(formData.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      toast({
        title: "Invalid Date",
        description: "Please select a future date for your event.",
        variant: "destructive",
      });
      return;
    }

    handleRazorpayPayment();
  };

  const handleInputChange = (field: string, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddOnChange = (addon: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      addOns: checked
        ? [...prev.addOns, addon]
        : prev.addOns.filter(a => a !== addon)
    }));
  };

  const openTermsModal = () => {
    const event = new CustomEvent('openTermsModal');
    window.dispatchEvent(event);
  };

  // Get minimum date for date picker
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" data-testid="booking-modal">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          onClick={closeModal}
        />
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 px-8 py-4 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">Book Your Shoot</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeModal}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              data-testid="close-booking-modal"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Package Selection */}
            <div>
              <Label className="block text-sm font-semibold text-foreground mb-2">Selected Package *</Label>
              <Select value={formData.packageType} onValueChange={(value) => handleInputChange('packageType', value)}>
                <SelectTrigger data-testid="select-package" className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smart-shot">Smart Shot - ₹1,499</SelectItem>
                  <SelectItem value="xpress-pro">Xpress Pro - ₹2,499</SelectItem>
                  <SelectItem value="xpress-pro+">Xpress Pro+ - ₹3,999</SelectItem>
                  <SelectItem value="xpress-max">Xpress Max - ₹4,999</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-semibold text-foreground mb-2">First Name *</Label>
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Sanvith"
                  className="h-12"
                  required
                  data-testid="input-booking-first-name"
                />
              </div>
              <div>
                <Label className="block text-sm font-semibold text-foreground mb-2">Last Name *</Label>
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Somasani"
                  className="h-12"
                  required
                  data-testid="input-booking-last-name"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-semibold text-foreground mb-2">Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="somasanisanvith@gmail.com"
                  className="h-12"
                  required
                  data-testid="input-booking-email"
                />
              </div>
              <div>
                <Label className="block text-sm font-semibold text-foreground mb-2">Phone *</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 9876543210"
                  className="h-12"
                  required
                  data-testid="input-booking-phone"
                />
              </div>
            </div>

            {/* Event Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-semibold text-foreground mb-2">Event Date *</Label>
                <Input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => handleInputChange('eventDate', e.target.value)}
                  min={getMinDate()}
                  className="h-12"
                  required
                  data-testid="input-event-date"
                />
              </div>
              <div>
                <Label className="block text-sm font-semibold text-foreground mb-2">Event Time *</Label>
                <Input
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => handleInputChange('eventTime', e.target.value)}
                  className="h-12"
                  required
                  data-testid="input-event-time"
                />
              </div>
            </div>

            <div>
              <Label className="block text-sm font-semibold text-foreground mb-2">Event Type *</Label>
              <Select value={formData.eventType} onValueChange={(value) => handleInputChange('eventType', value)}>
                <SelectTrigger data-testid="select-event-type-booking" className="h-12">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="birthday">Birthday Party</SelectItem>
                  <SelectItem value="corporate">Corporate Event</SelectItem>
                  <SelectItem value="baby-shower">Baby Shower</SelectItem>
                  <SelectItem value="portrait">Portrait Session</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-semibold text-foreground mb-2">Event Location *</Label>
              <Input
                type="text"
                value={formData.eventLocation}
                onChange={(e) => handleInputChange('eventLocation', e.target.value)}
                placeholder="Venue name, City"
                className="h-12"
                required
                data-testid="input-event-location"
              />
            </div>

            {/* Add-ons */}
            <div>
              <Label className="block text-sm font-semibold text-foreground mb-3">Add-ons (Optional)</Label>
              <div className="space-y-3">
                {[
                  { id: 'extra-video', label: 'Extra Video', price: 700 },
                  { id: 'traditional-photos', label: 'Traditional Photos', price: 1000 },
                  { id: 'extra-hour', label: 'Extra Hour', price: 900 },
                ].map((addon) => (
                  <div 
                    key={addon.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={addon.id}
                        checked={formData.addOns.includes(addon.id)}
                        onCheckedChange={(checked) => handleAddOnChange(addon.id, checked as boolean)}
                        data-testid={`addon-${addon.id}`}
                      />
                      <Label htmlFor={addon.id} className="cursor-pointer font-medium">
                        {addon.label}
                      </Label>
                    </div>
                    <span className="text-primary font-semibold">+₹{addon.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="block text-sm font-semibold text-foreground mb-2">
                Special Requirements & Song Suggestions (Optional)
              </Label>
              <Textarea
                value={formData.specialRequirements}
                onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                placeholder="Any special requests, song preferences, or requirements..."
                rows={3}
                className="resize-none"
                data-testid="textarea-special-requirements"
              />
            </div>

            {/* Terms & Conditions */}
            <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
              <CardContent className="p-4">
                <h4 className="font-bold text-foreground mb-2">📋 Terms & Conditions</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• 50% advance payment required to confirm booking</p>
                  <p>• Travel expenses are to be borne by the client</p>
                  <p>• Cancellations must be informed 24 hours in advance</p>
                  <p>• Last-minute cancellations are non-refundable</p>
                  <p>• RAW footage will not be shared under any package</p>
                  <p>• Logo placement is mandatory on all delivered reels</p>
                </div>
                <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-amber-200 dark:border-amber-800">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => handleInputChange('termsAccepted', checked as boolean)}
                    data-testid="checkbox-terms"
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={openTermsModal}
                      className="text-primary hover:underline font-medium"
                      data-testid="link-terms"
                    >
                      terms and conditions
                    </button>
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Package ({packageNames[formData.packageType]}):</span>
                    <span data-testid="package-cost">
                      ₹{packagePrices[formData.packageType]?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {formData.addOns.length > 0 && (
                    <div className="flex justify-between">
                      <span>Add-ons:</span>
                      <span data-testid="addons-cost">
                        ₹{formData.addOns.reduce((sum, addon) => sum + (addOnPrices[addon] || 0), 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-base">
                      <span>Total Amount:</span>
                      <span data-testid="total-cost">₹{formData.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-primary font-bold text-lg mt-1">
                      <span>Pay Now (50%):</span>
                      <span data-testid="advance-cost">₹{formData.advanceAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      * Remaining ₹{(formData.totalAmount - formData.advanceAmount).toLocaleString('en-IN')} to be paid on event day
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !razorpayLoaded}
              className="w-full h-14 text-lg font-bold bg-primary transition-all duration-300 disabled:opacity-50"
              data-testid="submit-booking-button"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : !razorpayLoaded ? (
                <span>Loading Payment Gateway...</span>
              ) : (
                <span className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Pay ₹{formData.advanceAmount.toLocaleString('en-IN')} & Book Now
                </span>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Secured by Razorpay • 256-bit SSL Encryption</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}