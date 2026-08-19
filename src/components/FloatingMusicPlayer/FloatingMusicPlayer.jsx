import {
  motion,
  animate,
  useMotionValue,
} from "framer-motion";

import { useEffect, useRef } from "react";
import "./FloatingMusicPlayer.css";

export default function FloatingMusicPlayer({
  song,
  isPlaying,
  progress,
  duration,
  onPlayPause,
  onSeek,
  onClose,
  formatTime,
}) {
      const playerRef = useRef(null);
      const constraintsRef = useRef(null);

        const savedPosition = (() => {
        try {
            const saved = localStorage.getItem(
            "vl-floating-player-position-v4"
        );

        return saved
        ? JSON.parse(saved)
        : { x: 0, y: 0 };
        } catch {
        return { x: 0, y: 0 };
    }
        })();

        const x = useMotionValue(savedPosition.x);
        const y = useMotionValue(savedPosition.y);

        const snapToNearestEdge = () => {
        const player = playerRef.current;

        if (!player) return;

        const rect = player.getBoundingClientRect();

        const margin = 14;

        const distances = {
            left: rect.left,
            right: window.innerWidth - rect.right,
            top: rect.top,
            bottom: window.innerHeight - rect.bottom,
        };

  const nearestEdge = Object.keys(distances).reduce(
    (closest, edge) =>
      distances[edge] < distances[closest]
        ? edge
        : closest,
    "left"
  );

  let targetX = x.get();
  let targetY = y.get();

  if (nearestEdge === "left") {
    targetX += margin - rect.left;
  }

  if (nearestEdge === "right") {
    targetX +=
      window.innerWidth -
      rect.width -
      margin -
      rect.left;
  }

  if (nearestEdge === "top") {
    targetY += margin - rect.top;
  }

  if (nearestEdge === "bottom") {
    const bottomSafeArea = 150;

    targetY +=
      window.innerHeight -
      bottomSafeArea -
      rect.height -
      rect.top;
    }

  animate(x, targetX, {
    type: "spring",
    stiffness: 280,
    damping: 28,
    mass: 0.7,
  });

  animate(y, targetY, {
    type: "spring",
    stiffness: 280,
    damping: 28,
    mass: 0.7,
  });

  localStorage.setItem(
    "vl-floating-player-position-v4",
    JSON.stringify({
      x: targetX,
      y: targetY,
    })
  );
};

const saveCurrentPosition = () => {
  localStorage.setItem(
    "vl-floating-player-position-v4",
    JSON.stringify({
      x: x.get(),
      y: y.get(),
    })
  );
};

useEffect(() => {
  const handleResize = () => {
    const player = playerRef.current;

    if (!player) return;

    const rect = player.getBoundingClientRect();

    const margin = 14;

    let targetX = x.get();
    let targetY = y.get();

    if (rect.right > window.innerWidth - margin) {
      targetX -=
        rect.right -
        (window.innerWidth - margin);
    }

    if (rect.left < margin) {
      targetX += margin - rect.left;
    }

    const bottomSafeArea = 150;

    if (rect.bottom > window.innerHeight - bottomSafeArea) {
        targetY -=
            rect.bottom -
            (window.innerHeight - bottomSafeArea);
        }

    if (rect.top < margin) {
      targetY += margin - rect.top;
    }

    animate(x, targetX, {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    });

    animate(y, targetY, {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    });

    localStorage.setItem(
      "vl-floating-player-position-v4",
      JSON.stringify({
        x: targetX,
        y: targetY,
      })
    );
  };

  window.addEventListener(
    "resize",
    handleResize
  );

  return () => {
    window.removeEventListener(
      "resize",
      handleResize
    );
  };
}, []);


        if (!song) return null;

        return (
        <>
            <div
                ref={constraintsRef}
                className="floating-player-constraints"
                aria-hidden="true"
            />

    <motion.div
  ref={playerRef}
  className="floating-music-player"

  style={{
    x,
    y,
  }}

  drag

  dragConstraints={constraintsRef}

  dragElastic={0}

  dragMomentum={false}

  whileTap={{
    scale: 0.985,
  }}

  onDragEnd={() => {
    saveCurrentPosition();
    snapToNearestEdge();
  }}
>
      {/* Drag handle */}

      <div
        className="floating-player-handle"
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
      </div>


      {/* Main content */}

      <div className="floating-player-content">

        <div className="floating-player-top">

          <div className="floating-player-meta">

            <span className="floating-player-label">
              now playing
            </span>

            <span className="floating-player-index">
              {String(song.id).padStart(2, "0")}
            </span>

          </div>


          <div className="floating-player-song">

            <span className="floating-player-title">
              {song.title}
            </span>

            <span className="floating-player-artist">
              {song.artist}
            </span>

          </div>

        </div>


        {/* Progress */}

        <div className="floating-player-progress-wrap">

          <span className="floating-player-time">
            {formatTime(progress)}
          </span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={progress}
            onChange={onSeek}
            className="floating-player-progress"
            aria-label="Song progress"
          />

          <span className="floating-player-time">
            {formatTime(duration)}
          </span>

        </div>

      </div>


      {/* Controls */}

      <div className="floating-player-actions">

        <button
          type="button"
          className="floating-player-play"
          onClick={onPlayPause}
          aria-label={
            isPlaying
              ? "Pause"
              : "Play"
          }
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>

        <button
          type="button"
          className="floating-player-close"
          onClick={onClose}
          aria-label="Close music player"
        >
          ×
        </button>

      </div>

        </motion.div>
  </>
  );
}