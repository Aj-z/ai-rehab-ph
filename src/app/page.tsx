import React from "react";
import NavBar from "../components/NavBar";
import HeroText from "../components/HeroText";
import AuthCard from "../components/AuthCard";
import Features from "../components/Features";
import DashboardPreview from "../components/DashboardPreview";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function Page() {
  return (
    <main className="min-h-screen">
      <NavBar />
      <section className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <HeroText />
          <AuthCard />
        </div>
      </section>

      <Features />
      <DashboardPreview />
      <Testimonials />
      <Footer />
    </main>
  );
}
