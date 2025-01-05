import React, { useRef, useState } from "react";
import "./layout.scss";
const ScreenShare = () => {
  const videoRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true, // Eğer ekran paylaşımı sırasında ses gerekiyorsa ekleyin
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsSharing(true);

        // Ekran paylaşımı durdurulduğunda olayı dinleyin
        stream.getVideoTracks()[0].onended = () => {
          stopScreenShare();
        };
      }
    } catch (error) {
      console.error("Ekran paylaşımı başlatılamadı:", error);
    }
  };

  const stopScreenShare = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop()); // Tüm akışları durdur
      videoRef.current.srcObject = null;
    }
    setIsSharing(false);
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", height: "auto", border: "1px solid #ccc" }}
      ></video>
      <div style={{ marginTop: "10px" }}>
        {!isSharing ? (
          <button onClick={startScreenShare}>Ekran Paylaşımını Başlat</button>
        ) : (
          <button onClick={stopScreenShare}>Ekran Paylaşımını Durdur</button>
        )}
      </div>
    </div>
  );
};

export default ScreenShare;
