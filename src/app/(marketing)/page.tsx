import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";

export default function Page() {
  return (
    <div>
      <Hero />
      <div className="mx-auto max-w-6xl px-6">
        <Features />
      </div>
      <Footer />
    </div>
  );
}
