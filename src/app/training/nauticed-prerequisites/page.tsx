"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle, ExternalLink, Mail, Phone, BookOpen, Laptop, Clock, ArrowLeft, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NauticEdPrerequisitesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-gradient-to-br from-[#061625] to-[#0a2540] pt-20">
        <div className="container relative z-10 mx-auto px-4 text-center text-white">
          <Link href="/training/day-skipper-st-martin" className="mb-6 inline-flex items-center gap-2 text-white/80 transition-colors hover:text-[#e89d79]">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to St. Martin Bareboat Charter Master</span>
          </Link>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#e89d79]/20 px-6 py-2">
            <BookOpen className="h-5 w-5 text-[#e89d79]" />
            <span className="text-sm font-bold uppercase tracking-wide text-[#e89d79]">Pre-Course Requirements</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            NauticEd Prerequisites
            <br />
            <span className="text-[#e89d79]">Checklist</span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-white/80">
            Complete these online theory courses before your practical training in St. Martin.
            All courses are available through NauticEd and can be completed at your own pace.
          </p>
        </div>
      </section>

      {/* Why Prerequisites */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Card className="border-2 border-[#e89d79] bg-[#e89d79]/5">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <AlertCircle className="mt-1 h-8 w-8 flex-shrink-0 text-[#e89d79]" />
                  <div>
                    <h2 className="mb-3 text-2xl font-bold text-[#061625]">Why Prerequisites Matter</h2>
                    <p className="mb-4 text-muted-foreground">
                      The 6-day St. Martin practical training is intensive and hands-on. To maximize your
                      on-water learning time, NauticEd requires that students complete foundational theory
                      courses before arriving. This ensures:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[#e89d79]" />
                        <span>All students start with the same theoretical foundation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[#e89d79]" />
                        <span>More time for practical skills during the course</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[#e89d79]" />
                        <span>Better understanding of safety procedures and COLREGs</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[#e89d79]" />
                        <span>Eligibility for NauticEd SLC + SLC certification</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Required Courses */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-[#061625] md:text-5xl">Required Online Courses</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Complete these NauticEd courses before your practical training
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            {/* Course 1: Skipper Course */}
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#e89d79] text-xl font-bold text-white">1</div>
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-[#061625]">Skipper Course</h3>
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">Required</span>
                    </div>
                    <p className="mb-4 text-muted-foreground">
                      The foundation course covering skipper responsibilities, crew management, passage planning,
                      and decision making. Essential knowledge for anyone taking command of a vessel.
                    </p>
                    <div className="mb-4 grid gap-4 md:grid-cols-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-[#e89d79]" />
                        <span>8-10 hours</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Laptop className="h-4 w-4 text-[#e89d79]" />
                        <span>Online, self-paced</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 text-[#e89d79]" />
                        <span>Certificate on completion</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.nauticed.org/sailing-courses/view/skipper" target="_blank" rel="noopener noreferrer">
                        View on NauticEd
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course 2: Coastal Navigation */}
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#e89d79] text-xl font-bold text-white">2</div>
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-[#061625]">Coastal Navigation</h3>
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">Required</span>
                    </div>
                    <p className="mb-4 text-muted-foreground">
                      Master chart reading, plotting courses, understanding tides and currents,
                      GPS navigation, and pilotage techniques for coastal sailing.
                    </p>
                    <div className="mb-4 grid gap-4 md:grid-cols-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-[#e89d79]" />
                        <span>12-15 hours</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Laptop className="h-4 w-4 text-[#e89d79]" />
                        <span>Online, self-paced</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 text-[#e89d79]" />
                        <span>Certificate on completion</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.nauticed.org/sailing-courses/view/coastal-navigation" target="_blank" rel="noopener noreferrer">
                        View on NauticEd
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course 3: Sail Trim */}
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#e89d79] text-xl font-bold text-white">3</div>
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-[#061625]">Sail Trim</h3>
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">Required</span>
                    </div>
                    <p className="mb-4 text-muted-foreground">
                      Learn proper sail trim for all points of sail, understanding sail shape,
                      reefing procedures, and optimizing performance.
                    </p>
                    <div className="mb-4 grid gap-4 md:grid-cols-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-[#e89d79]" />
                        <span>4-6 hours</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Laptop className="h-4 w-4 text-[#e89d79]" />
                        <span>Online, self-paced</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 text-[#e89d79]" />
                        <span>Certificate on completion</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.nauticed.org/sailing-courses/view/sail-trim" target="_blank" rel="noopener noreferrer">
                        View on NauticEd
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course 4: Rules of the Road (COLREGs) */}
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#e89d79] text-xl font-bold text-white">4</div>
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-[#061625]">Rules of the Road (COLREGs)</h3>
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">Required</span>
                    </div>
                    <p className="mb-4 text-muted-foreground">
                      Essential knowledge of international collision regulations, right of way,
                      navigation lights, sound signals, and safe navigation practices.
                    </p>
                    <div className="mb-4 grid gap-4 md:grid-cols-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-[#e89d79]" />
                        <span>6-8 hours</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Laptop className="h-4 w-4 text-[#e89d79]" />
                        <span>Online, self-paced</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 text-[#e89d79]" />
                        <span>Certificate on completion</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.nauticed.org/sailing-courses/view/rules-of-the-road" target="_blank" rel="noopener noreferrer">
                        View on NauticEd
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course 5: Anchoring */}
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#e89d79] text-xl font-bold text-white">5</div>
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-[#061625]">Anchoring</h3>
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">Required</span>
                    </div>
                    <p className="mb-4 text-muted-foreground">
                      Comprehensive anchoring techniques including anchor selection, scope calculation,
                      setting and retrieving, anchor alarms, and troubleshooting.
                    </p>
                    <div className="mb-4 grid gap-4 md:grid-cols-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-[#e89d79]" />
                        <span>3-4 hours</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Laptop className="h-4 w-4 text-[#e89d79]" />
                        <span>Online, self-paced</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 text-[#e89d79]" />
                        <span>Certificate on completion</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.nauticed.org/sailing-courses/view/anchoring" target="_blank" rel="noopener noreferrer">
                        View on NauticEd
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recommended Courses */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-[#061625] md:text-5xl">Recommended Courses</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              These additional courses will enhance your practical training experience
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {/* Catamaran Sailing Confidence */}
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6">
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="text-lg font-bold text-[#061625]">Catamaran Sailing Confidence</h3>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">Recommended</span>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Master catamaran-specific handling, docking, and maneuvering techniques.
                  Highly recommended since you'll be training on a Bali catamaran.
                </p>
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-[#e89d79]" />
                  <span>6 hours</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.nauticed.org/sailing-courses/view/catamaran-sailing" target="_blank" rel="noopener noreferrer">
                    View Course
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Maneuvering Under Power */}
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6">
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="text-lg font-bold text-[#061625]">Maneuvering Under Power</h3>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">Recommended</span>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Close quarters maneuvering, docking, prop walk understanding,
                  and marina operations. Essential for confident boat handling.
                </p>
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-[#e89d79]" />
                  <span>4 hours</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.nauticed.org/sailing-courses/view/maneuvering-under-power" target="_blank" rel="noopener noreferrer">
                    View Course
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Weather */}
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6">
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="text-lg font-bold text-[#061625]">Weather</h3>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">Recommended</span>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Understanding weather patterns, reading forecasts, and making
                  go/no-go decisions based on conditions.
                </p>
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-[#e89d79]" />
                  <span>6 hours</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.nauticed.org/sailing-courses/view/weather" target="_blank" rel="noopener noreferrer">
                    View Course
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Safety at Sea */}
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6">
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="text-lg font-bold text-[#061625]">Safety at Sea</h3>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">Recommended</span>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Emergency procedures, safety equipment, man overboard recovery,
                  and crisis management.
                </p>
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-[#e89d79]" />
                  <span>4 hours</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.nauticed.org/sailing-courses/view/safety-at-sea" target="_blank" rel="noopener noreferrer">
                    View Course
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pre-Course Checklist */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-[#061625] md:text-5xl">Pre-Course Checklist</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Complete these steps before your arrival in St. Martin
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Circle className="mt-1 h-6 w-6 flex-shrink-0 text-muted-foreground" />
                    <div>
                      <h3 className="font-bold text-[#061625]">Complete Required NauticEd Courses</h3>
                      <p className="text-sm text-muted-foreground">Skipper, Coastal Navigation, Sail Trim, COLREGs, and Anchoring</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Circle className="mt-1 h-6 w-6 flex-shrink-0 text-muted-foreground" />
                    <div>
                      <h3 className="font-bold text-[#061625]">Submit Pre-Course Experience Questionnaire</h3>
                      <p className="text-sm text-muted-foreground">We'll send this after booking — complete at least 2 weeks before arrival</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Circle className="mt-1 h-6 w-6 flex-shrink-0 text-muted-foreground" />
                    <div>
                      <h3 className="font-bold text-[#061625]">Book Flights to St. Martin (SXM)</h3>
                      <p className="text-sm text-muted-foreground">Princess Juliana International Airport — arrive by noon on Day 1</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Circle className="mt-1 h-6 w-6 flex-shrink-0 text-muted-foreground" />
                    <div>
                      <h3 className="font-bold text-[#061625]">Arrange Travel Insurance</h3>
                      <p className="text-sm text-muted-foreground">Ensure coverage for sailing activities and emergency evacuation</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Circle className="mt-1 h-6 w-6 flex-shrink-0 text-muted-foreground" />
                    <div>
                      <h3 className="font-bold text-[#061625]">Pack Appropriate Gear</h3>
                      <p className="text-sm text-muted-foreground">Light clothing, non-marking deck shoes, sunscreen, hat, light rain jacket</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Circle className="mt-1 h-6 w-6 flex-shrink-0 text-muted-foreground" />
                    <div>
                      <h3 className="font-bold text-[#061625]">Bring Valid Passport</h3>
                      <p className="text-sm text-muted-foreground">Required for multi-island passages to Anguilla (British) and St. Barts (French)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Circle className="mt-1 h-6 w-6 flex-shrink-0 text-muted-foreground" />
                    <div>
                      <h3 className="font-bold text-[#061625]">Review Course Materials</h3>
                      <p className="text-sm text-muted-foreground">Refresh your NauticEd course notes before arrival</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Estimated Time */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-[#061625] md:text-4xl">Total Preparation Time</h2>
            <div className="mb-8 grid gap-6 md:grid-cols-3">
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <p className="text-4xl font-bold text-[#e89d79]">35-45</p>
                  <p className="text-muted-foreground">hours for required courses</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <p className="text-4xl font-bold text-[#e89d79]">20+</p>
                  <p className="text-muted-foreground">hours for recommended courses</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <p className="text-4xl font-bold text-[#e89d79]">4-6</p>
                  <p className="text-muted-foreground">weeks suggested lead time</p>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground">
              We recommend starting your online courses at least 4-6 weeks before your practical training date.
              All courses can be paused and resumed at any time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#061625] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Ready to Get Started?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
            Book your St. Martin practical training, then start your NauticEd courses
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/training/day-skipper-st-martin#dates">View Course Dates</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#061625]" asChild>
              <a href="https://www.nauticed.org" target="_blank" rel="noopener noreferrer">
                Visit NauticEd
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
