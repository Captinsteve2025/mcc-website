"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, CheckCircle2, Mail, Phone, Ship, ArrowRight, Laptop, Globe, Star, Anchor } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
// MCC Brand Colors
export default function CaptainRankPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-end justify-center overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://ugc.same-assets.com/MquMMbulR6Zl3izgPgpjIi7LUUbQ2MSO.jpeg"
            alt="Captain Rank Training on Bali 5.8 Catamaran"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061625]/95 via-[#061625]/70 to-[#061625]/40" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center text-white">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#e89d79]/20 px-6 py-2 backdrop-blur-sm">
            <Star className="h-5 w-5 text-[#e89d79]" />
            <span className="text-sm font-bold uppercase tracking-wide text-[#e89d79]">Highest NauticEd Rank</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Captain Rank
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed md:text-xl text-white/90">
            The pinnacle of NauticEd certification. Professional-level competence for
            offshore passages and advanced vessel operations.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pb-8">
            <Button className="bg-[#e89d79] text-white hover:bg-[#d88a66]" size="lg" asChild>
              <a href="#enquire">Start Your Journey</a>
            </Button>
            <Button variant="outline" size="lg" className="border-white/50 text-white hover:bg-white/10 bg-white/10 backdrop-blur-sm" asChild>
              <Link href="/training#nauticed">View All Certifications</Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Stats */}
      <section className="py-16 bg-gradient-to-br from-[#061625] to-[#0a2540]">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#e89d79]">1000+</p>
              <p className="text-sm text-white/80">Logged Miles Required</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#e89d79]">8+</p>
              <p className="text-sm text-white/80">Online Courses</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#e89d79]">Offshore</p>
              <p className="text-sm text-white/80">Passage Experience</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#e89d79]">Pro</p>
              <p className="text-sm text-white/80">Level Certification</p>
            </div>
          </div>
        </div>
      </section>
      {/* What You'll Achieve */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-center text-4xl font-bold text-[#061625]">What You'll Achieve</h2>
            <p className="mb-12 text-center text-lg text-muted-foreground">
              Captain Rank represents the highest level of sailing competence recognized by NauticEd.
              It requires extensive experience, knowledge, and demonstrated skill.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e89d79]/10">
                    <Laptop className="h-6 w-6 text-[#e89d79]" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#061625]">Advanced Theory</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Offshore navigation & passage planning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Advanced weather interpretation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Emergency procedures & seamanship</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Yacht systems & maintenance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Crew leadership & management</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e89d79]/10">
                    <Ship className="h-6 w-6 text-[#e89d79]" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#061625]">Experience Requirements</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>1000+ logged nautical miles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Offshore passage experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Night sailing experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Bareboat Charter Master completion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Practical sign-off by instructor</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* Benefits */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-[#061625]">Why Captain Rank?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e89d79]/10">
                  <Globe className="h-8 w-8 text-[#e89d79]" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-[#061625]">Offshore Capable</h3>
                <p className="text-muted-foreground">
                  Demonstrate your ability to plan and execute ocean passages with confidence.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e89d79]/10">
                  <Award className="h-8 w-8 text-[#e89d79]" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-[#061625]">Professional Recognition</h3>
                <p className="text-muted-foreground">
                  The highest NauticEd rank, recognized by charter companies and insurers worldwide.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e89d79]/10">
                  <Anchor className="h-8 w-8 text-[#e89d79]" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-[#061625]">Ownership Ready</h3>
                <p className="text-muted-foreground">
                  Complete preparation for yacht ownership and extended cruising.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Build Miles with MCC */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative h-80 overflow-hidden rounded-xl shadow-2xl lg:h-[400px]">
              <Image
                src="https://ugc.same-assets.com/iUzbgjXUyFGYsN4vHDg0P_JeA_eM_PuP.jpeg"
                alt="Offshore Passage Training"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="mb-6 text-3xl font-bold text-[#061625]">Build Your Miles with MCC</h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Our 10-day Caribbean Offshore Passage programs are the perfect way to accumulate
                the miles needed for Captain Rank while gaining real offshore experience.
              </p>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#e89d79]" />
                  <span>300-350 NM per 10-day leg</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#e89d79]" />
                  <span>Night watches and offshore sailing</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#e89d79]" />
                  <span>Multi-country passages</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#e89d79]" />
                  <span>Practical sign-off available</span>
                </li>
              </ul>
              <Button variant="gold" size="lg" asChild>
                <Link href="/training/offshore-passages">
                  View Offshore Passages
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Enquiry Form */}
      <section id="enquire" className="bg-gradient-to-br from-[#061625] to-[#0a2540] py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-white">Start Your Captain Journey</h2>
              <p className="text-lg text-white/80">
                Contact us to discuss your pathway to Captain Rank and plan your training.
              </p>
            </div>
            <Card className="border-0 shadow-2xl">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#061625]">First Name *</label>
                      <input type="text" required placeholder="John" className="flex h-11 w-full rounded-[10px] border border-input bg-background px-4 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#061625]">Last Name *</label>
                      <input type="text" required placeholder="Smith" className="flex h-11 w-full rounded-[10px] border border-input bg-background px-4 py-2 text-sm" />
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#061625]">Email *</label>
                      <input type="email" required placeholder="john@example.com" className="flex h-11 w-full rounded-[10px] border border-input bg-background px-4 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#061625]">Phone</label>
                      <input type="tel" placeholder="+1 (555) 123-4567" className="flex h-11 w-full rounded-[10px] border border-input bg-background px-4 py-2 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#061625]">Current Logged Miles</label>
                    <select className="flex h-11 w-full rounded-[10px] border border-input bg-background px-4 py-2 text-sm">
                      <option value="">Select approximate miles</option>
                      <option value="0-250">0-250 NM</option>
                      <option value="250-500">250-500 NM</option>
                      <option value="500-1000">500-1000 NM</option>
                      <option value="1000+">1000+ NM</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#061625]">Current Certifications</label>
                    <input type="text" placeholder="e.g., Bareboat Charter Master, Competent Crew" className="flex h-11 w-full rounded-[10px] border border-input bg-background px-4 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#061625]">Message</label>
                    <textarea rows={4} placeholder="Tell us about your sailing experience and goals..." className="flex w-full rounded-[10px] border border-input bg-background px-4 py-3 text-sm" />
                  </div>
                  <input type="hidden" name="certification" value="captain-rank" />
                  <Button className="w-full bg-[#e89d79] text-white hover:bg-[#d88a66]" size="lg">
                    Request Captain Rank Info
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
            <div className="mt-8 text-center">
              <p className="mb-2 text-white/70">Or contact us directly:</p>
              <div className="flex flex-wrap justify-center gap-6">
                <a href="tel:+17865201558" className="flex items-center gap-2 text-white hover:text-[#e89d79]">
                  <Phone className="h-5 w-5" />+1 (786) 520-1558
                </a>
                <a href="mailto:info@mycaribbeancharters.com" className="flex items-center gap-2 text-white hover:text-[#e89d79]">
                  <Mail className="h-5 w-5" />info@mycaribbeancharters.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Certification Pathway */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#061625]">Certification Pathway</h2>
          <div className="grid gap-6 md:grid-cols-4">
            <Link href="/training/nauticed/catamaran-sailing-confidence" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79] group-hover:shadow-lg">
                <CardContent className="p-6">
                  <span className="text-xs text-muted-foreground">Foundation</span>
                  <h3 className="mb-2 font-bold text-[#061625] group-hover:text-[#e89d79]">Catamaran Sailing Confidence</h3>
                  <p className="text-sm text-muted-foreground">Master cat handling</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/training/nauticed/skipper-large-powerboat" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79] group-hover:shadow-lg">
                <CardContent className="p-6">
                  <span className="text-xs text-muted-foreground">Step 2</span>
                  <h3 className="mb-2 font-bold text-[#061625] group-hover:text-[#e89d79]">Skipper Large Powerboat</h3>
                  <p className="text-sm text-muted-foreground">Powerboats 27ft+</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/training/nauticed/bareboat-charter-master" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79] group-hover:shadow-lg">
                <CardContent className="p-6">
                  <span className="text-xs text-muted-foreground">Step 3</span>
                  <h3 className="mb-2 font-bold text-[#061625] group-hover:text-[#e89d79]">Bareboat Charter Master</h3>
                  <p className="text-sm text-muted-foreground">Charter worldwide</p>
                </CardContent>
              </Card>
            </Link>
            <Card className="h-full border-2 border-[#e89d79] bg-[#e89d79]/5">
              <CardContent className="p-6">
                <span className="text-xs text-[#e89d79]">You Are Here</span>
                <h3 className="mb-2 font-bold text-[#061625]">Captain Rank</h3>
                <p className="text-sm text-muted-foreground">Professional level</p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">Explore More:</p>
            <div className="mt-2 flex flex-wrap justify-center gap-3 text-sm">
              <Link href="/training" className="text-[#e89d79] hover:underline">All Training Programs</Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/training/offshore-passages" className="text-[#e89d79] hover:underline">Caribbean Offshore Passages</Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/search" className="text-[#e89d79] hover:underline">Browse Yachts</Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
