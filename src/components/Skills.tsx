
import { Calculator, Code, FlaskRound, Book, Clock, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/utils/scrollAnimation";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Skills = () => {
  const animationRef = useScrollAnimation();

  const skills = [
    {
      icon: <Code className="h-16 w-16 text-[#3E64FF]" />,
      name: "Digital Skills",
      description: "Learn programming, web development, digital marketing, and other in-demand tech skills.",
      topics: ["Coding", "Web Dev", "UI/UX", "Digital Marketing", "Data Science"],
      tutors: 123
    },
    {
      icon: <Calculator className="h-16 w-16 text-[#3E64FF]" />,
      name: "Academic Excellence",
      description: "Master concepts in mathematics, languages, sciences, and other academic subjects.",
      topics: ["Mathematics", "Languages", "Sciences", "History", "Economics"],
      tutors: 215
    },
    {
      icon: <FlaskRound className="h-16 w-16 text-[#3E64FF]" />,
      name: "Creative Arts",
      description: "Explore music, design, writing, visual arts, and other creative disciplines.",
      topics: ["Music", "Design", "Writing", "Photography", "Fine Arts"],
      tutors: 92
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
    <section id="skills" className="py-20 md:py-28 bg-[#F9FAFC] section-container" ref={animationRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-4">Learning Skills</h2>
          <div className="w-24 h-1 bg-[#3E64FF] mx-auto mb-6"></div>
          <p className="mt-4 text-lg text-[#2E2E2E] max-w-2xl mx-auto">
            Explore in-demand skills and connect with expert tutors to fast-track your growth.
          </p>
        </div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {skills.map((skill, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="overflow-hidden rounded-2xl border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] h-full bg-white">
                <CardContent className="p-8 flex flex-col items-center text-center h-full">
                  <div className="p-4 bg-[#F0F4FF] rounded-full mb-6">
                    {skill.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-[#2E2E2E] mb-4">{skill.name}</h3>
                  <p className="text-[#2E2E2E] mb-6 flex-grow">{skill.description}</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {skill.topics.map((topic, i) => (
                      <span 
                        key={i}
                        className="px-4 py-1.5 bg-[#F0F4FF] text-[#3E64FF] rounded-full text-sm font-medium border border-[#D6E0FF]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                    <Check className="h-4 w-4 text-[#32D296]" />
                    <span>{skill.tutors} tutors available</span>
                  </div>
                  <Link to="/signup">
                    <Button className="w-full py-2 bg-[#3E64FF] hover:bg-[#2D4FD6] text-white transition-all duration-300 hover:shadow-lg group">
                      <span>Explore Tutors</span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
