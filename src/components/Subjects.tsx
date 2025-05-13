
import { Calculator, Code, FlaskRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/utils/scrollAnimation";
import { motion } from "framer-motion";

const Subjects = () => {
  const animationRef = useScrollAnimation();

  const subjects = [
    {
      icon: <Code className="h-16 w-16 text-[#3E64FF]" />,
      name: "Coding",
      description: "Learn programming languages, web development, data structures, algorithms, and more.",
      topics: ["Python", "JavaScript", "Java", "Web Dev", "Data Science"]
    },
    {
      icon: <Calculator className="h-16 w-16 text-[#3E64FF]" />,
      name: "Mathematics",
      description: "Master concepts in algebra, calculus, statistics, geometry, and other math disciplines.",
      topics: ["Algebra", "Calculus", "Statistics", "Geometry", "Trigonometry"]
    },
    {
      icon: <FlaskRound className="h-16 w-16 text-[#3E64FF]" />,
      name: "Science",
      description: "Explore physics, chemistry, biology, and other scientific fields with expert guidance.",
      topics: ["Physics", "Chemistry", "Biology", "Earth Science", "Astronomy"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="subjects" className="py-20 md:py-28 bg-[#F9FAFC] section-container" ref={animationRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-4">Our Subjects</h2>
          <div className="w-24 h-1 bg-[#3E64FF] mx-auto mb-6"></div>
          <p className="mt-4 text-lg text-[#2E2E2E] max-w-2xl mx-auto">
            Get expert tutoring in these key subject areas from verified coaches.
          </p>
        </div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {subjects.map((subject, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="overflow-hidden rounded-2xl border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] h-full bg-white">
                <CardContent className="p-8 flex flex-col items-center text-center h-full">
                  <div className="p-4 bg-[#F0F4FF] rounded-full mb-6">
                    {subject.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-[#2E2E2E] mb-4">{subject.name}</h3>
                  <p className="text-[#2E2E2E] mb-6 flex-grow">{subject.description}</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-auto pt-4">
                    {subject.topics.map((topic, i) => (
                      <span 
                        key={i}
                        className="px-4 py-1.5 bg-[#F0F4FF] text-[#3E64FF] rounded-full text-sm font-medium border border-[#D6E0FF]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Subjects;
