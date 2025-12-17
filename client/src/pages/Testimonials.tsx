import { useEffect } from "react";
import TestimonialsSection from "@/components/testimonials-section";

export default function Testimonials() {
  useEffect(() => {
    // Auto-scroll to testimonials section when page loads
    const testimonialSection = document.getElementById('testimonials');
    if (testimonialSection) {
      testimonialSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="pt-16">
      <div className="hero-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            CLIENT <span className="text-primary">STORIES</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Read about the experiences and memories we've created with our clients
          </p>
        </div>
      </div>
      <TestimonialsSection />
    </div>
  );
}