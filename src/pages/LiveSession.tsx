import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DailyIframe from "@daily-co/daily-js";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

const LiveSession = () => {
  const [callFrame, setCallFrame] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const room = searchParams.get("room");
  const studentId = searchParams.get("student_id");

  useEffect(() => {
    const setupSession = async () => {
      if (room) {
        setRoomUrl(room);
        return;
      }

      try {
        const response = await fetch("https://api.daily.co/v1/rooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer YOUR_DAILY_API_KEY_HERE`,
          },
          body: JSON.stringify({
            properties: {
              enable_chat: true,
              start_video_off: false,
              start_audio_off: false,
            },
          }),
        });

        const data = await response.json();
        if (!data.url) throw new Error("Failed to create room");

        setRoomUrl(data.url);

        // Save to Supabase
        await supabase.from("live_sessions").insert({
          tutor_id: user?.id,
          student_id: studentId,
          room_url: data.url,
          started_at: new Date().toISOString(),
        });

        navigate(`/session?room=${encodeURIComponent(data.url)}`, { replace: true });
      } catch (err) {
        console.error("Error setting up session:", err);
      }
    };

    setupSession();
  }, [room, studentId, user?.id, navigate]);

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

  const handleEndSession = async () => {
    await supabase
      .from("live_sessions")
      .update({
        ended_at: new Date().toISOString(),
        status: "completed",
      })
      .eq("room_url", roomUrl);

    navigate("/");
  };

  return (
    <div className="flex h-screen flex-col relative">
      <div className="flex-1 bg-black" id="daily-video" />

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-2 rounded-xl flex gap-4 shadow-lg z-50">
        <button onClick={() => setShowWhiteboard(!showWhiteboard)}>
          📝 {showWhiteboard ? "Hide" : "Show"} Whiteboard
        </button>
        <button>🎤 Mute</button>
        <button>🎥 Camera</button>
        <button onClick={handleEndSession}>❌ End Session</button>
      </div>

      {showWhiteboard && (
        <div className="fixed inset-0 z-40 bg-white">
          <div className="flex justify-between items-center bg-gray-100 p-3 border-b">
            <span className="font-medium">Whiteboard</span>
            <button className="text-red-500 text-sm" onClick={() => setShowWhiteboard(false)}>Close</button>
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
