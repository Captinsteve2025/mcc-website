"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, CheckCircle2, Globe, Mail, Phone, Ship, ArrowRight, Laptop, BadgeCheck, Target } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
// MCC Brand Colors
export default function BareboatCharterMasterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-end justify-center overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://ugc.same-assets.com/MquMMbulR6Zl3izgPgpjIi7LUUbQ2MSO.jpeg"
            alt="Bali Catamaran for Bareboat Charter Master Training"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061625]/95 via-[#061625]/70 to-[#061625]/40" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center text-white">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#e89d79]/20 px-6 py-2 backdrop-blur-sm">
            <BadgeCheck className="h-5 w-5 text-[#e89d79]" />
            <span className="text-sm font-bold uppercase tracking-wide text-[#e89d79]">NauticEd Certification</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Bareboat Charter Master
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed md:text-xl text-white/90">
            The complete certification for independent bareboat chartering worldwide.
            Achieve your SLC license and charter confidently anywhere.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pb-8">
            <Button className="bg-[#e89d79] text-white hover:bg-[#d88a66]" size="lg" asChild>
              <a href="#enquire">Start Your Certification</a>
            </Button>
            <Button variant="outline" size="lg" className="border-white/50 text-white hover:bg-white/10 bg-white/10 backdrop-blur-sm" asChild>
              <Link href="/training#nauticed">View All Certifications</Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Overview */}
      <section className="py-16 bg-gradient-to-br from-[#061625] to-[#0a2540]">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#e89d79]">5+</p>
              <p className="text-sm text-white/80">Online Courses</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#e89d79]">3-5</p>
              <p className="text-sm text-white/80">Days Practical</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#e89d79]">SLC</p>
              <p className="text-sm text-white/80">License Eligible</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#e89d79]">30+</p>
              <p className="text-sm text-white/80">Countries Accept</p>
            </div>
          </div>
        </div>
      </section>
      {/* What You'll Learn */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-center text-4xl font-bold text-[#061625]">What You'll Learn</h2>
            <p className="mb-12 text-center text-lg text-muted-foreground">
              The Bareboat Charter Master certification covers everything you need to confidently
              skipper a yacht on a bareboat charter anywhere in the world.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e89d79]/10">
                    <Laptop className="h-6 w-6 text-[#e89d79]" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#061625]">Online Theory Courses</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Skipper Course (fundamentals)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Coastal Navigation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Sail Trim for Cruisers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Anchoring & Docking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Weather Fundamentals</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e89d79]/10">
                    <Ship className="h-6 w-6 text-[#e89d79]" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#061625]">Practical Assessment</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Boat handling under power</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Sail setting and trimming</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Mediterranean mooring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Anchoring techniques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Man overboard recovery</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* Why This Certification */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-[#061625]">Why Bareboat Charter Master?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e89d79]/10">
                  <Globe className="h-8 w-8 text-[#e89d79]" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-[#061625]">Globally Recognized</h3>
                <p className="text-muted-foreground">
                  Accepted by charter companies in the Mediterranean, Caribbean, Thailand,
                  Seychelles, and 30+ countries worldwide.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e89d79]/10">
                  <Award className="h-8 w-8 text-[#e89d79]" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-[#061625]">SLC License Eligible</h3>
                <p className="text-muted-foreground">
                  Upon completion, you qualify for the Sailing License and Credentials (SLC) —
                  the internationally recognized boating license.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e89d79]/10">
                  <Target className="h-8 w-8 text-[#e89d79]" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-[#061625]">Charter Ready</h3>
                <p className="text-muted-foreground">
                  Specifically designed for sailors who want to charter independently
                  without a skipper aboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-[#061625]">How It Works</h2>
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#061625] text-2xl font-bold text-white">1</div>
                <h3 className="mb-2 text-xl font-bold text-[#061625]">Complete Online Theory</h3>
                <p className="text-muted-foreground">
                  Study at your own pace from anywhere. Interactive courses with videos,
                  quizzes, and practical exercises.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#061625] text-2xl font-bold text-white">2</div>
                <h3 className="mb-2 text-xl font-bold text-[#061625]">Train With MCC</h3>
                <p className="text-muted-foreground">
                  Join us in the Caribbean for hands-on practical training
                  aboard a modern Bali catamaran.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#061625] text-2xl font-bold text-white">3</div>
                <h3 className="mb-2 text-xl font-bold text-[#061625]">Get Certified</h3>
                <p className="text-muted-foreground">
                  Receive your Bareboat Charter Master certification and apply for
                  your SLC international license.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Enquiry Form */}
      <section id="enquire" className="bg-gradient-to-br from-[#061625] to-[#0a2540] py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-white">Start Your Certification</h2>
              <p className="text-lg text-white/80">
                Request more information about the Bareboat Charter Master certification
                and practical training dates in the Caribbean.
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
                    <label className="mb-2 block text-sm font-medium text-[#061625]">Sailing Experience</label>
                    <select className="flex h-11 w-full rounded-[10px] border border-input bg-background px-4 py-2 text-sm">
                      <option value="">Select your experience level</option>
                      <option value="beginner">Beginner - Little to no experience</option>
                      <option value="some">Some experience - Crewed on yachts</option>
                      <option value="intermediate">Intermediate - Can handle a boat</option>
                      <option value="experienced">Experienced - Regular sailor</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#061625]">Preferred Training Dates</label>
                    <input type="text" placeholder="e.g., March 2026, Flexible" className="flex h-11 w-full rounded-[10px] border border-input bg-background px-4 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#061625]">Message</label>
                    <textarea rows={4} placeholder="Tell us about your goals and any questions you have..." className="flex w-full rounded-[10px] border border-input bg-background px-4 py-3 text-sm" />
                  </div>
                  <input type="hidden" name="certification" value="bareboat-charter-master" />
                  <Button className="w-full bg-[#e89d79] text-white hover:bg-[#d88a66]" size="lg">
                    Request Certification Info
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
      {/* Other Certifications */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#061625]">Other NauticEd Certifications</h2>
          <div className="grid gap-6 md:grid-cols-4">
            <Link href="/training/nauticed/catamaran-sailing-confidence" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79] group-hover:shadow-lg">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-bold text-[#061625] group-hover:text-[#e89d79]">Catamaran Sailing Confidence</h3>
                  <p className="text-sm text-muted-foreground">Master cat handling</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/training/nauticed/skipper-large-powerboat" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79] group-hover:shadow-lg">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-bold text-[#061625] group-hover:text-[#e89d79]">Skipper Large Powerboat</h3>
                  <p className="text-sm text-muted-foreground">For powerboats 27ft+</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/training/nauticed/captain-rank" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79] group-hover:shadow-lg">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-bold text-[#061625] group-hover:text-[#e89d79]">Captain Rank</h3>
                  <p className="text-sm text-muted-foreground">Professional level</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/training/nauticed/slc-license" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79] group-hover:shadow-lg">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-bold text-[#061625] group-hover:text-[#e89d79]">SLC License</h3>
                  <p className="text-sm text-muted-foreground">International boating license</p>
                </CardContent>
              </Card>
            </Link>
          </div>
          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">Explore More:</p>
            <div className="mt-2 flex flex-wrap justify-center gap-3 text-sm">
              <Link href="/training" className="text-[#e89d79] hover:underline">All Training Programs</Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/training/day-skipper" className="text-[#e89d79] hover:underline">BVI Sailing Courses</Link>
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
