
import { Shield, Clock, Award } from "lucide-react";

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: <Shield className="h-12 w-12 text-blue-500" />,
      title: "Trusted Experts",
      description: "All our coaches go through a rigorous verification process to ensure quality. We check credentials, experience, and conduct background checks."
    },
    {
      icon: <Award className="h-12 w-12 text-blue-500" />,
      title: "Verified Coaches",
      description: "Our platform features only qualified educators with proven teaching experience and subject matter expertise."
    },
    {
      icon: <Clock className="h-12 w-12 text-blue-500" />,
      title: "Flexible & Affordable",
      description: "Book sessions when it suits your schedule. Our coaches offer various price points to accommodate different budgets."
    }
  ];

  return (
    <section id="why-us" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose Us</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            CoachUp provides a quality learning experience with verified experts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6">{reason.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
