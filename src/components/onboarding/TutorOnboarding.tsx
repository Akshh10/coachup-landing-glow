
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

// Define the multi-step form schema
const teachingDetailsSchema = z.object({
  languages: z.string().min(1, "Please enter at least one language"),
  certifications: z.string().min(1, "Please enter your qualifications"),
  skills: z.string().min(1, "Please enter at least one skill you can teach"),
  experience: z.string().min(1, "Please select your experience level"),
  teachingMode: z.string().min(1, "Please select your preferred teaching mode"),
  chargeModel: z.string().min(1, "Please select your charging model"),
  hourlyRate: z.string().optional(),
});

const bioSchema = z.object({
  bio: z.string().min(50, "Please write at least 50 characters about your background and approach"),
  teachingStyle: z.string().min(1, "Please select at least one teaching style"),
  studentTypes: z.string().min(1, "Please select your target student types"),
});

const photoSchema = z.object({
  photoUrl: z.string().optional(),
});

const TutorOnboarding = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    languages: "",
    certifications: "",
    skills: "",
    experience: "",
    teachingMode: "",
    chargeModel: "",
    hourlyRate: "",
    bio: "",
    teachingStyle: "",
    studentTypes: "",
    photoUrl: "",
  });
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup for each step
  const teachingDetailsForm = useForm<z.infer<typeof teachingDetailsSchema>>({
    resolver: zodResolver(teachingDetailsSchema),
    defaultValues: {
      languages: formData.languages,
      certifications: formData.certifications,
      skills: formData.skills,
      experience: formData.experience,
      teachingMode: formData.teachingMode,
      chargeModel: formData.chargeModel,
      hourlyRate: formData.hourlyRate,
    },
  });

  const bioForm = useForm<z.infer<typeof bioSchema>>({
    resolver: zodResolver(bioSchema),
    defaultValues: {
      bio: formData.bio,
      teachingStyle: formData.teachingStyle,
      studentTypes: formData.studentTypes,
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
      let photoUrl = "";
      
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
          
        photoUrl = data.publicUrl;
      }
      
      // Save all tutor profile data
      const { error } = await supabase
        .from('tutor_profiles')
        .update({
          languages: formData.languages.split(',').map(item => item.trim()),
          certifications: formData.certifications.split(',').map(item => item.trim()),
          skills: formData.skills.split(',').map(item => item.trim()),
          experience_years: formData.experience,
          teaching_mode: formData.teachingMode,
          charge_model: formData.chargeModel,
          hourly_rate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
          bio: formData.bio,
          teaching_style: formData.teachingStyle.split(',').map(item => item.trim()),
          target_students: formData.studentTypes.split(',').map(item => item.trim()),
          photo_url: photoUrl || null,
          onboarding_completed: true
        })
        .eq('id', user?.id);

      if (error) {
        throw error;
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
                              <Input 
                                placeholder="English, Spanish, etc. (comma separated)" 
                                {...field} 
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
                              <Input 
                                placeholder="MBA, PhD in Computer Science, etc." 
                                {...field} 
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
                              <Input 
                                placeholder="Python, Public Speaking, Figma, etc. (comma separated)" 
                                {...field} 
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
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                <option value="">Select teaching mode</option>
                                <option value="online">Online</option>
                                <option value="in-person">In-Person</option>
                                <option value="group">Group</option>
                                <option value="hybrid">Hybrid</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={teachingDetailsForm.control}
                        name="chargeModel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Charging Model</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                }}
                              >
                                <option value="">Select charging model</option>
                                <option value="hourly">Per Hour</option>
                                <option value="session">Per Session</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {teachingDetailsForm.watch("chargeModel") === "hourly" && (
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
                      )}

                      <Button 
                        type="submit" 
                        className="w-full bg-[#3E64FF] hover:bg-[#2D4FD6] text-white"
                      >
                        Continue
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Bio & Teaching Style */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Bio & Teaching Style</h2>
                  <Form {...bioForm}>
                    <form onSubmit={bioForm.handleSubmit(handleBioSubmit)} className="space-y-4">
                      <FormField
                        control={bioForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>About You & Your Teaching Approach</FormLabel>
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
                        name="teachingStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teaching Style</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Hands-on, Flexible, Structured, etc. (comma separated)" 
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
                              <Input 
                                placeholder="Teens, Adults, Job-seekers, etc. (comma separated)" 
                                {...field} 
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
                        <strong>Tip:</strong> Coaches with photos are 2x more trusted by students!
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

export default TutorOnboarding;
