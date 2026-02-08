"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IoClose, IoCheckmark } from "react-icons/io5";
import { LuClock, LuDumbbell, LuVolume2, LuVideo } from "react-icons/lu";

function formatCountdown(diffMs) {
  if (diffMs <= 0) return "0:00";
  const totalSec = Math.floor(diffMs / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

export default function JoinModal({ classData, timeInfo, onClose }) {
  const [countdown, setCountdown] = useState("");
  const [isLive, setIsLive] = useState(timeInfo.isLive);

  useEffect(() => {
    function update() {
      const now = new Date();
      const start = new Date(classData.start_datetime);
      const diff = start - now;

      if (diff <= 0) {
        setIsLive(true);
        setCountdown("0:00");
      } else {
        setIsLive(false);
        setCountdown(formatCountdown(diff));
      }
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [classData.start_datetime]);

  // Close on escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      <style jsx>{`
        @keyframes scalePulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-scale-pulse {
          animation: scalePulse 1s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full max-w-4xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <IoClose className="w-5 h-5 text-white" />
        </button>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Left Side */}
          <div className="space-y-4">
            {/* Video Preview */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-zinc-900">
              <Image
                src={classData.image_url || "/Thumbnail.jpg"}
                alt={classData.title}
                fill
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Live/Countdown indicator */}
              <div className="absolute inset-0 animate-scale-pulse flex items-center justify-center">
                {isLive ? (
                  <div className="text-center ">
                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <div className="w-16 h-16 bg-red-500 rounded-full"></div>
                    </div>
                    <p className="text-2xl font-bold text-white trackig-tight">Class is LIVE!</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-zinc-100 text-6xl font-bold tracking-tighter font-mono leading-none">
                      {countdown}
                    </p>
                    <p className="text-zinc-200 text-lg tracking-tight font-medium mt-2">
                      Starting soon...
                    </p>
                  </div>
                )}
              </div>

              {/* Instructor badge on preview */}
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                  <Image
                    src={classData.instructor?.avatar_url || "/instruct.jpg"}
                    alt={classData.instructor?.name || "Instructor"}
                    width={48}
                    height={48}
                    className="aspect-square w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-zinc-300">with</p>
                  <p className="font-medium text-white">
                    {classData.instructor?.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Title and Instructor Info */}
            <div>
              <h1 className="text-2xl font-bold text-white mb-3">
                {classData.title}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={classData.instructor?.avatar_url || "/instruct.jpg"}
                      alt={classData.instructor?.name || "Instructor"}
                      width={40}
                      height={40}
                      className="aspect-square w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {classData.instructor?.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {classData.category || "HIIT & Boxing"}
                    </p>
                  </div>
                </div>
                <button className="inline-flex items-center justify-center whitespace-nowrap text-sm transition-all h-8 gap-1.5 bg-white text-black hover:bg-zinc-200 font-medium rounded-full px-4">
                  Follow
                </button>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Before You Join */}
            <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <LuClock className="w-4 h-4" />
                Before You Join
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-green-600">
                    <IoCheckmark className="w-3 h-3 text-white" />
                  </div>
                  <LuDumbbell className="w-4 h-4 text-zinc-400" />
                  <p className="text-sm text-zinc-300">Equipment ready</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-green-600">
                    <IoCheckmark className="w-3 h-3 text-white" />
                  </div>
                  <LuVolume2 className="w-4 h-4 text-zinc-400" />
                  <p className="text-sm text-zinc-300">Audio working</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-green-600">
                    <IoCheckmark className="w-3 h-3 text-white" />
                  </div>
                  <LuVideo className="w-4 h-4 text-zinc-400" />
                  <p className="text-sm text-zinc-300">Camera positioned</p>
                </div>
              </div>
            </div>

            {/* Equipment Needed */}
            <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
              <h3 className="text-sm font-semibold text-white mb-3">
                Equipment Needed
              </h3>
              <div className="flex flex-wrap gap-2">
                {classData.equipment_requirements ? (
                  classData.equipment_requirements
                    .split(",")
                    .map((eq, i) => (
                      <div
                        key={i}
                        className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs rounded-full border border-zinc-700"
                      >
                        {eq.trim()}
                      </div>
                    ))
                ) : (
                  <div className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs rounded-full border border-zinc-700">
                    None
                  </div>
                )}
              </div>
            </div>

            {/* Class Details */}
            <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Duration</span>
                  <span className="text-white font-semibold">
                  {classData.duration_minutes} mins
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Intensity</span>
                <span className="text-white font-semibold">
                  {classData.intensity || "High"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Level</span>
                <span className="text-white font-semibold">
                  {classData.difficulty_levels?.[0]?.difficulty_level_label ||
                    classData.difficulty_level ||
                    "All Levels"}
                </span>
              </div>
            </div>

            {/* Join Button */}
            <button
              className={`inline-flex items-center justify-center gap-2  whitespace-nowrap  font-medium transition-all h-10 rounded-md px-6 w-full ${
              
                isLive
                  ? "bg-red-600 hover:bg-red-700 text-white tracking-tight"
                  : "bg-zinc-900  text-zinc-600 text-[15px]"
              }`}
            >
              {isLive ? "Join Class Now" : `Join in ${countdown}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
