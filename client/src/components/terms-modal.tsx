import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener('openTermsModal', handleOpenModal);
    return () => window.removeEventListener('openTermsModal', handleOpenModal);
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
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
    <div className="fixed inset-0 z-50 overflow-y-auto" data-testid="terms-modal">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={closeModal}></div>
        <div className="relative bg-white rounded-xl max-w-4xl w-full max-h-screen overflow-y-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-foreground">Terms & Conditions</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
                data-testid="close-terms-modal"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="space-y-6 text-sm text-foreground">
              <div>
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold mb-3">
                  BOOKING & PAYMENT
                </div>
                <p>• A 50% advance payment is required to confirm the shoot.</p>
              </div>
              
              <div>
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold mb-3">
                  CANCELLATIONS
                </div>
                <p>• Cancellations must be informed at least 24 hours in advance</p>
                <p>• Last-minute cancellations are non-refundable.</p>
              </div>
              
              <div>
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold mb-3">
                  DELIVERABLES
                </div>
                <p>• RAW footage will not be shared under any package.</p>
                <p>• Logo placement is mandatory on all reels delivered.</p>
              </div>
              
              <div>
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold mb-3">
                  TIME EXTENSIONS
                </div>
                <p>• ₹200 for 30-minute extensions.</p>
                <p>• ₹350/hour for additional shoot time beyond the included duration.</p>
                <p>• Editing time may vary depending on shoot duration.</p>
              </div>
              
              <div>
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold mb-3">
                  TRAVEL & LOCATION
                </div>
                <p>• Travel expenses are to be borne by the client.</p>
              </div>

              <div className="mt-8 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  By booking our services, you acknowledge that you have read, understood, and agree to these terms and conditions. 
                  These terms are subject to change without prior notice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
