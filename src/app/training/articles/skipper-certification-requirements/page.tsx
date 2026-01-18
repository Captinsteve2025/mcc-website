"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, ArrowLeft, Award, Globe, BookOpen, Ship, FileCheck, Users, Clock } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function SkipperCertificationRequirementsPage() {
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
            <span className="text-sm font-medium text-[#47c0d5]">Charter Guide</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            What Charter Companies Look for in Skipper Certification
          </h1>
          <p className="max-w-3xl text-xl text-white/80">
            Before handing over the keys to a €500,000+ yacht, charter companies need to verify you have the skills to bring it back safely. Here's exactly what they look for.
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
                Charter companies operate in a high-liability environment. A single grounding, collision, or rescue operation can cost tens of thousands of dollars — not to mention reputational damage. That's why every reputable charter company has a vetting process for skippers.
              </p>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                Understanding what charter companies actually look for can help you prepare the right credentials and avoid disappointment when booking your dream charter.
              </p>
            </section>

            {/* The Three Pillars */}
            <section className="mb-12">
              <h2 className="mb-8 text-3xl font-bold text-[#061625]">The Three Pillars of Charter Approval</h2>

              <div className="space-y-6">
                {/* Pillar 1: Formal Certification */}
                <Card className="border-2 border-[#e89d79]">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e89d79] text-xl font-bold text-[#061625]">1</div>
                      <div>
                        <h3 className="mb-3 text-2xl font-bold text-[#061625]">Formal Certification</h3>
                        <p className="mb-4 text-muted-foreground">
                          The first thing charter companies check is whether you hold a recognized sailing qualification. The level required depends on the boat size, location, and company policy.
                        </p>

                        <div className="mb-4 rounded-lg bg-muted p-4">
                          <h4 className="mb-3 font-bold text-[#061625]">Accepted Certifications:</h4>
                          <ul className="grid gap-2 md:grid-cols-2">
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span>NauticEd SLC / Bareboat Charter Master</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span>NauticEd Bareboat Charter Master / Coastal Skipper</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span>ASA 104 / 114 Catamaran</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span>SLC (Sailing License and Credentials)</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span>IYT Bareboat Skipper</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span>National licenses (varies by country)</span>
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-lg border-l-4 border-[#e89d79] bg-[#e89d79]/10 p-4">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-[#061625]">Pro Tip:</strong> For European charters, ICC is often mandatory. NauticEd SLC includes ICC eligibility when combined with practical assessment.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pillar 2: Documented Experience */}
                <Card className="border-2 border-[#061625]/10">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e89d79] text-xl font-bold text-[#061625]">2</div>
                      <div>
                        <h3 className="mb-3 text-2xl font-bold text-[#061625]">Documented Experience</h3>
                        <p className="mb-4 text-muted-foreground">
                          Certification alone isn't enough. Charter companies want to see that you've actually been sailing — and recently. Your sailing resume or logbook proves your practical experience.
                        </p>

                        <div className="mb-4 grid gap-4 md:grid-cols-2">
                          <div className="rounded-lg bg-muted p-4">
                            <h4 className="mb-2 font-bold text-[#061625]">Minimum Requirements (Typical)</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-[#e89d79]" />
                                <span>50+ hours logged sailing time</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <Ship className="h-4 w-4 text-[#e89d79]" />
                                <span>Experience on similar-sized vessel</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-[#e89d79]" />
                                <span>Recent sailing (within 12-24 months)</span>
                              </li>
                            </ul>
                          </div>
                          <div className="rounded-lg bg-muted p-4">
                            <h4 className="mb-2 font-bold text-[#061625]">What Strengthens Your Resume</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span>Night sailing experience</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span>Offshore passages (50+ NM)</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span>Catamaran-specific experience</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="rounded-lg border-l-4 border-[#47c0d5] bg-[#47c0d5]/10 p-4">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-[#061625]">NauticEd Advantage:</strong> The NauticEd digital logbook automatically builds your sailing resume as you complete courses and log trips. Charter companies can verify your credentials online instantly.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pillar 3: Vessel-Specific Competence */}
                <Card className="border-2 border-[#061625]/10">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e89d79] text-xl font-bold text-[#061625]">3</div>
                      <div>
                        <h3 className="mb-3 text-2xl font-bold text-[#061625]">Vessel-Specific Competence</h3>
                        <p className="mb-4 text-muted-foreground">
                          Chartering a 50ft catamaran is very different from sailing a 30ft monohull. Companies want assurance you can handle the specific type of vessel you're booking.
                        </p>

                        <div className="mb-4 rounded-lg bg-muted p-4">
                          <h4 className="mb-3 font-bold text-[#061625]">Key Considerations:</h4>
                          <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-start gap-2">
                              <Ship className="mt-0.5 h-4 w-4 text-[#e89d79]" />
                              <div>
                                <span className="font-medium text-[#061625]">Monohull vs. Catamaran:</span>
                                <span> If chartering a cat, previous catamaran experience is strongly preferred or required</span>
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <Ship className="mt-0.5 h-4 w-4 text-[#e89d79]" />
                              <div>
                                <span className="font-medium text-[#061625]">Vessel Size:</span>
                                <span> Experience should be on vessels within 10-15ft of the charter boat</span>
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <Ship className="mt-0.5 h-4 w-4 text-[#e89d79]" />
                              <div>
                                <span className="font-medium text-[#061625]">Systems Knowledge:</span>
                                <span> Understanding of modern yacht systems (watermakers, generators, electronics)</span>
                              </div>
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-lg border-l-4 border-[#e89d79] bg-[#e89d79]/10 p-4">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-[#061625]">Our Advantage:</strong> Training on Bali catamarans (40-55ft) means you'll have logged experience on the exact type of vessel most commonly chartered in the Caribbean and Mediterranean.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* What Happens If You Don't Qualify */}
            <section className="mb-12">
              <h2 className="mb-6 text-3xl font-bold text-[#061625]">What If You Don't Meet Requirements?</h2>
              <p className="mb-6 text-muted-foreground">
                If your credentials fall short of a charter company's requirements, you typically have three options:
              </p>

              <div className="space-y-4">
                <Card className="border-2 border-[#061625]/10">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Users className="h-6 w-6 text-[#e89d79]" />
                      <div>
                        <h3 className="mb-2 font-bold text-[#061625]">Option 1: Hire a Professional Skipper</h3>
                        <p className="text-sm text-muted-foreground">
                          Most charter companies offer licensed skippers for hire. This adds €150-300/day but gives you an experienced captain. Great for learning while chartering.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-[#061625]/10">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <FileCheck className="h-6 w-6 text-[#e89d79]" />
                      <div>
                        <h3 className="mb-2 font-bold text-[#061625]">Option 2: Complete a Checkout Sail</h3>
                        <p className="text-sm text-muted-foreground">
                          Some companies offer an extended checkout (half-day with instructor) to verify your skills before approving bareboat charter. Additional fee typically €100-200.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-[#e89d79]">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Award className="h-6 w-6 text-[#e89d79]" />
                      <div>
                        <h3 className="mb-2 font-bold text-[#061625]">Option 3: Get Certified First (Recommended)</h3>
                        <p className="text-sm text-muted-foreground">
                          The most cost-effective long-term solution. A 6-day training program gives you certification, logged experience, and vessel-specific competence — qualifying you for bareboat charters worldwide.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Charter Company Examples */}
            <section className="mb-12">
              <h2 className="mb-6 text-3xl font-bold text-[#061625]">What Major Charter Companies Require</h2>

              <div className="overflow-hidden rounded-xl border-2 border-[#061625]/10">
                <table className="w-full">
                  <thead className="bg-[#061625] text-white">
                    <tr>
                      <th className="p-4 text-left font-bold">Company Type</th>
                      <th className="p-4 text-left font-bold">Typical Requirements</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="bg-white">
                      <td className="p-4 font-medium text-[#061625]">Major Fleets<br /><span className="text-xs text-muted-foreground">(Sunsail, Moorings, Dream Yacht)</span></td>
                      <td className="p-4 text-muted-foreground">
                        <ul className="space-y-1 text-sm">
                          <li>• Recognized certification (RYA/ASA/NauticEd/IYT)</li>
                          <li>• Sailing resume with 50+ hours</li>
                          <li>• Experience on similar vessel size</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="p-4 font-medium text-[#061625]">European Bases<br /><span className="text-xs text-muted-foreground">(Croatia, Greece, Spain)</span></td>
                      <td className="p-4 text-muted-foreground">
                        <ul className="space-y-1 text-sm">
                          <li>• ICC or equivalent mandatory</li>
                          <li>• VHF radio license (Croatia)</li>
                          <li>• Recent sailing experience</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-4 font-medium text-[#061625]">Caribbean Bases<br /><span className="text-xs text-muted-foreground">(BVI, St. Martin, Grenada)</span></td>
                      <td className="p-4 text-muted-foreground">
                        <ul className="space-y-1 text-sm">
                          <li>• Certification or comprehensive resume</li>
                          <li>• More flexible than Europe</li>
                          <li>• Catamaran experience for cats</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="p-4 font-medium text-[#061625]">Premium Yachts<br /><span className="text-xs text-muted-foreground">(50ft+ / High-value vessels)</span></td>
                      <td className="p-4 text-muted-foreground">
                        <ul className="space-y-1 text-sm">
                          <li>• Higher certification (Coastal Skipper level)</li>
                          <li>• Extensive logged experience</li>
                          <li>• May require references</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* CTA */}
            <section className="rounded-xl bg-gradient-to-br from-[#2e4b5c] to-[#1a2f3a] p-8 text-center">
              <h2 className="mb-4 text-2xl font-bold text-white">Get Charter-Ready Certified</h2>
              <p className="mb-6 text-white/80">
                Our 6-day St. Martin program delivers NauticEd SLC + SLC certification with logged catamaran experience on Bali 40-55ft vessels.
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
            <Link href="/training/articles/catamaran-charter-certification-europe" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79]">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-bold text-[#061625] group-hover:text-[#e89d79]">How to Get Certified to Charter a Catamaran in Europe</h3>
                  <p className="text-sm text-muted-foreground">Complete guide to SLC certification for European waters.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/training/articles/nauticed-vs-rya-certification" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79]">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-bold text-[#061625] group-hover:text-[#e89d79]">NauticEd vs RYA for Catamaran Charter Certification</h3>
                  <p className="text-sm text-muted-foreground">Compare certification options and find the right path for your goals.</p>
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
