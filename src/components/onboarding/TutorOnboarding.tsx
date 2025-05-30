
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
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Define multi-select components
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
const teachingDetailsSchema = z.object({
  languages: z.array(z.string()).min(1, { message: "Please select at least one language" }),
  certifications: z.array(z.string()).min(1, { message: "Please select at least one qualification" }),
  skills: z.array(z.string()).min(1, { message: "Please select at least one skill you can teach" }),
  experience: z.string().min(1, { message: "Please select your experience level" }),
  teachingMode: z.string().min(1, { message: "Please select your preferred teaching mode" }),
  hourlyRate: z.string().min(1, { message: "Please enter your hourly rate" }),
});

const bioSchema = z.object({
  bio: z.string().min(50, { message: "Please write at least 50 characters about your background and approach" }),
  studentTypes: z.array(z.string()).min(1, { message: "Please select at least one target student type" }),
});

const photoSchema = z.object({
  imageUrl: z.string().optional(),
});

// Sample data for dropdowns
const languages = [
  "English", "Spanish", "Mandarin", "Hindi", "French", "Arabic", "Bengali", "Russian", 
  "Portuguese", "Indonesian", "German", "Japanese", "Korean", "Vietnamese", "Tamil"
];

const certifications = [
  "PhD", "Master's Degree", "Bachelor's Degree", "Teaching Certificate", "Microsoft Certified", 
  "AWS Certified", "Google Certified", "Adobe Certified", "PMP", "CISSP", "CFA", 
  "Certified Teacher", "TEFL/TESOL", "CompTIA", "Cisco Certified"
];

const teachableSkills = [
  "Python", "JavaScript", "React", "Data Science", "Machine Learning", "Web Development",
  "Public Speaking", "Digital Marketing", "SEO", "Content Creation", "Graphic Design", 
  "UI/UX Design", "Figma", "Adobe Photoshop", "Adobe Illustrator", "Adobe Premiere Pro",
  "Microsoft Excel", "Microsoft PowerPoint", "Microsoft Word", "Mathematics", "Physics",
  "Chemistry", "Biology", "English Literature", "Essay Writing", "Business Management",
  "Accounting", "Finance", "Economics", "Statistics", "Guitar", "Piano", "Singing",
  "Photography", "Video Editing", "3D Modeling", "Game Development", "iOS Development",
  "Android Development", "Flutter", "React Native"
];

const studentTypes = [
  "K-12 Students", "College Undergraduates", "Graduate Students", "Career Changers",
  "Young Professionals", "Mid-Career Professionals", "Senior Executives", "Entrepreneurs",
  "Small Business Owners", "Hobbyists", "Retirees", "Kids (Ages 5-12)", "Teenagers",
  "Adults (18-30)", "Adults (30-50)", "Seniors (50+)", "Complete Beginners", "Intermediate Learners",
  "Advanced Practitioners", "Creative Professionals", "Technical Professionals", "Healthcare Workers",
  "Educators", "Remote Workers", "International Students", "English Language Learners",
  "Corporate Teams", "Non-Profit Organizations", "Government Employees"
];

