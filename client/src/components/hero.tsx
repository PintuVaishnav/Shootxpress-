"use client";

import { ChevronDown, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const openBookingModal = () => {
    window.dispatchEvent(new CustomEvent("openBookingModal"));
  };

  const scrollToPackages = () => {
    const packagesSection = document.getElementById("packages");
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const OPENMEMBER = () => {
    window.dispatchEvent(new CustomEvent("openMemberModal"));
  };

  return (
    <section className="hero-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <div className="animate-fade-in">

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            CAPTURE <br />
            <span className="text-primary">MOMENTS</span> <br />
            INSTANTLY
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            We specialize in high-quality reels with same-day delivery.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

            <Button
              onClick={openBookingModal}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105"
            >
              <Camera className="mr-2 h-5 w-5" />
              Book Your Shoot
            </Button>

            <Button
              onClick={scrollToPackages}
              variant="outline"
              className="border-2 border-white text-black hover:bg-white hover:text-black px-8 py-4 rounded-lg text-lg font-bold transition-all duration-300"
            >
              View Packages
            </Button>
          </div>

          <Button
            onClick={OPENMEMBER}
            variant="outline"
            className="border-2 border-white text-black hover:bg-white hover:text-black px-8 py-4 rounded-lg text-lg font-bold transition-all duration-300 mt-4"
          >
            Become a Member
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <ChevronDown className="text-white h-8 w-8" />
        </div>
      </div>
    </section>
  );
}
