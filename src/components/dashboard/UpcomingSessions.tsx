import React, { useEffect, useState, useCallback, useRef } from "react";
import { Calendar, Clock, MessageSquare, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Helper function to format dates
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

const formatDateTime = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

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
  // Client-side fields to manage reschedule state without DB schema changes
  original_start_time_on_reschedule?: string | null;
  original_end_time_on_reschedule?: string | null;
  original_status_on_reschedule?: string | null;
}

interface UpcomingSessionsProps {
  userType: 'student' | 'tutor';
}

const UpcomingSessions: React.FC<UpcomingSessionsProps> = ({ userType }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionWithProfiles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionWithProfiles | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newStartTime, setNewStartTime] = useState<string>('');
  const [newEndTime, setNewEndTime] = useState<string>('');

  const subscriptionRef = useRef<any>(null);
  const isCleaningUpRef = useRef(false);

  const fetchSessions = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
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

      if (userType === 'student') {
        query.eq('student_id', user.id);
      } else {
        query.eq('tutor_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      const typedData = (data || []).map(session => ({
        ...session,
        student: Array.isArray(session.student) ? session.student[0] || null : session.student,
        tutor: Array.isArray(session.tutor) ? session.tutor[0] || null : session.tutor,
        // Ensure client-side fields are not accidentally wiped if not present in DB data
        // This part is tricky if fetchSessions is called after a client-side enrichment.
        // For now, we assume fetchSessions provides the baseline and real-time updates enrich it.
      })) as SessionWithProfiles[];
      
      // Preserve existing original_... fields if a session is still 'reschedule_requested'
      // This is to handle cases where fetch might be called while client has enriched data.
      setSessions(prevSessions => {
        return typedData.map(newSession => {
          const existingSession = prevSessions.find(s => s.id === newSession.id);
          if (existingSession && newSession.status === 'reschedule_requested') {
            return {
              ...newSession,
              original_start_time_on_reschedule: existingSession.original_start_time_on_reschedule,
              original_end_time_on_reschedule: existingSession.original_end_time_on_reschedule,
              original_status_on_reschedule: existingSession.original_status_on_reschedule,
            };
          }
          return newSession;
        });
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load upcoming sessions');
    } finally {
      setIsLoading(false);
    }
  }, [user, userType]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (!user || isCleaningUpRef.current) return;

    let retryTimeout: NodeJS.Timeout;
    let retryCount = 0;
    const maxRetries = 3;

    const setupSubscription = () => {
      try {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
          subscriptionRef.current = null;
        }

        const channelName = `bookings_${userType}_${user.id}`;
        const subscription = supabase
          .channel(channelName)
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
              
              if (payload.eventType === 'UPDATE') {
                setSessions(currentSessions => 
                  currentSessions.map(session => {
                    if (session.id === payload.new.id) {
                      // Create updated session, preserving existing student/tutor profiles
                      // and other client-managed fields unless explicitly changed by payload.
                      const updatedSession: SessionWithProfiles = {
                        ...session, // Start with existing client session data
                        // Apply fields from payload.new carefully
                        id: payload.new.id,
                        subject: payload.new.subject,
                        start_time: payload.new.start_time,
                        end_time: payload.new.end_time,
                        status: payload.new.status,
                        note: payload.new.note,
                        room_url: payload.new.room_url,
                        // student and tutor objects are preserved from `session`
                      };

                      if (payload.new.status === 'reschedule_requested' && payload.old?.status !== 'reschedule_requested') {
                        updatedSession.original_start_time_on_reschedule = payload.old.start_time;
                        updatedSession.original_end_time_on_reschedule = payload.old.end_time;
                        updatedSession.original_status_on_reschedule = payload.old.status;
                        toast.info( userType === 'student' 
                            ? 'A tutor has requested to reschedule. Please respond.'
                            : 'A student has requested to reschedule. Please respond.'
                        );
                      } else if (session.status === 'reschedule_requested' && payload.new.status !== 'reschedule_requested') {
                        // Reschedule resolved, clear temporary fields
                        updatedSession.original_start_time_on_reschedule = null;
                        updatedSession.original_end_time_on_reschedule = null;
                        updatedSession.original_status_on_reschedule = null;

                        if (payload.new.status === 'confirmed') {
                             toast.success('Reschedule accepted. Session time updated.');
                        } else if (payload.new.status === 'pending') { // Or original status
                             toast.info('Reschedule declined. Session time reverted to original.');
                        }
                      }
                      return updatedSession;
                    }
                    return session;
                  })
                );
                // DO NOT call fetchSessions() here for UPDATEs if relying on client-side original_... fields,
                // as fetchSessions might overwrite them if it's not designed to merge.
                // For this client-side original_time strategy, we assume the payload gives enough info for status/time updates,
                // and student/tutor profiles don't change with these actions.

              } else if (payload.eventType === 'INSERT') {
                // New session added, refetch to get joined data
                toast.info('A new session has been booked.');
                fetchSessions();
              } else if (payload.eventType === 'DELETE') {
                if (payload.old?.id) {
                  toast.info('A session has been removed.');
                  setSessions(currentSessions => 
                    currentSessions.filter(session => session.id !== payload.old.id)
                  );
                }
              }
            }
          )
          .subscribe((status, err) => {
            if (status === 'SUBSCRIBED') {
                retryCount = 0;
            } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
                if (!isCleaningUpRef.current && retryCount < maxRetries) {
                    retryCount++;
                    retryTimeout = setTimeout(() => {
                        if (!isCleaningUpRef.current) setupSubscription();
                    }, Math.pow(2, retryCount) * 1000);
                }
            }
          });
        subscriptionRef.current = subscription;
      } catch (error) {
        console.error('Error setting up subscription:', error);
        if (!isCleaningUpRef.current && retryCount < maxRetries) {
          retryCount++;
          retryTimeout = setTimeout(() => {
            if (!isCleaningUpRef.current) setupSubscription();
          }, Math.pow(2, retryCount) * 1000);
        }
      }
    };
    const initTimeout = setTimeout(() => {
      if (!isCleaningUpRef.current) setupSubscription();
    }, 100);

    return () => {
      isCleaningUpRef.current = true;
      if (retryTimeout) clearTimeout(retryTimeout);
      if (initTimeout) clearTimeout(initTimeout);
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      setTimeout(() => { isCleaningUpRef.current = false; }, 1000);
    };
  }, [user, userType, fetchSessions]); // fetchSessions is a dependency if INSERT/DELETE use it

  const handleCancelClick = useCallback((session: SessionWithProfiles) => {
    setSelectedSession(session);
    setShowCancelModal(true);
  }, []);

  const confirmCancel = useCallback(async () => {
    if (!selectedSession) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', selectedSession.id);

      if (error) throw error;
      toast.success('Session cancelled successfully.');
      setSessions(sessions => sessions.filter(s => s.id !== selectedSession.id));
    } catch (err) {
      console.error('Cancellation failed:', err);
      toast.error('Failed to cancel session.');
    } finally {
      setIsSubmitting(false);
      setShowCancelModal(false);
      setSelectedSession(null);
    }
  }, [selectedSession]);

  const handleRescheduleClick = useCallback((session: SessionWithProfiles) => {
    setSelectedSession(session);
    const startDate = new Date(session.start_time); // For 'reschedule_requested', this is the proposed time
    const endDate = new Date(session.end_time);     // For 'reschedule_requested', this is the proposed time
    setNewStartTime(startDate.toISOString().slice(0, 16));
    setNewEndTime(endDate.toISOString().slice(0, 16));
    setShowRescheduleModal(true);
  }, []);

  const handleRescheduleRequest = useCallback(async () => { // User INITIATES a reschedule
    if (!selectedSession) return;
    setIsSubmitting(true);
    try {
      const newStart = new Date(newStartTime);
      const newEnd = new Date(newEndTime);
      if (newStart < new Date() || newEnd <= newStart || (newEnd.getTime() - newStart.getTime()) / (1000 * 60 * 60) < 0.5 || (newEnd.getTime() - newStart.getTime()) / (1000 * 60 * 60) > 4) {
        toast.error('Invalid time. Ensure future time, end after start, duration 30min-4hrs.');
        setIsSubmitting(false); return;
      }

      // DB `start_time` and `end_time` are updated to proposed times.
      // `original_...` times will be set by real-time listener on other client.
      // This client will also get the update and set its own original_... times.
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          status: 'reschedule_requested',
          start_time: newStart.toISOString(),
          end_time: newEnd.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedSession.id);

      if (bookingError) throw bookingError;

      const recipientId = userType === 'student' ? selectedSession.tutor?.id : selectedSession.student?.id;
      if (recipientId && user?.id) {
        await supabase.from('notifications').insert({
          recipient_id: recipientId, sender_id: user.id,
          content: `${userType === 'student' ? 'Student' : 'Tutor'} requested to reschedule to ${formatDateTime(newStart)} - ${formatTime(newEnd)}`,
          type: 'reschedule_request',
        });
      }
      toast.success('Reschedule request sent. Waiting for response.');
    } catch (err) {
      console.error('Reschedule request failed:', err);
      toast.error('An error occurred while requesting reschedule.');
    } finally {
      setIsSubmitting(false);
      setShowRescheduleModal(false);
      setSelectedSession(null);
    }
  }, [selectedSession, newStartTime, newEndTime, userType, user?.id]);

  const handleRescheduleResponse = useCallback(async (accept: boolean) => { // User RESPONDS to a reschedule
    if (!selectedSession) return;
    setIsSubmitting(true);
    try {
      const updateData: {
        status: string;
        updated_at: string;
        start_time: string; // Always provide start_time and end_time
        end_time: string;
      } = {
        updated_at: new Date().toISOString(),
        status: '', // Will be set below
        start_time: '', // Will be set below
        end_time: '', // Will be set below
      };

      if (accept) {
        updateData.status = 'confirmed';
        // newStartTime/newEndTime are pre-filled with proposed times from selectedSession
        updateData.start_time = new Date(newStartTime).toISOString();
        updateData.end_time = new Date(newEndTime).toISOString();
      } else { // Decline
        if (!selectedSession.original_start_time_on_reschedule || !selectedSession.original_end_time_on_reschedule) {
          toast.error("Cannot decline: original session time data is missing. Please refresh.");
          setIsSubmitting(false); return;
        }
        updateData.status = selectedSession.original_status_on_reschedule || 'pending'; // Revert to original status or 'pending'
        updateData.start_time = new Date(selectedSession.original_start_time_on_reschedule).toISOString();
        updateData.end_time = new Date(selectedSession.original_end_time_on_reschedule).toISOString();
      }

      const { error: bookingError } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', selectedSession.id);

      if (bookingError) throw bookingError;

      const recipientId = userType === 'student' ? selectedSession.tutor?.id : selectedSession.student?.id;
      if (recipientId && user?.id) {
        await supabase.from('notifications').insert({
          recipient_id: recipientId, sender_id: user.id,
          content: accept 
            ? `${userType === 'student' ? 'Student' : 'Tutor'} accepted your reschedule request.`
            : `${userType === 'student' ? 'Student' : 'Tutor'} declined your reschedule request.`,
          type: accept ? 'reschedule_accepted' : 'reschedule_declined',
        });
      }

      if (accept) toast.success('Reschedule accepted. Session time updated.');
      else toast.info('Reschedule declined. Original session time restored.');
      
    } catch (err) {
      console.error('Reschedule response failed:', err);
      toast.error('An error occurred while responding to reschedule request.');
    } finally {
      setIsSubmitting(false);
      setShowRescheduleModal(false);
      setSelectedSession(null);
    }
  }, [selectedSession, newStartTime, newEndTime, userType, user?.id]);

  const handleStartSession = useCallback(async (session: SessionWithProfiles) => {
    if (session.room_url) window.open(session.room_url, '_blank');
    else toast.info('No room URL available for this session yet.');
  }, []);

  if (isLoading && sessions.length === 0) { // Show loader only if no sessions are displayed yet
    return <Card><CardHeader><CardTitle>Upcoming Sessions</CardTitle></CardHeader><CardContent><div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div><p className="mt-2 text-gray-500">Loading sessions...</p></div></CardContent></Card>;
  }

  if (error) {
    return <Card><CardHeader><CardTitle>Upcoming Sessions</CardTitle></CardHeader><CardContent><div className="text-center py-8 text-red-500"><p>{error}</p><Button variant="outline" className="mt-4" onClick={fetchSessions}>Try Again</Button></div></CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader><CardTitle>Upcoming Sessions</CardTitle></CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No upcoming sessions</p>
            {userType === 'tutor' && <p className="text-sm mt-2">When students book sessions with you, they will appear here.</p>}
            {userType === 'student' && <p className="text-sm mt-2">Find a tutor to book your first session!</p>}
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const otherUser = userType === 'student' ? session.tutor : session.student;
              if (!otherUser) { console.warn('Session missing user data:', session); return null; }

              const startTime = new Date(session.start_time);
              const endTime = new Date(session.end_time);
              const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

              // Determine if current user is the one who needs to respond to a reschedule request
              // This is true if status is 'reschedule_requested' AND this user was NOT the last one to update it (simplification: check if this user is the recipient of the notification for request)
              // A more robust way would be to store `reschedule_requester_id` in the booking.
              // For now, we assume if status is 'reschedule_requested', both users see respond options if they didn't initiate. The modal handles this.
              const canRespondToReschedule = session.status === 'reschedule_requested'; 


              return (
                <div key={session.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={otherUser.profile_picture_url || undefined} />
                      <AvatarFallback>{otherUser.full_name ? otherUser.full_name.charAt(0) : (userType === 'student' ? 'T' : 'S')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{otherUser.full_name || (userType === 'student' ? 'Unknown Tutor' : 'Unknown Student')}</h4>
                        <Badge variant={session.status === 'confirmed' ? 'default' : session.status === 'reschedule_requested' ? 'secondary' : 'destructive'}>
                          {session.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="mt-1">{session.subject}</Badge>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{formatDate(startTime)}</span></div>
                        <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>{formatTime(startTime)} - {formatTime(endTime)} ({durationHours.toFixed(1)} {durationHours === 1 ? 'hour' : 'hours'})</span></div>
                      </div>
                      {session.note && session.status !== 'reschedule_requested' && <p className="mt-2 text-sm text-gray-600">Student Note: {session.note}</p>}
                      
                      {session.status === 'reschedule_requested' && (
                        <div className="mt-2 p-2 rounded-md bg-blue-50 border border-blue-200 text-sm text-blue-700">
                            {session.original_start_time_on_reschedule && session.original_end_time_on_reschedule && (
                                <p>Original time: {formatDateTime(new Date(session.original_start_time_on_reschedule))} - {formatTime(new Date(session.original_end_time_on_reschedule))}</p>
                            )}
                            <p className="font-semibold">New proposed time: {formatDateTime(startTime)} - {formatTime(endTime)}</p>
                            <p className="mt-1">The other party has requested to reschedule. You can accept, decline, or propose a different time via the Reschedule button.</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    {session.status === 'confirmed' && userType === 'student' && (
                      <Button size="sm" onClick={() => handleStartSession(session)} className="bg-accent text-accent-foreground hover:bg-accent/90"><Video className="mr-2 h-4 w-4" /> Join</Button>
                    )}
                    
                    {/* Always show Reschedule button unless cancelled. Modal will adapt. */}
                    {session.status !== 'cancelled' && (
                      <Button variant="outline" size="sm" onClick={() => handleRescheduleClick(session)}>
                        {session.status === 'reschedule_requested' ? 'Respond/Propose New' : 'Reschedule'}
                      </Button>
                    )}

                    {session.status !== 'cancelled' && (
                       <Button variant="outline" size="sm" onClick={() => handleCancelClick(session)}>Cancel Session</Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Cancel Session</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <p>Are you sure you want to cancel the session with {selectedSession?.student?.full_name || selectedSession?.tutor?.full_name} on {selectedSession?.start_time ? formatDateTime(new Date(selectedSession.start_time)) : ''}?</p>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Dismiss</Button></DialogClose>
            <Button onClick={confirmCancel} disabled={isSubmitting}>{isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRescheduleModal} onOpenChange={setShowRescheduleModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSession?.status === 'reschedule_requested' 
                ? 'Respond to or Modify Reschedule Request' 
                : 'Request Reschedule'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedSession?.status === 'reschedule_requested' && (
              <div className="text-sm p-3 bg-gray-100 rounded-md">
                <p>A reschedule has been requested for this session.</p>
                {selectedSession.original_start_time_on_reschedule && (
                  <p>Original Time: {formatDateTime(new Date(selectedSession.original_start_time_on_reschedule))} - {formatTime(new Date(selectedSession.original_end_time_on_reschedule))}</p>
                )}
                <p className="font-semibold">Currently Proposed: {formatDateTime(new Date(newStartTime))} - {formatTime(new Date(newEndTime))}</p>
                <p className="mt-2">You can accept, decline, or propose a new time below.</p>
              </div>
            )}
            {/* Input fields are always available for proposing/modifying a proposal */}
            <div className="grid gap-2">
              <Label htmlFor="newStartTime">New Start Time</Label>
              <input id="newStartTime" type="datetime-local" value={newStartTime} onChange={(e) => setNewStartTime(e.target.value)} className="border rounded p-2" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newEndTime">New End Time</Label>
              <input id="newEndTime" type="datetime-local" value={newEndTime} onChange={(e) => setNewEndTime(e.target.value)} className="border rounded p-2" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            {selectedSession?.status === 'reschedule_requested' ? (
              <>
                <Button variant="destructive" onClick={() => handleRescheduleResponse(false)} disabled={isSubmitting}>Decline Current Proposal</Button>
                <Button variant="default" onClick={() => handleRescheduleResponse(true)} disabled={isSubmitting}>Accept Current Proposal</Button>
                <Button onClick={handleRescheduleRequest} disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Propose This New Time'}</Button>
              </>
            ) : (
              <Button onClick={handleRescheduleRequest} disabled={isSubmitting}>{isSubmitting ? 'Sending Request...' : 'Send Reschedule Request'}</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UpcomingSessions;