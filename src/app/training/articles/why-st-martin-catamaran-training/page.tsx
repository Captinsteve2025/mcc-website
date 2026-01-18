"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, ArrowLeft, Wind, Anchor, Globe, Navigation, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function WhyStMartinTrainingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      {/* Article Header */}
      <section className="relative min-h-[50vh] bg-gradient-to-br from-[#2e4b5c] to-[#1a2f3a] py-20 pt-32">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="https://ugc.same-assets.com/WDsL9bhNshN4nvwScjcDQQxg6p1qRPft.webp"
            alt="Catamaran sailing in St Martin waters"
            fill
            className="object-cover"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <Link href="/training/day-skipper-st-martin" className="mb-6 inline-flex items-center gap-2 text-white/80 transition-colors hover:text-[#47c0d5]">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to St. Martin Training</span>
          </Link>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#47c0d5]/20 px-4 py-2">
            <BookOpen className="h-4 w-4 text-[#47c0d5]" />
            <span className="text-sm font-medium text-[#47c0d5]">Destination Guide</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Why St Martin Is the Ideal Place for Advanced Catamaran Training
          </h1>
          <p className="max-w-3xl text-xl text-white/80">
            From consistent trade winds to multi-nation island hopping, discover what makes St. Martin the Caribbean's premier destination for serious sailing education.
          </p>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Introduction */}
            <section className="mb-12">
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                When choosing a location for advanced catamaran training, the conditions matter as much as the curriculum. St. Martin offers a unique combination of geographic, meteorological, and logistical advantages that make it the ideal training ground for aspiring charter skippers.
              </p>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                Unlike sheltered training environments, St. Martin puts you in real offshore sailing conditions from day one — the same conditions you'll encounter when chartering in the Mediterranean, Caribbean, or further afield.
              </p>
            </section>

            {/* Key Advantages */}
            <section className="mb-12">
              <h2 className="mb-8 text-3xl font-bold text-[#061625]">What Makes St. Martin Special</h2>

              <div className="space-y-8">
                {/* Trade Winds */}
                <Card className="border-2 border-[#e89d79]">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <Wind className="h-10 w-10 text-[#e89d79]" />
                      <div>
                        <h3 className="mb-3 text-2xl font-bold text-[#061625]">Consistent Trade Winds</h3>
                        <p className="mb-4 text-muted-foreground">
                          The Caribbean trade winds blow reliably from the east at 15-25 knots, providing perfect training conditions year-round. You'll learn to sail in real wind — not the light, variable conditions that plague many training destinations.
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#e89d79]" />
                            <span>Consistent easterly winds 15-25 knots</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#e89d79]" />
                            <span>Year-round sailing season</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#e89d79]" />
                            <span>Build real offshore confidence</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Multi-Island Passages */}
                <Card className="border-2 border-[#061625]/10">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <Navigation className="h-10 w-10 text-[#e89d79]" />
                      <div>
                        <h3 className="mb-3 text-2xl font-bold text-[#061625]">Multi-Island Offshore Passages</h3>
                        <p className="mb-4 text-muted-foreground">
                          Unlike single-island training locations, St. Martin sits at the heart of a multi-island cruising ground. Within our 6-day program, you'll make genuine offshore passages to Anguilla (British) and St. Barts (French).
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#e89d79]" />
                            <span>15-25 nautical mile open water passages</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#e89d79]" />
                            <span>Navigate between three different nations</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#e89d79]" />
                            <span>Experience varied cruising environments</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* International Experience */}
                <Card className="border-2 border-[#061625]/10">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <Globe className="h-10 w-10 text-[#e89d79]" />
                      <div>
                        <h3 className="mb-3 text-2xl font-bold text-[#061625]">International Border Crossings</h3>
                        <p className="mb-4 text-muted-foreground">
                          One of the most valuable skills for international chartering is clearing customs and immigration. St. Martin training involves crossing between French, Dutch, and British territories — practicing the exact procedures you'll use chartering in Europe.
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#e89d79]" />
                            <span>French St. Martin / Dutch Sint Maarten</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#e89d79]" />
                            <span>British Anguilla clearance procedures</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#e89d79]" />
                            <span>French St. Barts port clearance</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* World-Class Cruising */}
                <Card className="border-2 border-[#061625]/10">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <Anchor className="h-10 w-10 text-[#e89d79]" />
                      <div>
                        <h3 className="mb-3 text-2xl font-bold text-[#061625]">Diverse Anchorages & Marinas</h3>
                        <p className="mb-4 text-muted-foreground">
                          From the protected Simpson Bay Lagoon to the challenging anchorages of St. Barts, you'll experience the full spectrum of mooring environments. Practice stern-to Mediterranean-style docking, mooring ball pickups, and exposed anchorage management.
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#e89d79]" />
                            <span>Protected lagoon training base</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#e89d79]" />
                            <span>Med-style stern-to practice</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#e89d79]" />
                            <span>Exposed anchorage assessment</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Training Route */}
            <section className="mb-12">
              <h2 className="mb-6 text-3xl font-bold text-[#061625]">Our Training Route</h2>
              <p className="mb-6 text-muted-foreground">
                Over 6 days, you'll sail a circuit covering approximately 120-180 nautical miles:
              </p>

              <div className="mb-8 rounded-xl bg-muted p-6">
                <ol className="space-y-4">
                  <li className="flex items-start gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e89d79] font-bold text-[#061625]">1</span>
                    <div>
                      <span className="font-bold text-[#061625]">Simpson Bay Lagoon</span>
                      <span className="text-muted-foreground"> — Protected base for close-quarters training</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e89d79] font-bold text-[#061625]">2</span>
                    <div>
                      <span className="font-bold text-[#061625]">Anguilla</span>
                      <span className="text-muted-foreground"> — 20nm offshore passage, British customs clearance</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e89d79] font-bold text-[#061625]">3</span>
                    <div>
                      <span className="font-bold text-[#061625]">St. Barts</span>
                      <span className="text-muted-foreground"> — Challenging pilotage, French port procedures</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e89d79] font-bold text-[#061625]">4</span>
                    <div>
                      <span className="font-bold text-[#061625]">Tintamarre</span>
                      <span className="text-muted-foreground"> — Remote anchorage, emergency drill practice</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e89d79] font-bold text-[#061625]">5</span>
                    <div>
                      <span className="font-bold text-[#061625]">Return to Simpson Bay</span>
                      <span className="text-muted-foreground"> — Final assessment and certification</span>
                    </div>
                  </li>
                </ol>
              </div>
            </section>

            {/* CTA */}
            <section className="rounded-xl bg-gradient-to-br from-[#2e4b5c] to-[#1a2f3a] p-8 text-center">
              <h2 className="mb-4 text-2xl font-bold text-white">Experience St. Martin Training</h2>
              <p className="mb-6 text-white/80">
                6-day intensive catamaran program with NauticEd SLC + SLC certification
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-[#47c0d5] text-[#2e4b5c] hover:bg-[#5dd0e5]">
                  <Link href="/training/day-skipper-st-martin">
                    View Program Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <Link href="/training/day-skipper-st-martin#dates">See Course Dates</Link>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="mb-6 text-center">
            <Link href="/training" className="text-[#e89d79] hover:underline">← Back to All Training Programs</Link>
          </div>
          <h2 className="mb-8 text-center text-2xl font-bold text-[#061625]">Related Articles</h2>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <Link href="/training/articles/catamaran-charter-certification-europe" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79]">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-bold text-[#061625] group-hover:text-[#e89d79]">How to Get Certified to Charter a Catamaran in Europe</h3>
                  <p className="text-sm text-muted-foreground">Complete guide to SLC certification requirements for European waters.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/training/articles/skipper-certification-requirements" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79]">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-bold text-[#061625] group-hover:text-[#e89d79]">What Charter Companies Look for in Skipper Certification</h3>
                  <p className="text-sm text-muted-foreground">Understand what credentials you need to book your first bareboat charter.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
