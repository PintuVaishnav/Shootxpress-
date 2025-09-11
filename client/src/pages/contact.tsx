import { useEffect } from "react";
import ContactSection from "@/components/contact-section";

export default function Contact() {
  useEffect(() => {
    // Auto-scroll to contact section when page loads
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="pt-16">
      <div className="hero-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            GET IN <span className="text-primary">TOUCH</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ready to capture your special moments? Let's discuss your project
          </p>
        </div>
      </div>
      <ContactSection />
    </div>
  );
}
