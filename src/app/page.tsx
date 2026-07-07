import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { About } from "@/components/sections/about";
import { Expertise } from "@/components/sections/expertise";
import { Highlights } from "@/components/sections/highlights";
import { Services } from "@/components/sections/services";
import { Facilities } from "@/components/sections/facilities";
import { Credentials } from "@/components/sections/credentials";
import { Location } from "@/components/sections/location";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { FloatingCta } from "@/components/sections/floating-cta";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <About />
        <Expertise />
        <Highlights />
        <Services />
        <Facilities />
        <Credentials />
        <Location />
        <Contact />
      </main>
      <Footer />
      <FloatingCta />
    </div>
  );
}
