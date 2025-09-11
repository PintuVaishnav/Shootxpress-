import { Instagram, MessageSquare, Youtube } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-foreground text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-black mb-4">
              SHOOT<span className="text-primary">X</span>PRESS
            </div>
            <p className="text-gray-300 mb-4">
              Professional photography and videography with same-day delivery. Capturing moments, creating memories.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-primary transition-colors"
                data-testid="footer-instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-primary transition-colors"
                data-testid="footer-whatsapp"
              >
                <MessageSquare className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-primary transition-colors"
                data-testid="footer-youtube"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-primary transition-colors">Event Photography</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Portrait Sessions</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Corporate Events</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Video Production</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Same-Day Editing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/packages" className="hover:text-primary transition-colors">Packages</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <span className="mr-2">📞</span>
                +91 98181 86301
              </li>
              <li className="flex items-center">
                <span className="mr-2">✉️</span>
                info@shootxpress.com
              </li>
              <li className="flex items-center">
                <span className="mr-2">📍</span>
                Hyderabad, India
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 ShootXpress. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
