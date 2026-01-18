"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, GraduationCap, MapPin, Phone, Ship, Calendar, Award, Users, ArrowLeft, ArrowRight, Globe, Navigation, AlertTriangle, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import EnquiryDialog from "../EnquiryDialog";
import { useState } from "react";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { NauticEdEmbed } from "@/components/NauticEdEmbed";

import { useScrollDepthTracking } from "@/hooks/useScrollDepthTracking";

export default function DaySkipperStMartinPage() {
  // Track scroll depth for analytics
  useScrollDepthTracking();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [preset, setPreset] = useState<{ passage?: string; date?: string; pkg?: "standard" | "vip" | "" }>({
    passage: "6-Day Bareboat Charter Master St. Martin",
    pkg: "",
  });

  // Course Schema
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Bareboat Charter Master Practical - St. Martin",
    "description": "6-day intensive liveaboard sailing program in St. Martin, Anguilla, and St. Barts. US Coast Guard approved American National Standard with NauticEd SLC certification.",
    "provider": {
      "@type": "Organization",
      "name": "My Caribbean Charters",
      "url": "https://mycaribbeancharters.com"
    },
    "courseMode": "onsite",
    "courseWorkload": "P6D",
    "occupationalCategory": "Yacht Skipper",
    "teaches": ["Navigation", "Seamanship", "Multi-country clearances", "Catamaran handling", "Passage planning"],
    "financialAidEligible": false,
    "offers": {
      "@type": "Offer",
      "price": "2900",
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
        "name": "What makes the St. Martin Bareboat Charter Master course unique?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The St. Martin program offers multi-country sailing experience, visiting St. Martin, Anguilla, and St. Barts in 6 days. You'll learn international clearance procedures, experience diverse sailing conditions, and gain the NauticEd SLC certification - a US Coast Guard recognized credential accepted by charter companies worldwide."
        }
      },
      {
        "@type": "Question",
        "name": "What certification do I receive from the St. Martin course?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You receive a NauticEd Sailing License and Credentials (SLC) upon completion, which is internationally recognized for bareboat charter. The SLC is accepted throughout the Mediterranean, Caribbean, and worldwide by major charter companies."
        }
      },
      {
        "@type": "Question",
        "name": "How does the 6-day St. Martin course compare to the 7-day BVI course?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Both courses provide equivalent certification. The St. Martin course is slightly shorter (6 days vs 7) and focuses on multi-country sailing with international clearances. The BVI course offers more time in protected waters ideal for building basic skills. Choose based on your preferred location and whether you want the multi-country experience."
        }
      },
      {
        "@type": "Question",
        "name": "What islands will I visit during the St. Martin training?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The course typically includes sailing to Anguilla (British territory), St. Barts (French Caribbean), and exploring both the French and Dutch sides of St. Martin. You'll practice international customs and immigration procedures while experiencing diverse Caribbean cultures."
        }
      },
      {
        "@type": "Question",
        "name": "What are the sailing conditions like in St. Martin?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "St. Martin offers consistent trade winds averaging 15-20 knots, making it excellent for sailing training. The waters between islands provide varied conditions from protected anchorages to open ocean crossings, giving you well-rounded experience for future chartering."
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
        { name: "St. Martin Program", url: "https://mycaribbeancharters.com/training/day-skipper-st-martin" },
      ]} />
      <Header />

      {/* Hero - St. Martin catamaran sailing */}
      <section className="relative flex min-h-[65vh] items-center justify-center overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/training/st-martin-hero.jpg"
            alt="Catamaran sailing in turquoise waters off St. Martin"
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
          {/* Introductory Discount Banner */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-500/90 px-6 py-2 backdrop-blur-sm">
            <Tag className="h-5 w-5 text-white" />
            <span className="text-sm font-bold uppercase tracking-wide text-white">15% OFF - Book Before April 2026</span>
          </div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#e89d79]/20 px-6 py-2 backdrop-blur-sm">
            <GraduationCap className="h-5 w-5 text-[#e89d79]" />
            <span className="text-sm font-bold uppercase tracking-wide text-[#e89d79]">6-Day Program</span>
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Bareboat Charter Master
            <br />
            <span className="text-[#e89d79]">St. Martin</span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed md:text-2xl">
            Intensive instructor-led practical training aligned with NauticEd SLC standards — US Coast Guard approved American National Standard.
            Multi-island passages from St. Martin to Anguilla and St. Barts.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="gold"
              size="lg"
              onClick={() => {
                setPreset({ passage: "6-Day Bareboat Charter Master St. Martin (15% Introductory Discount)", pkg: "standard" });
                setDialogOpen(true);
              }}
            >
              Reserve Your Spot
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-white bg-[#061625]/80 text-white backdrop-blur-sm hover:bg-white hover:text-[#061625]" asChild>
              <a href="#schedule">View Itinerary</a>
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
                <p className="text-muted-foreground">6 Days Liveaboard</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6 text-center">
                <MapPin className="mx-auto mb-3 h-8 w-8 text-[#061625]" />
                <h3 className="mb-1 text-lg font-bold text-[#061625]">Location</h3>
                <p className="text-muted-foreground">Simpson Bay, St. Martin</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6 text-center">
                <Ship className="mx-auto mb-3 h-8 w-8 text-[#061625]" />
                <h3 className="mb-1 text-lg font-bold text-[#061625]">Vessel</h3>
                <p className="text-muted-foreground">Bali Catamaran 40-55ft</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6 text-center">
                <Award className="mx-auto mb-3 h-8 w-8 text-[#061625]" />
                <h3 className="mb-1 text-lg font-bold text-[#061625]">Outcome</h3>
                <p className="text-muted-foreground">NauticEd SLC + ICC</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Program Description with Image */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="relative h-80 overflow-hidden rounded-xl shadow-xl lg:h-[450px]">
                <Image
                  src="https://ext.same-assets.com/1596285160/3706870644.jpeg"
                  alt="Bali Catamaran sailing in turquoise Caribbean waters"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                  unoptimized
                />
              </div>
              <div>
                <h2 className="mb-6 text-4xl font-bold text-[#061625] md:text-5xl">Program Overview</h2>
                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                  Our 6-Day St. Martin program delivers intensive instructor-led practical training aligned with
                  NauticEd SLC and ICC practical competency standards. Based from Simpson Bay Lagoon, you will
                  sail offshore passages to Anguilla and St. Barts in charter-realistic operating environments.
                </p>

                <div className="mb-8 rounded-xl border-2 border-[#e89d79] bg-orange-50 p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#e89d79]/20">
                      <Globe className="h-6 w-6 text-[#e89d79]" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-bold text-[#061625]">NauticEd Partnership</h3>
                      <p className="text-muted-foreground">
                        This program is delivered by VIYB Ltd / My Caribbean Charters (MCC) as an authorized NauticEd
                        practical training provider. Upon successful completion, students are eligible for NauticEd SLC
                        certification and SLC assessment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xl font-bold text-[#061625]">Practical Competency Areas</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">Boat handling and docking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">Sail handling and trimming</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">Navigation and passage planning</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">Anchoring and ground tackle</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">Emergency procedures</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">Skipper leadership and crew management</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-xl font-bold text-[#061625]">Entry Requirements</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">Completion of required NauticEd theory modules</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">Approved pre-course experience questionnaire</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">Minimum age 18 for SLC assessment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e89d79]" />
                    <span className="text-muted-foreground">Reasonable level of physical fitness</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NauticEd Prerequisites Section */}
      <section id="prerequisites" className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-4xl font-bold text-[#061625] md:text-5xl">Online Prerequisites</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Complete your theory training online before your practical course. The NauticEd Bareboat Charter Master bundle
                prepares you with 40+ hours of comprehensive sailing education — US Coast Guard approved and recognized worldwide.
              </p>
            </div>

            <div className="mb-8 rounded-xl border-2 border-[#e89d79]/20 bg-white p-6">
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
              <div className="mt-4 rounded-lg bg-[#e89d79]/10 p-4">
                <p className="text-sm font-medium text-[#061625]">
                  <span className="text-[#e89d79]">Bonus:</span> Get Basic Sail Trim and Navigation Rules courses FREE with the bundle!
                </p>
              </div>
            </div>

            <div className="rounded-xl border-2 border-[#061625]/10 bg-white p-6">
              <h3 className="mb-4 text-center text-xl font-bold text-[#061625]">Start Your Free Courses Today</h3>
              <p className="mb-6 text-center text-muted-foreground">
                Get started with NauticEd's comprehensive online sailing courses. Complete your theory training before your practical course in St. Martin.
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

      {/* Training Highlights with Image */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-[#061625] md:text-5xl">Why St. Martin?</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Multi-island training with varied sailing conditions</p>
          </div>

          <div className="mx-auto max-w-6xl">
            <div className="mb-12 grid items-center gap-8 lg:grid-cols-2">
              <div className="relative h-72 overflow-hidden rounded-xl shadow-xl lg:h-96">
                <Image
                  src="https://ugc.same-assets.com/IZ9BfHGyHGb6QxpKJ5Oibn0q26-IgC_Q.png"
                  alt="Bali 4.6 Catamaran anchored in Caribbean bay"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="grid gap-6">
                <Card className="border-2 border-[#061625]/10">
                  <CardContent className="p-6">
                    <Navigation className="mb-4 h-10 w-10 text-[#e89d79]" />
                    <h3 className="mb-3 text-xl font-bold text-[#061625]">Offshore Passages</h3>
                    <p className="text-muted-foreground">
                      Real open-water sailing between islands develops confidence for international chartering
                      and passage making.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-[#061625]/10">
                  <CardContent className="p-6">
                    <Globe className="mb-4 h-10 w-10 text-[#e89d79]" />
                    <h3 className="mb-3 text-xl font-bold text-[#061625]">Three Islands</h3>
                    <p className="text-muted-foreground">
                      Experience diverse cruising grounds including French St. Martin, British Anguilla,
                      and glamorous St. Barts.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-[#061625]/10">
                  <CardContent className="p-6">
                    <Users className="mb-4 h-10 w-10 text-[#e89d79]" />
                    <h3 className="mb-3 text-xl font-bold text-[#061625]">4:1 Ratio</h3>
                    <p className="text-muted-foreground">
                      Maximum 4 students per instructor ensures ample helm time, skipper rotations,
                      and personalized coaching.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Day Schedule */}
      <section id="schedule" className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-[#061625] md:text-5xl">6-Day Itinerary</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Structured progression with skipper rotation, drills, and competency logging</p>
          </div>

          <div className="mx-auto max-w-5xl space-y-6">
            {/* Day 1 */}
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#e89d79] text-xl font-bold text-[#061625]">1</div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-[#061625]">Simpson Bay Lagoon</h3>
                    <p className="mb-3 text-sm text-muted-foreground">Safety Induction & Close Quarters Maneuvering</p>
                    <ul className="grid gap-1 text-sm text-muted-foreground md:grid-cols-2">
                      <li>• Safety induction and vessel orientation</li>
                      <li>• Systems familiarization</li>
                      <li>• Close quarters maneuvering practice</li>
                      <li>• Prop walk and engine handling</li>
                    </ul>
                    <div className="mt-4 rounded-lg bg-[#e89d79] px-4 py-2">
                      <span className="text-sm font-medium text-white">Focus: Vessel familiarity, safety protocols, basic boat handling</span>
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
                    <h3 className="mb-2 text-xl font-bold text-[#061625]">St. Martin to Anguilla</h3>
                    <p className="mb-3 text-sm text-muted-foreground">Passage Planning, Sail Handling & Anchoring</p>
                    <ul className="grid gap-1 text-sm text-muted-foreground md:grid-cols-2">
                      <li>• Student-led passage planning</li>
                      <li>• Offshore sailing to Anguilla</li>
                      <li>• Sail hoisting, trimming, reefing</li>
                      <li>• Anchoring exercises and techniques</li>
                    </ul>
                    <div className="mt-4 rounded-lg bg-[#e89d79] px-4 py-2">
                      <span className="text-sm font-medium text-white">Focus: Offshore passage making, sail competence, anchoring as skipper</span>
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
                    <h3 className="mb-2 text-xl font-bold text-[#061625]">Anguilla to St. Barts</h3>
                    <p className="mb-3 text-sm text-muted-foreground">Pilotage, Mooring Operations & Optional Night Segment</p>
                    <ul className="grid gap-1 text-sm text-muted-foreground md:grid-cols-2">
                      <li>• Pilotage in challenging waters</li>
                      <li>• Mooring pickup and departure</li>
                      <li>• Electronic and visual navigation</li>
                      <li>• Optional night sailing segment</li>
                    </ul>
                    <div className="mt-4 rounded-lg bg-[#e89d79] px-4 py-2">
                      <span className="text-sm font-medium text-white">Focus: Pilotage skills, mooring operations, navigation confidence</span>
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
                    <h3 className="mb-2 text-xl font-bold text-[#061625]">St. Barts to Tintamarre</h3>
                    <p className="mb-3 text-sm text-muted-foreground">Emergency Drills & Anchoring Repetition</p>
                    <ul className="grid gap-1 text-sm text-muted-foreground md:grid-cols-2">
                      <li>• Man overboard under power and sail</li>
                      <li>• Engine failure response</li>
                      <li>• Squall preparation drills</li>
                      <li>• Repeated anchoring exercises</li>
                    </ul>
                    <div className="mt-4 rounded-lg bg-[#e89d79] px-4 py-2">
                      <span className="text-sm font-medium text-white">Focus: Emergency response, scenario-based training, anchoring mastery</span>
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
                    <h3 className="mb-2 text-xl font-bold text-[#061625]">Tintamarre to Simpson Bay</h3>
                    <p className="mb-3 text-sm text-muted-foreground">Advanced Docking & Charter Readiness Drills</p>
                    <ul className="grid gap-1 text-sm text-muted-foreground md:grid-cols-2">
                      <li>• Advanced docking techniques</li>
                      <li>• Stern-to and med mooring</li>
                      <li>• Charter readiness scenarios</li>
                      <li>• Decision making under pressure</li>
                    </ul>
                    <div className="mt-4 rounded-lg bg-[#e89d79] px-4 py-2">
                      <span className="text-sm font-medium text-white">Focus: Advanced boat control, command presence, charter preparation</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Day 6 */}
            <Card className="border-2 border-[#e89d79]">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#e89d79] text-xl font-bold text-[#061625]">6</div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-[#061625]">Final Practical Assessment</h3>
                    <p className="mb-3 text-sm text-muted-foreground">Competency Sign-off & Certification Review</p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 font-medium text-[#061625]">Morning</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Final practical assessment</li>
                          <li>• Independent skipper evaluation</li>
                          <li>• Close-quarters demonstration</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2 font-medium text-[#061625]">Afternoon</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Individual debriefs</li>
                          <li>• Competency sign-off</li>
                          <li>• NauticEd SLC + ICC paperwork</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assessment Standard */}
          <Card className="mx-auto mt-8 max-w-5xl border-2 border-[#061625]/10">
            <CardContent className="p-6">
              <h3 className="mb-3 text-xl font-bold text-[#061625]">Instructor Assessment Standard</h3>
              <ul className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span><strong>Pass:</strong> Safe, controlled, repeatable</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-yellow-600" />
                  <span><strong>Marginal:</strong> Safe but inconsistent</span>
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span><strong>Fail:</strong> Unsafe or intervention required</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Upcoming Course Dates */}
      <section id="dates" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-6 py-2">
              <Tag className="h-5 w-5 text-green-700" />
              <span className="text-sm font-bold uppercase tracking-wide text-green-700">15% OFF All Dates Before April 2026</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold text-[#061625] md:text-5xl">2026 Course Dates</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Select your preferred start date — each course runs 6 consecutive days</p>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="grid gap-4 md:grid-cols-3">
              {/* February */}
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-bold text-[#061625]">February 2026</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setPreset({ passage: "6-Day Bareboat Charter Master St. Martin (15% Introductory Discount)", date: "Feb 15-20, 2026", pkg: "standard" });
                        setDialogOpen(true);
                      }}
                      className="flex w-full items-center justify-between rounded-lg border-2 border-[#061625]/10 p-3 text-left transition-all hover:border-[#e89d79] hover:bg-[#e89d79]/5"
                    >
                      <div>
                        <p className="font-bold text-[#061625]">Feb 15 - 20</p>
                        <p className="text-sm text-muted-foreground">6 days</p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">15% OFF</span>
                    </button>
                    <button
                      onClick={() => {
                        setPreset({ passage: "6-Day Bareboat Charter Master St. Martin (15% Introductory Discount)", date: "Feb 22-27, 2026", pkg: "standard" });
                        setDialogOpen(true);
                      }}
                      className="flex w-full items-center justify-between rounded-lg border-2 border-[#061625]/10 p-3 text-left transition-all hover:border-[#e89d79] hover:bg-[#e89d79]/5"
                    >
                      <div>
                        <p className="font-bold text-[#061625]">Feb 22 - 27</p>
                        <p className="text-sm text-muted-foreground">6 days</p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">15% OFF</span>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* March */}
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-bold text-[#061625]">March 2026</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setPreset({ passage: "6-Day Bareboat Charter Master St. Martin (15% Introductory Discount)", date: "Mar 1-6, 2026", pkg: "standard" });
                        setDialogOpen(true);
                      }}
                      className="flex w-full items-center justify-between rounded-lg border-2 border-[#061625]/10 p-3 text-left transition-all hover:border-[#e89d79] hover:bg-[#e89d79]/5"
                    >
                      <div>
                        <p className="font-bold text-[#061625]">Mar 1 - 6</p>
                        <p className="text-sm text-muted-foreground">6 days</p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">15% OFF</span>
                    </button>
                    <button
                      onClick={() => {
                        setPreset({ passage: "6-Day Bareboat Charter Master St. Martin (15% Introductory Discount)", date: "Mar 8-13, 2026", pkg: "standard" });
                        setDialogOpen(true);
                      }}
                      className="flex w-full items-center justify-between rounded-lg border-2 border-[#061625]/10 p-3 text-left transition-all hover:border-[#e89d79] hover:bg-[#e89d79]/5"
                    >
                      <div>
                        <p className="font-bold text-[#061625]">Mar 8 - 13</p>
                        <p className="text-sm text-muted-foreground">6 days</p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">15% OFF</span>
                    </button>
                    <button
                      onClick={() => {
                        setPreset({ passage: "6-Day Bareboat Charter Master St. Martin (15% Introductory Discount)", date: "Mar 15-20, 2026", pkg: "standard" });
                        setDialogOpen(true);
                      }}
                      className="flex w-full items-center justify-between rounded-lg border-2 border-[#061625]/10 p-3 text-left transition-all hover:border-[#e89d79] hover:bg-[#e89d79]/5"
                    >
                      <div>
                        <p className="font-bold text-[#061625]">Mar 15 - 20</p>
                        <p className="text-sm text-muted-foreground">6 days</p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">15% OFF</span>
                    </button>
                    <button
                      onClick={() => {
                        setPreset({ passage: "6-Day Bareboat Charter Master St. Martin (15% Introductory Discount)", date: "Mar 22-27, 2026", pkg: "standard" });
                        setDialogOpen(true);
                      }}
                      className="flex w-full items-center justify-between rounded-lg border-2 border-[#061625]/10 p-3 text-left transition-all hover:border-[#e89d79] hover:bg-[#e89d79]/5"
                    >
                      <div>
                        <p className="font-bold text-[#061625]">Mar 22 - 27</p>
                        <p className="text-sm text-muted-foreground">6 days</p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">15% OFF</span>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* April */}
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-bold text-[#061625]">April 2026</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setPreset({ passage: "6-Day Bareboat Charter Master St. Martin", date: "Apr 5-10, 2026", pkg: "standard" });
                        setDialogOpen(true);
                      }}
                      className="flex w-full items-center justify-between rounded-lg border-2 border-[#061625]/10 p-3 text-left transition-all hover:border-[#e89d79] hover:bg-[#e89d79]/5"
                    >
                      <div>
                        <p className="font-bold text-[#061625]">Apr 5 - 10</p>
                        <p className="text-sm text-muted-foreground">6 days</p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Available</span>
                    </button>
                    <button
                      onClick={() => {
                        setPreset({ passage: "6-Day Bareboat Charter Master St. Martin", date: "Apr 12-17, 2026", pkg: "standard" });
                        setDialogOpen(true);
                      }}
                      className="flex w-full items-center justify-between rounded-lg border-2 border-[#061625]/10 p-3 text-left transition-all hover:border-[#e89d79] hover:bg-[#e89d79]/5"
                    >
                      <div>
                        <p className="font-bold text-[#061625]">Apr 12 - 17</p>
                        <p className="text-sm text-muted-foreground">6 days</p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Available</span>
                    </button>
                    <button
                      onClick={() => {
                        setPreset({ passage: "6-Day Bareboat Charter Master St. Martin", date: "Apr 19-24, 2026", pkg: "standard" });
                        setDialogOpen(true);
                      }}
                      className="flex w-full items-center justify-between rounded-lg border-2 border-[#061625]/10 p-3 text-left transition-all hover:border-[#e89d79] hover:bg-[#e89d79]/5"
                    >
                      <div>
                        <p className="font-bold text-[#061625]">Apr 19 - 24</p>
                        <p className="text-sm text-muted-foreground">6 days</p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Available</span>
                    </button>
                    <button
                      onClick={() => {
                        setPreset({ passage: "6-Day Bareboat Charter Master St. Martin", date: "Apr 26 - May 1, 2026", pkg: "standard" });
                        setDialogOpen(true);
                      }}
                      className="flex w-full items-center justify-between rounded-lg border-2 border-[#061625]/10 p-3 text-left transition-all hover:border-[#e89d79] hover:bg-[#e89d79]/5"
                    >
                      <div>
                        <p className="font-bold text-[#061625]">Apr 26 - May 1</p>
                        <p className="text-sm text-muted-foreground">6 days</p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Available</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <p className="mb-4 text-muted-foreground">Need a different date? Contact us to arrange a custom schedule.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link href="/training/nauticed-prerequisites">View NauticEd Prerequisites</Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="tel:+17862460809">
                    <Phone className="mr-2 h-4 w-4" />
                    Call to Discuss
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing with Discount */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-[#061625] md:text-5xl">Program Pricing</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">All-inclusive training with professional instruction</p>
          </div>

          {/* Discount Banner - Shared */}
          <div className="mx-auto mb-8 max-w-5xl rounded-lg bg-green-100 p-4 text-center">
            <p className="text-lg font-bold text-green-800">15% Introductory Discount on All Packages</p>
            <p className="text-sm text-green-700">Book any course starting before April 2026</p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
            {/* Standard Package */}
            <Card className="border-2 border-[#061625]/20 shadow-lg">
              <CardContent className="p-8">
                <div className="mb-6 text-center">
                  <p className="text-sm font-bold uppercase tracking-wide text-[#061625]">Standard Bareboat Charter Master</p>
                  <div className="mt-2 flex items-center justify-center gap-3">
                    <span className="text-2xl text-muted-foreground line-through">$4,500</span>
                    <span className="text-4xl font-bold text-[#061625]">$3,825</span>
                  </div>
                  <p className="text-muted-foreground">per person</p>
                  <p className="mt-1 text-sm font-medium text-green-600">Save $675 before April 2026</p>
                </div>

                <div className="mb-6">
                  <h4 className="mb-3 font-bold text-[#061625]">Standard Inclusions</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />Shared double cabin accommodation</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />Max 4:1 instructor-to-student ratio</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />6 nights accommodation aboard</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />All meals and provisions</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />NauticEd authorized instructor</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />NauticEd SLC + SLC assessment</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />Fuel and marina fees</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />Training materials and logbook</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="mb-3 font-bold text-[#061625]">Not Included</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Flights to/from St. Martin (SXM)</li>
                    <li>• Required NauticEd online theory courses</li>
                    <li>• Meals ashore</li>
                    <li>• Personal travel insurance</li>
                  </ul>
                </div>

                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setPreset({ passage: "6-Day Bareboat Charter Master St. Martin - Standard Package", pkg: "standard" });
                    setDialogOpen(true);
                  }}
                >
                  Reserve Standard - Save 15%
                </Button>
              </CardContent>
            </Card>

            {/* VIP Package */}
            <Card className="relative border-2 border-[#e89d79] shadow-xl">
              {/* VIP Badge */}
              <div className="absolute -right-3 -top-3 rounded-full bg-[#e89d79] px-4 py-1.5 text-sm font-bold text-[#061625] shadow-lg">
                VIP
              </div>
              <CardContent className="p-8">
                <div className="mb-6 text-center">
                  <p className="text-sm font-bold uppercase tracking-wide text-[#e89d79]">VIP Bareboat Charter Master Experience</p>
                  <div className="mt-2 flex items-center justify-center gap-3">
                    <span className="text-2xl text-muted-foreground line-through">$12,000</span>
                    <span className="text-4xl font-bold text-[#061625]">$10,200</span>
                  </div>
                  <p className="text-muted-foreground">per cabin</p>
                  <p className="mt-1 text-sm font-medium text-green-600">Save $1,800 before April 2026</p>
                </div>

                <div className="mb-6">
                  <h4 className="mb-3 font-bold text-[#e89d79]">VIP Inclusions</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />2 people sharing owner&apos;s version cabin</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />Max 3:1 instructor-to-student ratio</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="mb-3 font-bold text-[#061625]">All Standard Inclusions</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />6 nights accommodation aboard</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />All meals and provisions</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />Professional NauticEd approved instructor</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />SLC assessment fee</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />Fuel and marina fees</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />Training materials</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#e89d79]" />Logbook sign-off</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="mb-3 font-bold text-[#061625]">Not Included</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Flights to/from St. Martin (SXM)</li>
                    <li>• Required NauticEd online theory courses</li>
                    <li>• Meals ashore</li>
                    <li>• Personal travel insurance</li>
                  </ul>
                </div>

                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setPreset({ passage: "6-Day Bareboat Charter Master St. Martin - VIP Experience", pkg: "vip" });
                    setDialogOpen(true);
                  }}
                >
                  Reserve VIP - Save 15%
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SLC & ICC Boating License Section */}
      <section className="bg-gradient-to-br from-[#2e4b5c] to-[#1a2f3a] py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#47c0d5]/20 px-4 py-2">
                  <Globe className="h-5 w-5 text-[#47c0d5]" />
                  <span className="text-sm font-bold text-[#47c0d5]">International License</span>
                </div>
                <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">SLC & ICC Boating License</h2>
                <p className="mb-6 text-lg text-white/80">
                  The Sailing License and Credentials (SLC) and SLC (Sailing License and Credentials) are
                  internationally accepted licenses for chartering recreational sail and power yachts in European waters
                  and beyond.
                </p>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 className="h-5 w-5 text-[#47c0d5]" />
                    <span>Accepted in Mediterranean, Seychelles, Thailand & more</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 className="h-5 w-5 text-[#47c0d5]" />
                    <span>Required by many charter companies worldwide</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 className="h-5 w-5 text-[#47c0d5]" />
                    <span>Complete online theory + practical with VIYB in St. Martin</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 className="h-5 w-5 text-[#47c0d5]" />
                    <span>Lifetime validity with experience logging</span>
                  </li>
                </ul>
                <div className="flex flex-wrap gap-4">
                  <Button asChild className="bg-[#47c0d5] text-[#2e4b5c] hover:bg-[#5dd0e5]">
                    <Link href="/training/nauticed/slc-license">
                      Get Your License
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                    <a href="#contact">Ask Us How It Works</a>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="relative h-80 overflow-hidden rounded-xl shadow-2xl lg:h-96">
                  <Image
                    src="https://ugc.same-assets.com/zuTdSz4xy8lrhCOuCvpy3hxumXxqkx3u.webp"
                    alt="NauticEd SLC Certificate on tablet"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 rounded-lg bg-white p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2e4b5c]">
                      <Award className="h-6 w-6 text-[#47c0d5]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#2e4b5c]">Trusted Worldwide</p>
                      <p className="text-xs text-muted-foreground">30+ Countries</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-[#061625] md:text-5xl">Learn More About Catamaran Certification</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Explore our guides to sailing certification, charter requirements, and training destinations</p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            <Link href="/training/articles/catamaran-charter-certification-europe" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79] group-hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e89d79]/10 px-3 py-1">
                    <Globe className="h-4 w-4 text-[#e89d79]" />
                    <span className="text-xs font-medium text-[#e89d79]">Certification Guide</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-[#061625] group-hover:text-[#e89d79]">How to Get Certified to Charter a Catamaran in Europe</h3>
                  <p className="text-sm text-muted-foreground">Complete guide to SLC certification requirements for Mediterranean, Croatia, Greece, and beyond.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/training/articles/why-st-martin-catamaran-training" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79] group-hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e89d79]/10 px-3 py-1">
                    <MapPin className="h-4 w-4 text-[#e89d79]" />
                    <span className="text-xs font-medium text-[#e89d79]">Destination Guide</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-[#061625] group-hover:text-[#e89d79]">Why St Martin Is Ideal for Advanced Catamaran Training</h3>
                  <p className="text-sm text-muted-foreground">Trade winds, multi-island passages, and international waters for charter-ready skills.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/training/articles/nauticed-vs-rya-certification" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79] group-hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e89d79]/10 px-3 py-1">
                    <Award className="h-4 w-4 text-[#e89d79]" />
                    <span className="text-xs font-medium text-[#e89d79]">Certification Comparison</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-[#061625] group-hover:text-[#e89d79]">NauticEd vs RYA for Catamaran Charter Certification</h3>
                  <p className="text-sm text-muted-foreground">Compare NauticEd SLC and RYA certifications. Which is right for your charter goals?</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/training/articles/skipper-certification-requirements" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79] group-hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e89d79]/10 px-3 py-1">
                    <Ship className="h-4 w-4 text-[#e89d79]" />
                    <span className="text-xs font-medium text-[#e89d79]">Charter Guide</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-[#061625] group-hover:text-[#e89d79]">What Charter Companies Look for in Skipper Certification</h3>
                  <p className="text-sm text-muted-foreground">Understand exactly what credentials charter companies require before approving bareboat charters.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Related Programs Navigation */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="mb-6 text-2xl font-bold text-[#061625]">Explore More Training Options</h3>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <Link href="/training" className="text-[#e89d79] hover:underline">All Training Programs</Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/training/day-skipper" className="text-[#e89d79] hover:underline">BVI Sailing Courses</Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/training/offshore-passages" className="text-[#e89d79] hover:underline">Caribbean Offshore Passages</Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/bali" className="text-[#e89d79] hover:underline">Train on Bali Catamarans</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="bg-[#061625] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Questions About the St. Martin Program?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
            Contact us to discuss dates, NauticEd prerequisites, or custom training options
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/training">View All Programs</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#061625]" asChild>
              <a href="tel:+17862460809">
                <Phone className="mr-2 h-4 w-4" />
                Call Us Direct
              </a>
            </Button>
          </div>
        </div>
      </section>

      <EnquiryDialog open={dialogOpen} onClose={() => setDialogOpen(false)} preset={preset} />

      <Footer />
    </div>
  );
}
