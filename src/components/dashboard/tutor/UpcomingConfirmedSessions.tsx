import React, { useEffect, useState } from "react";
import { Calendar, Clock, MessageSquare, MoreVertical, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { Session } from "@/integrations/supabase/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface UpcomingConfirmedSessionsProps {}

const UpcomingConfirmedSessions: React.FC<UpcomingConfirmedSessionsProps> = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for modals
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [newStartTime, setNewStartTime] = useState(''); // Consider using Date objects or a proper date picker component
  const [newEndTime, setNewEndTime] = useState(''); // Consider using Date objects or a proper time picker component
   const [isSubmitting, setIsSubmitting] = useState(false); // For modal actions

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) {
        console.log('No user found');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('Fetching confirmed sessions for tutor:', user.id);

        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            subject,
            start_time,
            end_time,
            status,
            note,
            cancellation_reason,
            room_url,
            student:student_id (
              id,
              full_name,
              profile_picture_url
            )
          `)
          .eq('tutor_id', user.id)
          .in('status', ['confirmed', 'reschedule_requested'])
          .gt('start_time', new Date().toISOString())
          .order('start_time', { ascending: true });

        console.log('Confirmed sessions query result:', { data, error });

        if (error) {
          console.error('Supabase query error fetching confirmed sessions:', error);
          throw error;
        }

        setSessions(data || []);
      } catch (err) {
        console.error('Error fetching confirmed sessions:', err);
        setError('Failed to load upcoming sessions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  const handleRescheduleClick = (session: Session) => {
    setSelectedSession(session);
    // Initialize modal inputs with current session time for convenience
    setNewStartTime(session.start_time);
    setNewEndTime(session.end_time);
    setShowRescheduleModal(true);
  };

  const handleCancelClick = (session: Session) => {
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
          cancellation_reason: cancellationReason || null,
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
      setCancellationReason('');
    }
  };

  const confirmReschedule = async () => {
     if (!selectedSession || !newStartTime || !newEndTime) {
       toast.error('Please select a new date and time.');
       return;
     }

     setIsSubmitting(true);
     try {
       // Need to parse newStartTime and newEndTime strings into Date objects
       // Assuming they come from inputs/pickers
       const updatedStartTime = new Date(newStartTime);
       const updatedEndTime = new Date(newEndTime);

       const { error } = await supabase
         .from('bookings')
         .update({
           start_time: updatedStartTime.toISOString(),
           end_time: updatedEndTime.toISOString(),
           status: 'reschedule_requested',
           updated_at: new Date().toISOString() // Explicitly update updated_at
         })
         .eq('id', selectedSession.id);

       if (error) {
         console.error('Error rescheduling booking:', error);
         toast.error('Failed to request reschedule.');
       } else {
         toast.success('Reschedule request sent to student.');
         // Update the session status in the local state
         setSessions(sessions.map(s =>
           s.id === selectedSession.id ? { ...s, status: 'reschedule_requested', start_time: updatedStartTime.toISOString(), end_time: updatedEndTime.toISOString() } : s
         ));
       }
     } catch (err) {
       console.error('Reschedule failed:', err);
       toast.error('An error occurred during reschedule.');
     } finally {
       setIsSubmitting(false);
       setShowRescheduleModal(false);
       setSelectedSession(null);
       setNewStartTime('');
       setNewEndTime('');
     }
  };


  const handleStartSession = (session: Session) => {
    console.log('Start session:', session.id);
    if (session.room_url) {
       window.open(session.room_url, '_blank');
     } else {
       toast.info('No room URL available for this session yet.');
     }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Confirmed Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading upcoming sessions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Confirmed Sessions</CardTitle>
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
        <CardTitle>Upcoming Confirmed Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>You have no upcoming confirmed sessions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
               const student = session.student;
               if (!student) {
                console.warn(`Session ${session.id} is missing student data.`);
                 return null; // Skip rendering if student data is missing
               }

               const startTime = new Date(session.start_time);
               const endTime = new Date(session.end_time);
               const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

              return (
                <div
                  key={session.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={student.profile_picture_url || undefined} />
                        <AvatarFallback>
                          {student.full_name ? student.full_name.charAt(0) : 'S'}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h4 className="font-medium">{student.full_name || 'Unknown Student'}</h4>
                        <Badge variant="outline" className="mt-1">
                          {session.subject}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                       <Badge variant={session.status === 'confirmed' ? 'default' : 'secondary'}>
                          {session.status}
                        </Badge>

                       {session.status === 'confirmed' && ( // Only show Start Session for confirmed
                         <Button
                           size="sm"
                           onClick={() => handleStartSession(session)}
                           className="bg-accent text-accent-foreground hover:bg-accent/90"
                         >
                           <Video className="mr-2 h-4 w-4" /> Start
                         </Button>
                       )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          {session.status === 'confirmed' && (
                            <>
                             <DropdownMenuItem onClick={() => handleRescheduleClick(session)}>
                               🗓️ Reschedule
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCancelClick(session)} className="text-red-600 focus:text-red-600">
                                🚫 Cancel
                              </DropdownMenuItem>
                            </>
                          )}
                           {session.status === 'reschedule_requested' && (
                            <DropdownMenuItem disabled>
                              ⏳ Awaiting student response
                            </DropdownMenuItem>
                          )}
                           {session.note && (
                             <>
                               <DropdownMenuSeparator />
                                <DropdownMenuItem disabled className="whitespace-normal h-auto flex items-start">
                                  <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                                   <div className="flex-1 break-words">
                                    Student Note: {session.note}
                                   </div>
                                </DropdownMenuItem>
                             </>
                           )}
                            {session.cancellation_reason && session.status === 'cancelled' && (
                             <>
                               <DropdownMenuSeparator />
                                <DropdownMenuItem disabled className="whitespace-normal h-auto flex items-start">
                                  <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                                   <div className="flex-1 break-words text-red-600">
                                    Cancellation Reason: {session.cancellation_reason}
                                   </div>
                                </DropdownMenuItem>
                             </>
                           )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mt-4">
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

                 {/* Display new proposed time if status is reschedule_requested */}
                 {session.status === 'reschedule_requested' && (
                   <div className="mt-2 text-sm text-blue-600">
                      <p>Reschedule requested. New proposed time:</p>
                      {/* For now, we'll just display the updated time from the booking row */}
                       <p className="font-medium">{format(startTime, 'MMMM d, yyyy h:mm a')} - {format(endTime, 'h:mm a')}</p>
                       {/* Tutor's note for reschedule request could be added here if stored */}
                   </div>
                 )}

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
             <p>Are you sure you want to cancel the session with {selectedSession?.student?.full_name} on {selectedSession?.start_time ? format(new Date(selectedSession.start_time), 'MMMM d, yyyy h:mm a') : ''}?</p>
             <div className="grid gap-2">
               <Label htmlFor="cancellationReason">Reason for cancellation (optional):</Label>
               <Textarea
                 id="cancellationReason"
                 value={cancellationReason}
                 onChange={(e) => setCancellationReason(e.target.value)}
                 placeholder="e.g., unexpected conflict, illness"
               />
             </div>
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

       {/* Reschedule Dialog (Basic - needs date/time pickers) */}
       <Dialog open={showRescheduleModal} onOpenChange={setShowRescheduleModal}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Reschedule Session</DialogTitle>
           </DialogHeader>
           <div className="grid gap-4 py-4">
             <p>Propose a new time for the session with {selectedSession?.student?.full_name} currently scheduled for {selectedSession?.start_time ? format(new Date(selectedSession.start_time), 'MMMM d, yyyy h:mm a') : ''}.</p>
             <div className="grid gap-2">
               <Label htmlFor="newStartTime">New Start Time:</Label>
               {/* TODO: Replace with a proper Date and Time picker component */}
               <Input
                 id="newStartTime"
                 type="datetime-local"
                 value={newStartTime ? new Date(newStartTime).toISOString().slice(0, 16) : ''}
                 onChange={(e) => setNewStartTime(e.target.value)}
               />
             </div>
             <div className="grid gap-2">
               <Label htmlFor="newEndTime">New End Time:</Label>
                {/* TODO: Replace with a proper Date and Time picker component */}
                 <Input
                  id="newEndTime"
                  type="datetime-local"
                  value={newEndTime ? new Date(newEndTime).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setNewEndTime(e.target.value)}
                />
             </div>
              {/* Optional Note for Reschedule can be added here */}
           </div>
           <DialogFooter>
             <DialogClose asChild>
               <Button variant="outline">Dismiss</Button>
             </DialogClose>
             <Button onClick={confirmReschedule} disabled={isSubmitting}>
               {isSubmitting ? 'Submitting...' : 'Request Reschedule'}
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
    </Card>
  );
};

export default UpcomingConfirmedSessions; 