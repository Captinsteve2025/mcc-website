"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, CheckCircle2, Mail, Phone, Ship, ArrowRight, Anchor, Users, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
// MCC Brand Colors
export default function CatamaranSailingConfidencePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-end justify-center overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://ugc.same-assets.com/iUzbgjXUyFGYsN4vHDg0P_JeA_eM_PuP.jpeg"
            alt="Catamaran Sailing Confidence Course"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061625]/95 via-[#061625]/70 to-[#061625]/40" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center text-white">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#e89d79]/20 px-6 py-2 backdrop-blur-sm">
            <Ship className="h-5 w-5 text-[#e89d79]" />
            <span className="text-sm font-bold uppercase tracking-wide text-[#e89d79]">NauticEd Online Course</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Catamaran Sailing Confidence
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/90">
            Master catamaran handling, docking, and maneuvering. The essential online course
            for anyone chartering or buying a catamaran.
          </p>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-sm text-white/80">4.86 (1,356 reviews)</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 pb-8">
            <Button className="bg-[#e89d79] text-white hover:bg-[#d88a66]" size="lg" asChild>
              <a href="#enquire">Get Started</a>
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
              <p className="text-3xl font-bold text-[#e89d79]">6</p>
              <p className="text-sm text-white/80">Hours Online</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#e89d79]">$49</p>
              <p className="text-sm text-white/80">Course Price</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#e89d79]">Lifetime</p>
              <p className="text-sm text-white/80">Access</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#e89d79]">Lagoon</p>
              <p className="text-sm text-white/80">Endorsed</p>
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
              Created by world-class instructors including Lagoon Catamaran expert Nick Harvey and
              NauticEd legend Grant Headifen, this course teaches you to skipper large catamarans
              safely and effectively.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-bold text-[#061625]">Getting Started</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Moving on board</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Stowing your gear</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Life aboard a catamaran</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Dinghy management</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-bold text-[#061625]">Maneuvering</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Twin-engine handling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Docking under power</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Mooring & anchoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Spring line techniques</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-bold text-[#061625]">Sailing</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Tacking & gybing a cat</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Sail trim for cats</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Reefing techniques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Heavy weather tactics</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* Perfect For */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-[#061625]">This Course Is Perfect For You If...</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e89d79]/10">
                  <Users className="h-7 w-7 text-[#e89d79]" />
                </div>
                <h3 className="mb-2 font-bold text-[#061625]">Monohull Crossovers</h3>
                <p className="text-sm text-muted-foreground">
                  Transitioning from monohulls and want to sail multihulls confidently.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e89d79]/10">
                  <Anchor className="h-7 w-7 text-[#e89d79]" />
                </div>
                <h3 className="mb-2 font-bold text-[#061625]">Charter Planners</h3>
                <p className="text-sm text-muted-foreground">
                  Dreaming of a stress-free catamaran charter vacation.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e89d79]/10">
                  <Ship className="h-7 w-7 text-[#e89d79]" />
                </div>
                <h3 className="mb-2 font-bold text-[#061625]">Future Owners</h3>
                <p className="text-sm text-muted-foreground">
                  Exploring buying a catamaran and want to understand what's involved.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e89d79]/10">
                  <Award className="h-7 w-7 text-[#e89d79]" />
                </div>
                <h3 className="mb-2 font-bold text-[#061625]">New Cat Sailors</h3>
                <p className="text-sm text-muted-foreground">
                  New to catamarans and want to build confidence quickly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* What You Get */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-4xl font-bold text-[#061625]">Everything You Get</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                <div>
                  <p className="font-medium text-[#061625]">Learn to sail large catamarans</p>
                  <p className="text-sm text-muted-foreground">On your own or on a bareboat charter</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                <div>
                  <p className="font-medium text-[#061625]">Available immediately online</p>
                  <p className="text-sm text-muted-foreground">Start learning today at your own pace</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                <div>
                  <p className="font-medium text-[#061625]">Unlimited lifetime access</p>
                  <p className="text-sm text-muted-foreground">Review materials anytime, free updates included</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                <div>
                  <p className="font-medium text-[#061625]">Free bonus courses</p>
                  <p className="text-sm text-muted-foreground">Basic Sail Trim & Nav Rules included</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                <div>
                  <p className="font-medium text-[#061625]">Sailing resume recognition</p>
                  <p className="text-sm text-muted-foreground">Charter companies trust NauticEd credentials</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                <div>
                  <p className="font-medium text-[#061625]">30-day money back guarantee</p>
                  <p className="text-sm text-muted-foreground">Complete satisfaction guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Pathway */}
      <section className="bg-gradient-to-br from-[#061625] to-[#0a2540] py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-white">Next Steps After This Course</h2>
          <p className="mb-12 mx-auto max-w-2xl text-center text-white/80">
            Complete the Catamaran Sailing Confidence course, then continue your certification
            pathway with MCC for hands-on practical training in the Caribbean.
          </p>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <Card className="border-0 bg-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <span className="text-xs text-[#e89d79]">Step 1</span>
                <h3 className="mb-2 font-bold text-white">This Course</h3>
                <p className="text-sm text-white/70">Catamaran theory & techniques online</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <span className="text-xs text-[#e89d79]">Step 2</span>
                <h3 className="mb-2 font-bold text-white">Bareboat Charter Master</h3>
                <p className="text-sm text-white/70">Complete certification bundle</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <span className="text-xs text-[#e89d79]">Step 3</span>
                <h3 className="mb-2 font-bold text-white">Caribbean Practical with MCC</h3>
                <p className="text-sm text-white/70">Get your catamaran endorsement</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Enquiry Form */}
      <section id="enquire" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-[#061625]">Get Started Today</h2>
              <p className="text-lg text-muted-foreground">
                Contact us to learn more about the Catamaran Sailing Confidence course
                and how to combine it with practical training in the Caribbean.
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
                    <label className="mb-2 block text-sm font-medium text-[#061625]">Your Interest</label>
                    <select className="flex h-11 w-full rounded-[10px] border border-input bg-background px-4 py-2 text-sm">
                      <option value="">What are you planning?</option>
                      <option value="charter">Planning a catamaran charter</option>
                      <option value="crossover">Transitioning from monohull</option>
                      <option value="buying">Considering buying a catamaran</option>
                      <option value="certification">Building towards full certification</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#061625]">Message</label>
                    <textarea rows={4} placeholder="Tell us about your sailing experience and goals..." className="flex w-full rounded-[10px] border border-input bg-background px-4 py-3 text-sm" />
                  </div>
                  <input type="hidden" name="course" value="catamaran-sailing-confidence" />
                  <Button variant="gold" size="lg" className="w-full">
                    Request Course Info
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
          <h2 className="mb-8 text-center text-3xl font-bold text-[#061625]">Continue Your Certification</h2>
          <div className="grid gap-6 md:grid-cols-4">
            <Link href="/training/nauticed/skipper-large-powerboat" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79] group-hover:shadow-lg">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-bold text-[#061625] group-hover:text-[#e89d79]">Skipper Large Powerboat</h3>
                  <p className="text-sm text-muted-foreground">For powerboats 27ft+</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/training/nauticed/bareboat-charter-master" className="group">
              <Card className="h-full border-2 border-[#e89d79] shadow-lg">
                <CardContent className="p-6">
                  <span className="mb-2 inline-block rounded bg-[#e89d79]/10 px-2 py-1 text-xs font-bold text-[#e89d79]">Recommended</span>
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
              <Link href="/training/day-skipper-st-martin" className="text-[#e89d79] hover:underline">St Martin Catamaran Training</Link>
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
