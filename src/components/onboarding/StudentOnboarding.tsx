
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

// Define the multi-step form schema
const learningInterestsSchema = z.object({
  skills: z.string().min(1, "Please enter at least one skill you want to learn"),
  level: z.string().min(1, "Please select your desired learning level"),
  goal: z.string().min(5, "Please briefly describe your learning goal"),
  preferredMode: z.string().min(1, "Please select your preferred learning mode"),
});

const scheduleSchema = z.object({
  availability: z.string().min(1, "Please select your availability"),
  coachStyle: z.string().min(1, "Please select your preferred coaching style"),
  useCase: z.string().optional(),
});

const photoSchema = z.object({
  photoUrl: z.string().optional(),
});

const StudentOnboarding = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    skills: "",
    level: "",
    goal: "",
    preferredMode: "",
    availability: "",
    coachStyle: "",
    useCase: "",
    photoUrl: "",
  });
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup for each step
  const learningInterestsForm = useForm<z.infer<typeof learningInterestsSchema>>({
    resolver: zodResolver(learningInterestsSchema),
    defaultValues: {
      skills: formData.skills,
      level: formData.level,
      goal: formData.goal,
      preferredMode: formData.preferredMode,
    },
  });

  const scheduleForm = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      availability: formData.availability,
      coachStyle: formData.coachStyle,
      useCase: formData.useCase,
    },
  });

  const photoForm = useForm<z.infer<typeof photoSchema>>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      photoUrl: formData.photoUrl,
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
      let photoUrl = "";
      
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
          
        photoUrl = data.publicUrl;
      }
      
      // Save all student profile data
      const { error } = await supabase
        .from('student_profiles')
        .update({
          learning_interests: formData.skills.split(',').map(item => item.trim()),
          level: formData.level,
          learning_goal: formData.goal,
          preferred_mode: formData.preferredMode,
          availability: formData.availability.split(',').map(item => item.trim()),
          preferred_coach_style: formData.coachStyle.split(',').map(item => item.trim()),
          use_case: formData.useCase || null,
          photo_url: photoUrl || null,
          onboarding_completed: true
        })
        .eq('id', user?.id);

      if (error) {
        throw error;
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
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What skills do you want to learn?</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Python, SEO, Public Speaking, etc. (comma separated)" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={learningInterestsForm.control}
                        name="level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Level</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                <option value="">Select your level</option>
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
                        name="goal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What's your main learning goal?</FormLabel>
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
                                <option value="group">Group</option>
                                <option value="hybrid">Hybrid</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full bg-[#3E64FF] hover:bg-[#2D4FD6] text-white mt-4"
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
                                placeholder="Weekday evenings, weekend mornings, etc. (comma separated)" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={scheduleForm.control}
                        name="coachStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Coach Style</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Friendly, Structured, Fast-paced, etc. (comma separated)" 
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
                          className="bg-[#3E64FF] hover:bg-[#2D4FD6] text-white"
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
                      className="bg-[#3E64FF] hover:bg-[#2D4FD6] text-white"
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
