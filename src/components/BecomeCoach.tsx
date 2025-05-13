
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const BecomeCoach = () => {
  return (
    <section className="py-16 md:py-24 bg-blue-500 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center md:justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold">Become a Founding Coach</h2>
            <p className="mt-4 text-lg text-blue-50 max-w-lg">
              Join our growing platform of educators. Set your own rates, create your schedule, and help students achieve their academic goals.
            </p>
            <ul className="mt-6 space-y-2">
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-200 mr-2"></div>
                <span>Keep 85% of what you earn</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-200 mr-2"></div>
                <span>Access our growing student network</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-200 mr-2"></div>
                <span>Use our integrated teaching tools</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-200 mr-2"></div>
                <span>Early access to platform features</span>
              </li>
            </ul>
          </div>
          <div className="md:w-1/3 bg-white text-gray-900 p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Apply Now</h3>
            <p className="text-gray-600 mb-6">
              Limited spots available for founding coaches. Get early access and priority placement.
            </p>
            <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">
              Apply as a Coach <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeCoach;
