import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Video, Calendar, Clock, User, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Types
interface User {
  id: string;
  full_name: string;
  profile_picture_url?: string;
  email?: string;
}

interface Session {
  id: string;
  subject: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'reschedule_requested';
  room_url?: string;
  student: User;
  tutor: User;
  original_start_time?: string;
  original_end_time?: string;
}

type ModalType = 'cancel' | 'reschedule' | 'respond' | null;
type UserType = 'student' | 'tutor';

// Constants
const SESSION_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  reschedule_requested: 'Reschedule Requested'
} as const;

const NOTIFICATION_MESSAGES = {
  cancel: 'Session was cancelled.',
  reschedule_accepted: 'Reschedule accepted.',
  reschedule_declined: 'Reschedule declined.'
} as const;

// Utility functions
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })}`;
};

const generateRoomUrl = (sessionId: string): string => 
  `https://meet.jit.si/${sessionId}-${Date.now()}`;

const createNotification = async (
  recipientId: string,
  senderId: string,
  content: string,
  type: string
) => {
  try {
    await supabase.from('notifications').insert({
      recipient_id: recipientId,
      sender_id: senderId,
      content,
      type
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

// Custom hooks
const useSessionManager = (userType: UserType) => {
  const { user, profile } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          student:student_id(*),
          tutor:tutor_id(*)
        `)
        .eq(userType === 'student' ? 'student_id' : 'tutor_id', user.id)
        .neq('status', 'cancelled') // Exclude cancelled sessions
        .gte('start_time', new Date().toISOString())
        .order('start_time');

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      toast.error('Failed to fetch sessions');
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, userType]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return { sessions, loading, fetchSessions };
};

// Components
const SessionCard: React.FC<{
  session: Session;
  userType: UserType;
  onAction: (session: Session, action: string, data?: any) => void;
}> = ({ session, userType, onAction }) => {
  const otherUser = userType === 'student' ? session.tutor : session.student;
  const canStart = userType === 'tutor' && !['cancelled', 'completed'].includes(session.status);
  const canJoin = userType === 'student' && !!session.room_url && !['cancelled', 'completed'].includes(session.status);
  const canModify = ['pending', 'confirmed', 'in_progress'].includes(session.status);
  const needsResponse = session.status === 'reschedule_requested';

  return (
    <div className="border rounded-lg p-4 mb-3 bg-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherUser?.profile_picture_url} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{otherUser?.full_name || 'Unknown User'}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              <span>{session.subject}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatDateTime(session.start_time)}</span>
            </div>
            {needsResponse && (
              <div className="text-xs text-amber-600 mt-1">
                ⏳ Reschedule request pending response
              </div>
            )}
          </div>
        </div>
        <Badge variant={session.status === 'confirmed' ? 'default' : 
                       session.status === 'reschedule_requested' ? 'destructive' : 'secondary'}>
          {SESSION_STATUS_LABELS[session.status]}
        </Badge>
      </div>

      <div className="flex gap-2 flex-wrap">
        {canStart && (
          <Button 
            size="sm" 
            onClick={() => onAction(session, 'start')}
            className="flex items-center gap-2"
          >
            <Video className="h-4 w-4" />
            Start Session
          </Button>
        )}
        
        {canJoin && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onAction(session, 'join')}
            className="flex items-center gap-2"
          >
            <Video className="h-4 w-4" />
            Join Session
          </Button>
        )}
        
        {/* Cancel and Reschedule buttons - show for confirmed and in-progress sessions */}
        {canModify && (
          <>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onAction(session, 'reschedule')}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Reschedule
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => onAction(session, 'cancel')}
            >
              Cancel
            </Button>
          </>
        )}
        
        {/* Response button for reschedule requests */}
        {needsResponse && (
          <Button 
            size="sm"
            onClick={() => onAction(session, 'respond')}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Respond to Reschedule
          </Button>
        )}
      </div>
    </div>
  );
};

const ActionModals: React.FC<{
  modalType: ModalType;
  selectedSession: Session | null;
  newStart: string;
  newEnd: string;
  onNewStartChange: (value: string) => void;
  onNewEndChange: (value: string) => void;
  onClose: () => void;
  onConfirm: (data?: any) => void;
  userType: UserType;
}> = ({ 
  modalType, 
  selectedSession, 
  newStart, 
  newEnd, 
  onNewStartChange, 
  onNewEndChange, 
  onClose, 
  onConfirm,
  userType 
}) => {
  if (!modalType || !selectedSession) return null;

  const modalConfig = {
    cancel: {
      title: 'Cancel Session',
      content: (
        <div className="space-y-3">
          <p>Are you sure you want to cancel this session?</p>
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-800">
              <strong>Session Details:</strong><br />
              Subject: {selectedSession?.subject}<br />
              Time: {selectedSession ? formatDateTime(selectedSession.start_time) : ''}<br />
              With: {selectedSession ? 
                (modalType === 'cancel' ? 
                  (userType === 'student' ? selectedSession.tutor?.full_name : selectedSession.student?.full_name) 
                  : '') : ''}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. The other participant will be notified of the cancellation.
          </p>
        </div>
      ),
      confirmText: 'Cancel Session',
      confirmVariant: 'destructive' as const,
      showDecline: false
    },
    reschedule: {
      title: 'Reschedule Session',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              <strong>Current Time:</strong><br />
              {selectedSession ? formatDateTime(selectedSession.start_time) : ''} - {selectedSession ? formatDateTime(selectedSession.end_time) : ''}
            </p>
          </div>
          <div>
            <Label htmlFor="start-time">New Start Time</Label>
            <Input
              id="start-time"
              type="datetime-local"
              value={newStart.slice(0, 16)}
              onChange={(e) => onNewStartChange(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          <div>
            <Label htmlFor="end-time">New End Time</Label>
            <Input
              id="end-time"
              type="datetime-local"
              value={newEnd.slice(0, 16)}
              onChange={(e) => onNewEndChange(e.target.value)}
              min={newStart.slice(0, 16)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            A reschedule request will be sent to the other participant for approval.
          </p>
        </div>
      ),
      confirmText: 'Send Reschedule Request',
      confirmVariant: 'default' as const,
      showDecline: false
    },
    respond: {
      title: 'Respond to Reschedule Request',
      content: (
        <div className="space-y-3">
          <p>Do you want to accept the proposed new time?</p>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
            <p className="text-sm text-amber-800">
              <strong>Proposed New Time:</strong><br />
              {selectedSession ? formatDateTime(selectedSession.start_time) : ''} - {selectedSession ? formatDateTime(selectedSession.end_time) : ''}
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
            <p className="text-sm text-gray-600">
              <strong>Original Time:</strong><br />
              {selectedSession?.original_start_time ? formatDateTime(selectedSession.original_start_time) : ''} - {selectedSession?.original_end_time ? formatDateTime(selectedSession.original_end_time) : ''}
            </p>
          </div>
        </div>
      ),
      confirmText: 'Accept',
      confirmVariant: 'default' as const,
      showDecline: true
    }
  };

  const config = modalConfig[modalType];

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {typeof config.content === 'string' ? (
            <p>{config.content}</p>
          ) : (
            config.content
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {config.showDecline && (
            <Button variant="outline" onClick={() => onConfirm(false)}>
              Decline
            </Button>
          )}
          <Button 
            variant={config.confirmVariant}
            onClick={() => onConfirm(modalType === 'respond' ? true : undefined)}
          >
            {config.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main component
export default function SessionManager({ userType }: { userType: UserType }) {
  const { user, profile } = useAuth();
  const { sessions, loading, fetchSessions } = useSessionManager(userType);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');

  const handleSessionAction = useCallback(async (session: Session, action: string, data?: any) => {
    switch (action) {
      case 'start':
        await handleStartSession(session);
        break;
      case 'join':
        window.open(session.room_url, '_blank');
        break;
      case 'cancel':
        setSelectedSession(session);
        setModalType('cancel');
        break;
      case 'reschedule':
        setSelectedSession(session);
        setModalType('reschedule');
        setNewStart(session.start_time);
        setNewEnd(session.end_time);
        break;
      case 'respond':
        setSelectedSession({
          ...session,
          original_start_time: session.start_time,
          original_end_time: session.end_time
        });
        setModalType('respond');
        break;
    }
  }, []);

  const handleStartSession = async (session: Session) => {
    const roomUrl = generateRoomUrl(session.id);
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          room_url: roomUrl,
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', session.id);

      if (error) throw error;

      toast.success('Session started successfully');
      await fetchSessions();
      window.open(roomUrl, '_blank');
    } catch (error) {
      toast.error('Failed to start session');
      console.error('Error starting session:', error);
    }
  };

  const updateSession = async (updates: Partial<Session>, notificationType?: string, message?: string) => {
    if (!selectedSession?.id || !user?.id) {
      toast.error('Missing required information');
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', selectedSession.id);

      if (error) throw error;

      // Send notification if specified
      if (notificationType && message) {
        const recipientId = userType === 'student' 
          ? selectedSession.tutor.id 
          : selectedSession.student.id;
        
        await createNotification(recipientId, user.id, message, notificationType);
      }

      await fetchSessions();
      
      // Different success messages based on action
      if (updates.status === 'cancelled') {
        toast.success('Session cancelled successfully');
      } else if (updates.status === 'reschedule_requested') {
        toast.success('Reschedule request sent successfully');
      } else {
        toast.success('Session updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update session');
      console.error('Error updating session:', error);
    } finally {
      handleCloseModal();
    }
  };

  const handleModalConfirm = async (data?: any) => {
    if (!selectedSession) return;

    switch (modalType) {
      case 'cancel':
        // Cancel the session - this will remove it from upcoming sessions
        await updateSession(
          { status: 'cancelled' },
          'cancel_notification',
          `${profile?.full_name || 'Someone'} has cancelled the session scheduled for ${formatDateTime(selectedSession.start_time)}`
        );
        break;
        
      case 'reschedule':
        // Validate that new times are provided
        if (!newStart || !newEnd) {
          toast.error('Please select both start and end times');
          return;
        }
        
        // Validate that new start time is before end time
        if (new Date(newStart) >= new Date(newEnd)) {
          toast.error('Start time must be before end time');
          return;
        }
        
        // Send reschedule request
        const rescheduleMessage = `${profile?.full_name || 'Someone'} has requested to reschedule the session from ${formatDateTime(selectedSession.start_time)} to ${formatDateTime(newStart)} - ${formatDateTime(newEnd)}. Please respond to confirm or decline.`;
        
        await updateSession(
          {
            start_time: new Date(newStart).toISOString(),
            end_time: new Date(newEnd).toISOString(),
            status: 'reschedule_requested',
            // Store original times for fallback
            original_start_time: selectedSession.start_time,
            original_end_time: selectedSession.end_time
          },
          'reschedule_request',
          rescheduleMessage
        );
        break;
        
      case 'respond':
        const accept = data === true;
        
        if (accept) {
          // Accept the reschedule - confirm the new times
          await updateSession(
            {
              status: 'confirmed',
              start_time: selectedSession.start_time,
              end_time: selectedSession.end_time
            },
            'reschedule_accepted',
            `${profile?.full_name || 'Someone'} has accepted the reschedule request. The session is now confirmed for ${formatDateTime(selectedSession.start_time)}.`
          );
        } else {
          // Decline the reschedule - revert to original times
          await updateSession(
            {
              status: 'confirmed',
              start_time: selectedSession.original_start_time || selectedSession.start_time,
              end_time: selectedSession.original_end_time || selectedSession.end_time
            },
            'reschedule_declined',
            `${profile?.full_name || 'Someone'} has declined the reschedule request. The session remains at the original time: ${formatDateTime(selectedSession.original_start_time || selectedSession.start_time)}.`
          );
        }
        break;
    }
  };

  const handleCloseModal = () => {
    setSelectedSession(null);
    setModalType(null);
    setNewStart('');
    setNewEnd('');
  };

  const sessionsContent = useMemo(() => {
    if (loading) {
      return <div className="text-center py-8 text-muted-foreground">Loading sessions...</div>;
    }

    if (sessions.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">No upcoming sessions</div>;
    }

    return sessions.map(session => (
      <SessionCard
        key={session.id}
        session={session}
        userType={userType}
        onAction={handleSessionAction}
      />
    ));
  }, [sessions, loading, userType, handleSessionAction]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            My Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessionsContent}
        </CardContent>
      </Card>

      <ActionModals
        modalType={modalType}
        selectedSession={selectedSession}
        newStart={newStart}
        newEnd={newEnd}
        onNewStartChange={setNewStart}
        onNewEndChange={setNewEnd}
        onClose={handleCloseModal}
        onConfirm={handleModalConfirm}
        userType={userType}
      />
    </>
  );
}