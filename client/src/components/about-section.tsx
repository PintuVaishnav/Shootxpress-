import { Zap, Award, Users } from "lucide-react";

export default function AboutSection() {
  const features = [
    {
      icon: Zap,
      title: "Same-Day Delivery",
      description: "Get your edited reels and photos delivered the same day of your shoot.",
    },
    {
      icon: Award,
      title: "Professional Quality",
      description: "High-end equipment and expert editing for stunning results.",
    },
    {
      icon: Users,
      title: "Experienced Team",
      description: "Skilled photographers and videographers with years of experience.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
              WHY CHOOSE <span className="text-primary">SHOOTXPRESS?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              We specialize in delivering high-quality photography and videography with same-day reel delivery. 
              Our team of professionals ensures every moment is captured perfectly.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start" data-testid={`feature-${index}`}>
                  <div className="bg-primary text-primary-foreground rounded-full p-3 mr-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1522205408450-add114ad53fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Professional photographer working on creative shoot"
              className="rounded-xl shadow-2xl w-full"
              data-testid="about-image"
            />
            <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl">
              <div className="text-3xl font-black" data-testid="client-count">6000+</div>
              <div className="text-sm">Strong Family</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
