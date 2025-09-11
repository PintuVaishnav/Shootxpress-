import { useEffect } from "react";
import PackagesSection from "@/components/packages-section";

export default function Packages() {
  useEffect(() => {
    // Auto-scroll to packages section when page loads
    const packagesSection = document.getElementById('packages');
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="pt-16">
      <div className="hero-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            OUR <span className="text-primary">PACKAGES</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the perfect package for your photography and videography needs
          </p>
        </div>
      </div>
      <PackagesSection />
    </div>
  );
}
