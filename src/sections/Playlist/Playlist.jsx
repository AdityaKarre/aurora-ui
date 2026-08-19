import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  useEffect,
  useRef,
} from "react";

import {
  useMusic,
} from "../../context/MusicContext";

import "./Playlist.css";


export default function Playlist() {

  const {
    songs,
    selected,
    activeSong,

    isPlaying,
    progress,
    duration,

    previousSong,
    nextSong,

    canGoPrevious,
    canGoNext,

    selectSong,
    togglePlay,
    handleSeek,

    formatTime,
  } = useMusic();


  const playlistRef =
    useRef(null);


  /* =====================================================
     RESET SCROLL
  ===================================================== */

  useEffect(() => {

    playlistRef.current?.scrollTo({
      top: 0,
      behavior: "instant",
    });

  }, []);


  /* =====================================================
     SELECT SONG
  ===================================================== */

  const handleSongSelect = (song) => {

    if (!song) return;

    selectSong(song);

  };


  /* =====================================================
     KEYBOARD SUPPORT
  ===================================================== */

  const handleSongKeyDown = (
    event,
    song
  ) => {

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {

      event.preventDefault();

      handleSongSelect(song);

    }

  };


  /* =====================================================
     EMPTY STATE
  ===================================================== */

  const renderEmptyState = () => (

    <motion.div
      className="playlist-focus-empty"

      initial={{
        opacity: 0,
        y: 8,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      exit={{
        opacity: 0,
        y: -8,
      }}

      transition={{
        duration: 0.42,
        ease: [0.22, 1, 0.36, 1],
      }}
    >

      <h2>
        Choose one.
      </h2>

    </motion.div>

  );


  /* =====================================================
     ACTIVE SONG
  ===================================================== */

  const renderActiveSong = () => {

    if (!activeSong) {
      return renderEmptyState();
    }


    const quote =
      activeSong.quote ||
      activeSong.description ||
      "Some songs just feel like you.";


    return (

      <motion.div

        key={`focus-${activeSong.id}`}

        className="playlist-focus-content"

        initial={{
          opacity: 0,
          y: 10,
          filter: "blur(4px)",
        }}

        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}

        exit={{
          opacity: 0,
          y: -8,
          filter: "blur(3px)",
        }}

        transition={{
          duration: 0.42,
          ease: [0.22, 1, 0.36, 1],
        }}
      >

        {/* =================================================
            TITLE
        ================================================= */}

        <h2 className="playlist-focus-title">
          {activeSong.title}
        </h2>


        {/* =================================================
            ARTIST
        ================================================= */}

        <p className="playlist-focus-artist">
          {activeSong.artist}
        </p>


        {/* =================================================
            QUOTE
        ================================================= */}

        <div className="playlist-focus-quote">

  <span
    className="playlist-focus-quote-mark"
    aria-hidden="true"
  >
    “
  </span>

  <p>
    {quote}
  </p>

  <span
    className="playlist-focus-quote-mark playlist-focus-quote-mark-end"
    aria-hidden="true"
  >
    ”
  </span>

</div>


        {/* =================================================
            MUSIC CONTROL BAR
        ================================================= */}

        <div className="playlist-music-bar">

          {/* PLAY / PAUSE */}

          <button
            type="button"
            className="playlist-play-button"
            onClick={togglePlay}
            disabled={!activeSong.audio}
            aria-label={
              isPlaying
                ? "Pause song"
                : "Play song"
            }
          >

            {isPlaying ? (

              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >

                <rect
                  x="7"
                  y="5"
                  width="3"
                  height="14"
                  rx="1"
                />

                <rect
                  x="14"
                  y="5"
                  width="3"
                  height="14"
                  rx="1"
                />

              </svg>

            ) : (

              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >

                <path
                  d="M8 5.5v13l10-6.5-10-6.5Z"
                />

              </svg>

            )}

          </button>


          {/* CURRENT TIME */}

          <span
            className="
              playlist-time
              playlist-time-current
            "
          >
            {formatTime(progress)}
          </span>


          {/* PROGRESS */}

          <div className="playlist-progress-wrap">

            <input
              type="range"
              min="0"
              max={duration || 0}
              value={progress}
              onChange={handleSeek}
              className="playlist-progress"
              aria-label="Song progress"
            />

          </div>


          {/* DURATION */}

          <span
            className="
              playlist-time
              playlist-time-duration
            "
          >
            {formatTime(duration)}
          </span>

        </div>


        {/* =================================================
            PREVIOUS / NEXT
        ================================================= */}

        <div className="playlist-song-navigation">

          <button
            type="button"
            className="playlist-song-nav"
            onClick={previousSong}
            disabled={!canGoPrevious}
            aria-label="Previous song"
          >

            <span aria-hidden="true">
              ←
            </span>

            <span>
              PREVIOUS
            </span>

          </button>


          <span
            className="
              playlist-song-navigation-line
            "
            aria-hidden="true"
          />


          <button
            type="button"
            className="playlist-song-nav"
            onClick={nextSong}
            disabled={!canGoNext}
            aria-label="Next song"
          >

            <span>
              NEXT
            </span>

            <span aria-hidden="true">
              →
            </span>

          </button>

        </div>

      </motion.div>

    );

  };


  return (

    <section
      ref={playlistRef}
      className="
        section
        fade
        playlist-section
      "
    >

      <div className="playlist-container">


        {/* =================================================
            INTRO
        ================================================= */}

        {/* =================================================
            MAIN FOCUS
        ================================================= */}

        <div className="playlist-focus">

          <div
            className="playlist-focus-glow"
            aria-hidden="true"
          />

          <AnimatePresence
            mode="wait"
            initial={false}
          >

            {activeSong
              ? renderActiveSong()
              : renderEmptyState()}

          </AnimatePresence>

        </div>


        {/* =================================================
            SONG GRID
        ================================================= */}

        <div className="playlist-list">

          {songs.map((song) => {

            const isActive =
              selected === song.id;


            return (

              <motion.button

                key={song.id}

                type="button"

                data-song-id={song.id}

                className={
                  `playlist-song ${
                    isActive
                      ? "playlist-song-active"
                      : ""
                  }`
                }

                onClick={() =>
                  handleSongSelect(song)
                }

                onKeyDown={(event) =>
                  handleSongKeyDown(
                    event,
                    song
                  )
                }

                whileHover={{
                  y: -2,
                }}

                whileTap={{
                  scale: 0.985,
                }}

                transition={{
                  duration: 0.20,
                  ease: "easeOut",
                }}

                aria-pressed={isActive}
              >

                {/* NUMBER */}

                <span className="playlist-song-index">

                  {String(
                    song.id
                  ).padStart(2, "0")}

                </span>


                {/* INFO */}

                <span className="playlist-song-main">

                  <span className="playlist-song-title">
                    {song.title}
                  </span>

                  <span className="playlist-song-artist">
                    {song.artist}
                  </span>

                </span>


                {/* INDICATOR */}

                <span
                  className="
                    playlist-song-indicator
                  "
                  aria-hidden="true"
                >

                  {isActive ? (

                    <span
                      className="
                        playlist-song-active-dot
                      "
                    />

                  ) : (

                    <span
                      className="
                        playlist-song-arrow
                      "
                    >
                      →
                    </span>

                  )}

                </span>

              </motion.button>

            );

          })}

        </div>

      </div>

    </section>

  );

}