const TutorOnboarding = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    languages: [],
    certifications: [],
    skills: [],
    experience: "",
    teachingMode: "",
    hourlyRate: "",
    bio: "",
    studentTypes: [],
    imageUrl: "",
  });
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typingText, setTypingText] = useState({ current: '', target: '', index: 0 });

  // Initialize typing animation for sample text
  React.useEffect(() => {
    const sampleBio = "I'm a passionate educator with over 5 years of experience teaching programming and data science. My teaching approach focuses on practical, hands-on learning with real-world examples.";
    
    setTypingText({ current: '', target: sampleBio, index: 0 });
    
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
  const teachingDetailsForm = useForm<z.infer<typeof teachingDetailsSchema>>({
    resolver: zodResolver(teachingDetailsSchema),
    defaultValues: {
      languages: formData.languages,
      certifications: formData.certifications,
      skills: formData.skills,
      experience: formData.experience,
      teachingMode: formData.teachingMode,
      hourlyRate: formData.hourlyRate,
    },
  });

  const bioForm = useForm<z.infer<typeof bioSchema>>({
    resolver: zodResolver(bioSchema),
    defaultValues: {
      bio: formData.bio,
      studentTypes: formData.studentTypes,
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
  const handleTeachingDetailsSubmit = (values: z.infer<typeof teachingDetailsSchema>) => {
    setFormData({ ...formData, ...values });
    setStep(2);
  };

  const handleBioSubmit = (values: z.infer<typeof bioSchema>) => {
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
          .from('tutor-photos')
          .upload(fileName, uploadedPhoto);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data } = supabase.storage
          .from('tutor-photos')
          .getPublicUrl(fileName);
          
        imageUrl = data.publicUrl;
      }
      
      // Save all tutor profile data
      const { error } = await supabase
  .from('tutor_profiles')
  .upsert([{
    id: user?.id,
    languages: formData.languages,
    certifications: formData.certifications,
    subjects: formData.skills,
    experience: formData.bio,
    teaching_mode: formData.teachingMode,
    hourly_rate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
    target_students: formData.studentTypes,
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
        description: "Your tutor profile has been created successfully.",
      });

      // Redirect to tutor dashboard
      navigate('/tutor-dashboard');
    } catch (error) {
      console.error('Error saving tutor profile:', error);
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
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Set Up Your Tutor Profile</h1>
            <p className="text-gray-600">Complete your profile to start teaching and connecting with students.</p>
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
                <span className="text-xs mt-1">Teaching</span>
              </div>
              <div className={`flex flex-col items-center ${step >= 2 ? "text-[#3E64FF]" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-[#3E64FF] text-white" : "bg-gray-200"}`}>
                  {step > 2 ? <Check className="h-5 w-5" /> : "2"}
                </div>
                <span className="text-xs mt-1">Bio</span>
              </div>
              <div className={`flex flex-col items-center ${step >= 3 ? "text-[#3E64FF]" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-[#3E64FF] text-white" : "bg-gray-200"}`}>
                  3
                </div>
                <span className="text-xs mt-1">Photo</span>
              </div>
            </div>
          </div>

          {/* Step 1: Teaching Details */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Teaching Details</h2>
                  <Form {...teachingDetailsForm}>
                    <form onSubmit={teachingDetailsForm.handleSubmit(handleTeachingDetailsSubmit)} className="space-y-4">
                      <FormField
                        control={teachingDetailsForm.control}
                        name="languages"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Languages Spoken</FormLabel>
                            <FormControl>
                              <MultiSelect 
                                options={languages}
                                value={field.value || []}
                                onChange={field.onChange}
                                placeholder="Select languages you speak"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={teachingDetailsForm.control}
                        name="certifications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Degrees or Certifications</FormLabel>
                            <FormControl>
                              <MultiSelect 
                                options={certifications}
                                value={field.value || []}
                                onChange={field.onChange}
                                placeholder="Select your certifications"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={teachingDetailsForm.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skills You Can Teach</FormLabel>
                            <FormControl>
                              <MultiSelect 
                                options={teachableSkills}
                                value={field.value || []}
                                onChange={field.onChange}
                                placeholder="Select skills you can teach"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={teachingDetailsForm.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Experience Level</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                <option value="">Select your experience level</option>
                                <option value="1-2">1-2 years</option>
                                <option value="3-5">3-5 years</option>
                                <option value="6-10">6-10 years</option>
                                <option value="11-20">11-20 years</option>
                                <option value="20+">20+ years</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={teachingDetailsForm.control}
                        name="teachingMode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Teaching Mode</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                <option value="">Select teaching mode</option>
                                <option value="online">Online</option>
                                <option value="one-on-one">1-on-1</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={teachingDetailsForm.control}
                        name="hourlyRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hourly Rate ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Enter your hourly rate" 
                                {...field} 
                              />
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

          {/* Step 2: Bio */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Bio & Student Type</h2>
                  <Form {...bioForm}>
                    <form onSubmit={bioForm.handleSubmit(handleBioSubmit)} className="space-y-4">
                      <FormField
                        control={bioForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>About You & Your Teaching Approach</FormLabel>
                            <div className="mb-2 text-sm text-gray-500 italic">
                              Sample: <span className="text-gray-700">{typingText.current}<span className="animate-pulse">|</span></span>
                            </div>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell students about your background, expertise, and teaching philosophy..." 
                                className="min-h-[200px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={bioForm.control}
                        name="studentTypes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Student Types</FormLabel>
                            <FormControl>
                              <MultiSelect
                                options={studentTypes}
                                value={field.value || []}
                                onChange={field.onChange}
                                placeholder="Select your target student types"
                              />
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

          {/* Step 3: Profile Photo Upload */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Profile Photo</h2>
                  
                  <div className="text-center mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg mb-4">
                      <p className="text-[#3E64FF]">
                        <strong>Tip:</strong> Tutors with photos are 2x more trusted by students!
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
                    
                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 mb-6">
                      <h4 className="font-medium mb-2">Photo Guidelines:</h4>
                      <ul className="list-disc list-inside text-left space-y-1">
                        <li>Use a front-facing, clear photo of yourself</li>
                        <li>Avoid group photos or distant shots</li>
                        <li>No watermarks or text overlays</li>
                        <li>Professional but approachable appearance</li>
                      </ul>
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

export default TutorOnboarding;
