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
  'smart-shot': 999,
  'xpress-pro': 1799,
  'xpress-max': 2999,
};

const addOnPrices = {
  'extra-video': 550,
  'traditional-photos': 500,
  'extra-hour': 400,
};

export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('smart-shot');
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
    totalAmount: 999,
    advanceAmount: 500,
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
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create booking');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Your booking has been confirmed. You'll receive a confirmation email shortly.",
      });
      closeModal();
      resetForm();
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
      totalAmount: 999,
      advanceAmount: 500,
      termsAccepted: false,
    });
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
    createBooking.mutate(formData);
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

  if (!isOpen) return null;

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

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
                    <SelectItem value="smart-shot">Smart Shot - ₹999</SelectItem>
                    <SelectItem value="xpress-pro">Xpress Pro - ₹1799</SelectItem>
                    <SelectItem value="xpress-max">Xpress Max - ₹2999</SelectItem>
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
                    <Label htmlFor="extra-video">Extra Video (+₹550)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="traditional-photos"
                      checked={formData.addOns.includes('traditional-photos')}
                      onCheckedChange={(checked) => handleAddOnChange('traditional-photos', checked as boolean)}
                      data-testid="addon-traditional-photos"
                    />
                    <Label htmlFor="traditional-photos">Traditional Photos (+₹500)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="extra-hour"
                      checked={formData.addOns.includes('extra-hour')}
                      onCheckedChange={(checked) => handleAddOnChange('extra-hour', checked as boolean)}
                      data-testid="addon-extra-hour"
                    />
                    <Label htmlFor="extra-hour">Extra Hour (+₹400/hour)</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">Special Requirements</Label>
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
