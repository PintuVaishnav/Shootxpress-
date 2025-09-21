import { Video, Clock, Edit, Camera, Rocket, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Package {
  id: string;
  name: string;
  price: number;
  features: { icon: any; text: string }[];
  popular?: boolean;
}

const packages: Package[] = [
  {
    id: "smart-shot",
    name: "SMART SHOT",
    price: 999,
    features: [
      { icon: Video, text: "1 Reel" },
      { icon: Clock, text: "Up to 1.5-hour shoot" },
      { icon: Edit, text: "30-45 min editing" },
      { icon: Camera, text: "3-5 Candid Photos" },
    ],
  },
  {
    id: "xpress-pro",
    name: "XPRESS PRO",
    price: 1799,
    popular: true,
    features: [
      { icon: Video, text: "2 Reels" },
      { icon: Clock, text: "Up to 3-hours shoot" },
      { icon: Rocket, text: "Fast same-day delivery" },
      { icon: Camera, text: "7-10 Candid Photos" },
    ],
  },
  {
    id: "xpress-max",
    name: "XPRESS MAX",
    price: 2999,
    features: [
      { icon: Video, text: "4 Reels" },
      { icon: Clock, text: "6 hours shoot" },
      { icon: Rocket, text: "Fast same-day delivery" },
      { icon: Camera, text: "11-15 Candid Photos" },
    ],
  },
];

export default function PackagesSection() {
  const selectPackage = (packageId: string) => {
    const event = new CustomEvent('selectPackage', { detail: packageId });
    window.dispatchEvent(event);
  };

  return (
    <section id="packages" className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            CHOOSE YOUR <span className="text-primary">PACKAGE</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional photography and videography packages designed for every need and budget
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id}
              className={`package-card relative ${
                pkg.popular ? 'border-2 border-primary' : 'border border-border'
              }`}
              data-testid={`package-card-${pkg.id}`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold flex items-center">
                    <Star className="mr-1 h-3 w-3" />
                    POPULAR
                  </span>
                </div>
              )}
              
              <CardContent className="p-8">
                <div className="bg-primary text-primary-foreground text-center py-3 rounded-lg mb-6">
                  <h3 className="text-xl font-black">{pkg.name}</h3>
                </div>
                
                <div className="space-y-4 mb-8">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center" data-testid={`feature-${pkg.id}-${index}`}>
                      <feature.icon className="text-primary mr-3 h-5 w-5" />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-black text-foreground mb-4" data-testid={`price-${pkg.id}`}>
                    ₹{pkg.price}/api/-
                  </div>
                  <Button 
                    onClick={() => selectPackage(pkg.id)}
                    className={`w-full py-3 rounded-lg font-bold transition-colors duration-200 ${
                      pkg.popular 
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        : 'bg-foreground hover:bg-foreground/90 text-white'
                    }`}
                    data-testid={`select-package-${pkg.id}`}
                  >
                    Choose Package
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Add-ons */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="bg-primary text-primary-foreground text-center py-2 rounded-lg mb-4">
                <h4 className="font-black">ADD ON's</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center" data-testid="addon-video">
                  <span>ADD on:- Per video</span>
                  <span className="font-bold">₹550/-</span>
                </div>
                <div className="flex justify-between items-center" data-testid="addon-hour">
                  <span>Extra Hour</span>
                  <span className="font-bold">₹400/- Per Hour</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="bg-primary text-primary-foreground text-center py-2 rounded-lg mb-4">
                <h4 className="font-black">PHOTOS PACKAGE</h4>
              </div>
              <div className="space-y-3">
                <div>• Candid Traditional photos</div>
                <div>• Full Event Coverage</div>
                <div className="text-center bg-foreground text-white py-2 rounded-lg font-bold" data-testid="photos-price">
                  ₹500/-
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
