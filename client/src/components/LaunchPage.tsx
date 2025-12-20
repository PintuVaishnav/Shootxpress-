// src/components/LaunchPage.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";

// ================================
// TYPE DEFINITIONS
// ================================
type Stage = "initial" | "countdown" | "celebrating" | "redirect";
type CountdownValue = number | string | null;

interface FeatureItem {
  title: string;
  subtitle: string;
}

interface Particle {
  id: number;
  size: number;
  opacity: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

interface LaunchPageProps {
  onLaunchComplete: () => void;
  logoUrl?: string;
}

// ================================
// MAIN COMPONENT
// ================================
export default function LaunchPage({
  onLaunchComplete,
  logoUrl = "https://raw.githubusercontent.com/PintuVaishanv/shootxpress/main/logo.png",
}: LaunchPageProps) {
  const [stage, setStage] = useState<Stage>("initial");
  const [countdownNumber, setCountdownNumber] = useState<CountdownValue>(null);
  const [showContent, setShowContent] = useState<boolean>(false);

  // Feature items for celebration screen
  const featureItems: FeatureItem[] = [
    { title: "Premium Quality", subtitle: "Professional Grade" },
    { title: "Express Delivery", subtitle: "Same Day Service" },
    { title: "Best Prices", subtitle: "Affordable Packages" },
    { title: "Expert Team", subtitle: "Skilled Professionals" },
  ];

  // Generate particles once (memoized) - REDUCED from 50 to 30
  const particles: Particle[] = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.4 + 0.1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 20 + Math.random() * 15,
        delay: Math.random() * 10,
      })),
    []
  );

  // ================================
  // CONFETTI ANIMATIONS - REDUCED
  // ================================

  const fireGrandFireworks = (): ReturnType<typeof setInterval> => {
    const duration: number = 4 * 1000;
    const animationEnd: number = Date.now() + duration;

    const colors: string[] = [
      "#dc2626",
      "#ffffff",
      "#fbbf24",
      "#2563eb",
      "#16a34a",
      "#9333ea",
    ];

    const interval = setInterval((): void => {
      const timeLeft: number = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const positions = [
        { x: 0.2, y: 0.2 },
        { x: 0.5, y: 0.15 },
        { x: 0.8, y: 0.2 },
      ];

      positions.forEach((pos) => {
        if (Math.random() > 0.6) {
          confetti({
            particleCount: 60, // Reduced from 80
            startVelocity: 35,
            spread: 360,
            ticks: 80,
            origin: { x: pos.x, y: pos.y },
            colors: colors,
            zIndex: 9999,
            gravity: 0.8,
            scalar: 1,
          });
        }
      });
    }, 600);

    return interval;
  };

  const fireMassiveConfetti = (): void => {
    const colors: string[] = ["#dc2626", "#ffffff", "#fbbf24", "#1f2937"];

    // Main burst - Reduced from 50 to 30
    confetti({
      particleCount: 40,
      spread: 150,
      startVelocity: 50,
      origin: { y: 0.6 },
      colors: colors,
      ticks: 150,
      zIndex: 9999,
      gravity: 0.6,
      scalar: 1.2,
    });

    // Side bursts - Reduced from 50 to 25
    setTimeout(() => {
      confetti({
        particleCount: 35,
        spread: 100,
        startVelocity: 40,
        origin: { x: 0.3, y: 0.5 },
        colors: colors,
        ticks: 120,
        zIndex: 9999,
      });
      confetti({
        particleCount: 35,
        spread: 100,
        startVelocity: 40,
        origin: { x: 0.7, y: 0.5 },
        colors: colors,
        ticks: 120,
        zIndex: 9999,
      });
    }, 150);
  };

  const firePowerfulCannons = (): void => {
    const colors: string[] = ["#dc2626", "#ffffff", "#fbbf24"];

    // Left cannon - Reduced from 50 to 30
    confetti({
      particleCount: 40,
      angle: 45,
      spread: 50,
      startVelocity: 55,
      origin: { x: 0, y: 0.8 },
      colors: colors,
      ticks: 120,
      zIndex: 9999,
      gravity: 0.7,
    });

    // Right cannon - Reduced from 50 to 30
    confetti({
      particleCount: 40,
      angle: 135,
      spread: 50,
      startVelocity: 55,
      origin: { x: 1, y: 0.8 },
      colors: colors,
      ticks: 120,
      zIndex: 9999,
      gravity: 0.7,
    });
  };

  const fireConfettiRain = (): ReturnType<typeof setInterval> => {
    const colors: string[] = ["#dc2626", "#ffffff", "#fbbf24", "#374151"];

    const interval = setInterval((): void => {
      confetti({
        particleCount: 7, // Reduced from 10
        startVelocity: 0,
        ticks: 150,
        origin: { x: Math.random(), y: 0 },
        colors: colors,
        shapes: ["square", "circle"],
        gravity: 0.3,
        scalar: 0.8,
        drift: Math.random() * 2 - 1,
        zIndex: 9999,
      });
    }, 100); // Slower interval

    return interval;
  };

  // ================================
  // LAUNCH SEQUENCE - FIXED TIMINGS
  // ================================

  const handleLaunch = (): void => {
    setStage("countdown");

    // Show 3
    setCountdownNumber(3);

    // Show 2 at 1 second
    setTimeout((): void => {
      setCountdownNumber(2);
    }, 1000);

    // Show 1 at 2 seconds
    setTimeout((): void => {
      setCountdownNumber(1);
    }, 2000);

    // Show "Let's GO" at 3 seconds + confetti
    setTimeout((): void => {
      setCountdownNumber("Let's GO");
      fireMassiveConfetti();
      firePowerfulCannons();
    }, 3000);

    // Switch to celebrating at 4.5 seconds (after "Let's GO" shows for 1.5s)
    setTimeout((): void => {
      setStage("celebrating");
      setCountdownNumber(null);
      setShowContent(true);

      // Start celebration effects
      const fireworksInterval = fireGrandFireworks();
      const rainInterval = fireConfettiRain();

      // Fire cannons every 1.5 seconds
      const cannonInterval = setInterval(() => {
        firePowerfulCannons();
      }, 1500);

      // Stop effects after 4 seconds
      setTimeout(() => {
        clearInterval(fireworksInterval);
        clearInterval(rainInterval);
        clearInterval(cannonInterval);
      }, 4000);
    }, 4500);

    // Redirect at 9.5 seconds (4.5s countdown + 5s celebration)
    setTimeout((): void => {
      setStage("redirect");
      sessionStorage.setItem("showCelebration", "true");
      onLaunchComplete();
    }, 9500);
  };

  // ================================
  // INITIAL ANIMATION
  // ================================

  useEffect(() => {
    if (stage === "initial") {
      const timer = setTimeout(() => setShowContent(true), 500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // ================================
  // RENDER
  // ================================

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-black">
      {/* ========== SOLID BACKGROUND ========== */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />

      {/* ========== GRID PATTERN ========== */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* ========== FLOATING PARTICLES ========== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle: Particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `floatParticle ${particle.duration}s linear infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ========== CORNER ACCENTS ========== */}
      <div className="absolute top-0 left-0 w-32 md:w-64 h-32 md:h-64 border-l-2 border-t-2 border-red-600 opacity-30" />
      <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 border-r-2 border-t-2 border-red-600 opacity-30" />
      <div className="absolute bottom-0 left-0 w-32 md:w-64 h-32 md:h-64 border-l-2 border-b-2 border-red-600 opacity-30" />
      <div className="absolute bottom-0 right-0 w-32 md:w-64 h-32 md:h-64 border-r-2 border-b-2 border-red-600 opacity-30" />

      {/* ========== MAIN CONTENT ========== */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* ==================== INITIAL STATE ==================== */}
        {stage === "initial" && (
          <div
            className={`text-center transition-all duration-1000 ${
              showContent
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Top Line */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 md:w-32 bg-gradient-to-r from-transparent to-red-600" />
              <span className="text-red-600 text-xs md:text-base tracking-[0.2em] md:tracking-[0.3em] uppercase font-medium">
                Grand Launch Event
              </span>
              <div className="h-px w-12 md:w-32 bg-gradient-to-l from-transparent to-red-600" />
            </div>

            {/* Logo Image */}
            <div className="mb-8 md:mb-12">
              <img
                src={logoUrl}
                alt="ShootXpress Logo"
                className="w-48 sm:w-64 md:w-80 lg:w-96 h-auto mx-auto object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = document.getElementById("logo-fallback");
                  if (fallback) fallback.style.display = "block";
                }}
              />
              <div id="logo-fallback" className="hidden">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight">
                  SHOOT<span className="text-red-600">X</span>PRESS
                </h1>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-gray-400 text-base md:text-xl lg:text-2xl tracking-widest uppercase mb-3 md:mb-4">
              Professional Photography & Videography Services
            </p>
            <p className="text-gray-500 text-sm md:text-lg mb-12 md:mb-16">
              December 21
            </p>

            {/* Launch Button */}
            <button
              onClick={handleLaunch}
              className="group relative px-10 md:px-16 lg:px-20 py-4 md:py-6 bg-red-600 text-white 
                         text-base md:text-xl lg:text-2xl font-bold uppercase tracking-wider
                         transition-all duration-300 hover:bg-red-700 
                         active:scale-95 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              <span className="relative z-10">Launch Website</span>
              <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            </button>

            {/* Bottom Text */}
            <p className="text-gray-600 mt-8 md:mt-12 text-xs md:text-sm tracking-wider uppercase">
              Click to begin
            </p>

            {/* Decorative Lines */}
            <div className="flex items-center justify-center gap-2 mt-6 md:mt-8">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-600 rotate-45" />
              <div className="h-px w-16 md:w-24 bg-gray-700" />
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-600 rotate-45" />
              <div className="h-px w-16 md:w-24 bg-gray-700" />
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-600 rotate-45" />
            </div>
          </div>
        )}

        {/* ==================== COUNTDOWN STATE ==================== */}
        {stage === "countdown" && countdownNumber && (
          <div className="text-center">
            <div className="relative">
              <div
                className={`font-black text-white leading-none tracking-tighter
                  ${
                    typeof countdownNumber === "number"
                      ? "text-[150px] sm:text-[200px] md:text-[300px] lg:text-[400px]"
                      : "text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
                  }`}
                style={{
                  animation: "countdownPulse 0.8s ease-in-out",
                }}
                key={String(countdownNumber)}
              >
                {countdownNumber}
              </div>

              {typeof countdownNumber === "number" && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ animation: "ringExpand 1s ease-out infinite" }}
                >
                  <div className="w-48 h-48 md:w-80 md:h-80 lg:w-96 lg:h-96 border-4 border-red-600 rounded-full opacity-50" />
                </div>
              )}
            </div>

            {typeof countdownNumber === "number" && (
              <p className="text-gray-400 text-xl md:text-3xl lg:text-4xl mt-6 md:mt-8 tracking-widest uppercase animate-pulse">
                Get Ready
              </p>
            )}
          </div>
        )}

        {/* ==================== CELEBRATING STATE ==================== */}
        {stage === "celebrating" && (
          <div
            className={`text-center transition-all duration-1000 px-4 ${
              showContent ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            {/* Announcement Badge */}
            <div
              className="inline-block bg-red-600 text-white px-6 md:px-8 py-2 md:py-3 mb-6 md:mb-8 
                         text-xs md:text-base tracking-[0.2em] md:tracking-[0.3em] uppercase font-bold"
              style={{ animation: "slideDown 0.8s ease-out" }}
            >
              Now Live
            </div>

            {/* Main Title */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 md:mb-6 tracking-tight"
              style={{ animation: "revealUp 1s ease-out 0.3s both" }}
            >
              WE ARE LIVE
            </h1>

            {/* Logo Image in Celebration */}
            <div
              className="mb-8 md:mb-12"
              style={{ animation: "revealUp 1s ease-out 0.5s both" }}
            >
              <img
                src={logoUrl}
                alt="ShootXpress Logo"
                className="w-40 sm:w-48 md:w-64 lg:w-80 h-auto mx-auto object-contain mb-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = document.getElementById(
                    "logo-fallback-celebrate"
                  );
                  if (fallback) fallback.style.display = "block";
                }}
              />
              <div id="logo-fallback-celebrate" className="hidden">
                <p className="text-xl md:text-3xl lg:text-4xl text-white font-bold tracking-wider">
                  SHOOT<span className="text-red-600">X</span>PRESS
                </p>
              </div>
              <p className="text-gray-400 text-sm md:text-lg lg:text-xl mt-2 tracking-widest uppercase">
                Is Now Officially Launched
              </p>
            </div>

            {/* Feature Cards */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 max-w-4xl mx-auto mb-8 md:mb-12"
              style={{ animation: "revealUp 1s ease-out 0.7s both" }}
            >
              {featureItems.map((item: FeatureItem, index: number) => (
                <div
                  key={index}
                  className="bg-gray-900 border border-gray-800 p-3 md:p-4 lg:p-6 text-center
                             hover:border-red-600 transition-colors duration-300"
                >
                  <p className="text-white font-bold text-xs md:text-sm lg:text-lg mb-1">
                    {item.title}
                  </p>
                  <p className="text-gray-500 text-[10px] md:text-xs lg:text-sm">
                    {item.subtitle}
                  </p>
                </div>
              ))}
            </div>

            {/* Thank You Message */}
            <p
              className="text-gray-400 text-sm md:text-lg lg:text-xl mb-6 md:mb-8"
              style={{ animation: "revealUp 1s ease-out 0.9s both" }}
            >
              Thank you for being part of our journey
            </p>

            {/* Loading Bar - 5 seconds to match celebration duration */}
            <div
              className="w-48 md:w-64 lg:w-96 h-1 bg-gray-800 mx-auto overflow-hidden"
              style={{ animation: "revealUp 1s ease-out 1.1s both" }}
            >
              <div
                className="h-full bg-red-600"
                style={{
                  animation: "loadingBar 5s linear forwards",
                }}
              />
            </div>
            <p
              className="text-gray-600 text-xs md:text-sm mt-3 md:mt-4 tracking-wider uppercase"
              style={{ animation: "revealUp 1s ease-out 1.3s both" }}
            >
              Entering main website
            </p>
          </div>
        )}
      </div>

      {/* ========== ANIMATION STYLES ========== */}
      <style>{`
        @keyframes floatParticle {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes countdownPulse {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes ringExpand {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes slideDown {
          0% {
            transform: translateY(-50px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes revealUp {
          0% {
            transform: translateY(50px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes loadingBar {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}