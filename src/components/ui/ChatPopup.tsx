import React, { useEffect, useState, useRef } from "react";
import { Rnd } from "react-rnd";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  created_at: string;
}

const ChatPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, profile } = useUser();
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async (userId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user?.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${user?.id})`)
      .order("created_at", { ascending: true });

    if (data) setMessages(data);
  };

  useEffect(() => {
    if (!profile?.role) return;
    const targetRole = profile.role === "student" ? "tutor" : "student";

    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("role", targetRole)
      .then(({ data }) => {
        if (data) setContacts(data);
      });
  }, [profile?.role]);

  useEffect(() => {
    if (!selectedUserId || !user?.id) return;

    fetchMessages(selectedUserId);

    const sub = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const m = payload.new as Message;
          if (
            (m.sender_id === user.id && m.recipient_id === selectedUserId) ||
            (m.sender_id === selectedUserId && m.recipient_id === user.id)
          ) {
            setMessages((prev) => [...prev, m]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, [selectedUserId, user?.id]);

  const sendMessage = async () => {
    if (!input.trim() || !user?.id || !selectedUserId) return;
    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      recipient_id: selectedUserId,
      message: input.trim(),
      is_read: false,
    });
    
  if (error) {
    console.error("Failed to send message:", error.message);
  } else {
    setInput(""); // clear input only if successful
  }
};


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return createPortal(
    <Rnd
      default={{
        x: window.innerWidth - 430,
        y: window.innerHeight - 540,
        width: 400,
        height: 500,
      }}
      minWidth={320}
      minHeight={400}
      bounds="window"
      dragHandleClassName="chat-header"
      enableResizing={{ bottom: true, right: true, bottomRight: true }}
      className="fixed z-[9999] rounded-xl bg-white shadow-xl border flex flex-col"
    >
      <div className="chat-header flex justify-between items-center p-3 border-b bg-gray-100 cursor-move">
        <div className="font-semibold text-sm">Messages</div>
        <button onClick={onClose}><X size={18} /></button>
      </div>

      <div className="flex h-full overflow-hidden">
        {/* Contacts Sidebar */}
        <div className="w-1/3 border-r p-2 bg-gray-50 overflow-y-auto text-sm">
          <h4 className="font-semibold text-sm mb-2">Contacts</h4>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedUserId(contact.id)}
              className={cn(
                "cursor-pointer px-3 py-2 rounded-md mb-1 truncate",
                selectedUserId === contact.id
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100"
              )}
            >
              {contact.full_name}
            </div>
          ))}
        </div>

        {/* Messages Area */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center px-4 py-2 border-b bg-white">
            <span className="font-medium text-sm">
              {selectedUserId
                ? contacts.find((c) => c.id === selectedUserId)?.full_name || "Chat"
                : "Select a contact"}
            </span>
            <button onClick={onClose}><X className="w-4 h-4" /></button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 text-sm bg-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "p-2 rounded-md max-w-[75%]",
                  msg.sender_id === user?.id
                    ? "bg-blue-100 ml-auto text-right"
                    : "bg-gray-100 text-left"
                )}
              >
                {msg.message}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t bg-gray-50 flex gap-2">
            <Input
              placeholder={selectedUserId ? "Type a message..." : "Select a contact"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1"
              disabled={!selectedUserId}
            />
            <Button onClick={sendMessage} disabled={!input.trim() || !selectedUserId}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </Rnd>,
    document.body
  );
};

export default ChatPopup;
