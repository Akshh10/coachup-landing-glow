
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Subjects from "@/components/Subjects";
import WhyChooseUs from "@/components/WhyChooseUs";
import BecomeCoach from "@/components/BecomeCoach";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Subjects />
      <WhyChooseUs />
      <BecomeCoach />
      <Footer />
    </div>
  );
};

export default Index;
