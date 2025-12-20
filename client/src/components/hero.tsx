"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Camera, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

export default function Hero() {
  const [showAlert, setShowAlert] = useState(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  // Professional Celebration Effect
  useEffect(() => {
    const showCelebration = sessionStorage.getItem("showCelebration");

    if (showCelebration === "true") {
      sessionStorage.removeItem("showCelebration");
      setShowWelcome(true);

      const colors: string[] = ["#dc2626", "#ffffff", "#fbbf24"];

      // Initial Big Burst
      confetti({
        particleCount: 200,
        spread: 180,
        startVelocity: 50,
        origin: { y: 0.6 },
        colors: colors,
        ticks: 200,
        zIndex: 9999,
      });

      // Continuous Side Cannons - Slower and More Visible
      const cannonInterval = setInterval(() => {
        // Left Cannon
        confetti({
          particleCount: 80,
          angle: 45,
          spread: 50,
          startVelocity: 60,
          origin: { x: 0, y: 0.7 },
          colors: colors,
          ticks: 150,
          zIndex: 9999,
          gravity: 0.8,
        });

        // Right Cannon
        confetti({
          particleCount: 40,
          angle: 135,
          spread: 50,
          startVelocity: 60,
          origin: { x: 1, y: 0.7 },
          colors: colors,
          ticks: 150,
          zIndex: 9999,
          gravity: 0.8,
        });
      }, 1000); // Slower interval

      // Fireworks Effect
      const fireworksInterval = setInterval(() => {
        const x = Math.random() * 0.6 + 0.2; // Between 0.2 and 0.8

        confetti({
          particleCount: 50,
          spread: 360,
          startVelocity: 40,
          origin: { x: x, y: 0.3 },
          colors: colors,
          ticks: 120,
          zIndex: 9999,
          gravity: 0.6,
        });
      }, 800);

      // Stop after 3 seconds
      setTimeout(() => {
        clearInterval(cannonInterval);
        clearInterval(fireworksInterval);
      }, 3000);

      // Hide banner after 5 seconds
      setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
    }
  }, []);

  const openBookingModal = () => {
    window.dispatchEvent(new CustomEvent("openBookingModal"));
  };

  const scrollToPackages = () => {
    const packagesSection = document.getElementById("packages");
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMemberClick = () => {
    setShowAlert(true);
  };

  const handleAlertContinue = () => {
    setShowAlert(false);
    window.dispatchEvent(new CustomEvent("openMemberModal"));
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <>
      <section className="hero-bg min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Welcome Banner */}
        {showWelcome && (
          <div
            className="fixed top-0 left-0 right-0 z-50"
            style={{ animation: "bannerSlide 0.5s ease-out" }}
          >
            <div className="bg-red-600 py-4 px-4 text-center">
              <p className="text-white text-lg md:text-2xl font-bold tracking-wider uppercase">
                Welcome to SHOOT<span className="text-gray-900">X</span>PRESS —
                We Are Now Live
              </p>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            {/* Launch Badge */}
            {showWelcome && (
              <div
                className="mb-6"
                style={{ animation: "fadeInUp 0.8s ease-out" }}
              >
                <span
                  className="inline-block bg-gray-900 text-white border-2 border-red-600 
                               px-6 py-2 text-sm md:text-base font-bold tracking-wider uppercase"
                >
                  Just Launched
                </span>
              </div>
            )}

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
              onClick={handleMemberClick}
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

        {/* Banner Animation Style */}
        <style>{`
          @keyframes bannerSlide {
            0% {
              transform: translateY(-100%);
            }
            100% {
              transform: translateY(0);
            }
          }

          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </section>

      {/* Alert Modal */}
      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleAlertClose}
          />

          {/* Alert Box */}
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-fade-in">
            {/* Close Button */}
            <button
              onClick={handleAlertClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-500" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Important Notice
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                We are currently{" "}
                <span className="font-bold text-red-600 dark:text-red-500">
                  not accepting applications
                </span>{" "}
                from{" "}
                <span className="font-semibold text-primary">Hyderabad</span>.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                If you are from a different location, please proceed with your
                application.
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                ⚠️ Applications from Hyderabad will not be processed at this
                time.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAlertClose}
                variant="outline"
                className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                I'm from Hyderabad
              </Button>
              <Button
                onClick={handleAlertContinue}
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
              >
                I'm from Other Location
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}