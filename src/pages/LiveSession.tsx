import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DailyIframe from "@daily-co/daily-js";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";


const LiveSession = () => {
  const [callFrame, setCallFrame] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const { user } = useAuth();

  const handleStartOrJoin = () => {
    navigate("/session"); // LiveSession.tsx will auto-create or join via useSearchParams
  };
  

  useEffect(() => {
    const room = searchParams.get("room");

    const fetchOrCreateRoom = async () => {
      if (room) {
        setRoomUrl(room);
        return;
      }

      try {
        const response = await fetch("https://api.daily.co/v1/rooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 1809d1ce5b692e456f0eb38f96ab771ef3d9ecd1ffecab20717d5bc960e15b7b`,
          },
          body: JSON.stringify({
            properties: {
              enable_chat: true,
              enable_knocking: false,
              start_video_off: false,
              start_audio_off: false,
            },
          }),
        });

        const data = await response.json();
        if (!data?.url) throw new Error("Failed to create room");

        setRoomUrl(data.url);

        // Save session to Supabase
        await supabase.from("live_sessions").insert({
          tutor_id: user?.id,
          room_url: data.url,
          started_at: new Date().toISOString(),
        });

        // Update URL with ?room param
        navigate(`/session?room=${encodeURIComponent(data.url)}`, { replace: true });
      } catch (err) {
        console.error("Error creating room:", err);
      }
    };

    fetchOrCreateRoom();
  }, [searchParams, navigate, user?.id]);

  useEffect(() => {
    if (!roomUrl) return;

    const frame = DailyIframe.createFrame({
      showLeaveButton: true,
      iframeStyle: {
        width: "100%",
        height: "100vh",
        border: "0px",
      },
    });

    frame.join({ url: roomUrl });
    document.getElementById("daily-video")?.appendChild(frame.iframe());
    setCallFrame(frame);

    return () => {
      frame.leave();
      frame.destroy();
    };
  }, [roomUrl]);

  return (
    <div className="flex h-screen flex-col relative">
      {/* VIDEO SECTION */}
      <div className="flex-1 bg-black" id="daily-video" />
  
      {/* Control Bar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-2 rounded-xl flex gap-4 shadow-lg z-50">
        <button onClick={() => setShowWhiteboard(!showWhiteboard)}>
          📝 {showWhiteboard ? "Hide" : "Show"} Whiteboard
        </button>
        <button>🎤 Mute</button>
        <button>🎥 Camera</button>
        <button onClick={() => navigate("/")}>❌ End Session</button>
      </div>
  
      {/* Conditional Whiteboard */}
      {showWhiteboard && (
        <div className="fixed inset-0 z-40 bg-white">
          <div className="flex justify-between items-center bg-gray-100 p-3 border-b">
            <span className="font-medium">Whiteboard</span>
            <button
              className="text-red-500 text-sm"
              onClick={() => setShowWhiteboard(false)}
            >
              Close
            </button>
          </div>
          <iframe
            src="https://excalidraw.com"
            width="100%"
            height="100%"
            allow="camera; microphone"
            className="w-full h-full border-none"
          
          />
        </div>
      )}
    </div>
  );
};

export default LiveSession;
