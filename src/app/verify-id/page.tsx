'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { CameraCapture } from '@/components/CameraCapture';
import {
  Camera,
  Upload,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export default function VerifyIdPage() {
  const { currentUser, submitVerification } = useAuth();

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(currentUser?.id_card_url || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const handleCameraCapture = (dataUrl: string) => {
    setPreviewImage(dataUrl);
    setIsCameraOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!previewImage) return;
    setIsSubmitting(true);
    try {
      await submitVerification(previewImage);
      setSuccessNotice(true);
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const status = currentUser?.verification_status || 'unverified';

  return (
    <div className="min-h-[88vh] py-12 px-4 sm:px-6 max-w-3xl mx-auto">
      {/* Live Camera Viewfinder Modal */}
      {isCameraOpen && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setIsCameraOpen(false)}
        />
      )}

      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative">
        {/* Verification Status Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> University ID Review
            </div>

            {/* Current Status Pill */}
            {status === 'verified' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-400 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-500/40">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Account
              </span>
            )}
            {status === 'pending' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40 animate-pulse">
                <Clock className="w-3.5 h-3.5" /> Under Review
              </span>
            )}
            {status === 'rejected' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/40">
                <AlertCircle className="w-3.5 h-3.5" /> Needs Re-upload
              </span>
            )}
            {status === 'unverified' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
                Unverified
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Verify Your CSJMU Student ID
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            To keep Find My Vibe safe and authentic for hostelites, take a quick selfie holding your CSJMU university ID card.
          </p>
        </div>

        {/* Status Messages */}
        {status === 'verified' ? (
          <div className="p-6 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-center space-y-4">
            <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto text-teal-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">You Are 100% Verified!</h2>
              <p className="text-xs text-zinc-400 mt-1">
                You have full access to student profile photos, hostel branches, and direct messaging.
              </p>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 text-white font-bold text-xs shadow-glow-purple"
            >
              <span>Go to Campus Feed</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : status === 'pending' || successNotice ? (
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-400 animate-pulse">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">ID Card Under Admin Review</h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                Thank you! Your ID submission has been uploaded to our private proctor queue. You will receive full access as soon as it is approved.
              </p>
            </div>

            {previewImage && (
              <div className="max-w-xs mx-auto rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950 p-1">
                <img src={previewImage} alt="Submitted ID" className="w-full h-40 object-cover rounded-lg" />
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/discover"
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
              >
                Browse in Restricted Mode
              </Link>
              <Link
                href="/admin/verifications"
                className="px-5 py-2.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300 text-xs font-semibold"
              >
                Simulate Admin Approval →
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Guide Info Box */}
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center shrink-0 p-1 relative overflow-hidden">
                <div className="w-full h-full bg-gradient-to-tr from-purple-800/40 to-teal-800/40 rounded-lg flex flex-col items-center justify-center text-center p-1">
                  <Camera className="w-6 h-6 text-teal-400 mb-1" />
                  <span className="text-[9px] font-bold text-zinc-300">Selfie + ID</span>
                </div>
              </div>
              <div className="text-xs text-zinc-300 space-y-1">
                <h3 className="font-bold text-white text-sm">How to take your verification photo:</h3>
                <ul className="list-disc list-inside text-zinc-400 space-y-1">
                  <li>Hold your physical CSJMU Student ID card next to your face.</li>
                  <li>Ensure your <strong>Roll Number, Department, and Photo</strong> on the card are clearly legible.</li>
                  <li>Take the photo in good campus lighting (e.g. room or daylight).</li>
                </ul>
              </div>
            </div>

            {/* Photo Capture & Upload Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Live Camera (Recommended) */}
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/40 to-zinc-900 border border-purple-500/30 hover:border-purple-500/60 transition-all text-left group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold mb-2">
                    Recommended
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Live Camera Selfie
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Open webcam or phone camera with on-screen card framing guidelines.
                  </p>
                </div>
                <div className="mt-4 text-xs font-semibold text-purple-400 flex items-center gap-1">
                  <span>Open Camera</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option 2: Upload File */}
              <label className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800 hover:border-teal-500/40 transition-all text-left group flex flex-col justify-between cursor-pointer">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[10px] font-bold mb-2">
                    Gallery / Files
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Upload ID Photo
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Upload an existing JPEG/PNG snapshot from your phone or device.
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="mt-4 text-xs font-semibold text-teal-400 flex items-center gap-1">
                  <span>Choose Image</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </label>
            </div>

            {/* Preview of captured image */}
            {previewImage && (
              <div className="p-4 rounded-2xl bg-zinc-950 border border-purple-500/40 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    Selected ID Snapshot Preview
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewImage(null)}
                    className="text-rose-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                  <img
                    src={previewImage}
                    alt="ID Preview"
                    className="w-full h-full object-contain bg-black/40"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-rose-500 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold text-sm shadow-glow-purple transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting to Proctor Queue...' : 'Submit ID for Verification'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Skip / Restricted Mode Link */}
            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
              <span>You can verify anytime from your profile</span>
              <Link
                href="/discover"
                className="text-zinc-400 hover:text-zinc-200 underline underline-offset-4"
              >
                Skip for now & browse in restricted mode →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
