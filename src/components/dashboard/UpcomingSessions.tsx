import React, { useEffect, useState } from "react";
import { Calendar, Clock, MessageSquare, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { Bookings } from "@/integrations/supabase/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Define a type that matches the structure returned by the Supabase select query
interface SessionWithProfiles {
  id: string;
  subject: string;
  start_time: string;
  end_time: string;
  status: string;
  note: string | null;
  room_url: string | null;
  student: {
    id: string;
    full_name: string | null;
    profile_picture_url: string | null;
    role: string | null;
  } | null;
  tutor: {
    id: string;
    full_name: string | null;
    profile_picture_url: string | null;
    role: string | null;
  } | null;
}

interface UpcomingSessionsProps {
  userType: 'student' | 'tutor';
}

const UpcomingSessions: React.FC<UpcomingSessionsProps> = ({ userType }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionWithProfiles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for modals
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionWithProfiles | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newStartTime, setNewStartTime] = useState<string>('');
  const [newEndTime, setNewEndTime] = useState<string>('');

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) {
        console.log('No user found');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('Fetching sessions for:', { userType, userId: user.id });

        // First, let's check if we can access the bookings table
        const { data: testData, error: testError } = await supabase
          .from('bookings')
          .select('id')
          .limit(1);

        console.log('Test query result:', { testData, testError });

        // Now fetch the actual sessions
        const query = supabase
          .from('bookings')
          .select(`
            id,
            subject,
            start_time,
            end_time,
            status,
            note,
            room_url,
            student:student_id (
              id,
              full_name,
              profile_picture_url,
              role
            ),
            tutor:tutor_id (
              id,
              full_name,
              profile_picture_url,
              role
            )
          `)
          .gte('start_time', new Date().toISOString())
          .in('status', ['pending', 'confirmed', 'reschedule_requested'])
          .order('start_time', { ascending: true });

        // Filter based on user type
        if (userType === 'student') {
          query.eq('student_id', user.id);
        } else {
          query.eq('tutor_id', user.id);
        }

        const { data, error } = await query;

        console.log('Query result:', { data, error });

        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }

        // Convert the data to match our interface structure
        const typedData = (data || []).map(session => {
          console.log('Processing session:', session); // Debug log
          return {
            ...session,
            student: Array.isArray(session.student) ? session.student[0] || null : session.student,
            tutor: Array.isArray(session.tutor) ? session.tutor[0] || null : session.tutor
          };
        }) as SessionWithProfiles[];

        console.log('Processed sessions:', typedData);
        setSessions(typedData);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError('Failed to load upcoming sessions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [user, userType]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    let retryCount = 0;
    const maxRetries = 3;

    const setupSubscription = async () => {
      try {
        // Subscribe to changes in the bookings table
        const subscription = supabase
          .channel('bookings_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'bookings',
              filter: userType === 'student' 
                ? `student_id=eq.${user.id}`
                : `tutor_id=eq.${user.id}`
            },
            (payload) => {
              console.log('Real-time update received:', payload);
              
              // Handle different types of changes
              if (payload.eventType === 'UPDATE') {
                const updatedSession = payload.new as SessionWithProfiles;
                
                // Update the sessions list
                setSessions(currentSessions => 
                  currentSessions.map(session => 
                    session.id === updatedSession.id ? updatedSession : session
                  )
                );

                // Show appropriate notifications
                if (updatedSession.status === 'reschedule_requested') {
                  if (userType === 'student') {
                    toast.info(
                      `${updatedSession.tutor?.full_name} has requested to reschedule your session.`,
                      {
                        action: {
                          label: 'View',
                          onClick: () => {
                            setSelectedSession(updatedSession);
                            setShowRescheduleModal(true);
                          }
                        }
                      }
                    );
                  }
                } else if (updatedSession.status === 'confirmed' && 
                          payload.old.status === 'reschedule_requested') {
                  toast.success('Reschedule request has been accepted.');
                } else if (updatedSession.status === 'pending' && 
                          payload.old.status === 'reschedule_requested') {
                  toast.info('Reschedule request has been declined.');
                }
              }
            }
          )
          .subscribe((status, err) => {
            console.log('Subscription status:', status, err);
            if (status === 'SUBSCRIBED') {
              retryCount = 0; // Reset retry count on successful subscription
            } else if (status === 'CLOSED') {
              console.log('Subscription closed. Error:', err);
              if (retryCount < maxRetries) {
                retryCount++;
                console.log(`Retrying subscription (${retryCount}/${maxRetries})...`);
                setTimeout(setupSubscription, 1000 * retryCount); // Exponential backoff
              }
            }
          });

        // Cleanup subscription on unmount
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error setting up subscription:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying subscription (${retryCount}/${maxRetries})...`);
          setTimeout(setupSubscription, 1000 * retryCount);
        }
      }
    };

    setupSubscription();
  }, [user, userType]);

  const handleCancelClick = (session: SessionWithProfiles) => {
    setSelectedSession(session);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!selectedSession) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
           updated_at: new Date().toISOString() // Explicitly update updated_at
        })
        .eq('id', selectedSession.id);

      if (error) {
        console.error('Error cancelling booking:', error);
        toast.error('Failed to cancel session.');
      } else {
        toast.success('Session cancelled successfully.');
        // Remove the session from the list
        setSessions(sessions.filter(s => s.id !== selectedSession.id));
      }
    } catch (err) {
      console.error('Cancellation failed:', err);
      toast.error('An error occurred during cancellation.');
    } finally {
      setIsSubmitting(false);
      setShowCancelModal(false);
      setSelectedSession(null);
    }
  };

  const handleRescheduleClick = (session: SessionWithProfiles) => {
    setSelectedSession(session);
    // Format the dates for the datetime-local input
    const startDate = new Date(session.start_time);
    const endDate = new Date(session.end_time);
    
    // Format to YYYY-MM-DDThh:mm format required by datetime-local input
    setNewStartTime(startDate.toISOString().slice(0, 16));
    setNewEndTime(endDate.toISOString().slice(0, 16));
    setShowRescheduleModal(true);
  };

  const handleRescheduleRequest = async () => {
    if (!selectedSession) return;

    setIsSubmitting(true);
    try {
      // Validate the new times
      const newStart = new Date(newStartTime);
      const newEnd = new Date(newEndTime);
      const now = new Date();

      if (newStart < now) {
        toast.error('Cannot schedule sessions in the past');
        setIsSubmitting(false);
        return;
      }

      if (newEnd <= newStart) {
        toast.error('End time must be after start time');
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'reschedule_requested',
          start_time: newStart.toISOString(),
          end_time: newEnd.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedSession.id);

      if (error) {
        console.error('Error requesting reschedule:', error);
        toast.error('Failed to request reschedule.');
      } else {
        toast.success('Reschedule request sent successfully.');
        // The real-time subscription will handle the UI update
      }
    } catch (err) {
      console.error('Reschedule request failed:', err);
      toast.error('An error occurred while requesting reschedule.');
    } finally {
      setIsSubmitting(false);
      setShowRescheduleModal(false);
      setSelectedSession(null);
    }
  };

  const handleRescheduleResponse = async (accept: boolean) => {
    if (!selectedSession) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: accept ? 'confirmed' : 'pending',
          start_time: accept ? newStartTime : selectedSession.start_time,
          end_time: accept ? newEndTime : selectedSession.end_time,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedSession.id);

      if (error) {
        console.error('Error responding to reschedule:', error);
        toast.error('Failed to respond to reschedule request.');
      } else {
        toast.success(accept ? 'Reschedule accepted.' : 'Reschedule declined.');
        // The real-time subscription will handle the UI update
      }
    } catch (err) {
      console.error('Reschedule response failed:', err);
      toast.error('An error occurred while responding to reschedule request.');
    } finally {
      setIsSubmitting(false);
      setShowRescheduleModal(false);
      setSelectedSession(null);
    }
  };

  const handleStartSession = async (session: SessionWithProfiles) => {
    console.log('Starting session:', session.id);
    // Implement video call functionality here
     if (session.room_url) {
        window.open(session.room_url, '_blank');
      } else {
        toast.info('No room URL available for this session yet.');
      }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading sessions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No upcoming sessions</p>
            {userType === 'tutor' && (
              <p className="text-sm mt-2">When students book sessions with you, they will appear here.</p>
            )}
            {userType === 'student' && (
               <p className="text-sm mt-2">Find a tutor to book your first session!</p>
            )}
            <p className="text-sm mt-1">Debug info: {userType} - {user?.id}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const otherUser = userType === 'student' ? session.tutor : session.student;
              const startTime = new Date(session.start_time);
              const endTime = new Date(session.end_time);

              // Skip rendering if user data is missing and log a warning
              if (!otherUser) {
                console.warn('Session missing user data:', {
                  sessionId: session.id,
                  subject: session.subject,
                  status: session.status,
                  userType
                });
                return null;
              }

              const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

              return (
                <div
                  key={session.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={otherUser.profile_picture_url || undefined} />
                      <AvatarFallback>
                        {otherUser.full_name ? otherUser.full_name.charAt(0) : (userType === 'student' ? 'T' : 'S')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                          {otherUser.full_name || (userType === 'student' ? 'Unknown Tutor' : 'Unknown Student')}
                        </h4>
                        <Badge variant={session.status === 'confirmed' ? 'default' : session.status === 'reschedule_requested' ? 'secondary' : 'destructive'}>
                          {session.status}
                        </Badge>
                      </div>

                      <Badge variant="outline" className="mt-1">
                        {session.subject}
                      </Badge>

                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(startTime, 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
                             ({durationHours} {durationHours === 1 ? 'hour' : 'hours'})
                          </span>
                        </div>
                      </div>

                       {session.note && session.status !== 'reschedule_requested' && ( // Display student note here if not for reschedule
                         <p className="mt-2 text-sm text-gray-600">
                           Student Note: {session.note}
                         </p>
                       )}

                         {session.status === 'reschedule_requested' && ( // Display new proposed time if status is reschedule_requested
                            <div className="mt-2 text-sm text-blue-600">
                                <p>Reschedule requested. New proposed time:</p>
                                <p className="font-medium">{format(startTime, 'MMMM d, yyyy h:mm a')} - {format(endTime, 'h:mm a')}</p>
                                {/* Tutor's note for reschedule request could be added here if stored */}
                            </div>
                          )}

                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    {session.status === 'confirmed' && userType === 'student' && (
                      <Button
                        size="sm"
                        onClick={() => handleStartSession(session)}
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        <Video className="mr-2 h-4 w-4" /> Join
                      </Button>
                    )}
                    
                    {session.status === 'reschedule_requested' && userType === 'student' && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleRescheduleResponse(true)}
                          disabled={isSubmitting}
                        >
                          Accept Reschedule
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRescheduleResponse(false)}
                          disabled={isSubmitting}
                        >
                          Decline Reschedule
                        </Button>
                      </>
                    )}

                    {session.status !== 'cancelled' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRescheduleClick(session)}
                        >
                          Reschedule
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelClick(session)}
                        >
                          Cancel Session
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Cancel Confirmation Dialog */}
       <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Cancel Session</DialogTitle>
           </DialogHeader>
           <div className="grid gap-4 py-4">
             <p>Are you sure you want to cancel the session with {selectedSession?.student?.full_name || selectedSession?.tutor?.full_name} on {selectedSession?.start_time ? format(new Date(selectedSession.start_time), 'MMMM d, yyyy h:mm a') : ''}?</p>
           </div>
           <DialogFooter>
             <DialogClose asChild>
               <Button variant="outline">Dismiss</Button>
             </DialogClose>
             <Button onClick={confirmCancel} disabled={isSubmitting}>
               {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>

       {/* Reschedule Dialog */}
       <Dialog open={showRescheduleModal} onOpenChange={setShowRescheduleModal}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>
               {selectedSession?.status === 'reschedule_requested' 
                 ? 'Respond to Reschedule Request'
                 : 'Request Reschedule'}
             </DialogTitle>
           </DialogHeader>
           <div className="grid gap-4 py-4">
             {selectedSession?.status === 'reschedule_requested' ? (
               <p>
                 {selectedSession.tutor?.full_name} has requested to reschedule this session to:
                 <br />
                 {format(new Date(newStartTime), 'MMMM d, yyyy h:mm a')} - {format(new Date(newEndTime), 'h:mm a')}
               </p>
             ) : (
               <>
                 <div className="grid gap-2">
                   <Label htmlFor="newStartTime">New Start Time</Label>
                   <input
                     id="newStartTime"
                     type="datetime-local"
                     value={newStartTime}
                     onChange={(e) => setNewStartTime(e.target.value)}
                     className="border rounded p-2"
                   />
                 </div>
                 <div className="grid gap-2">
                   <Label htmlFor="newEndTime">New End Time</Label>
                   <input
                     id="newEndTime"
                     type="datetime-local"
                     value={newEndTime}
                     onChange={(e) => setNewEndTime(e.target.value)}
                     className="border rounded p-2"
                   />
                 </div>
               </>
             )}
           </div>
           <DialogFooter>
             <DialogClose asChild>
               <Button variant="outline">Cancel</Button>
             </DialogClose>
             {selectedSession?.status === 'reschedule_requested' ? (
               <>
                 <Button
                   variant="outline"
                   onClick={() => handleRescheduleResponse(false)}
                   disabled={isSubmitting}
                 >
                   Decline
                 </Button>
                 <Button
                   onClick={() => handleRescheduleResponse(true)}
                   disabled={isSubmitting}
                 >
                   Accept
                 </Button>
               </>
             ) : (
               <Button
                 onClick={handleRescheduleRequest}
                 disabled={isSubmitting}
               >
                 {isSubmitting ? 'Sending Request...' : 'Send Reschedule Request'}
               </Button>
             )}
           </DialogFooter>
         </DialogContent>
       </Dialog>
    </Card>
  );
};

export default UpcomingSessions; 