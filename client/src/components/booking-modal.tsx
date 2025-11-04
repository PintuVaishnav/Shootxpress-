import { useState, useEffect } from "react";
import { X, CreditCard, Calendar, Clock, MapPin, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import PaymentQR from "./payment-qr";
import emailjs from "@emailjs/browser";

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

const packagePrices = {
  'smart-shot': 1499,
  'xpress-pro': 2499,
  'xpress-pro+': 3999,
  'xpress-max': 4999,
};

const addOnPrices = {
  'extra-video': 700,
  'traditional-photos': 1000,
  'extra-hour': 900,
};

export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('smart-shot');
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<any>(null);
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

  // Calculate pricing
  const calculatePricing = () => {
    const basePrice = packagePrices[formData.packageType as keyof typeof packagePrices] || 999;
    const addOnsTotal = formData.addOns.reduce((sum, addon) => {
      return sum + (addOnPrices[addon as keyof typeof addOnPrices] || 0);
    }, 0);
    const total = basePrice + addOnsTotal;
    const advance = Math.round(total * 0.5);

    setFormData(prev => ({
      ...prev,
      totalAmount: total,
      advanceAmount: advance,
    }));
  };

  useEffect(() => {
    calculatePricing();
  }, [formData.packageType, formData.addOns]);

  // Modal event listeners
  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true);
    const handleSelectPackage = (event: CustomEvent) => {
      setSelectedPackage(event.detail);
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

  const createBooking = useMutation({
    mutationFn: async (data: BookingData) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create booking');
      return response.json();
    },
    onSuccess: (booking) => {
      setCurrentBooking(booking);
      // Show payment QR modal with static QR
      setShowPaymentQR(true);
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "Unable to create booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const closeModal = () => {
    setIsOpen(false);
    setShowPaymentQR(false);
    setCurrentBooking(null);

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
  const handleUPIPayment = () => {
    const upiId = "sanvithbunny@ybl"; // 🔹 Replace with your UPI ID
    const amount = formData.advanceAmount || "100";
    const name = `${formData.firstName} ${formData.lastName}`;
    const note = `Advance payment for ${formData.packageType} by ${name}`;

    const upiLink = `upi://pay?pa=${upiId}&pn=ShootXPress&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      // 🔹 Opens directly in UPI app (Google Pay / PhonePe / Paytm)
      window.location.href = upiLink;
    } else {
      // 🔹 Desktop fallback: Show QR + UPI ID
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}`;
      const qrPopup = window.open("", "QR", "width=320,height=420");
      qrPopup?.document.write(`
      <div style="text-align:center;font-family:sans-serif;padding:15px;">
        <h3>Scan to Pay via UPI</h3>
        <img src="${qrUrl}" style="width:220px;height:220px;margin:10px 0;"/>
        <p style="font-size:16px;margin:5px 0;">💰 Amount: <b>₹${amount}</b></p>
        <p style="font-size:14px;margin:5px 0;">📦 ${formData.packageType}</p>
        <p style="font-size:14px;margin:10px 0;">or pay manually using:</p>
        <p style="font-size:18px;font-weight:bold;color:#333;">${upiId}</p>
      </div>
    `);
    }

    // 🔹 Confirm after a few seconds
    // 🔹 Confirm after payment attempt
    setTimeout(() => {
      const confirmed = window.confirm("Did you complete the payment?");
      if (!confirmed) {
        toast({
          title: "Payment Pending ⚠️",
          description: (
            <div className="space-y-3">
              <p>Please complete your UPI payment to confirm your booking.</p>
              <p className="font-semibold">You can send your payment screenshot via:</p>
              <div className="flex gap-3 flex-wrap">
                <a
                  href="mailto:shootxpress27@gmail.com"
                  className="bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition"
                >
                  📧 Email
                </a>
                <a
                  href="https://wa.me/918186831230"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                >
                  💬 WhatsApp
                </a>
                <a
                  href="https://www.instagram.com/shootxpress"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pink-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-pink-600 transition"
                >
                  📸 Instagram
                </a>
              </div>
            </div>
          ),
          duration: Infinity,
        });
        return;
      }

      // ✅ If confirmed (Yes)
      handlePaymentSuccess();

      // Persistent toast until user clicks any link
      toast({
        title: "Payment Successful 🎉",
        description: (
          <div className="space-y-3">
            <p>Awesome! Please send your payment screenshot to confirm your booking.</p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="mailto:shootxpress27@gmail.com?subject=Payment Screenshot for Booking"
                onClick={() => toast.dismiss()} // closes toast when clicked
                className="bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition"
              >
                📧 Email
              </a>
              <a
                href="https://wa.me/918186831230?text=Hi! I’ve completed the payment. Here’s my screenshot:"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => toast.dismiss()}
                className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
              >
                💬 WhatsApp
              </a>
              <a
                href="https://www.instagram.com/shootxpress"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => toast.dismiss()}
                className="bg-pink-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-pink-600 transition"
              >
                📸 Instagram
              </a>
            </div>
          </div>
        ),
        duration: Infinity, // stays until user clicks
      });
    }, Math.floor(Math.random() * 5000) + 10000);


  };


  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful! 🎉",
      description: "Your booking has been confirmed. You'll receive a confirmation email shortly.",
    });

    // 🔹 Send confirmation email to client

    emailjs
      .send(
        import.meta.env.VITE_EMAIL_SERVICE_ID,
        import.meta.env.VITE_EMAIL_TEMPLATE_ID,
        {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          package: formData.packageType,
          amount: formData.advanceAmount,
          phone: formData.phone,
          eventDate: formData.eventDate,
          eventTime: formData.eventTime,
          eventType: formData.eventType,
          eventLocation: formData.eventLocation,
          addOns: formData.addOns.join(", ") || "None",
          specialRequirements: formData.specialRequirements || "None",
          totalAmount: formData.totalAmount,
        },
        import.meta.env.VITE_EMAIL_PUBLIC_KEY
      )
      .then(() => {
        console.log("✅ Confirmation email sent to client successfully!");
      })
      .catch((error) => {
        console.error("❌ Failed to send email:", error);
      });

    // 🔹 (Optional) Send copy to owner (you can remove if your template already handles it)
    emailjs.send(
      import.meta.env.VITE_EMAIL_SERVICE_ID,
      import.meta.env.VITE_EMAIL_TEMPLATE_ID,
      {
        name: "Shoot X Press Admin",
        email: "shootxpress27@gmail.com", // replace with your owner mail
        package: formData.packageType,
        amount: formData.advanceAmount,
      },
      import.meta.env.VITE_EMAIL_PUBLIC_KEY
    )
      .then(() => {
        console.log("📩 Copy email sent to owner successfully!");
      })
      .catch((error) => {
        console.error("❌ Failed to send owner email:", error);
      });

    closeModal();
    resetForm();
  };


  const handlePaymentCancel = () => {
    setShowPaymentQR(false);
    setCurrentBooking(null);

  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive",
      });
      return;
    }

    // Instead of Razorpay or QR, we trigger UPI redirect directly
    handleUPIPayment();
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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Show payment QR if payment is needed
  if (showPaymentQR && currentBooking) {
    return (
      <PaymentQR
        amount={formData.advanceAmount}
        bookingId={currentBooking.id}
        onPaymentSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" data-testid="booking-modal">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={closeModal}></div>
        <div className="relative bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-foreground">Book Your Shoot</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
                data-testid="close-booking-modal"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Package Selection */}
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">Selected Package</Label>
                <Select value={formData.packageType} onValueChange={(value) => handleInputChange('packageType', value)}>
                  <SelectTrigger data-testid="select-package">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smart-shot">Smart Shot - ₹1499</SelectItem>
                    <SelectItem value="xpress-pro">Xpress Pro - ₹2499</SelectItem>
                    <SelectItem value="xpress-pro+">Xpress Pro+ - ₹3999</SelectItem>
                    <SelectItem value="xpress-max">Xpress Max - ₹4999</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-foreground mb-2">First Name *</Label>
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    required
                    data-testid="input-booking-first-name"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-foreground mb-2">Last Name *</Label>
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    required
                    data-testid="input-booking-last-name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-foreground mb-2">Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                    required
                    data-testid="input-booking-email"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-foreground mb-2">Phone *</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 98181 86301"
                    required
                    data-testid="input-booking-phone"
                  />
                </div>
              </div>

              {/* Event Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-foreground mb-2">Event Date *</Label>
                  <Input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => handleInputChange('eventDate', e.target.value)}
                    required
                    data-testid="input-event-date"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-foreground mb-2">Event Time *</Label>
                  <Input
                    type="time"
                    value={formData.eventTime}
                    onChange={(e) => handleInputChange('eventTime', e.target.value)}
                    required
                    data-testid="input-event-time"
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">Event Type *</Label>
                <Select value={formData.eventType} onValueChange={(value) => handleInputChange('eventType', value)} required>
                  <SelectTrigger data-testid="select-event-type-booking">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="corporate">Corporate Event</SelectItem>
                    <SelectItem value="portrait">Portrait Session</SelectItem>
                    <SelectItem value="birthday">Birthday Party</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">Event Location *</Label>
                <Input
                  type="text"
                  value={formData.eventLocation}
                  onChange={(e) => handleInputChange('eventLocation', e.target.value)}
                  placeholder="Hyderabad, India"
                  required
                  data-testid="input-event-location"
                />
              </div>

              {/* Add-ons */}
              <div>
                <Label className="block text-sm font-medium text-foreground mb-3">Add-ons</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="extra-video"
                      checked={formData.addOns.includes('extra-video')}
                      onCheckedChange={(checked) => handleAddOnChange('extra-video', checked as boolean)}
                      data-testid="addon-extra-video"
                    />
                    <Label htmlFor="extra-video">Extra Video (+₹700)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="traditional-photos"
                      checked={formData.addOns.includes('traditional-photos')}
                      onCheckedChange={(checked) => handleAddOnChange('traditional-photos', checked as boolean)}
                      data-testid="addon-traditional-photos"
                    />
                    <Label htmlFor="traditional-photos">Traditional Photos (+₹1000)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="extra-hour"
                      checked={formData.addOns.includes('extra-hour')}
                      onCheckedChange={(checked) => handleAddOnChange('extra-hour', checked as boolean)}
                      data-testid="addon-extra-hour"
                    />
                    <Label htmlFor="extra-hour">Extra Hour (+₹900/hour)</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">Special Requirements & Song Suggestion</Label>
                <Textarea
                  value={formData.specialRequirements}
                  onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  placeholder="Any special requests or requirements..."
                  rows={3}
                  data-testid="textarea-special-requirements"
                />
              </div>

              {/* Terms & Conditions */}
              <Card className="bg-secondary">
                <CardContent className="p-4">
                  <h4 className="font-bold text-foreground mb-2">Terms & Conditions</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• 50% advance payment required to confirm booking</p>
                    <p>• Travel expenses are to be borne by the client</p>
                    <p>• Cancellations must be informed 24 hours in advance</p>
                    <p>• Last-minute cancellations are non-refundable</p>
                    <p>• RAW footage will not be shared under any package</p>
                    <p>• Logo placement is mandatory on all delivered reels</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <Checkbox
                      id="terms"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => handleInputChange('termsAccepted', checked as boolean)}
                      required
                      data-testid="checkbox-terms"
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <button
                        type="button"
                        onClick={openTermsModal}
                        className="text-primary hover:underline"
                        data-testid="link-terms"
                      >
                        terms and conditions
                      </button>
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card className="border border-border">
                <CardContent className="p-4">
                  <h4 className="font-bold text-foreground mb-3">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Package Cost:</span>
                      <span data-testid="package-cost">₹{packagePrices[formData.packageType as keyof typeof packagePrices] || 999}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Add-ons:</span>
                      <span data-testid="addons-cost">₹{formData.addOns.reduce((sum, addon) => sum + (addOnPrices[addon as keyof typeof addOnPrices] || 0), 0)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total Amount:</span>
                        <span data-testid="total-cost">₹{formData.totalAmount}</span>
                      </div>
                      <div className="flex justify-between text-primary">
                        <span>Advance Payment (50%):</span>
                        <span data-testid="advance-cost">₹{formData.advanceAmount}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={createBooking.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-lg font-bold text-lg transition-colors duration-200"
                data-testid="submit-booking-button"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                {createBooking.isPending ? "Processing..." : "Pay Advance & Book"}
              </Button>



            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
