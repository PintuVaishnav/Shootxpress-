import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const testimonials = [
  {
    id: 1,
    name: "Manisha",
    role: "Ayyappa pooja",
    content: "You really had an amazing talent Sanvith…. Loved your edits keep growing all the best ♥️",
    rating: 5,
    avatar: "M",
  },
  {
    id: 2,
    name: "Purush",
    role: "Cake Baking Shoot",
    content:
      "The reels came out extremely creative, crisp, and professional. Shoot X Press captured and edited everything beautifully. Highly recommended for high-quality reels and a smooth shooting experience.",
    rating: 5,
    avatar: "P",
  },
  {
    id: 3,
    name: "Chikki",
    role: "House Warming Shoot",
    content:
      "Thank you for agreeing to shoot on such short notice. We loved the videos, especially the fast delivery timeline. Would definitely choose Shoot X Press again.",
    rating: 5,
    avatar: "C",
  },
  {
    id: 4,
    name: "Gayathri",
    role: "Personal Shoot",
    content:
      "Had an amazing experience working with Sanvith. He made me feel comfortable and captured natural moments beautifully. The final photos exceeded my expectations.",
    rating: 5,
    avatar: "G",
  },
  {
    id: 5,
    name: "Shruthi",
    role: "Engagement Instant Reel Gift",
    content:
      "The video is absolutely stunning. Turning the couple’s happiest memories into a video is truly an art, and your team nailed it. Wishing Shoot X Press continued success.",
    rating: 5,
    avatar: "S",
  },
  {
    id: 6,
    name: "Rishika",
    role: "Reception Shoot",
    content:
      "Thank you Sanvith and Uday for the wonderful work. I truly appreciate the effort and professionalism. Best wishes to the entire Shoot X Press team.",
    rating: 5,
    avatar: "R",
  },
  {
    id: 7,
    name: "Shekar",
    role: "Bangalore Car Delivery Shoot",
    content:
      "Amazing experience with Shoot X Press. Yashwant and the team were professional, creative, and patient. They captured every detail perfectly.",
    rating: 5,
    avatar: "S",
  },
  {
    id: 8,
    name: "Pavan faith",
    role: "Car Delivery Shoot",
    content:
      "Excellent service with great visuals. I am very satisfied and will definitely refer Shoot X Press to my colleagues and friends.",
    rating: 5,
    avatar: "PF",
  },
  {
    id: 9,
    name: "Satya-vijay",
    role: "Full wedding coverage",
    content:
      "Words truly fall short in expressing our gratitude. I was skeptical at first about booking people I didn’t know, wondering how the experience would be and whether I’d feel comfortable. But you both were absolutely amazing! You were incredibly accommodating, friendly, and efficient—and in such a short time, I feel I’ve gained two wonderful friends.After a long wait, I finally married the love of my life, and I wanted every moment to be celebrated and captured beautifully. You did exactly that and more ❣️",
    rating: 5,
    avatar: "SV",
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
                className={`h-4 w-4 ${i < item.rating ? "text-primary fill-primary" : "text-muted"
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