import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Dummy data
const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Wedding Client",
    content: "The team was absolutely incredible! They captured moments I didn't even notice happening. The final photos brought tears to my eyes.",
    rating: 5,
    avatar: "SJ",
  },
  {
    id: 2,
    name: "Marcus Thorne",
    role: "Event Organizer",
    content: "Professional, punctual, and highly creative. The reels they produced for our corporate event went viral instantly.",
    rating: 5,
    avatar: "MT",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Fashion Model",
    content: "I've worked with many photographers, but ShootXpress has a unique eye for lighting and composition. Highly recommended!",
    rating: 5,
    avatar: "ER",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Marketing Director",
    content: "The product photography completely transformed our e-commerce conversion rates. Worth every penny.",
    rating: 5,
    avatar: "DK",
  },
  {
    id: 5,
    name: "Jessica & Tom",
    role: "Engagement Shoot",
    content: "We are usually camera shy, but they made us feel so comfortable. The photos look natural and full of joy.",
    rating: 5,
    avatar: "JT",
  },
  {
    id: 6,
    name: "Global Tech Summit",
    role: "Conference Host",
    content: "Coverage was comprehensive and the highlight reel was delivered in record time. Exceptional service.",
    rating: 4,
    avatar: "GT",
  },
];

const ReviewCard = ({ item }: { item: typeof testimonials[0] }) => (
  <Card className="w-[350px] md:w-[450px] shrink-0 mx-4 border-border shadow-md bg-card/50 hover:bg-card transition-colors duration-300">
    <CardContent className="p-6 flex flex-col gap-4 h-full justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <Quote className="text-primary/20 h-10 w-10 -ml-2 -mt-2 transform rotate-180" />
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < item.rating ? "text-primary fill-primary" : "text-muted"
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-muted-foreground italic leading-relaxed">
          "{item.content}"
        </p>
      </div>

      <div className="flex items-center gap-3 mt-2 pt-4 border-t border-border/50">
        <Avatar className="h-10 w-10 border border-primary/20">
          <AvatarImage src="" alt={item.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {item.avatar}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-bold text-sm text-foreground">{item.name}</h4>
          <span className="text-xs text-muted-foreground">{item.role}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-background overflow-hidden">
      {/* CSS for specific marquee animations */}
      <style>
        {`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scroll-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-scroll-left {
            animation: scroll-left 40s linear infinite;
          }
          .animate-scroll-right {
            animation: scroll-right 40s linear infinite;
          }
          /* Pause animation on hover for better readability */
          .marquee-container:hover .animate-scroll-left,
          .marquee-container:hover .animate-scroll-right {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            CLIENT <span className="text-primary">LOVE</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here is what our amazing clients have to say.
          </p>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="flex flex-col gap-8 marquee-container">
        
        {/* Row 1: Right to Left */}
        <div className="relative w-full overflow-hidden">
          {/* Fading gradients for edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          <div className="flex w-max animate-scroll-left">
            {/* We double the array to create the seamless loop effect */}
            {[...testimonials, ...testimonials].map((item, idx) => (
              <ReviewCard key={`l-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* Row 2: Left to Right */}
        <div className="relative w-full overflow-hidden">
           {/* Fading gradients for edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex w-max animate-scroll-right">
            {/* Reverse the array or shift it so it looks different from row 1 */}
            {[...testimonials.slice().reverse(), ...testimonials.slice().reverse()].map((item, idx) => (
              <ReviewCard key={`r-${idx}`} item={item} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}