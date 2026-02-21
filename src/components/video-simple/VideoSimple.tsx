"use client";


import { CONFIG } from "@/lib/config";
import { useEffect, useState } from "react";
import axios from "axios";


interface VideoSimpleProps {
  eventId: string | number;
}

export const VideoSimple: React.FC<VideoSimpleProps> = ({ eventId }) => {
  const [iframeUrl, setIframeUrl] = useState<string>("");

  async function getStreamData(params: any) {
    try {
      const res = await axios.post(CONFIG.exchEventsStreaming, params);
      return res.data;
    } catch (error: any) {
      console.error("Stream API error:", error);
      return null;
    }
  }

  useEffect(() => {
    let alive = true;

    const loadStream = async () => {
      try {
        const res = await getStreamData({
          eventId,
          _t: Date.now(),
        });

        const data = res?.data;
        if (!data) return;

        const { streamingName, url, token = "", appName } = data;

        setIframeUrl(
          `https://iframe.ltve.live/videoPlayer.html?appName=${appName}&streamingName=${streamingName}&url=${url}&token=${token}`
        );
      } catch (e) {
      }
    };

    if (eventId !== "99.0062") {
      loadStream();
    }

    return () => {
      alive = false;
      setIframeUrl(``);
    };
  }, [eventId]);

  

  if (!iframeUrl) return null;

  return (
    <div className="player-container aspect-video h-full md:h-auto">
      <iframe
        src={iframeUrl}
        width="100%"
        style={{ aspectRatio: "16 / 9", height: "auto" }}
        allow="autoplay; fullscreen"
      />
    </div>
  );
};
