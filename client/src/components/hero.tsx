import { ChevronDown, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const openBookingModal = () => {
    const event = new CustomEvent('openBookingModal');
    window.dispatchEvent(event);
  };

  const scrollToPackages = () => {
    const packagesSection = document.getElementById('packages');
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Film strip decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-32 h-6 bg-primary transform -rotate-12"></div>
        <div className="absolute bottom-20 right-16 w-40 h-8 bg-primary transform rotate-45"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
            CAPTURE<br />
            <span className="text-primary">MOMENTS</span><br />
            INSTANTLY
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Professional photography and videography with same-day reel delivery. 
            Transform your events into stunning visual stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={openBookingModal}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105"
              data-testid="hero-book-button"
            >
              <Camera className="mr-2 h-5 w-5" />
              Book Your Shoot
            </Button>
            <Button
              onClick={scrollToPackages}
              variant="outline"
              className="border-2 border-white text-black hover:bg-white hover:text-black px-8 py-4 rounded-lg text-lg font-bold transition-all duration-300"
              data-testid="hero-packages-button"
            >
              View Packages
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <ChevronDown className="text-white h-8 w-8" />
        </div>
      </div>
    </section>
  );
}
