
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Skills from "@/components/Skills";
import Blogs from "@/components/Blogs";
import BecomeCoach from "@/components/BecomeCoach";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Skills />
      <Blogs />
      <BecomeCoach />
      <Footer />
    </div>
  );
};

export default Index;
