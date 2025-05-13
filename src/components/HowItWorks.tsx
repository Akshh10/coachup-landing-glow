
import { ArrowRight, CheckCircle, Search, Calendar, Video } from "lucide-react";

const HowItWorks = () => {
  const studentSteps = [
    {
      icon: <Search className="h-8 w-8 text-blue-500" />,
      title: "Find Your Perfect Coach",
      description: "Browse profiles of verified coaches, read reviews, and filter by subject, price, and availability."
    },
    {
      icon: <Calendar className="h-8 w-8 text-blue-500" />,
      title: "Book a Session",
      description: "Schedule a session at a time that works for you. Pay securely through our platform."
    },
    {
      icon: <Video className="h-8 w-8 text-blue-500" />,
      title: "Learn and Grow",
      description: "Connect via our integrated virtual classroom with video, chat, and collaborative tools."
    }
  ];

  const coachSteps = [
    {
      icon: <CheckCircle className="h-8 w-8 text-blue-500" />,
      title: "Create Your Profile",
      description: "Set up your profile with your expertise, teaching style, rates, and availability."
    },
    {
      icon: <Calendar className="h-8 w-8 text-blue-500" />,
      title: "Accept Bookings",
      description: "Receive booking requests from students. Accept or propose alternative times."
    },
    {
      icon: <Video className="h-8 w-8 text-blue-500" />,
      title: "Teach and Earn",
      description: "Teach sessions through our platform and get paid automatically after each completed session."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform makes it simple to connect students with coaches for effective learning experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* For Students */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">For Students</h3>
            <div className="space-y-10">
              {studentSteps.map((step, index) => (
                <div key={`student-${index}`} className="flex items-start">
                  <div className="mr-6 flex-shrink-0">{step.icon}</div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{step.title}</h4>
                    <p className="mt-2 text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a href="#" className="inline-flex items-center text-blue-500 font-medium hover:underline">
                Find a tutor today <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>

          {/* For Coaches */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">For Coaches</h3>
            <div className="space-y-10">
              {coachSteps.map((step, index) => (
                <div key={`coach-${index}`} className="flex items-start">
                  <div className="mr-6 flex-shrink-0">{step.icon}</div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{step.title}</h4>
                    <p className="mt-2 text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a href="#" className="inline-flex items-center text-blue-500 font-medium hover:underline">
                Apply as a coach <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
