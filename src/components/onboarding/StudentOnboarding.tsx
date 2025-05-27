
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the multi-select component
const MultiSelect = ({ options, value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (option) => {
    if (!value.includes(option)) {
      onChange([...value, option]);
    }
    setInputValue('');
     setIsOpen(false);
  };
  
  const handleRemove = (option) => {
    onChange(value.filter(item => item !== option));
  };
  
  const filteredOptions = options.filter(option => 
    !value.includes(option) && 
    option.toLowerCase().includes(inputValue.toLowerCase())
  );
  
  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background">
        {value.map(item => (
          <div key={item} className="flex items-center bg-[#E6EFFF] text-[#3E64FF] rounded-full px-3 py-1 text-sm">
            {item}
            <button
              type="button"
              onClick={() => handleRemove(item)}
              className="ml-2 text-[#3E64FF] hover:text-red-500"
            >
              ×
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-grow border-none outline-none bg-transparent p-1 text-sm"
        />
      </div>
      
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map(option => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className="p-2 hover:bg-[#F0F4FF] cursor-pointer text-sm"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Define the multi-step form schema
const learningInterestsSchema = z.object({
  learningType: z.string().min(1, "Please select your learning type"),
  skills: z.array(z.string()).optional(),
  learningGoal: z.string().optional(),
  experienceLevel: z.string().optional(),
  grade: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  curriculum: z.array(z.string()).optional(),
  preferredMode: z.string().min(1, "Please select your preferred learning mode"),
});

const scheduleSchema = z.object({
  availability: z.string().min(1, "Please select your availability"),
  useCase: z.string().optional(),
});

const photoSchema = z.object({
  imageUrl: z.string().optional(),
});

// Sample data for dropdowns
const skillOptions = [
  "Python", "JavaScript", "React", "Data Science", "Machine Learning", "Web Development",
  "Public Speaking", "Digital Marketing", "SEO", "Content Creation", "Graphic Design", 
  "UI/UX Design", "Figma", "Adobe Photoshop", "Adobe Illustrator", "Adobe Premiere Pro",
  "Microsoft Excel", "Microsoft PowerPoint", "Microsoft Word", "Mathematics", "Physics",
  "Chemistry", "Biology", "English Literature", "Essay Writing", "Business Management",
  "Accounting", "Finance", "Economics", "Statistics", "Guitar", "Piano", "Singing",
  "Photography", "Video Editing", "3D Modeling", "Game Development", "iOS Development",
  "Android Development", "Flutter", "React Native"
];

const gradeOptions = [
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"
];

const subjectOptions = [
  "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", 
  "History", "Geography", "Social Studies", "English", "Literature", 
  "Economics", "Business Studies", "Accounting", "Political Science"
];

const curriculumOptions = [
  "CBSE", "ICSE", "State Board", "IB", "Cambridge/IGCSE", "AP", "Other"
];

const StudentOnboarding = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    learningType: "",
    skills: [],
    learningGoal: "",
    experienceLevel: "",
    grade: "",
    subjects: [],
    curriculum: [],
    preferredMode: "",
    availability: "",
    useCase: "",
    imageUrl: "",
  });
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typingText, setTypingText] = useState({ current: '', target: '', index: 0 });

  // Initialize typing animation for sample text
  React.useEffect(() => {
    const sampleGoal = "I want to land a junior developer role by learning React and modern web development practices.";
    
    setTypingText({ current: '', target: sampleGoal, index: 0 });
    
    const typingInterval = setInterval(() => {
      setTypingText(prev => {
        if (prev.index >= prev.target.length) {
          clearInterval(typingInterval);
          return prev;
        }
        
        return {
          ...prev,
          current: prev.target.substring(0, prev.index + 1),
          index: prev.index + 1
        };
      });
    }, 50);
    
    return () => clearInterval(typingInterval);
  }, []);

  // Form setup for each step
  const learningInterestsForm = useForm<z.infer<typeof learningInterestsSchema>>({
    resolver: zodResolver(learningInterestsSchema),
    defaultValues: {
      learningType: formData.learningType,
      skills: formData.skills,
      learningGoal: formData.learningGoal,
      experienceLevel: formData.experienceLevel,
      grade: formData.grade,
      subjects: formData.subjects,
      curriculum: formData.curriculum,
      preferredMode: formData.preferredMode,
    },
  });

  const scheduleForm = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      availability: formData.availability,
      useCase: formData.useCase,
    },
  });

  const photoForm = useForm<z.infer<typeof photoSchema>>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      imageUrl: formData.imageUrl,
    },
  });

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  // Handle form submission for each step
  const handleLearningInterestsSubmit = (values: z.infer<typeof learningInterestsSchema>) => {
    setFormData({ ...formData, ...values });
    setStep(2);
  };

  const handleScheduleSubmit = (values: z.infer<typeof scheduleSchema>) => {
    setFormData({ ...formData, ...values });
    setStep(3);
  };

  const handlePhotoSubmit = async () => {
    setIsSubmitting(true);

    try {
      let imageUrl = "";
      
      // Upload photo if available
      if (uploadedPhoto && user) {
        const fileExt = uploadedPhoto.name.split('.').pop();
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('student-photos')
          .upload(fileName, uploadedPhoto);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data } = supabase.storage
          .from('student-photos')
          .getPublicUrl(fileName);
          
        imageUrl = data.publicUrl;
      }
      
      let preferredSubjects = [];
      
      // Handle different data based on learning type
      if (formData.learningType === 'skills') {
        preferredSubjects = formData.skills;
      } else if (formData.learningType === 'academics') {
        preferredSubjects = formData.subjects;
      }
      console.log("Inserting with ID:", user?.id);

      const { error } = await supabase
      
      .from('student_profiles')
      .upsert([{
        id: user?.id,
        preferred_subjects: preferredSubjects,
        grade_level: formData.grade || null,
        learning_goals: formData.learningGoal || null,
        profile_picture_url: imageUrl || null,
        onboarding_completed: true
      }]);
    

      if (error) {
        throw error;
      }

      // Update the main profile photo as well
      if (imageUrl) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            profile_picture_url: imageUrl
          })
          .eq('id', user?.id);
          
        if (profileError) {
          console.error('Error updating profile picture:', profileError);
        }
      }

      toast({
        title: "Profile setup complete!",
        description: "Your student profile has been created successfully.",
      });

      // Redirect to student dashboard
      navigate('/student-dashboard');
    } catch (error) {
      console.error('Error saving student profile:', error);
      toast({
        title: "Something went wrong",
        description: "Unable to complete your profile setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress bar calculation
  const progressPercentage = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-[#e6f3ff] to-[#f8faff] flex flex-col">
      <header className="w-full py-6 px-6 md:px-10">
        <div className="text-2xl font-bold text-[#3E64FF]">UpSkill</div>
      </header>
      
      <div className="container mx-auto flex-1 flex flex-col items-center justify-center px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Complete Your Student Profile</h1>
            <p className="text-gray-600">Tell us about your learning preferences to connect with the perfect tutors</p>
          </div>
          
          {/* Progress bar */}
          <div className="relative mb-10">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-2 rounded-full bg-[#3E64FF]"
              />
            </div>
            <div className="flex justify-between mt-2">
              <div className={`flex flex-col items-center ${step >= 1 ? "text-[#3E64FF]" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-[#3E64FF] text-white" : "bg-gray-200"}`}>
                  {step > 1 ? <Check className="h-5 w-5" /> : "1"}
                </div>
                <span className="text-xs mt-1">Interests</span>
              </div>
              <div className={`flex flex-col items-center ${step >= 2 ? "text-[#3E64FF]" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-[#3E64FF] text-white" : "bg-gray-200"}`}>
                  {step > 2 ? <Check className="h-5 w-5" /> : "2"}
                </div>
                <span className="text-xs mt-1">Schedule</span>
              </div>
              <div className={`flex flex-col items-center ${step >= 3 ? "text-[#3E64FF]" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-[#3E64FF] text-white" : "bg-gray-200"}`}>
                  3
                </div>
                <span className="text-xs mt-1">Photo</span>
              </div>
            </div>
          </div>

          {/* Step 1: Learning Interests */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Learning Interests</h2>
                  <Form {...learningInterestsForm}>
                    <form onSubmit={learningInterestsForm.handleSubmit(handleLearningInterestsSubmit)} className="space-y-4">
                      <FormField
                        control={learningInterestsForm.control}
                        name="learningType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What would you like to learn?</FormLabel>
                            <FormControl>
                              <Tabs
                                defaultValue={field.value || "skills"}
                                className="w-full"
                                onValueChange={(value) => {
                                  field.onChange(value);
                                }}
                              >
                                <TabsList className="grid w-full grid-cols-2">
                                  <TabsTrigger value="skills">Skills & Career</TabsTrigger>
                                  <TabsTrigger value="academics">Academic Subjects</TabsTrigger>
                                </TabsList>
                                <TabsContent value="skills" className="mt-4 space-y-4">
                                  <FormField
                                    control={learningInterestsForm.control}
                                    name="skills"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>What skills do you want to learn?</FormLabel>
                                        <FormControl>
                                          <MultiSelect
                                            options={skillOptions}
                                            value={field.value || []}
                                            onChange={field.onChange}
                                            placeholder="Select skills you want to learn"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={learningInterestsForm.control}
                                    name="experienceLevel"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Experience Level</FormLabel>
                                        <FormControl>
                                          <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            {...field}
                                          >
                                            <option value="">Select your experience level</option>
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                          </select>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={learningInterestsForm.control}
                                    name="learningGoal"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>What's your main learning goal?</FormLabel>
                                        <div className="mb-2 text-sm text-gray-500 italic">
                                          Example: <span className="text-gray-700">{typingText.current}<span className="animate-pulse">|</span></span>
                                        </div>
                                        <FormControl>
                                          <Input 
                                            placeholder="E.g., Career advancement, mastering a new skill, etc." 
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TabsContent>
                                
                                <TabsContent value="academics" className="mt-4 space-y-4">
                                  <FormField
                                    control={learningInterestsForm.control}
                                    name="grade"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Which grade are you in?</FormLabel>
                                        <FormControl>
                                          <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            {...field}
                                          >
                                            <option value="">Select your grade</option>
                                            {gradeOptions.map(grade => (
                                              <option key={grade} value={grade}>{grade}</option>
                                            ))}
                                          </select>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={learningInterestsForm.control}
                                    name="subjects"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Which subjects do you need help with?</FormLabel>
                                        <FormControl>
                                          <MultiSelect
                                            options={subjectOptions}
                                            value={field.value || []}
                                            onChange={field.onChange}
                                            placeholder="Select subjects"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={learningInterestsForm.control}
                                    name="curriculum"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Which curriculum do you follow?</FormLabel>
                                        <FormControl>
                                          <MultiSelect
                                            options={curriculumOptions}
                                            value={field.value || []}
                                            onChange={field.onChange}
                                            placeholder="Select curriculum"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TabsContent>
                              </Tabs>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={learningInterestsForm.control}
                        name="preferredMode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Learning Mode</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                <option value="">Select learning mode</option>
                                <option value="online">Online</option>
                                <option value="one-on-one">1-on-1</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full bg-[#3E64FF] hover:bg-[#2D4FD6] text-white transition-all duration-300 hover:shadow-[0_0_12px_rgba(62,100,255,0.6)]"
                      >
                        Continue
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Schedule & Preferences */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Schedule & Preferences</h2>
                  <Form {...scheduleForm}>
                    <form onSubmit={scheduleForm.handleSubmit(handleScheduleSubmit)} className="space-y-4">
                      <FormField
                        control={scheduleForm.control}
                        name="availability"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>When are you available?</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Weekday evenings, weekend mornings, etc." 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={scheduleForm.control}
                        name="useCase"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <span>Use Case (Optional)</span>
                            </FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                <option value="">Select your use case</option>
                                <option value="career_growth">Career Growth</option>
                                <option value="school_prep">School Preparation</option>
                                <option value="hobby">Personal Interest/Hobby</option>
                                <option value="exam_prep">Exam Preparation</option>
                                <option value="professional_cert">Professional Certification</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between pt-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setStep(1)}
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-[#3E64FF] hover:bg-[#2D4FD6] text-white transition-all duration-300 hover:shadow-[0_0_12px_rgba(62,100,255,0.6)]"
                        >
                          Continue
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Optional Photo Upload */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Profile Photo (Optional)</h2>
                  
                  <div className="text-center mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg mb-4">
                      <p className="text-[#3E64FF]">
                        <strong>Tip:</strong> Adding a photo helps tutors connect better with you!
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      {photoPreview ? (
                        <div className="flex flex-col items-center">
                          <img 
                            src={photoPreview} 
                            alt="Profile preview" 
                            className="w-40 h-40 rounded-full object-cover border-4 border-[#3E64FF] mb-4" 
                          />
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                              setPhotoPreview(null);
                              setUploadedPhoto(null);
                            }}
                          >
                            Remove Photo
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <Upload className="h-12 w-12 text-gray-400" />
                          </div>
                          <label className="cursor-pointer">
                            <span className="bg-[#3E64FF] text-white px-4 py-2 rounded-md hover:bg-[#2D4FD6] transition-colors inline-block">
                              Upload Photo
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      className="bg-[#3E64FF] hover:bg-[#2D4FD6] text-white transition-all duration-300 hover:shadow-[0_0_12px_rgba(62,100,255,0.6)]"
                      onClick={handlePhotoSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating Profile..." : "Complete Profile"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentOnboarding;
