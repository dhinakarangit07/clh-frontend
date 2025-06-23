import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = ({ scrollToSection }) => {
  return (
    <footer className="bg-slate-900/90 backdrop-blur-sm border-t border-white/10 py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-2xl font-bold">
                <span className="text-white">CLH</span>
                <span className="text-orange-500">Advocates</span>
              </span>
            </div>
            <p className="text-white/70 mb-6 leading-relaxed">
              The premier community platform empowering legal professionals across India with exclusive benefits and
              resources.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <Facebook className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <Linkedin className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
            <div className="space-y-3">
              <a href ="/">
              <button
                onClick={() => scrollToSection("home")}
                className="block text-white/70 hover:text-white transition-colors"
              >
                Home
              </button>
              </a>
              <a href = "#benefits">
              <button
                onClick={() => scrollToSection("benefits")}
                className="block text-white/70 hover:text-white transition-colors"
              >
                Benefits
              </button>
              </a>
              <a href = "#about">
              <button
                onClick={() => scrollToSection("about")}
                className="block text-white/70 hover:text-white transition-colors"
              >
                About
              </button>
              </a>
              <a href ="#contact">
              <button
                onClick={() => scrollToSection("contact")}
                className="block text-white/70 hover:text-white transition-colors"
              >
                Contact
              </button>
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                Terms & Conditions
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-white/60">© 2025 CLH Advocates. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
