"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import JoinModal from "./JoinModal";
import { FiClock } from "react-icons/fi";
import { LuFlame, LuDumbbell } from "react-icons/lu";
import { IoMdTrendingUp } from "react-icons/io";
import { IoChevronUp, IoChevronDown, IoPlayOutline, IoClose } from "react-icons/io5";

function getTimeUntilStart(startDatetime) {
  const now = new Date();
  const start = new Date(startDatetime);
  const diffMs = start - now;

  if (diffMs <= 0) return { isLive: true, diffMs: 0, diffMins: 0, diffHours: 0 };

  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins === 0) return { isLive: true, diffMs: 0, diffMins: 0, diffHours: 0 };

  const diffHours = Math.floor(diffMins / 60);

  return { isLive: false, diffMs, diffMins, diffHours };
}

function formatDuration(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0 && mins > 0) return `${hrs}:${String(mins).padStart(2, "0")}`;
  if (hrs > 0) return `${hrs}:00`;
  return `${mins}:00`;
}

function ThumbnailBadges({ timeInfo }) {
  if (timeInfo.isLive) {
    return (
      <div className="absolute top-1 left-1">
        <div className="px-2 py-0.5 text-xs rounded-md font-medium bg-red-600 text-white">
          LIVE
        </div>
      </div>
    );
  }

  if (timeInfo.diffMins > 0 && timeInfo.diffMins <= 10) {
    return (
      <div className="absolute top-1 left-1">
        <div className="px-2 py-0.5 text-xs rounded-md font-medium bg-orange-600 text-white">
          {timeInfo.diffMins}m
        </div>
      </div>
    );
  }

  return null;
}

function TimeStatusText({ timeInfo }) {
  if (timeInfo.isLive) return "Live now";
  if (timeInfo.diffMins > 0) return `in ${timeInfo.diffMins} minutes`;
  return "Upcoming";
}


