import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  MessageSquare,
  Youtube,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    eventType: "",
    message: "",
  });

  /* ---------------- MAIN FEATURED MEMBERS ---------------- */
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const featuredMembers = [
    {
      img: "https://github.com/PintuVaishanv/shootxpress/blob/main/11%20(1).png?raw=true",
      name: "SOMASANI SANVITH",
      role: "FOUNDER & CEO",
    },
    {
      img: "https://github.com/PintuVaishanv/shootxpress/blob/main/11.png?raw=true",
      name: "YASWANTH KUMAR KINTHALI",
      role: "MANAGING DIRECTOR",
    },
    {
      img: "https://github.com/PintuVaishanv/shootxpress/blob/main/11%20(2).png?raw=true",
      name: "SOMASANI GNANESHWARI",
      role: "HEAD OF OPERATIONS",
    },
  ];

  const featured = featuredMembers[featuredIndex];

  /* ---------------- LEADERSHIP MEMBERS (DIFFERENT) ---------------- */
  const [leaderIndex, setLeaderIndex] = useState(0);

  const leaders = [
    {
      img: "https://github.com/PintuVaishanv/shootxpress/blob/main/11%20(6).png?raw=true",
      name: "MOOLA VENKATA SREESHANTH ",
      role: "PHOTOGRAPHY HEAD",
    },
    {
      img: "https://github.com/PintuVaishanv/shootxpress/blob/main/11%20(5).png?raw=true",
      name: "UDAY THOKATI",
      role: "SENIOR REEL CREATOR",
    },
    {
      img: "https://github.com/PintuVaishanv/shootxpress/blob/main/11%20(4).png?raw=true",
      name: "ADARASANI HARSHA",
      role: "SENIOR REEL CREATOR",
    },
    {
      img: "https://github.com/PintuVaishanv/shootxpress/blob/main/11%20(3).png?raw=true",
      name: "SHIVAGANESH KONGARI",
      role: "REEL CREATOR",
    },
  ];

  const leader = leaders[leaderIndex];

  const { toast } = useToast();

  

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            GET IN <span className="text-primary">TOUCH</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to capture your special moments? Contact us today to discuss
            your project
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT COLUMN – MAIN FEATURED CARD */}
          <div className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-lg bg-white relative">
            <img
              src={featured.img}
              alt={featured.name}
              className="w-full object-cover"
            />

            <div className="p-6 text-center">
              <h2 className="text-4xl font-extrabold text-gray-900">
                SHOOT<span className="text-primary">X</span>PRESS
              </h2>
              <p className="text-xl font-bold text-gray-600 mt-3">
                {featured.role}
              </p>
              <p className="text-xl font-bold text-gray-600">
                {featured.name}
              </p>
            </div>

            <button
              onClick={() =>
                setFeaturedIndex(
                  featuredIndex === 0
                    ? featuredMembers.length - 1
                    : featuredIndex - 1
                )
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-full"
            >
              ‹
            </button>

            <button
              onClick={() =>
                setFeaturedIndex(
                  featuredIndex === featuredMembers.length - 1
                    ? 0
                    : featuredIndex + 1
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-full"
            >
              ›
            </button>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">
            {/* Contact Information */}
            <Card className="border border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="bg-primary text-primary-foreground rounded-full p-3 mr-4">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        Phone
                      </div>
                      <div className="text-muted-foreground">
                        +91 7416365923
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-primary text-primary-foreground rounded-full p-3 mr-4">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        Email
                      </div>
                      <div className="text-muted-foreground">
                        shootxpress27@gmail.com
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-primary text-primary-foreground rounded-full p-3 mr-4">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        Location
                      </div>
                      <div className="text-muted-foreground">
                        Hyderabad, India
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Follow Us */}
            <Card className="border border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  <a
                    href="https://www.instagram.com/shootxpress_/"
                    className="bg-primary text-primary-foreground rounded-full p-3"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a
                    href="https://www.instagram.com/junior_stylishstar__27/"
                    className="bg-primary text-primary-foreground rounded-full p-3"
                  >
                    <MessageSquare className="h-6 w-6" />
                  </a>
                  <a
                    href="https://youtube.com/@shootxpress27"
                    className="bg-primary text-primary-foreground rounded-full p-3"
                  >
                    <Youtube className="h-6 w-6" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Leadership Card */}
<Card className="border border-border overflow-hidden relative">
  <CardContent className="p-0">
    <h3 className="text-2xl font-bold text-foreground text-center px-8 pt-8 pb-4">
      Leadership Team
    </h3>

    <div className="flex h-56 px-6 pb-6 gap-4 relative">
      {/* Image Section */}
      <div className="w-1/2 h-full overflow-hidden rounded-xl relative left-5">
        <img
          src={leader.img}
          alt={leader.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text Section – Centered */}
      <div className="w-1/2 flex flex-col justify-center items-center text-center">
        <div className="text-xl font-semibold text-foreground">
          {leader.name}
        </div>
        <div className="text-muted-foreground text-base mt-2">
          {leader.role}
        </div>
      </div>
    </div>

    {/* Left Arrow – positioned over the image */}
    <button
      onClick={() =>
        setLeaderIndex(
          leaderIndex === 0 ? leaders.length - 1 : leaderIndex - 1
        )
      }
      className="absolute left-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full shadow"
    >
      ‹
    </button>

    {/* Right Arrow – still on the right */}
    <button
      onClick={() =>
        setLeaderIndex(
          leaderIndex === leaders.length - 1 ? 0 : leaderIndex + 1
        )
      }
      className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full shadow"
    >
      ›
    </button>
  </CardContent>
</Card>

          </div>
        </div>
      </div>
    </section>
  );
}