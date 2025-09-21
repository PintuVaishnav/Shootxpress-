import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Play, Eye, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Portfolio } from "@shared/schema";

const categories = ["All", "Events", "Portraits", "Reels"];

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: portfolio = [], isLoading } = useQuery<Portfolio[]>({
    queryKey: ['/portfolio', activeCategory === "All" ? undefined : activeCategory.toLowerCase()],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL; // use env variable
      const url = activeCategory === "All"
        ? `${baseUrl}/api/portfolio`
        : `${baseUrl}/api/portfolio?category=${encodeURIComponent(activeCategory)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch portfolio');
      return response.json();
    },
  });

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
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${activeCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
                }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="aspect-square bg-secondary rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item) => (
              <Card
                key={item.id}
                className="group relative overflow-hidden rounded-xl shadow-lg aspect-square border-0"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold mb-2"
                      onClick={() => {
                        if (item.isVideo && item.videoUrl) {
                          window.open(item.videoUrl, "_blank");
                        } else {
                          console.log("No video URL available");
                        }
                      }}
                    >
                      {item.isVideo ? (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Play
                        </>
                      ) : (
                        <>
                          <Expand className="mr-2 h-4 w-4" />
                          View
                        </>
                      )}
                    </Button>
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-xs opacity-75">{item.category}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {portfolio.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-xl text-muted-foreground">
              No portfolio items found for "{activeCategory}"
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-bold transition-colors duration-200">
            View Full Portfolio
          </Button>
        </div>
      </div>
    </section>
  );
}
