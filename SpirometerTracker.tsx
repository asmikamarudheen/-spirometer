"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Loader2 } from "lucide-react";

interface SpirometerTrackerProps {
  onLevelChange: (level: number) => void;
  targetColor?: "red" | "green" | "blue" | "yellow";
}

// Ensure TypeScript doesn't complain about window.cv
declare global {
  interface Window {
    cv: any;
  }
}

export default function SpirometerTracker({
  onLevelChange,
  targetColor = "red",
}: SpirometerTrackerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvReady, setCvReady] = useState(false);

  const smoothedLevelRef = useRef<number>(0);
  const prevReportedLevelRef = useRef<number>(-1);

  // Poll for OpenCV.js load
  useEffect(() => {
    const checkCv = setInterval(() => {
      if (window.cv && window.cv.Mat) {
        setCvReady(true);
        clearInterval(checkCv);
      }
    }, 500);
    return () => clearInterval(checkCv);
  }, []);

  useEffect(() => {
    if (!isTracking || !cvReady || !videoRef.current || !canvasRef.current) return;

    let animationFrameId: number;
    const cv = window.cv;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Memory management: pre-allocate Mats outside the loop
    const width = 640;
    const height = 480;
    
    // Ensure video is playing at known dimensions
    video.width = width;
    video.height = height;
    canvas.width = width;
    canvas.height = height;

    let src = new cv.Mat(height, width, cv.CV_8UC4);
    let dst = new cv.Mat(height, width, cv.CV_8UC1);
    let hsv = new cv.Mat(height, width, cv.CV_8UC3);
    let cap = new cv.VideoCapture(video);

    // Setup color boundaries (HSV)
    let lowBound: any;
    let highBound: any;

    if (targetColor === "red") {
      lowBound = new cv.Mat(height, width, hsv.type(), [0, 120, 70, 0]);
      highBound = new cv.Mat(height, width, hsv.type(), [15, 255, 255, 255]);
    } else {
      lowBound = new cv.Mat(height, width, hsv.type(), [0, 100, 100, 0]);
      highBound = new cv.Mat(height, width, hsv.type(), [15, 255, 255, 255]);
    }

    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();

    const processFrame = () => {
      try {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          cap.read(src);

          cv.cvtColor(src, hsv, cv.COLOR_RGBA2RGB);
          cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);

          cv.inRange(hsv, lowBound, highBound, dst);
          cv.findContours(dst, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

          let maxArea = 0;
          let maxIndex = -1;
          for (let i = 0; i < contours.size(); ++i) {
            let cnt = contours.get(i);
            let area = cv.contourArea(cnt);
            if (area > maxArea && area > 500) {
              maxArea = area;
              maxIndex = i;
            }
          }

          let rawLevel = 0;
          if (maxIndex !== -1) {
            let cnt = contours.get(maxIndex);
            let moments = cv.moments(cnt, false);
            let cy = moments.m01 / moments.m00;
            
            rawLevel = 1.0 - (cy / height);
            rawLevel = Math.max(0, Math.min(1, rawLevel));

            let rect = cv.boundingRect(cnt);
            let point1 = new cv.Point(rect.x, rect.y);
            let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
            cv.rectangle(src, point1, point2, [0, 255, 0, 255], 3, cv.LINE_AA, 0);
          }

          cv.imshow(canvas, src);

          // EMA Smoothing for the game engine
          const smoothingFactor = 0.2;
          smoothedLevelRef.current = 
            (rawLevel * smoothingFactor) + (smoothedLevelRef.current * (1 - smoothingFactor));

          const finalLevel = smoothedLevelRef.current < 0.05 ? 0 : smoothedLevelRef.current;
          
          // THROTTLE: Only update React state if the value changed significantly (by at least 1%)
          // This prevents microscopic floating-point jitter from causing 60 state updates per second
          // which can overwhelm React and cause "Maximum update depth exceeded" errors in complex apps.
          if (Math.abs(finalLevel - prevReportedLevelRef.current) > 0.01 || finalLevel === 0) {
            prevReportedLevelRef.current = finalLevel;
            onLevelChange(finalLevel);
          }
        }
      } catch (err) {
        console.error("OpenCV Processing Error:", err);
      }

      animationFrameId = requestAnimationFrame(processFrame);
    };

    // Start loop
    animationFrameId = requestAnimationFrame(processFrame);

    // Cleanup function when unmounting or stopping
    return () => {
      cancelAnimationFrame(animationFrameId);
      // PREVENT MEMORY LEAKS! WebAssembly does not garbage collect Mats.
      try {
        src.delete();
        dst.delete();
        hsv.delete();
        lowBound.delete();
        highBound.delete();
        contours.delete();
        hierarchy.delete();
      } catch (e) {
        console.error("Error during OpenCV cleanup", e);
      }
    };
  }, [isTracking, cvReady, onLevelChange, targetColor]);

  const startTracking = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsTracking(true);
        setError(null);
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setError("Could not access webcam. Please ensure permissions are granted.");
    }
  };

  const stopTracking = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsTracking(false);
    onLevelChange(0);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl max-w-sm w-full">
      <div className="flex items-center justify-between w-full mb-4">
        <h2 className="text-lg font-semibold text-slate-200">Spirometer Tracker</h2>
        <div className="flex items-center gap-2">
          {!cvReady && <span className="text-xs text-slate-400">Loading CV...</span>}
          <div className={`w-3 h-3 rounded-full ${!cvReady ? 'bg-yellow-500 animate-pulse' : isTracking ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
        </div>
      </div>

      <div className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden mb-4 border-2 border-slate-700">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover hidden"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-10"
          id="canvasOutput"
        />
        {!isTracking && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 flex-col gap-2 z-0">
            <CameraOff size={32} />
            <span className="text-sm">Camera inactive</span>
          </div>
        )}
      </div>

      {error && (
        <div className="w-full p-3 mb-4 text-sm text-red-200 bg-red-900/50 rounded-lg border border-red-800">
          {error}
        </div>
      )}

      {isTracking ? (
        <button
          onClick={stopTracking}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
        >
          Stop Camera
        </button>
      ) : (
        <button
          onClick={startTracking}
          disabled={!cvReady}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {!cvReady ? (
            <><Loader2 className="animate-spin" size={20} /> Loading OpenCV...</>
          ) : (
            <><Camera size={20} /> Start Camera</>
          )}
        </button>
      )}

      <div className="mt-4 text-xs text-slate-400 text-center">
        Powered by OpenCV.js. Tracking the <strong>{targetColor}</strong> object using HSV color space.
      </div>
    </div>
  );
}
