"use client";

import { useState } from "react";
import { ChevronDown, Camera, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const [showAlert, setShowAlert] = useState(false);

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