import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RouteRail, RouteRailMobile } from "@/components/rail/RouteRail";

import { Hero } from "@/components/sections/Hero";
import { Why } from "@/components/sections/Why";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Tracking } from "@/components/sections/Tracking";
import { Geofencing } from "@/components/sections/Geofencing";
import { Alerts } from "@/components/sections/Alerts";
import { Reports } from "@/components/sections/Reports";
import { Control } from "@/components/sections/Control";
import { Customer } from "@/components/sections/Customer";
import { Administration } from "@/components/sections/Administration";
import { Platform } from "@/components/sections/Platform";
import { Contact } from "@/components/sections/Contact";

export default function App() {
  return (
    <ThemeProvider>
      <SmoothScroll>
        <RouteRail />
        <RouteRailMobile />
        <Header />
        <main>
          <Hero />
          <Why />
          <HowItWorks />
          <Tracking />
          <Geofencing />
          <Alerts />
          <Reports />
          <Control />
          <Customer />
          <Administration />
          <Platform />
          <Contact />
        </main>
        <Footer />
      </SmoothScroll>
    </ThemeProvider>
  );
}
