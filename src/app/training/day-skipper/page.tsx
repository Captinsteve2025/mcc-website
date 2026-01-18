"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, GraduationCap, MapPin, Ship, Calendar, Award, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import EnquiryDialog from "../EnquiryDialog";
import { useState } from "react";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { NauticEdEmbed } from "@/components/NauticEdEmbed";

import { useScrollDepthTracking } from "@/hooks/useScrollDepthTracking";

export default function DaySkipperPage() {
  // Track scroll depth for analytics
  useScrollDepthTracking();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [preset, setPreset] = useState<{ passage?: string; date?: string; pkg?: "standard" | "vip" | "" }>({
    passage: "7-Day Bareboat Charter Master Program",
    pkg: "",
  });

  // Course Schema
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Bareboat Charter Master Practical - British Virgin Islands",
    "description": "7-day US Coast Guard approved Bareboat Charter Master training aboard a Bali catamaran in the British Virgin Islands with SLC assessment.",
    "provider": {
      "@type": "Organization",
      "name": "My Caribbean Charters",
      "url": "https://mycaribbeancharters.com"
    },
    "courseMode": "onsite",
    "courseWorkload": "P7D",
    "occupationalCategory": "Yacht Skipper",
    "teaches": ["Navigation", "Seamanship", "Sail handling", "Anchoring", "Passage planning", "Safety procedures"],
    "financialAidEligible": false,
    "offers": {
      "@type": "Offer",
      "price": "3200",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };

  // FAQ Schema for rich snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What certification do I receive from the BVI Bareboat Charter Master course?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upon successful completion, you receive a US Coast Guard approved Bareboat Charter Master practical certificate aligned with American National Standards. You can also obtain the NauticEd SLC (Sailing License and Credentials), which is recognized for chartering yachts worldwide including Europe and the Caribbean."
        }
      },
      {
        "@type": "Question",
        "name": "What is included in the 7-day Bareboat Charter Master course price?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The course includes professional instruction, liveaboard accommodation on a Bali catamaran, all sailing equipment, fuel, and marina fees. Meals are typically shared costs among participants. The VIP package includes additional private cabin accommodation and personalized instruction."
        }
      },
      {
        "@type": "Question",
        "name": "Where in the BVI does the Bareboat Charter Master course take place?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The course operates throughout the British Virgin Islands, including stops at popular destinations like Tortola, Virgin Gorda, Jost Van Dyke, and the famous Baths. You will experience real cruising conditions while learning in some of the world's best sailing waters."
        }
      },
      {
        "@type": "Question",
        "name": "What prerequisites do I need for the Bareboat Charter Master course?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We recommend completing the NauticEd Bareboat Charter Master online bundle before arrival. This includes: Skipper Large Keelboat (20 hrs), Maneuvering Under Power (4 hrs), Bareboat Charter Clinic (5 hrs), Coastal Navigation (10 hrs), Anchoring (4 hrs), and Electronic Navigation (5 hrs). Plus free courses: Basic Sail Trim and Navigation Rules. Some prior sailing experience is beneficial but not mandatory."
        }
      },
      {
        "@type": "Question",
        "name": "When are the Bareboat Charter Master course dates in the BVI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We run courses year-round in the British Virgin Islands, with peak season from November to April offering the best sailing conditions. Contact us for available dates and to book your preferred week."
        }
      }
    ]
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://mycaribbeancharters.com" },
        { name: "Training", url: "https://mycaribbeancharters.com/training" },
        { name: "BVI Program", url: "https://mycaribbeancharters.com/training/day-skipper" },
      ]} />

      <Header />

      {/* Hero */}
      <section className="relative flex min-h-[65vh] items-center justify-center overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero/day-skipper-bvi.jpg"
            alt="Bali catamaran sailing in turquoise Caribbean waters"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        <div className="container relative z-10 mx-auto px-4 pb-8 text-center text-white">
          <Link href="/training" className="mb-6 inline-flex items-center gap-2 text-white/80 transition-colors hover:text-[#e89d79]">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Training Programs</span>
          </Link>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#e89d79]/20 px-6 py-2 backdrop-blur-sm">
            <GraduationCap className="h-5 w-5 text-[#e89d79]" />
            <span className="text-sm font-bold uppercase tracking-wide text-[#e89d79]">7-Day Program</span>
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Bareboat Charter Master
            <br />
            <span className="text-[#e89d79]">BVI Program</span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed md:text-2xl">
            Complete Bareboat Charter Master practical training with NauticEd SLC certification aboard a Bali catamaran
            in the beautiful British Virgin Islands. US Coast Guard approved American National Standard.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="gold"
              size="lg"
              onClick={() => {
                setPreset({ passage: "7-Day Bareboat Charter Master Program", pkg: "standard" });
                setDialogOpen(true);
              }}
            >
              Reserve Your Spot
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-white bg-[#061625]/80 text-white backdrop-blur-sm hover:bg-white hover:text-[#061625]" asChild>
              <a href="#schedule">View Schedule</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-4">
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6 text-center">
                <Calendar className="mx-auto mb-3 h-8 w-8 text-[#061625]" />
                <h3 className="mb-1 text-lg font-bold text-[#061625]">Duration</h3>
                <p className="text-muted-foreground">7 Days</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6 text-center">
                <MapPin className="mx-auto mb-3 h-8 w-8 text-[#061625]" />
                <h3 className="mb-1 text-lg font-bold text-[#061625]">Location</h3>
                <p className="text-muted-foreground">Sopers Hole, Tortola</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6 text-center">
                <Ship className="mx-auto mb-3 h-8 w-8 text-[#e89d79]" />
                <h3 className="mb-1 text-lg font-bold text-[#061625]">Vessel</h3>
                <p className="text-muted-foreground">Bali Catamaran</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6 text-center">
                <Award className="mx-auto mb-3 h-8 w-8 text-[#061625]" />
                <h3 className="mb-1 text-lg font-bold text-[#061625]">Outcome</h3>
                <p className="text-muted-foreground">NauticEd SLC</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Program Description */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-center text-4xl font-bold text-[#061625] md:text-5xl">Program Overview</h2>
            <p className="mb-8 text-center text-lg leading-relaxed text-muted-foreground">
              Our 7-Day Bareboat Charter Master Program delivers the complete NauticEd Bareboat Charter Master practical syllabus
              plus preparation for the SLC (Sailing License and Credentials) assessment.
              You will learn to skipper a yacht safely in daylight hours within familiar waters.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xl font-bold text-[#061625]">What You will Learn</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">Catamaran handling under power and sail</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">Navigation and pilotage techniques</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">Anchoring and mooring procedures</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">COLREGs and rules of the road</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">Emergency procedures and MOB drills</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-xl font-bold text-[#061625]">Prerequisites</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">Some previous sailing experience helpful</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">Competent Crew or equivalent recommended</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">Minimum age 18 for SLC assessment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">Reasonable level of physical fitness</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">Enthusiasm and willingness to learn</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NauticEd Prerequisites Section */}
      <section id="prerequisites" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-4xl font-bold text-[#061625] md:text-5xl">Online Prerequisites</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Complete your theory training online before your practical course. The NauticEd Bareboat Charter Master bundle
                prepares you with 40+ hours of comprehensive sailing education — US Coast Guard approved and recognized worldwide.
              </p>
            </div>

            <div className="mb-8 rounded-xl border-2 border-[#e89d79]/20 bg-[#e89d79]/5 p-6">
              <h3 className="mb-4 text-xl font-bold text-[#061625]">Required Online Courses</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                  <span className="text-muted-foreground">Skipper Large Keelboat (20 hours)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                  <span className="text-muted-foreground">Maneuvering Under Power (4 hours)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                  <span className="text-muted-foreground">Bareboat Charter Clinic (5 hours)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                  <span className="text-muted-foreground">Coastal Navigation (10 hours)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                  <span className="text-muted-foreground">Anchoring a Sailboat (4 hours)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                  <span className="text-muted-foreground">Electronic Navigation (5 hours)</span>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-white p-4">
                <p className="text-sm font-medium text-[#061625]">
                  <span className="text-[#e89d79]">Bonus:</span> Get Basic Sail Trim and Navigation Rules courses FREE with the bundle!
                </p>
              </div>
            </div>

            <div className="rounded-xl border-2 border-[#061625]/10 bg-white p-6">
              <h3 className="mb-4 text-center text-xl font-bold text-[#061625]">Start Your Free Courses Today</h3>
              <p className="mb-6 text-center text-muted-foreground">
                Get started with NauticEd's comprehensive online sailing courses. Complete your theory training before your practical course in the BVI.
              </p>
              {/* NauticEd Course Embed */}
              <div className="mb-6">
                <NauticEdEmbed />
              </div>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button variant="gold" size="lg" asChild>
                  <a href="https://www.nauticed.org/sailing-courses/bareboat-charter-master-bundle" target="_blank" rel="noopener noreferrer">
                    View Course Bundle
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="border-[#061625] text-[#061625] hover:bg-[#061625] hover:text-white" asChild>
                  <a href="https://www.nauticed.org/sailing-courses" target="_blank" rel="noopener noreferrer">
                    All NauticEd Courses
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Schedule */}
      <section id="schedule" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-[#061625] md:text-5xl">7-Day Schedule</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">A structured progression from basics to confident skippering</p>
          </div>

          <div className="mx-auto max-w-5xl space-y-6">
            {/* Day 1 */}
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#e89d79] text-xl font-bold text-[#061625]">1</div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-[#061625]">Arrival, Induction & First Handling</h3>
                    <p className="mb-3 text-sm text-muted-foreground">Sopers Hole, Tortola</p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 font-medium text-[#061625]">Morning / Midday</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Arrival and check-in at Sopers Hole Marina</li>
                          <li>• Vessel orientation and safety briefing</li>
                          <li>• Allocation of cabins and onboard routines</li>
                          <li>• Overview of the week and SLC assessment criteria</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2 font-medium text-[#061625]">Afternoon</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Familiarisation sail in Sir Francis Drake Channel</li>
                          <li>• Engine handling and prop walk awareness</li>
                          <li>• Close-quarters manoeuvring under instruction</li>
                          <li>• Anchoring practice in a nearby bay</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4 rounded-lg bg-[#e89d79] px-4 py-2">
                      <span className="text-sm font-medium text-white">Focus: Safety at sea, crew roles, basic boat handling</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Day 2 */}
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#e89d79] text-xl font-bold text-[#061625]">2</div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-[#061625]">Sail Handling, Helming & Anchoring</h3>
                    <p className="mb-3 text-sm text-muted-foreground">Sopers Hole → Norman Island</p>
                    <ul className="mb-4 grid gap-1 text-sm text-muted-foreground md:grid-cols-2">
                      <li>• Passage planning by students with oversight</li>
                      <li>• Sail hoists, trimming, reefing, points of sail</li>
                      <li>• Helming techniques on a catamaran</li>
                      <li>• Anchoring: scope, holding, anchor watch</li>
                      <li>• Evening theory: COLREGs and lookout</li>
                    </ul>
                    <div className="rounded-lg bg-[#e89d79] px-4 py-2">
                      <span className="text-sm font-medium text-white">Focus: Sail handling competence, situational awareness, anchoring as skipper</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Day 3 */}
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#e89d79] text-xl font-bold text-[#061625]">3</div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-[#061625]">Navigation & Pilotage</h3>
                    <p className="mb-3 text-sm text-muted-foreground">Norman Island → Cooper Island</p>
                    <ul className="mb-4 grid gap-1 text-sm text-muted-foreground md:grid-cols-2">
                      <li>• Chartwork, course to steer, leeway, variation</li>
                      <li>• Visual pilotage into anchorages</li>
                      <li>• GPS and electronic aids with paper charts</li>
                      <li>• Man overboard drills under sail and engine</li>
                      <li>• Evening: passage planning for ICC</li>
                    </ul>
                    <div className="rounded-lg bg-[#e89d79] px-4 py-2">
                      <span className="text-sm font-medium text-white">Focus: Daytime navigation, pilotage in confined waters, emergency response</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Day 4 */}
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#e89d79] text-xl font-bold text-[#061625]">4</div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-[#061625]">Passage Making & Skipper Responsibility</h3>
                    <p className="mb-3 text-sm text-muted-foreground">Cooper Island → Virgin Gorda area</p>
                    <ul className="mb-4 grid gap-1 text-sm text-muted-foreground md:grid-cols-2">
                      <li>• Longer leg with rotating skipper roles</li>
                      <li>• Watchkeeping, lookout, log keeping</li>
                      <li>• Sail changes for wind shifts and angles</li>
                      <li>• Weather interpretation and decision making</li>
                      <li>• Mooring pick-up and close-quarters handling</li>
                    </ul>
                    <div className="rounded-lg bg-[#e89d79] px-4 py-2">
                      <span className="text-sm font-medium text-white">Focus: Command decision making, passage execution, leadership</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Day 5 */}
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#e89d79] text-xl font-bold text-[#061625]">5</div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-[#061625]">Advanced Handling & Emergencies</h3>
                    <p className="mb-3 text-sm text-muted-foreground">Virgin Gorda → Jost Van Dyke</p>
                    <ul className="mb-4 grid gap-1 text-sm text-muted-foreground md:grid-cols-2">
                      <li>• Close-quarters manoeuvring under power</li>
                      <li>• Berthing techniques for catamarans</li>
                      <li>• Emergency procedures: fire, flooding, steering</li>
                      <li>• Towing considerations and risk assessment</li>
                      <li>• ICC oral prep: rules, buoyage, responsibilities</li>
                    </ul>
                    <div className="rounded-lg bg-[#e89d79] px-4 py-2">
                      <span className="text-sm font-medium text-white">Focus: Boat control, emergency management, skipper judgment</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Day 6 */}
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#e89d79] text-xl font-bold text-[#061625]">6</div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-[#061625]">Consolidation & SLC Preparation</h3>
                    <p className="mb-3 text-sm text-muted-foreground">Jost Van Dyke → Outer anchorages → Sopers Hole</p>
                    <ul className="mb-4 grid gap-1 text-sm text-muted-foreground md:grid-cols-2">
                      <li>• Students plan and execute the day's passage</li>
                      <li>• Instructor reduces input to observer role</li>
                      <li>• Final MOB and anchoring exercises</li>
                      <li>• Return sail to Sopers Hole</li>
                      <li>• Evening ICC briefing and readiness checks</li>
                    </ul>
                    <div className="rounded-lg bg-[#e89d79] px-4 py-2">
                      <span className="text-sm font-medium text-white">Focus: Independent skippering, consistency, final skill polish</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Day 7 */}
            <Card className="border-2 border-[#e89d79]">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#e89d79] text-xl font-bold text-[#061625]">7</div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-[#061625]">SLC Practical Assessment & Debrief</h3>
                    <p className="mb-3 text-sm text-muted-foreground">Sopers Hole, Tortola</p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 font-medium text-[#061625]">Morning — Assessment</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• SLC practical assessment by qualified examiner</li>
                          <li>• Close-quarters handling demonstration</li>
                          <li>• Navigation questioning</li>
                          <li>• COLREGs and safety knowledge</li>
                          <li>• Command and situational awareness</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2 font-medium text-[#061625]">Afternoon — Completion</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Individual debriefs and logbook sign-off</li>
                          <li>• SLC paperwork completion (subject to pass)</li>
                          <li>• Course wrap-up and next-steps guidance</li>
                          <li>• Departure</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ICC Notes */}
          <Card className="mx-auto mt-8 max-w-5xl border-2 border-[#061625]/10">
            <CardContent className="p-6">
              <h3 className="mb-3 text-xl font-bold text-[#061625]">Notes on SLC Delivery in the BVI</h3>
              <ul className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                <li>• SLC assessment can be conducted without tidal waters</li>
                <li>• The BVI offers ideal controlled conditions for assessment</li>
                <li>• Night hours not required for ICC (unlike Yachtmaster)</li>
                <li>• Candidates must be 18+ and demonstrate skipper competence</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-[#061625] md:text-5xl">Program Pricing</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">All-inclusive training with professional instruction</p>
          </div>

          <div className="mx-auto max-w-3xl space-y-8">
            {/* Standard Package */}
            <Card className="border-2 border-[#e89d79] shadow-xl">
              <CardContent className="p-8">
                <div className="mb-6 text-center">
                  <p className="text-sm font-bold uppercase tracking-wide text-[#e89d79]">7-Day Bareboat Charter Master Program</p>
                  <p className="mt-2 text-4xl font-bold text-[#061625]">$4,500 <span className="text-lg font-normal text-muted-foreground">per person</span></p>
                  <p className="mt-1 text-sm text-muted-foreground">Based on shared double cabin</p>
                </div>

                <div className="mb-8 grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3 font-bold text-[#061625]">Included</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />7 nights accommodation aboard</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />All meals and provisions</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />Professional NauticEd instructor</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />SLC assessment fee</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />Fuel and marina fees</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />Training materials</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />Logbook sign-off</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-3 font-bold text-[#061625]">Not Included</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Flights to/from Tortola</li>
                      <li>• Meals ashore</li>
                      <li>• Shore excursions</li>
                      <li>• Personal travel insurance</li>
                    </ul>
                  </div>
                </div>

                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setPreset({ passage: "7-Day Bareboat Charter Master Program", pkg: "standard" });
                    setDialogOpen(true);
                  }}
                >
                  Reserve Your Spot
                </Button>
              </CardContent>
            </Card>

            {/* VIP Package */}
            <Card className="border-2 border-yellow-400 shadow-xl">
              <CardContent className="p-8">
                <div className="mb-6 text-center">
                  <p className="text-sm font-bold uppercase tracking-wide text-yellow-600">VIP Bareboat Charter Master Experience</p>
                  <p className="mt-2 text-4xl font-bold text-[#061625]">$12,000</p>
                  <p className="mt-1 text-sm text-muted-foreground">VIP package details below</p>
                </div>

                <div className="mb-8 grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3 font-bold text-[#061625]">VIP Inclusions</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-yellow-600" />2 people sharing an owner's version cabin</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-yellow-600" />Max 3:1 instructor-to-student ratio</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-3 font-bold text-[#061625]">All Standard Inclusions</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 7 nights accommodation aboard</li>
                      <li>• All meals and provisions</li>
                      <li>• Professional NauticEd instructor</li>
                      <li>• SLC assessment fee</li>
                      <li>• Fuel and marina fees</li>
                      <li>• Training materials</li>
                      <li>• Logbook sign-off</li>
                    </ul>
                  </div>
                </div>

                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setPreset({ passage: "7-Day Bareboat Charter Master Program", pkg: "vip" });
                    setDialogOpen(true);
                  }}
                >
                  Enquire About VIP
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-[#061625] md:text-5xl">Bareboat Charter Master & SLC FAQs</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Clear answers for skippers training in the British Virgin Islands</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-bold text-[#061625]">What's the difference between Bareboat Charter Master and SLC?</h3>
                  <p className="text-muted-foreground">Bareboat Charter Master is a practical training standard that prepares you to safely skipper in daylight within familiar waters. The SLC (Sailing License and Credentials) is an internationally recognized license for chartering; we can conduct SLC assessment during the Bareboat Charter Master practical in the BVI.</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-bold text-[#061625]">Do I need tidal waters to take the ICC in the BVI?</h3>
                  <p className="text-muted-foreground">No. SLC assessment can be completed without tidal waters provided you demonstrate navigation, COLREGs, boat handling, and safety standards. The BVI offers ideal controlled conditions for assessing competence.</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-bold text-[#061625]">What are the prerequisites and minimum age?</h3>
                  <p className="text-muted-foreground">Competent Crew or equivalent experience is recommended. For SLC assessment, candidates are typically 18+. A reasonable level of fitness and willingness to learn is expected.</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-bold text-[#061625]">Is this taught on catamarans? Why Bali?</h3>
                  <p className="text-muted-foreground">Yes. Training is conducted aboard modern Bali catamarans. Their open-space design, systems layout, and handling characteristics are ideal for owner-operators and Caribbean charter environments.</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-bold text-[#061625]">What license do I need to charter a yacht in the Caribbean?</h3>
                  <p className="text-muted-foreground">Requirements vary by jurisdiction and charter company. Bareboat Charter Master certification with SLC is widely accepted for bareboat charter worldwide. We can advise on local compliance and insurance expectations.</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-bold text-[#061625]">Is there a VIP option?</h3>
                  <p className="text-muted-foreground">Yes. VIP is $12,000 for two people sharing an owner's version cabin with a max 3:1 instructor-to-student ratio. All standard inclusions apply.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Programs */}
      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="mb-6 text-2xl font-bold text-[#061625]">Explore More Training Options</h3>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <Link href="/training" className="text-[#e89d79] hover:underline">All Training Programs</Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/training/day-skipper-st-martin" className="text-[#e89d79] hover:underline">St Martin Catamaran Training</Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/training/offshore-passages" className="text-[#e89d79] hover:underline">Caribbean Offshore Passages</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#061625] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Ready to Become a Bareboat Charter Master?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
            Contact us to check availability and reserve your place on our next program
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="gold"
              size="lg"
              onClick={() => {
                setPreset({ passage: "7-Day Bareboat Charter Master Program", pkg: "" });
                setDialogOpen(true);
              }}
            >
              Enquire Now
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#061625]" asChild>
              <Link href="/training">View All Programs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enquiry Dialog */}
      <EnquiryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        preset={preset}
      />

      <Footer />
    </div>
  );
}
