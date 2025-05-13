
import { Calculator, Code, FlaskRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Subjects = () => {
  const subjects = [
    {
      icon: <Code className="h-12 w-12 text-blue-500" />,
      name: "Coding",
      description: "Learn programming languages, web development, data structures, algorithms, and more.",
      topics: ["Python", "JavaScript", "Java", "Web Dev", "Data Science"]
    },
    {
      icon: <Calculator className="h-12 w-12 text-blue-500" />,
      name: "Mathematics",
      description: "Master concepts in algebra, calculus, statistics, geometry, and other math disciplines.",
      topics: ["Algebra", "Calculus", "Statistics", "Geometry", "Trigonometry"]
    },
    {
      icon: <FlaskRound className="h-12 w-12 text-blue-500" />,
      name: "Science",
      description: "Explore physics, chemistry, biology, and other scientific fields with expert guidance.",
      topics: ["Physics", "Chemistry", "Biology", "Earth Science", "Astronomy"]
    }
  ];

  return (
    <section id="subjects" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Subjects</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Get expert tutoring in these key subject areas from verified coaches.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {subjects.map((subject, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6">{subject.icon}</div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">{subject.name}</h3>
                  <p className="text-gray-600 mb-6">{subject.description}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {subject.topics.map((topic, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Subjects;