function JoinButton({ timeInfo, isLoggedIn, onClick, fullWidth = false }) {
  const isLive = timeInfo.isLive;
  const isSoon = !isLive && timeInfo.diffMins > 0 && timeInfo.diffMins <= 10;
  const baseClasses = `inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all h-10 rounded-md px-6 gap-2${fullWidth ? ' w-full shadow-lg' : ''}`;

  let colorClasses;
  let label;

  if (!isLoggedIn) {
    colorClasses = 'bg-blue-600 hover:bg-blue-700 text-white';
    label = 'Login to Join';
  } else if (isLive) {
    colorClasses = 'bg-red-600 hover:bg-red-700 text-white';
    label = 'Join Live Class';
  } else if (isSoon) {
    colorClasses = 'bg-orange-600 hover:bg-orange-700 text-white';
    label = 'Join Class';
  } else {
    colorClasses = 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300';
    label = `Starts in ${timeInfo.diffMins} ${timeInfo.diffMins === 1 ? 'min' : 'mins'}`;
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${colorClasses}`}>
      
      
      
    {isLive && (<IoPlayOutline className="w-5 h-5" />)}
      {label}
    </button>
  );
}

function SimilarClassCard({ cls, onClick }) {
  const clsTime = getTimeUntilStart(cls.start_datetime);
  return (
    <button
      onClick={onClick}
      className="w-full text-left group transition-all rounded-lg hover:bg-zinc-800/30"
    >
      <div className="flex gap-2 p-2">
        <div className="relative w-[168px] flex-shrink-0 rounded-lg overflow-hidden bg-zinc-900">
          <div className="aspect-video">
            <Image
              src={cls.image_url || "/Thumbnail.jpg"}
              alt={cls.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-1 right-1 bg-black/90 px-1.5 py-0.5 rounded text-xs font-medium text-white">
            {formatDuration(cls.duration_minutes)}
          </div>
          <ThumbnailBadges timeInfo={clsTime} />
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="text-sm font-medium text-white mb-1.5 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
            {cls.title}
          </h3>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="relative flex size-10 shrink-0 overflow-hidden rounded-full w-5 h-5">
              <Image
                src={cls.instructor?.avatar_url || "/instruct.jpg"}
                alt={cls.instructor?.name || "Instructor"}
                width={20}
                height={20}
                className="aspect-square size-full object-cover"
              />
            </span>
            <p className="text-xs text-zinc-400 truncate">
              {cls.instructor?.name}
            </p>
          </div>
          <p className="text-xs text-zinc-500">
            <TimeStatusText timeInfo={clsTime} />
          </p>
        </div>
      </div>
    </button>
  );
}

export default function ClassView({ classes, onClose }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [, setTick] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Login state

  const featured = classes[selectedIndex] || classes[0];
  const similar = classes.filter((_, i) => i !== selectedIndex);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeInfo = getTimeUntilStart(featured.start_datetime);
  const canJoin = timeInfo.isLive || timeInfo.diffMins > 0;

  const handleJoinClick = useCallback(() => {
    if (!isLoggedIn) {
      // Redirect to login or show login modal
      alert('Please log in to join the class');
      return;
    }
    if (canJoin) {
      setShowModal(true);
      document.body.style.overflow = 'hidden';
    }
  }, [canJoin, isLoggedIn]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    document.body.style.overflow = 'unset';
  }, []);

  const handleSimilarClick = useCallback(
    (cls) => {
      const idx = classes.findIndex((c) => c.id === cls.id);
      if (idx !== -1) {
        setSelectedIndex(idx);
        setDescExpanded(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [classes]
  );

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return (
    <>
      <main className="min-h-screen bg-zinc-950">
        {/* Mobile Header - Close and Login Toggle */}
        <div className="absolute top-4 right-4 z-50 lg:hidden flex items-center gap-2">
          <button
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-white text-xs rounded-lg border border-zinc-600 transition-colors"
          >
            {isLoggedIn ? 'Logged In' : 'Logged Out'}
          </button>
          {showModal && (
            <button
              onClick={handleClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition-colors"
              aria-label="Close"
            >
              <IoClose className="w-6 h-6 text-white" />
            </button>
          )}
        </div>

        {/* Login Toggle Button - Desktop Only */}
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-lg border border-zinc-600 transition-colors hidden lg:block"
        >
          {isLoggedIn ? 'Logged In' : 'Logged Out'} <span className="text-zinc-500">(Click to toggle)</span>
        </button>

        <div className="max-w-[1800px] mx-auto">
          <div className="lg:flex lg:gap-6 lg:p-6">
            {/* Left Column - Featured Class */}
            <div className="lg:flex-1 lg:max-w-[70%]" style={{ opacity: 1 }}>
              <div className="space-y-6 p-4 lg:p-0 pb-24 lg:pb-0">
                {/* Hero Image */}
                <div className="relative w-full rounded-lg overflow-hidden bg-zinc-900 aspect-video">
                  <Image
                    src={featured.image_url || "/Thumbnail.jpg"}
                    alt={featured.title}
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top-left badge */}
                  <div className="absolute top-4 left-4">
                    {timeInfo.isLive ? (
                      <div className="px-3 py-1 text-sm rounded-md font-medium bg-red-600 text-white">
                        LIVE
                      </div>
                    ) : timeInfo.diffMins > 0 && timeInfo.diffMins <= 10 ? (
                      <div className="px-3 py-1 text-sm rounded-md font-medium bg-orange-600 text-white">
                        Starts in {timeInfo.diffMins} {timeInfo.diffMins === 1 ? 'min' : 'mins'}
                      </div>
                    ) : timeInfo.diffMins > 10 ? (
                      <div className="px-3 py-1 text-sm rounded-md font-semibold bg-zinc-800 text-white/90 ">
                        Upcoming
                      </div>
                    ) : null}
                  </div>

                  {/* Bottom-right "Starts in" badge for > 10 min - desktop only */}
                  {!timeInfo.isLive && timeInfo.diffMins > 10 && (
                    <div className="absolute bottom-4 right-4 bg-zinc-800 px-6 py-2 rounded-lg text-[13px] font-semibold text-zinc-600 hidden lg:block">
                      Starts in {timeInfo.diffMins} {timeInfo.diffMins === 1 ? 'min' : 'mins'}
                    </div>
                  )}

                  {/* Instructor overlay bottom-left */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <span className="relative flex size-10 shrink-0 overflow-hidden rounded-full w-12 h-12 border-2 border-white">
                      <Image
                        src={featured.instructor?.avatar_url || "/instruct.jpg"}
                        alt={featured.instructor?.name || "Instructor"}
                        width={48}
                        height={48}
                        className="aspect-square size-full object-cover"
                      />
                    </span>
                    <div>
                      <p className="text-sm text-zinc-300">with</p>
                      <p className="font-medium text-white">
                        {featured.instructor?.name}
                      </p>
                    </div>
                  </div>

                  {/* Desktop Join Button - bottom right */}
                  <div className="absolute bottom-4 right-4 hidden lg:block">
                    <JoinButton timeInfo={timeInfo} isLoggedIn={isLoggedIn} onClick={handleJoinClick} />
                  </div>

                  {/* Mobile Join Button - center overlay */}
                  <div className="absolute inset-0 flex items-center justify-center lg:hidden pointer-events-none">
                    <div className="pointer-events-auto">
                      <JoinButton timeInfo={timeInfo} isLoggedIn={isLoggedIn} onClick={handleJoinClick} />
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                  {/* Duration */}
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                      <FiClock className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Duration</p>
                      <p className="text-sm font-medium text-white">
                        {featured.duration_minutes} mins
                      </p>
                    </div>
                  </div>

                  {/* Intensity */}
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-orange-600/20 flex items-center justify-center">
                      <LuFlame className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Intensity</p>
                      <p className="text-sm font-medium text-white">
                        {featured.intensity || "High"}
                      </p>
                    </div>
                  </div>

                  {/* Level */}
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                      <IoMdTrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Level</p>
                      <p className="text-sm font-medium text-white">
                        {featured.difficulty_levels?.[0]?.difficulty_level_label ||
                          featured.difficulty_level ||
                          "All Levels"}
                      </p>
                    </div>
                  </div>

                  {/* Equipment */}
                  <div className="flex items-center gap-2 col-span-2 lg:col-span-1">
                    <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                      <LuDumbbell className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-zinc-400">Equipment</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs bg-zinc-800 text-zinc-300 border-zinc-700">
                          None
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Card */}
                <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    {featured.title}
                  </h2>
                  {(() => {
                    const paragraphs = featured.description?.split("\n").filter((line) => line.trim() !== "") || [];
                    const hasMore = paragraphs.length > 2;
                    const visibleParagraphs = descExpanded ? paragraphs : paragraphs.slice(0, 2);
                    return (
                      <>
                        <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                          {visibleParagraphs.join("\n\n")}
                        </div>
                        {hasMore && (
                          <button
                            onClick={() => setDescExpanded(!descExpanded)}
                            className="mt-3 flex items-center gap-1 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                          >
                            {descExpanded ? "Read less" : "Read more"}
                            {descExpanded ? (
                              <IoChevronUp className="w-4 h-4 transition-transform" />
                            ) : (
                              <IoChevronDown className="w-4 h-4 transition-transform" />
                            )}
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Mobile Similar Classes */}
                <div className="lg:hidden">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-white mb-3 px-2">
                      Similar Classes
                    </h3>
                    {similar.map((cls) => (
                      <SimilarClassCard key={cls.id} cls={cls} onClick={() => handleSimilarClick(cls)} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Sidebar - Similar Classes */}
            <div className="hidden lg:block lg:w-[400px] lg:flex-shrink-0">
              <div className="sticky top-6">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-white mb-3 px-2">
                    Similar Classes
                  </h3>
                  {similar.map((cls) => (
                    <SimilarClassCard key={cls.id} cls={cls} onClick={() => handleSimilarClick(cls)} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Mobile Join Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent lg:hidden z-40">
          <JoinButton timeInfo={timeInfo} isLoggedIn={isLoggedIn} onClick={handleJoinClick} fullWidth />
        </div>
      </main>

      {/* Join Class Modal */}
      {showModal && (
        <JoinModal
          classData={featured}
          timeInfo={timeInfo}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}