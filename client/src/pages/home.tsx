import Hero from "@/components/hero";
import PackagesSection from "@/components/packages-section";
import GallerySection from "@/components/gallery-section";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";

export default function Home() {
  return (
    <div className="pt-16">
      <Hero />
      <PackagesSection />
      <GallerySection />
      <AboutSection />
      <ContactSection />
    </div>
  );
}
