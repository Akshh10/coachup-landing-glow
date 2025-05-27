
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Search, BookOpen, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface WelcomeSectionProps {
  studentName: string;
  upcomingSessions: number;
  completedSessions: number;
  gradeLevel: string;
  preferredSubjects: string[];
  learningGoals: string[];
  onAddGoal: (goal: string) => void;
  onAddSubject: (subject: string) => void;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  studentName,
  upcomingSessions,
  completedSessions,
  gradeLevel,
  preferredSubjects,
  learningGoals,
  onAddGoal,
  onAddSubject
}) => {
  const [newGoal, setNewGoal] = useState("");
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);

  const currentTime = new Date();
  const hour = currentTime.getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 18) greeting = "Good afternoon";
  else if (hour >= 18) greeting = "Good evening";

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-[#3E64FF]/80 to-[#32D296]/80 text-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{greeting}, {studentName}!</h1>
              <p className="mb-6 opacity-90">
                Welcome back to your personalized learning journey.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    <h3 className="font-medium">Upcoming Sessions</h3>
                  </div>
                  <p className="text-3xl font-bold mt-2">{upcomingSessions}</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    <h3 className="font-medium">Completed Sessions</h3>
                  </div>
                  <p className="text-3xl font-bold mt-2">{completedSessions}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-0 md:ml-6 md:text-right">
              <Button className="bg-white text-[#3E64FF] hover:bg-white/90 transition-all duration-300 hover:shadow-[0_0_12px_rgba(255,255,255,0.5)] mb-3 group">
                <Search className="mr-2 h-4 w-4" />
                <span>Find a Tutor</span>
                <ArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" size={16} />
              </Button>
              <p className="text-sm opacity-90">
                Need help with a specific subject?<br />
                Our tutors are ready to assist you.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="h-full">
          <Card className="h-full transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-[#3E64FF]" />
                <span>Your Learning Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningGoals.length > 0 ? learningGoals.map((goal, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 p-4 rounded-lg border border-blue-100"
                  >
                    <h4 className="font-medium text-blue-800 mb-1">{goal}</h4>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500">No goals added yet.</p>
                )}
                <Dialog open={goalModalOpen} onOpenChange={setGoalModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full border-dashed">
                      <span className="text-gray-500">Add New Learning Goal</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Learning Goal</DialogTitle>
                    </DialogHeader>
                    <Input
                      placeholder="e.g. Master Algebra"
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                    />
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          if (newGoal.trim()) {
                            onAddGoal(newGoal.trim());
                            setNewGoal("");
                            setGoalModalOpen(false);
                          }
                        }}
                      >
                        Add
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="h-full">
          <Card className="h-full transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-[#3E64FF]" />
                <span>Grade Level & Subjects</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Current Grade</div>
                    <div className="text-sm text-gray-600">{gradeLevel}</div>
                  </div>
                  <Link to="/profile/edit">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Link>
                </div>

                <div className="p-3">
                  <h4 className="font-medium mb-2">Your Subjects</h4>
                  <div className="flex flex-wrap gap-2">
                    {preferredSubjects.length > 0 ? preferredSubjects.map((subject, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{subject}</span>
                    )) : (
                      <p className="text-sm text-gray-500">No subjects added yet.</p>
                    )}
                    <Dialog open={subjectModalOpen} onOpenChange={setSubjectModalOpen}>
                      <DialogTrigger asChild>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center cursor-pointer">
                          <span>Add</span><span className="ml-1">+</span>
                        </span>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Skill or Subject</DialogTitle>
                        </DialogHeader>
                        <Input
                          placeholder="e.g. Chemistry"
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                        />
                        <DialogFooter>
                          <Button
                            onClick={() => {
                              if (newSubject.trim()) {
                                onAddSubject(newSubject.trim());
                                setNewSubject("");
                                setSubjectModalOpen(false);
                              }
                            }}
                          >
                            Add
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeSection;
