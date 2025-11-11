import { useState } from "react";
import { Phone, Mail, MapPin, Instagram, MessageSquare, Youtube, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  const { toast } = useToast();

  const submitContact = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit contact form');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        eventType: "",
        message: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContact.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            GET IN <span className="text-primary">TOUCH</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to capture your special moments? Contact us today to discuss your project
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Image Section */}
          <div className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-lg bg-white">
            <img
              src="https://raw.githubusercontent.com/PintuVaishanv/post-images/refs/heads/main/Untitled%20design.png"
              alt="Vaishnav Yejju - Founder of ShootXpress"
              className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="p-6 text-center">
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">SHOOT<span className="text-primary">X</span>PRESS</h2>
              <p className="text-2xl font-bold text-gray-600 uppercase tracking-wide mt-3">Founder & Ceo</p>
              <p className="text-2xl font-bold text-gray-600 uppercase tracking-wide ">Somasani Sanvith</p>
            </div>
          </div>





          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="border border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">Contact Information</h3>

                <div className="space-y-6">
                  <div className="flex items-center" data-testid="contact-phone">
                    <div className="bg-primary text-primary-foreground rounded-full p-3 mr-4">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Phone</div>
                      <div className="text-muted-foreground">+91 81868 31230</div>
                    </div>
                  </div>

                  <div className="flex items-center" data-testid="contact-email">
                    <div className="bg-primary text-primary-foreground rounded-full p-3 mr-4">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Email</div>
                      <div className="text-muted-foreground">shootxpress27@gmail.com</div>
                    </div>
                  </div>

                  <div className="flex items-center" data-testid="contact-location">
                    <div className="bg-primary text-primary-foreground rounded-full p-3 mr-4">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Location</div>
                      <div className="text-muted-foreground">Hyderabad, India</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Links */}
            <Card className="border border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://www.instagram.com/shootxpress_/"
                    className="bg-primary text-primary-foreground rounded-full p-3 hover:bg-primary/90 transition-colors"
                    data-testid="social-instagram"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a
                    href="https://www.instagram.com/junior_stylishstar__27/"
                    className="bg-primary text-primary-foreground rounded-full p-3 hover:bg-primary/90 transition-colors"
                    data-testid="social-whatsapp"
                  >
                    <MessageSquare className="h-6 w-6" />
                  </a>
                  <a
                    href="https://youtube.com/@shootxpress27?si=r0sot-1Neryb6M77"
                    className="bg-primary text-primary-foreground rounded-full p-3 hover:bg-primary/90 transition-colors"
                    data-testid="social-youtube"
                  >
                    <Youtube className="h-6 w-6" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* QR Code for Easy Contact */}
            <Card className="border border-border">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-foreground mb-4">Scan to Connect</h3>
                <div className="w-32 h-32 bg-secondary rounded-lg mx-auto flex items-center justify-center mb-4">
                  <img src="https://raw.githubusercontent.com/PintuVaishanv/post-images/refs/heads/main/WhatsApp%20Image%202025-11-11%20at%2015.18.01_6df23c0f.jpg" alt="QR Code" width={96} height={96} />
                </div>
                <p className="text-sm text-muted-foreground">Scan with your camera to visit our Instagram</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
