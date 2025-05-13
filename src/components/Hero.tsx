
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Find the Perfect Tutor for Coding, Math, or Science — 
              <span className="text-blue-500">Live and Online</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 md:pr-16">
              Get personalized 1-on-1 or small-group tutoring from expert coaches. 
              Learn at your own pace, achieve your academic goals, and build confidence.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button className="text-white bg-blue-500 hover:bg-blue-600 font-medium px-6 py-3 text-base rounded-md">
                Find a Tutor
              </Button>
              <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50 font-medium px-6 py-3 text-base rounded-md">
                Apply as a Coach
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-white rounded-xl shadow-xl p-6 md:ml-10">
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" 
                alt="Online learning session" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
