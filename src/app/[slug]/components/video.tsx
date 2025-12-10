"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios"

export const VideoLogic = ({ blob, setBlob }: { blob: Blob | null; setBlob: React.Dispatch<React.SetStateAction<Blob | null>> }) => {
  const [recording, setRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);


  useEffect(() => {
    initializeCamera();
    return () => stopCamera();
  }, []);


  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.style.transform = "scaleX(-1)";
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current);
    recorderRef.current = recorder;

    recorder.ondataavailable = (event: BlobEvent) => {
      chunksRef.current.push(event.data);
    };

    recorder.onstop = () => {
      const videoBlob = new Blob(chunksRef.current, { type: "video/webm" });
      setBlob(videoBlob);

      stopCamera();
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = URL.createObjectURL(videoBlob);
        videoRef.current.style.transform = "scaleX(1)";
      }
    };

    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
      setRecording(false);
    }
  };

  const recordAgain = () => {
    setBlob(null);
    setRecording(false);
    initializeCamera();
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-black shadow-lg">

        <video
          ref={videoRef}
          autoPlay
          muted={!blob}
          controls={!!blob}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Controls Overlay */}
        {!blob ? (
          // Start / Stop Recording Buttons
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            {!recording ? (
              <button
                onClick={startRecording}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-all font-semibold"
              >
                ● Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-full shadow-lg transition-all font-semibold"
              >
                ■ Stop Recording
              </button>
            )}
          </div>
        ) : (
          // RECORD AGAIN BUTTON INSIDE VIDEO
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <button
              onClick={recordAgain}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all font-semibold"
            >
              ↺ Record Again
            </button>
          </div>
        )}

        {/* Recording Indicator */}
        {recording && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded-full text-white shadow-md">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            Recording...
          </div>
        )}
      </div>
    </div>
  );
};
