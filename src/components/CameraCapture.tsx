'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, CheckCircle2, AlertCircle, X, Shield, SwitchCamera } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onClose?: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isInitializing, setIsInitializing] = useState(true);

  // Start Camera Stream
  const startCamera = useCallback(async (mode: 'user' | 'environment') => {
    setIsInitializing(true);
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      setCameraError(
        'Unable to access your camera. Please check permissions or switch to manual file upload below.'
      );
    } finally {
      setIsInitializing(false);
    }
  }, [stream]);

  useEffect(() => {
    startCamera(facingMode);

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to high quality JPEG data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      onCapture(capturedImage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[96dvh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-zinc-100 text-xs sm:text-base truncate">Live CSJMU ID Verification</h3>
              <p className="text-[11px] sm:text-xs text-zinc-400 truncate">Hold ID card clearly next to your face</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Viewfinder / Capture Area */}
        <div className="relative bg-black aspect-[4/3] sm:aspect-[16/9] max-h-[48vh] sm:max-h-[60vh] flex items-center justify-center overflow-hidden shrink-0">
          {cameraError ? (
            <div className="p-6 text-center max-w-md">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
              <p className="text-zinc-300 text-sm mb-4">{cameraError}</p>
              <button
                type="button"
                onClick={() => startCamera(facingMode)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Try Again
              </button>
            </div>
          ) : capturedImage ? (
            // Preview of captured image
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Captured ID Verification"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-emerald-500/90 text-zinc-950 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                <CheckCircle2 className="w-3.5 h-3.5" /> Snapshot Ready
              </div>
            </div>
          ) : (
            // Live Stream
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
              />

              {/* ID Card Framing Overlay Guide */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4 sm:p-6">
                <div className="w-full h-full border-2 border-dashed border-teal-400/40 rounded-xl relative flex flex-col justify-between p-3 sm:p-4">
                  {/* ID Guide box on bottom left */}
                  <div className="self-end bg-purple-950/80 border border-purple-400/50 rounded-lg p-2 sm:p-2.5 backdrop-blur-sm max-w-[170px] sm:max-w-[200px] text-right">
                    <p className="text-[10px] sm:text-[11px] font-semibold text-purple-300">🪪 Hold CSJMU ID here</p>
                    <p className="text-[8.5px] sm:text-[9px] text-zinc-400">Ensure roll number is legible</p>
                  </div>
                  {/* Face Guide on right */}
                  <div className="self-start bg-teal-950/80 border border-teal-400/50 rounded-lg p-2 sm:p-2.5 backdrop-blur-sm max-w-[170px] sm:max-w-[200px]">
                    <p className="text-[10px] sm:text-[11px] font-semibold text-teal-300">👤 Your Face</p>
                    <p className="text-[8.5px] sm:text-[9px] text-zinc-400">Keep face in camera view</p>
                  </div>
                </div>
              </div>

              {/* Camera Switcher */}
              <button
                type="button"
                onClick={toggleFacingMode}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 p-2.5 rounded-full backdrop-blur-md border border-zinc-700 transition-all shadow-lg cursor-pointer"
                title="Switch Camera"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Controls */}
        <div className="px-4 py-3 sm:px-5 sm:py-4 bg-zinc-900 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shrink-0">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-zinc-400 text-center sm:text-left">
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400 shrink-0" />
            <span>Encrypted & reviewed strictly by CSJMU Proctor Admins.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {capturedImage ? (
              <>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retake
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-semibold text-xs sm:text-sm shadow-glow-purple transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Use Photo
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleCapture}
                disabled={isInitializing || !!cameraError}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-rose-500 to-teal-500 hover:opacity-90 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Camera className="w-4 h-4" /> Capture Snapshot
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
