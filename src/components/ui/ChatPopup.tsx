import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface ChatPopupProps {
  currentUserId: string;
  peerId: string;
  onClose: () => void;
}

const ChatPopup: React.FC<ChatPopupProps> = ({ currentUserId, peerId, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUserId || !peerId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order("created_at", { ascending: true });

      setMessages(data?.filter((m) =>
        (m.sender_id === currentUserId && m.receiver_id === peerId) ||
        (m.sender_id === peerId && m.receiver_id === currentUserId)
      ) || []);
    };

    fetchMessages();

    const subscription = supabase
      .channel("realtime:messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new as Message;
        if (
          (msg.sender_id === currentUserId && msg.receiver_id === peerId) ||
          (msg.sender_id === peerId && msg.receiver_id === currentUserId)
        ) {
          setMessages((prev) => [...prev, msg]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [currentUserId, peerId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await supabase.from("messages").insert({
      sender_id: currentUserId,
      receiver_id: peerId,
      message: newMessage,
      is_read: false,
    });

    setNewMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg w-80 h-[400px] flex flex-col z-50 resize overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-semibold text-sm">Chat</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
              msg.sender_id === currentUserId ? "ml-auto bg-blue-100 text-blue-900" : "mr-auto bg-gray-100 text-gray-800"
            }`}
          >
            {msg.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t flex items-center space-x-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
};

export default ChatPopup;
