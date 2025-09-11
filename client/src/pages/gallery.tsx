import { useEffect } from "react";
import GallerySection from "@/components/gallery-section";

export default function Gallery() {
  useEffect(() => {
    // Auto-scroll to gallery section when page loads
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="pt-16">
      <div className="hero-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            OUR <span className="text-primary">GALLERY</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our portfolio of captured moments and creative visual stories
          </p>
        </div>
      </div>
      <GallerySection />
    </div>
  );
}
