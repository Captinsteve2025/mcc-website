"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Users, MapPin, Send } from "lucide-react";

export function EnquiryCTA() {
  const [formData, setFormData] = useState({ name: "", email: "", dates: "", guests: "", destination: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you! Our team will be in touch within 24 hours.");
  };

  return (
    <section id="enquire" className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-primary/90" />
      </div>
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-white mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-normal italic mb-4">Tell Us Your Dates, We&apos;ll Find Your Perfect Yacht</h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">Share your preferences and our expert team will curate a shortlist of the best yachts.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-white/80">Your Name</label>
                <Input type="text" placeholder="John Smith" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/80">Email Address</label>
                <Input type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-white/80 flex items-center gap-2"><Calendar className="w-4 h-4" />Preferred Dates</label>
                <Input type="text" placeholder="e.g., Feb 15-22, 2025" value={formData.dates} onChange={(e) => setFormData({ ...formData, dates: e.target.value })} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/80 flex items-center gap-2"><Users className="w-4 h-4" />Number of Guests</label>
                <Input type="text" placeholder="e.g., 6 adults, 2 children" value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/80 flex items-center gap-2"><MapPin className="w-4 h-4" />Preferred Destination</label>
                <Input type="text" placeholder="e.g., British Virgin Islands" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/80">Anything else you&apos;d like us to know?</label>
              <textarea placeholder="Tell us about your ideal charter experience..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none" />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4">
              <p className="text-white/60 text-sm">We typically respond within 24 hours</p>
              <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-white px-8"><Send className="w-4 h-4 mr-2" />Send Enquiry</Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
