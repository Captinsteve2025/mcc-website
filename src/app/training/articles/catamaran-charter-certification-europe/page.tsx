"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, ArrowLeft, MapPin, BookOpen } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function CatamaranCharterCertificationEuropePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      {/* Article Header */}
      <section className="bg-gradient-to-br from-[#2e4b5c] to-[#1a2f3a] py-20 pt-32">
        <div className="container mx-auto px-4">
          <Link href="/training/day-skipper-st-martin" className="mb-6 inline-flex items-center gap-2 text-white/80 transition-colors hover:text-[#47c0d5]">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to St. Martin Training</span>
          </Link>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#47c0d5]/20 px-4 py-2">
            <BookOpen className="h-4 w-4 text-[#47c0d5]" />
            <span className="text-sm font-medium text-[#47c0d5]">Training Guide</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            How to Get Certified to Charter a Catamaran in Europe
          </h1>
          <p className="max-w-3xl text-xl text-white/80">
            Your complete guide to obtaining the certifications required for bareboat catamaran charter in European waters, including the Mediterranean, Greece, Croatia, and beyond.
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
                Chartering a catamaran in Europe is a dream for many sailors, offering access to stunning destinations like the Greek Islands, Croatian coast, French Riviera, and Balearic Islands. However, European charter companies require proof of competence before handing over the keys to a €500,000+ yacht.
              </p>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                This guide explains the certification requirements, how to obtain them, and why training in the Caribbean can fast-track your European charter dreams.
              </p>
            </section>

            {/* Understanding European Requirements */}
            <section className="mb-12">
              <h2 className="mb-6 text-3xl font-bold text-[#061625]">Understanding European Charter Requirements</h2>
              <p className="mb-6 text-muted-foreground">
                Unlike the Caribbean, where charter requirements are often more relaxed, European countries mandate specific certifications:
              </p>

              <div className="mb-8 grid gap-6 md:grid-cols-2">
                <Card className="border-2 border-[#061625]/10">
                  <CardContent className="p-6">
                    <h3 className="mb-3 text-xl font-bold text-[#061625]">SLC (Sailing License and Credentials)</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      The ICC is a UN-recognized certificate proving you're competent to operate recreational craft in foreign waters. Required or recommended in most European countries.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#e89d79]" />
                        <span>Required in Croatia, Greece, Spain</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#e89d79]" />
                        <span>Issued after practical assessment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#e89d79]" />
                        <span>Valid for sail and/or power</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 border-[#061625]/10">
                  <CardContent className="p-6">
                    <h3 className="mb-3 text-xl font-bold text-[#061625]">SLC (Sailing License & Credentials)</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      NauticEd's internationally recognized sailing license that combines online theory with practical assessment. Accepted by charter companies worldwide.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#e89d79]" />
                        <span>Accepted in 30+ countries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#e89d79]" />
                        <span>Includes digital logbook</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#e89d79]" />
                        <span>Lifetime validity</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Country-Specific Requirements */}
            <section className="mb-12">
              <h2 className="mb-6 text-3xl font-bold text-[#061625]">Country-Specific Requirements</h2>

              <div className="space-y-4">
                <Card className="border-2 border-[#061625]/10">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-[#e89d79]" />
                      <div>
                        <h3 className="mb-2 font-bold text-[#061625]">Croatia</h3>
                        <p className="text-sm text-muted-foreground">
                          ICC mandatory. Also requires VHF radio license. Croatian authorities actively check credentials during charter check-ins.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-[#061625]/10">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-[#e89d79]" />
                      <div>
                        <h3 className="mb-2 font-bold text-[#061625]">Greece</h3>
                        <p className="text-sm text-muted-foreground">
                          ICC or equivalent national license required. NauticEd SLC widely accepted by Greek charter companies.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-[#061625]/10">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-[#e89d79]" />
                      <div>
                        <h3 className="mb-2 font-bold text-[#061625]">Spain & Balearics</h3>
                        <p className="text-sm text-muted-foreground">
                          ICC or NauticEd Bareboat Charter Master minimum. Boats over 15m may require additional qualifications.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-[#061625]/10">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-[#e89d79]" />
                      <div>
                        <h3 className="mb-2 font-bold text-[#061625]">France & Corsica</h3>
                        <p className="text-sm text-muted-foreground">
                          ICC recommended. French charter companies may accept comprehensive sailing resume in lieu of formal certification.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Why Train in the Caribbean */}
            <section className="mb-12">
              <h2 className="mb-6 text-3xl font-bold text-[#061625]">Why Train in the Caribbean for European Charters?</h2>
              <p className="mb-6 text-muted-foreground">
                Our St. Martin catamaran training program provides the perfect foundation for European chartering:
              </p>

              <ul className="mb-8 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[#e89d79]" />
                  <div>
                    <span className="font-bold text-[#061625]">Consistent Trade Winds:</span>
                    <span className="text-muted-foreground"> Train in reliable 15-25 knot conditions that build real sailing skills</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[#e89d79]" />
                  <div>
                    <span className="font-bold text-[#061625]">Multi-Island Passages:</span>
                    <span className="text-muted-foreground"> Experience offshore sailing between St. Martin, Anguilla, and St. Barts</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[#e89d79]" />
                  <div>
                    <span className="font-bold text-[#061625]">International Clearances:</span>
                    <span className="text-muted-foreground"> Practice customs and immigration procedures between French, Dutch, and British territories</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[#e89d79]" />
                  <div>
                    <span className="font-bold text-[#061625]">Year-Round Training:</span>
                    <span className="text-muted-foreground"> No seasonal restrictions — train when European waters are too cold</span>
                  </div>
                </li>
              </ul>
            </section>

            {/* CTA */}
            <section className="rounded-xl bg-gradient-to-br from-[#2e4b5c] to-[#1a2f3a] p-8 text-center">
              <h2 className="mb-4 text-2xl font-bold text-white">Ready to Get Charter Certified?</h2>
              <p className="mb-6 text-white/80">
                Our 6-day St. Martin program includes NauticEd SLC + SLC certification
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-[#47c0d5] text-[#2e4b5c] hover:bg-[#5dd0e5]">
                  <Link href="/training/day-skipper-st-martin">
                    View St. Martin Program
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <Link href="/training/nauticed-prerequisites">View Prerequisites</Link>
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
            <Link href="/training/articles/why-st-martin-catamaran-training" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79]">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-bold text-[#061625] group-hover:text-[#e89d79]">Why St Martin Is Ideal for Advanced Catamaran Training</h3>
                  <p className="text-sm text-muted-foreground">Discover what makes St. Martin the perfect location for offshore sailing training.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/training/articles/nauticed-vs-rya-certification" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79]">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-bold text-[#061625] group-hover:text-[#e89d79]">NauticEd vs RYA for Catamaran Charter Certification</h3>
                  <p className="text-sm text-muted-foreground">Compare certification options and find the right path for your sailing goals.</p>
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
