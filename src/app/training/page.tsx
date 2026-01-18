"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, CheckCircle2, GraduationCap, Mail, Phone, Ship, Users, Target, ArrowRight, Globe, BookOpen, Laptop, BadgeCheck, Navigation } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useScrollDepthTracking } from "@/hooks/useScrollDepthTracking";
import { BreadcrumbSchema } from "@/components/StructuredData";

// MCC Brand Colors
const coral = "#e89d79";
const navy = "#061625";

export default function TrainingPage() {
  useScrollDepthTracking();

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "Course",
        name: "Bareboat Charter Master Practical – British Virgin Islands",
        description: "US Coast Guard approved Bareboat Charter Master training aboard a Bali catamaran with SLC assessment.",
        provider: { "@type": "Organization", name: "My Caribbean Charters" },
        url: "https://mycaribbeancharters.com/training/day-skipper",
      },
      {
        "@type": "Course",
        name: "Bareboat Charter Master Practical – St. Martin",
        description: "6-day intensive liveaboard program aligned with NauticEd SLC standards in St. Martin, Anguilla, and St. Barts.",
        provider: { "@type": "Organization", name: "My Caribbean Charters" },
        url: "https://mycaribbeancharters.com/training/day-skipper-st-martin",
      },
      {
        "@type": "Course",
        name: "Caribbean Offshore Passage Training – 10-Day",
        description: "Mile-building passages with night watches and multi-country clearances across the Eastern Caribbean.",
        provider: { "@type": "Organization", name: "My Caribbean Charters" },
        url: "https://mycaribbeancharters.com/training/offshore-passages",
      },
      {
        "@type": "Course",
        name: "Catamaran Owner Transition – Charter Ownership Onboarding",
        description: "Structured owner training covering vessel systems, operations, and commercial handover.",
        provider: { "@type": "Organization", name: "My Caribbean Charters" },
        url: "https://mycaribbeancharters.com/training/owner-program",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What sailing certifications do I need to charter a yacht in the Caribbean?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To charter a bareboat yacht in the Caribbean, you typically need an SLC (Sailing License and Credentials) or equivalent certification like the NauticEd Bareboat Charter Master. Most charter companies in the BVI and Caribbean require proof of sailing experience and a recognized certification."
        }
      },
      {
        "@type": "Question",
        "name": "How long does it take to get a sailing certification?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our Bareboat Charter Master practical courses run 6-7 days and include all the hands-on training needed for certification. You can complete online theory beforehand through NauticEd."
        }
      },
      {
        "@type": "Question",
        "name": "What type of boats are used for training?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We train on modern catamarans, which are the same vessels used in charter fleets throughout the Caribbean. Training on a catamaran gives you practical experience with the boat type you&apos;re most likely to charter."
        }
      },
    ]
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://mycaribbeancharters.com" },
        { name: "Training", url: "https://mycaribbeancharters.com/training" },
      ]} />

      <Header />

      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] items-end justify-center overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://ugc.same-assets.com/MquMMbulR6Zl3izgPgpjIi7LUUbQ2MSO.jpeg"
            alt="Catamaran sailing in Caribbean waters"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-0" style={{ background: `linear-gradient(to top, ${navy}cc, ${navy}4d, ${navy}1a)` }} />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center text-white">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-6 py-2 backdrop-blur-sm" style={{ backgroundColor: `${coral}33` }}>
            <Ship className="h-5 w-5" style={{ color: coral }} />
            <span className="text-sm font-bold uppercase tracking-wide" style={{ color: coral }}>Caribbean Sailing Training</span>
          </div>
          <h1 className="mb-6 font-display text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Caribbean Sailing
            <br />
            <span style={{ color: coral }}>Training & Certification</span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed md:text-2xl">
            Professional sailing programs aboard modern catamarans. From Bareboat Charter Master certification
            to offshore passages — build confidence for your Caribbean adventures.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="gold" size="lg" asChild>
              <a href="#programs">Explore Programs</a>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#061625]" asChild>
              <a href="#nauticed">View Certifications</a>
            </Button>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-4">
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold" style={{ color: coral }}>4</p>
              <p className="text-sm text-white/80">Training Programs</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold" style={{ color: coral }}>6-20</p>
              <p className="text-sm text-white/80">Days Duration</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold" style={{ color: coral }}>500+</p>
              <p className="text-sm text-white/80">Miles Available</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold" style={{ color: coral }}>SLC</p>
              <p className="text-sm text-white/80">Certification</p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 font-display text-4xl font-bold md:text-5xl" style={{ color: navy }}>Train in the Caribbean</h2>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              Whether you&apos;re seeking your first sailing qualification, looking to log offshore miles,
              or transitioning into yacht ownership — our programs deliver hands-on experience aboard
              modern catamarans in stunning Caribbean waters.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              All programs align with <strong>US Coast Guard approved American National Standards</strong> and offer practical, real-world
              training that prepares you for confident, independent sailing. We partner with
              <strong> NauticEd</strong> for internationally recognized online certifications and the SLC license.
            </p>
          </div>
        </div>
      </section>

      {/* Who Would Benefit */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold md:text-5xl" style={{ color: navy }}>Who Would Benefit from Training</h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              Our courses are designed for sailors who want to take their skills to the next level
            </p>
          </div>

          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-8">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: `${coral}1a` }}>
                    <Target className="h-7 w-7" style={{ color: coral }} />
                  </div>
                  <h3 className="mb-4 text-xl font-bold" style={{ color: navy }}>Sailors Looking to Improve Key Skills</h3>
                  <p className="mb-4 text-muted-foreground">
                    Perfect for experienced sailors who want to refine essential cruising competencies:
                  </p>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {["Docking & maneuvering", "Boat handling under power & sail", "Passage planning", "Customs procedures", "Provisioning for cruising", "Offshore sailing techniques", "On-board safety", "Heavy weather sailing"].map((skill) => (
                      <li key={skill} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: coral }} />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2" style={{ borderColor: coral, backgroundColor: `${coral}08` }}>
                <CardContent className="p-8">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: `${coral}33` }}>
                    <Globe className="h-7 w-7" style={{ color: coral }} />
                  </div>
                  <h3 className="mb-4 text-xl font-bold" style={{ color: navy }}>Sailors Planning to Charter Internationally</h3>
                  <p className="mb-4 text-muted-foreground">
                    If you&apos;re planning to charter a yacht in the Mediterranean or other destinations that require a sailing license:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: coral }} />
                      <span><strong>NauticEd SLC</strong> — Sailing License and Credentials accepted worldwide</span>
                    </li>
                    <li className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: coral }} />
                      <span><strong>US Coast Guard approved</strong> — Training aligned with American National Standards</span>
                    </li>
                    <li className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: coral }} />
                      <span><strong>Practical experience</strong> — Real-world sailing in Caribbean conditions</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Button variant="gold" asChild>
                      <Link href="/training/nauticed/slc-license">
                        Learn About the SLC License
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Train With Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold md:text-5xl" style={{ color: navy }}>Why Train With Us</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Professional instruction on premium vessels in ideal sailing conditions</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Ship, title: "Modern Catamarans", desc: "Train on the latest catamaran designs with innovative layouts and advanced systems." },
              { icon: Navigation, title: "Caribbean Waters", desc: "Perfect trade wind conditions in the British Virgin Islands and Eastern Caribbean." },
              { icon: Award, title: "US Coast Guard Approved", desc: "Curriculum follows US Coast Guard approved American National Standards with SLC certification." },
              { icon: Users, title: "Small Groups", desc: "Maximum 6 participants ensures hands-on time at helm, navigation, and all crew roles." },
              { icon: GraduationCap, title: "Experienced Instructors", desc: "Qualified skippers with extensive Caribbean and offshore experience." },
              { icon: Target, title: "Charter Pathway", desc: "Programs designed for sailors preparing for bareboat charter or yacht ownership." },
            ].map((item) => (
              <Card key={item.title} className="border-2 border-[#061625]/10 transition-all hover:shadow-lg" style={{ borderColor: "transparent" }}>
                <CardContent className="p-8">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: `${coral}1a` }}>
                    <item.icon className="h-7 w-7" style={{ color: coral }} />
                  </div>
                  <h3 className="mb-3 text-xl font-bold" style={{ color: navy }}>{item.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section id="programs" className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold md:text-5xl" style={{ color: navy }}>Our Training Programs</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Choose the program that matches your experience level and goals</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {/* Bareboat Charter Master BVI */}
            <Card className="flex flex-col overflow-hidden border-2 border-[#061625]/10 transition-all hover:shadow-xl">
              <div className="relative h-56 bg-[#061625]">
                <Image
                  src="https://ugc.same-assets.com/iUzbgjXUyFGYsN4vHDg0P_JeA_eM_PuP.jpeg"
                  alt="Catamaran for Bareboat Charter Master Training in BVI"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061625]/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="rounded-full px-3 py-1 text-xs font-bold uppercase" style={{ backgroundColor: coral, color: navy }}>7 Days</span>
                </div>
              </div>
              <CardContent className="flex flex-1 flex-col p-6">
                <h3 className="mb-2 text-2xl font-bold" style={{ color: navy }}>Bareboat Charter Master</h3>
                <p className="mb-4 text-sm text-muted-foreground">British Virgin Islands</p>
                <p className="mb-6 flex-1 leading-relaxed text-muted-foreground">
                  Comprehensive 7-day program covering all Bareboat Charter Master practical requirements
                  plus SLC assessment. Ideal for sailors ready to skipper independently.
                </p>
                <div className="mb-6 space-y-2">
                  {["Bareboat Charter Master certification", "SLC assessment included", "Close-quarters boat handling", "Navigation and pilotage"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" style={{ color: coral }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <Button variant="gold" className="w-full" asChild>
                  <Link href="/training/day-skipper">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* St. Martin Program */}
            <Card className="flex flex-col overflow-hidden border-2 shadow-xl" style={{ borderColor: "#22c55e" }}>
              <div className="px-4 py-2 text-center text-sm font-bold uppercase text-white" style={{ backgroundColor: "#22c55e" }}>15% OFF - Book Before April 2026</div>
              <div className="relative h-56 bg-[#061625]">
                <Image
                  src="https://ugc.same-assets.com/MquMMbulR6Zl3izgPgpjIi7LUUbQ2MSO.jpeg"
                  alt="Catamaran Training in St. Martin"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061625]/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="rounded-full px-3 py-1 text-xs font-bold uppercase" style={{ backgroundColor: coral, color: navy }}>6 Days</span>
                </div>
              </div>
              <CardContent className="flex flex-1 flex-col p-6">
                <h3 className="mb-2 text-2xl font-bold" style={{ color: navy }}>Charter Master St. Martin</h3>
                <p className="mb-4 text-sm text-muted-foreground">St. Martin, St. Barts, Anguilla</p>
                <p className="mb-6 flex-1 leading-relaxed text-muted-foreground">
                  Intensive 6-day liveaboard program aligned with NauticEd SLC standards.
                  Multi-island passages with offshore sailing experience.
                </p>
                <div className="mb-6 space-y-2">
                  {["NauticEd SLC assessment", "Multi-island offshore passages", "4:1 student-instructor ratio", "Skipper rotation command"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" style={{ color: coral }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <Button variant="gold" className="w-full" asChild>
                  <Link href="/training/day-skipper-st-martin">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Offshore Passages */}
            <Card className="flex flex-col overflow-hidden border-2 shadow-xl" style={{ borderColor: coral }}>
              <div className="px-4 py-2 text-center text-sm font-bold uppercase" style={{ backgroundColor: coral, color: navy }}>Most Popular</div>
              <div className="relative h-56 bg-[#061625]">
                <Image
                  src="https://ugc.same-assets.com/MquMMbulR6Zl3izgPgpjIi7LUUbQ2MSO.jpeg"
                  alt="Offshore Passage Training"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061625]/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="rounded-full px-3 py-1 text-xs font-bold uppercase" style={{ backgroundColor: coral, color: navy }}>10 Days</span>
                </div>
              </div>
              <CardContent className="flex flex-1 flex-col p-6">
                <h3 className="mb-2 text-2xl font-bold" style={{ color: navy }}>Offshore Passages</h3>
                <p className="mb-4 text-sm text-muted-foreground">St. Martin to Grenada</p>
                <p className="mb-6 flex-1 leading-relaxed text-muted-foreground">
                  10-day voyages through the Eastern Caribbean. Build offshore confidence
                  with night watches and multi-day passages.
                </p>
                <div className="mb-6 space-y-2">
                  {["300-350 NM per leg logged", "Night watches and offshore sailing", "8+ islands visited", "Multi-country clearances"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" style={{ color: coral }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <Button variant="gold" className="w-full" asChild>
                  <Link href="/training/offshore-passages">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Owner Transition */}
            <Card className="flex flex-col overflow-hidden border-2 border-[#061625]/10 transition-all hover:shadow-xl">
              <div className="relative h-56 bg-[#061625]">
                <Image
                  src="https://ugc.same-assets.com/-fSMVCzIkSwwX_cPFoal3aOWGAgnywHk.webp"
                  alt="Owner Transition Training"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061625]/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="rounded-full px-3 py-1 text-xs font-bold uppercase" style={{ backgroundColor: coral, color: navy }}>7-10 Days</span>
                </div>
              </div>
              <CardContent className="flex flex-1 flex-col p-6">
                <h3 className="mb-2 text-2xl font-bold" style={{ color: navy }}>Owner Transition</h3>
                <p className="mb-4 text-sm text-muted-foreground">BVI Base</p>
                <p className="mb-6 flex-1 leading-relaxed text-muted-foreground">
                  Comprehensive onboarding for new yacht owners. Combines skipper training
                  with vessel systems and operations.
                </p>
                <div className="mb-6 space-y-2">
                  {["Vessel systems mastery", "Charter operations training", "Financial & legal briefing", "Optional SLC assessment"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" style={{ color: coral }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <Button variant="gold" className="w-full" asChild>
                  <Link href="/training/owner-program">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* NauticEd Partnership */}
      <section id="nauticed" className="py-20" style={{ background: `linear-gradient(135deg, ${navy} 0%, #0a2436 100%)` }}>
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-2">
              <Globe className="h-5 w-5" style={{ color: coral }} />
              <span className="text-sm font-bold uppercase tracking-wide" style={{ color: coral }}>Official Training Partner</span>
            </div>
            <h2 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl">NauticEd Certification</h2>
            <p className="mx-auto max-w-3xl text-lg text-white/80">
              As an official NauticEd training partner, we offer the complete pathway to internationally recognized
              sailing certifications. Complete online theory, then join us for hands-on practical assessment.
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Laptop, title: "Learn Online", desc: "30+ multimedia courses from beginner to advanced, study at your own pace" },
              { icon: Ship, title: "Train With Us", desc: "Complete your practical assessment with experienced instructors in the BVI" },
              { icon: BadgeCheck, title: "Get Certified", desc: "Earn your SLC license, accepted internationally for bareboat chartering" },
              { icon: BookOpen, title: "Track Progress", desc: "Digital logbook and sailing resume that builds automatically" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-white/5 p-6 text-center backdrop-blur-sm">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: `${coral}33` }}>
                  <item.icon className="h-7 w-7" style={{ color: coral }} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{item.title}</h3>
                <p className="text-sm text-white/70">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Certification Cards */}
          <div className="mb-12">
            <h3 className="mb-8 text-center text-2xl font-bold text-white">Certification Pathways</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Catamaran Sailing Confidence", desc: "Master catamaran handling, docking & maneuvering", features: ["6 hours online", "Lagoon endorsed"], href: "/training/nauticed/catamaran-sailing-confidence", featured: false },
                { title: "Skipper Large Powerboat", desc: "For powerboats 27ft+. Master large vessel command", features: ["20 hours online", "Docking & maneuvering"], href: "/training/nauticed/skipper-large-powerboat", featured: false },
                { title: "Bareboat Charter Master", desc: "Complete certification for independent bareboat chartering", features: ["SLC license eligible", "Charter accepted"], href: "/training/nauticed/bareboat-charter-master", featured: true },
                { title: "Offshore Captain Rank", desc: "The highest NauticEd rank for professional competence", features: ["Offshore passages", "Advanced systems"], href: "/training/nauticed/captain-rank", featured: false },
              ].map((cert) => (
                <Card key={cert.title} className={`overflow-hidden border-0 bg-white/10 backdrop-blur-sm transition-all hover:bg-white/15 ${cert.featured ? "border-2" : ""}`} style={cert.featured ? { borderColor: coral } : {}}>
                  {cert.featured && <div className="px-3 py-1 text-center text-xs font-bold uppercase" style={{ backgroundColor: coral, color: navy }}>Most Popular</div>}
                  <CardContent className="p-5">
                    <h4 className="mb-2 text-lg font-bold text-white">{cert.title}</h4>
                    <p className="mb-4 text-sm text-white/70">{cert.desc}</p>
                    <div className="mb-4 space-y-1">
                      {cert.features.map((f) => (
                        <div key={f} className="flex items-center gap-2 text-xs text-white/60">
                          <CheckCircle2 className="h-3 w-3" style={{ color: coral }} />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant={cert.featured ? "gold" : "outline"} size="sm" className={cert.featured ? "w-full" : "w-full border-white/30 text-white hover:bg-white/10"} asChild>
                      <Link href={cert.href}>Learn More <ArrowRight className="ml-2 h-3 w-3" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* SLC Highlight */}
          <div className="rounded-2xl bg-white/5 p-8 backdrop-blur-sm md:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2" style={{ backgroundColor: `${coral}33` }}>
                  <Globe className="h-5 w-5" style={{ color: coral }} />
                  <span className="text-sm font-bold" style={{ color: coral }}>International License</span>
                </div>
                <h3 className="mb-4 text-3xl font-bold text-white">SLC Boating License</h3>
                <p className="mb-6 text-lg text-white/80">
                  The Sailing License and Credentials (SLC) is internationally accepted for chartering
                  recreational yachts in European waters and beyond.
                </p>
                <ul className="mb-8 space-y-3">
                  {[
                    "Accepted in Mediterranean, Seychelles, Thailand & more",
                    "Required by many charter companies worldwide",
                    "Complete online theory + practical in the Caribbean",
                    "Lifetime validity with experience logging"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/80">
                      <CheckCircle2 className="h-5 w-5" style={{ color: coral }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-4">
                  <Button variant="gold" asChild>
                    <Link href="/training/nauticed/slc-license">
                      Get Your License <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                    <a href="#contact">Ask Us How It Works</a>
                  </Button>
                </div>
              </div>
              <div className="relative h-80 overflow-hidden rounded-xl shadow-2xl lg:h-96">
                <Image
                  src="https://ugc.same-assets.com/WDsL9bhNshN4nvwScjcDQQxg6p1qRPft.webp"
                  alt="Catamaran for SLC License Training"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-display text-4xl font-bold md:text-5xl" style={{ color: navy }}>Get in Touch</h2>
              <p className="text-lg text-muted-foreground">Request more information about our training programs</p>
            </div>
            <Card className="border-2 border-[#061625]/10">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium" style={{ color: navy }}>First Name</label>
                      <input type="text" placeholder="John" className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium" style={{ color: navy }}>Last Name</label>
                      <input type="text" placeholder="Smith" className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm" />
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium" style={{ color: navy }}>Email</label>
                      <input type="email" placeholder="john@example.com" className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium" style={{ color: navy }}>Phone</label>
                      <input type="tel" placeholder="+1 (555) 123-4567" className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium" style={{ color: navy }}>Program Interest</label>
                    <select className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm">
                      <option value="">Select a program</option>
                      <option value="day-skipper-bvi">7-Day Bareboat Charter Master (BVI)</option>
                      <option value="day-skipper-st-martin">6-Day Charter Master (St. Martin)</option>
                      <option value="offshore">10-Day Offshore Passages</option>
                      <option value="owner">Owner Transition Program</option>
                      <option value="nauticed-slc">SLC International License</option>
                      <option value="custom">Custom Training / Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium" style={{ color: navy }}>Message</label>
                    <textarea rows={4} placeholder="Tell us about your sailing experience and goals..." className="flex w-full rounded-lg border border-input bg-background px-4 py-3 text-sm" />
                  </div>
                  <Button variant="gold" size="lg" className="w-full">Submit Enquiry</Button>
                </form>
              </CardContent>
            </Card>
            <div className="mt-8 text-center">
              <p className="mb-2 text-muted-foreground">Or contact us directly:</p>
              <div className="flex flex-wrap justify-center gap-6">
                <a href="tel:+17865201558" className="flex items-center gap-2 hover:opacity-80" style={{ color: navy }}>
                  <Phone className="h-5 w-5" style={{ color: coral }} />+1 (786) 520-1558
                </a>
                <a href="mailto:training@mycaribbeancharters.com" className="flex items-center gap-2 hover:opacity-80" style={{ color: navy }}>
                  <Mail className="h-5 w-5" style={{ color: coral }} />training@mycaribbeancharters.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
