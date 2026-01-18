"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, CheckCircle2, Mail, Phone, Ship, ArrowRight, Laptop, BadgeCheck, Navigation, Anchor, Gauge, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
// MCC Brand Colors
export default function SkipperLargePowerboatPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-end justify-center overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://ugc.same-assets.com/MquMMbulR6Zl3izgPgpjIi7LUUbQ2MSO.jpeg"
            alt="Skipper Large Powerboat Training"
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
            Skipper Large Powerboat
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/90">
            Master the skills to command large powerboats 27ft and larger. The definitive
            training program for inland and near-coastal waters.
          </p>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-sm text-white/80">4.84 (49 reviews)</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-[#e89d79] text-[#061625] hover:bg-[#d88a66]" size="lg" asChild>
              <a href="#enquire">Start Your Certification</a>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#061625]" asChild>
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
              <p className="text-3xl font-bold text-[#e89d79]">27ft+</p>
              <p className="text-sm text-white/80">Vessel Size</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#e89d79]">20</p>
              <p className="text-sm text-white/80">Hours Online</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#e89d79]">$195</p>
              <p className="text-sm text-white/80">Course Price</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#e89d79]">Lifetime</p>
              <p className="text-sm text-white/80">Access</p>
            </div>
          </div>
        </div>
      </section>
      {/* Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-center text-4xl font-bold text-[#061625]">The Gold Standard in Powerboat Training</h2>
            <p className="mb-8 text-center text-lg text-muted-foreground">
              This advanced powerboat course is designed to the highest level of professional boating education
              under the American National Standards and exceeding internationally recognized benchmarks.
            </p>
            <p className="mb-8 text-center text-lg text-muted-foreground">
              The Skipper Large Powerboat online course teaches you all the theory, knowledge, and strategies
              necessary to competently command large powerboats that are 27ft or larger, inland or near-coastal
              (within 20nm), and in moderate to rough powerboating conditions.
            </p>
          </div>
        </div>
      </section>
      {/* What You'll Learn */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-4xl font-bold text-[#061625]">What You'll Learn</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e89d79]/10">
                    <Ship className="h-6 w-6 text-[#e89d79]" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-[#061625]">Boat Operations</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Master large powerboats (27ft+)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Hull designs & handling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Helm control techniques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Motoring at speed</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e89d79]/10">
                    <Gauge className="h-6 w-6 text-[#e89d79]" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-[#061625]">Systems & Mechanics</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Engine systems & drive types</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Electrical systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Inboard, stern drive, outboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Communications equipment</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e89d79]/10">
                    <Anchor className="h-6 w-6 text-[#e89d79]" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-[#061625]">Maneuvering & Docking</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Docking & slip handling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Using spring lines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Anchoring & mooring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Close-quarters maneuvering</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e89d79]/10">
                    <Navigation className="h-6 w-6 text-[#e89d79]" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-[#061625]">Navigation & Planning</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Nautical rules of the road</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Navigate & plan trips safely</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Weather & sea conditions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Marine electronics</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e89d79]/10">
                    <Award className="h-6 w-6 text-[#e89d79]" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-[#061625]">Safety & Emergency</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Powerboat safety fundamentals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Safety equipment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Coping with emergencies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Decision-making skills</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e89d79]/10">
                    <Laptop className="h-6 w-6 text-[#e89d79]" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-[#061625]">Course Features</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Online on any device</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Free navigation rules course</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Free eLogbook included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Lifetime access & updates</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* Who Is This For */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-[#061625]">Is This Course Right For You?</h2>
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e89d79]/10">
                  <Ship className="h-8 w-8 text-[#e89d79]" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-[#061625]">New Large Boat Owners</h3>
                <p className="text-muted-foreground">
                  Perfect for new large boat owners wanting professional-grade training.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e89d79]/10">
                  <Navigation className="h-8 w-8 text-[#e89d79]" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-[#061625]">Charter Powerboaters</h3>
                <p className="text-muted-foreground">
                  Ideal for those planning to charter powerboats in coastal waters.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e89d79]/10">
                  <Award className="h-8 w-8 text-[#e89d79]" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-[#061625]">Skill Upgraders</h3>
                <p className="text-muted-foreground">
                  Designed for coastal skippers upgrading their skills and competence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* What's Next */}
      <section className="bg-gradient-to-br from-[#061625] to-[#0a2540] py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-white">What's Next After This Course?</h2>
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-3 text-2xl font-bold text-[#e89d79]">1</div>
                <h3 className="mb-2 font-bold text-white">Practice & Log Experience</h3>
                <p className="text-sm text-white/70">
                  Apply your knowledge and add experience to your free eLogbook to earn your certification.
                </p>
              </div>
              <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-3 text-2xl font-bold text-[#e89d79]">2</div>
                <h3 className="mb-2 font-bold text-white">Practical Training</h3>
                <p className="text-sm text-white/70">
                  Contact MCC for on-water skills training and "Verified Competence" assessment.
                </p>
              </div>
              <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-3 text-2xl font-bold text-[#e89d79]">3</div>
                <h3 className="mb-2 font-bold text-white">Charter Master</h3>
                <p className="text-sm text-white/70">
                  Progress to Bareboat Charter Master for multiday and near-coastal powerboating.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Enquiry Form */}
      <section id="enquire" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-[#061625]">Start Your Certification</h2>
              <p className="text-lg text-muted-foreground">
                Request more information about the Skipper Large Powerboat certification
                and practical training opportunities.
              </p>
            </div>
            <Card className="border-2 border-[#061625]/10 shadow-xl">
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
                    <label className="mb-2 block text-sm font-medium text-[#061625]">Current Boating Experience</label>
                    <select className="flex h-11 w-full rounded-[10px] border border-input bg-background px-4 py-2 text-sm">
                      <option value="">Select your experience level</option>
                      <option value="beginner">Beginner - New to powerboating</option>
                      <option value="some">Some experience - Smaller boats</option>
                      <option value="intermediate">Intermediate - Can handle a boat</option>
                      <option value="experienced">Experienced - Regular powerboater</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#061625]">Boat Size Interest</label>
                    <select className="flex h-11 w-full rounded-[10px] border border-input bg-background px-4 py-2 text-sm">
                      <option value="">Select boat size</option>
                      <option value="27-35">27-35ft</option>
                      <option value="35-45">35-45ft</option>
                      <option value="45-60">45-60ft</option>
                      <option value="60+">60ft+</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#061625]">Message</label>
                    <textarea rows={4} placeholder="Tell us about your powerboating goals..." className="flex w-full rounded-[10px] border border-input bg-background px-4 py-3 text-sm" />
                  </div>
                  <input type="hidden" name="certification" value="skipper-large-powerboat" />
                  <Button variant="gold" size="lg" className="w-full">
                    Request Certification Info
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
            <div className="mt-8 text-center">
              <p className="mb-2 text-muted-foreground">Or contact us directly:</p>
              <div className="flex flex-wrap justify-center gap-6">
                <a href="tel:+17865201558" className="flex items-center gap-2 text-[#061625] hover:text-[#e89d79]">
                  <Phone className="h-5 w-5" />+1 (786) 520-1558
                </a>
                <a href="mailto:info@mycaribbeancharters.com" className="flex items-center gap-2 text-[#061625] hover:text-[#e89d79]">
                  <Mail className="h-5 w-5" />info@mycaribbeancharters.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Other Certifications */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#061625]">Other NauticEd Certifications</h2>
          <div className="grid gap-6 md:grid-cols-4">
            <Link href="/training/nauticed/catamaran-sailing-confidence" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79] group-hover:shadow-lg">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-bold text-[#061625] group-hover:text-[#e89d79]">Catamaran Sailing Confidence</h3>
                  <p className="text-sm text-muted-foreground">Master catamaran handling</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/training/nauticed/bareboat-charter-master" className="group">
              <Card className="h-full border-2 border-[#e89d79] shadow-lg">
                <CardContent className="p-6">
                  <span className="mb-2 inline-block rounded bg-[#e89d79]/10 px-2 py-1 text-xs font-bold text-[#e89d79]">Recommended Next</span>
                  <h3 className="mb-2 font-bold text-[#061625]">Bareboat Charter Master</h3>
                  <p className="text-sm text-muted-foreground">Charter worldwide</p>
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
                  <p className="text-sm text-muted-foreground">International license</p>
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
              <Link href="/bali" className="text-[#e89d79] hover:underline">Train on Bali Catamarans</Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
