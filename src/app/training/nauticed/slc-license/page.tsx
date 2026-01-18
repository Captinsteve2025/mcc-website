"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Mail, Phone, ArrowRight, Globe, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
// MCC Brand Colors
export default function SLCLicensePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-end justify-center overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://ugc.same-assets.com/WDsL9bhNshN4nvwScjcDQQxg6p1qRPft.webp"
            alt="SLC International License Training"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061625]/95 via-[#061625]/70 to-[#061625]/40" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center text-white">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#e89d79]/20 px-6 py-2 backdrop-blur-sm">
            <Globe className="h-5 w-5 text-[#e89d79]" />
            <span className="text-sm font-bold uppercase tracking-wide text-[#e89d79]">International Boating License</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            SLC & ICC License
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed md:text-xl text-white/90">
            The internationally recognized Sailing License and Credentials (SLC) and ICC.
            Charter yachts in the Mediterranean, Caribbean, and worldwide.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-[#e89d79] text-[#061625] hover:bg-[#d88a66]" size="lg" asChild>
              <a href="#enquire">Get Your License</a>
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
              <p className="text-3xl font-bold text-[#e89d79]">30+</p>
              <p className="text-sm text-white/80">Countries Accept</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#e89d79]">Lifetime</p>
              <p className="text-sm text-white/80">Validity</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#e89d79]">Sail + Power</p>
              <p className="text-sm text-white/80">Endorsements</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#e89d79]">Charter</p>
              <p className="text-sm text-white/80">Company Accepted</p>
            </div>
          </div>
        </div>
      </section>
      {/* What is SLC */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-center text-4xl font-bold text-[#061625]">What is the SLC License?</h2>
            <p className="mb-8 text-center text-lg text-muted-foreground">
              The Sailing License and Credentials (SLC) is an internationally recognized boating license
              that proves your competence to charter yachts in countries that require a license.
            </p>
            <div className="grid gap-6 md:grid-cols-2 mb-12">
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-bold text-[#061625]">Where You Can Charter</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-[#e89d79]" />
                      <span>Greece</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-[#e89d79]" />
                      <span>Croatia</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-[#e89d79]" />
                      <span>Italy</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-[#e89d79]" />
                      <span>France</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-[#e89d79]" />
                      <span>Spain</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-[#e89d79]" />
                      <span>Turkey</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-[#e89d79]" />
                      <span>Thailand</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-[#e89d79]" />
                      <span>Seychelles</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-[#e89d79]" />
                      <span>Caribbean</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-[#e89d79]" />
                      <span>+ 20 more</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#061625]/10">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-bold text-[#061625]">License Features</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Physical card + digital version</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Lifetime validity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Both sail and power endorsements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>QR code verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e89d79]" />
                      <span>Linked to digital logbook</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* How to Get It */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-[#061625]">How to Get Your SLC</h2>
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#061625] text-2xl font-bold text-white">1</div>
                <h3 className="mb-2 text-xl font-bold text-[#061625]">Complete Online Courses</h3>
                <p className="text-muted-foreground">
                  Finish required NauticEd theory courses including navigation, safety, and seamanship.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#061625] text-2xl font-bold text-white">2</div>
                <h3 className="mb-2 text-xl font-bold text-[#061625]">Practical Training with MCC</h3>
                <p className="text-muted-foreground">
                  Complete on-water practical assessment in the BVI aboard a Bali catamaran.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#061625] text-2xl font-bold text-white">3</div>
                <h3 className="mb-2 text-xl font-bold text-[#061625]">Receive Your License</h3>
                <p className="text-muted-foreground">
                  Get your physical SLC card and digital license, ready for worldwide chartering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* SLC vs ICC */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-4xl font-bold text-[#061625]">SLC vs ICC: What's the Difference?</h2>
            <div className="overflow-hidden rounded-xl border">
              <table className="w-full">
                <thead className="bg-[#061625] text-white">
                  <tr>
                    <th className="p-4 text-left">Feature</th>
                    <th className="p-4 text-center">SLC</th>
                    <th className="p-4 text-center">ICC</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="bg-white">
                    <td className="p-4 font-medium">Recognition</td>
                    <td className="p-4 text-center">International</td>
                    <td className="p-4 text-center">International</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="p-4 font-medium">Validity</td>
                    <td className="p-4 text-center">Lifetime</td>
                    <td className="p-4 text-center">5 years</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-4 font-medium">Digital Version</td>
                    <td className="p-4 text-center text-[#e89d79]">Yes</td>
                    <td className="p-4 text-center">Yes</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="p-4 font-medium">Experience Logging</td>
                    <td className="p-4 text-center text-[#e89d79]">Included</td>
                    <td className="p-4 text-center">Separate</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-4 font-medium">Mediterranean Accepted</td>
                    <td className="p-4 text-center text-[#e89d79]">Yes</td>
                    <td className="p-4 text-center text-[#e89d79]">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Through MCC, you can obtain SLC and renew every 3 years with an online exam.
            </p>
          </div>
        </div>
      </section>
      {/* Enquiry Form */}
      <section id="enquire" className="bg-gradient-to-br from-[#061625] to-[#0a2540] py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-white">Get Your International License</h2>
              <p className="text-lg text-white/80">
                Request more information about the SLC/SLC license and practical training dates.
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
                    <label className="mb-2 block text-sm font-medium text-[#061625]">Where Do You Want to Charter?</label>
                    <input type="text" placeholder="e.g., Mediterranean, Caribbean, Thailand" className="flex h-11 w-full rounded-[10px] border border-input bg-background px-4 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#061625]">Current Sailing Experience</label>
                    <select className="flex h-11 w-full rounded-[10px] border border-input bg-background px-4 py-2 text-sm">
                      <option value="">Select your experience level</option>
                      <option value="beginner">Beginner - Learning to sail</option>
                      <option value="some">Some experience - Can crew</option>
                      <option value="intermediate">Intermediate - Can skipper</option>
                      <option value="experienced">Experienced - Regular sailor</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#061625]">Message</label>
                    <textarea rows={4} placeholder="Tell us about your charter plans..." className="flex w-full rounded-[10px] border border-input bg-background px-4 py-3 text-sm" />
                  </div>
                  <input type="hidden" name="certification" value="slc-license" />
                  <Button className="w-full bg-[#e89d79] text-[#061625] hover:bg-[#d88a66]" size="lg">
                    Request License Info
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
      {/* Related Certifications */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#061625]">Related Certifications</h2>
          <p className="mb-8 text-center text-muted-foreground">
            Complete these certifications to qualify for your SLC license:
          </p>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <Link href="/training/nauticed/skipper-large-powerboat" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79] group-hover:shadow-lg">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-bold text-[#061625] group-hover:text-[#e89d79]">Skipper Large Powerboat</h3>
                  <p className="text-sm text-muted-foreground">Foundation for SLC eligibility</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/training/nauticed/bareboat-charter-master" className="group">
              <Card className="h-full border-2 border-[#e89d79] shadow-lg">
                <CardContent className="p-6">
                  <span className="mb-2 inline-block rounded bg-[#e89d79]/10 px-2 py-1 text-xs font-bold text-[#e89d79]">Recommended</span>
                  <h3 className="mb-2 font-bold text-[#061625]">Bareboat Charter Master</h3>
                  <p className="text-sm text-muted-foreground">Complete SLC qualification</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/training/nauticed/captain-rank" className="group">
              <Card className="h-full border-2 border-[#061625]/10 transition-all group-hover:border-[#e89d79] group-hover:shadow-lg">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-bold text-[#061625] group-hover:text-[#e89d79]">Captain Rank</h3>
                  <p className="text-sm text-muted-foreground">Highest certification level</p>
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
              <Link href="/bali" className="text-[#e89d79] hover:underline">Train on Bali Catamarans</Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
