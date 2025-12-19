import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Play, Expand, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Portfolio } from "@shared/schema";

// API URL - empty for local dev (uses Vite proxy), full URL for production
const API_URL = import.meta.env.VITE_API_URL || '';

const categories = ["All", "Events", "Portraits", "Reels"];

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: portfolio = [], isLoading } = useQuery<Portfolio[]>({
    queryKey: ['/portfolio', activeCategory === "All" ? undefined : activeCategory.toLowerCase()],
    queryFn: async () => {
      const url = activeCategory === "All"
        ? `${API_URL}/api/portfolio`
        : `${API_URL}/api/portfolio?category=${encodeURIComponent(activeCategory)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch portfolio');
      return response.json();
    },
  });

  // Scroll functions for arrow buttons
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -350,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 350,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            OUR <span className="text-primary">PORTFOLIO</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the moments we've captured and the stories we've told
          </p>
        </div>

        {/* Gallery Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Horizontal Scrolling Gallery */}
        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-lg rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-4 hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-lg rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-foreground" />
          </button>

          {/* Scrollable Container */}
          {isLoading ? (
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-72 h-72 md:w-80 md:h-80 bg-secondary rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {portfolio.map((item) => (
                <Card
                  key={item.id}
                  className="group/card relative overflow-hidden rounded-xl shadow-lg flex-shrink-0 w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 border-0 snap-center cursor-grab active:cursor-grabbing"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-6">
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-semibold mb-3 hover:scale-105 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.isVideo && item.videoUrl) {
                          window.open(item.videoUrl, "_blank");
                        } else if (!item.isVideo) {
                          setSelectedImage(item.imageUrl);
                        }
                      }}
                    >
                      {item.isVideo ? (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Play Reel
                        </>
                      ) : (
                        <>
                          <Expand className="mr-2 h-4 w-4" />
                          View
                        </>
                      )}
                    </Button>
                    <div className="text-white text-center">
                      <div className="text-lg font-bold">{item.title}</div>
                      <div className="text-sm opacity-75">{item.category}</div>
                    </div>
                  </div>

                  {/* Video indicator badge */}
                  {item.isVideo && (
                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      Video
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Scroll Indicator Dots */}
          {portfolio.length > 0 && (
            <div className="flex justify-center gap-2 mt-6">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />
                <span>Swipe to explore</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>

        {portfolio.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-xl text-muted-foreground">
              No portfolio items found for "{activeCategory}"
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-bold transition-colors duration-200"
            onClick={() => window.open('https://www.instagram.com/shootxpress_/', '_blank')}
          >
            View Full Portfolio
          </Button>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full mx-4 p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full shadow-lg z-10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-h-[85vh] w-full object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}