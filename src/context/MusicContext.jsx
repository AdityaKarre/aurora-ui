import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import songs from "../data/songs";

import chapter1Bgm from "../assets/music/chapter1-bgm.mp3";
import chapter2Bgm from "../assets/music/chapter2-bgm.mp3";


const MusicContext = createContext(null);


/* =========================================================
   BGM SETTINGS
========================================================= */

const BGM_VOLUME = 0.32;

const BGM_FADE_DURATION = 1200;

const CHAPTER_2_MAX_PLAYS = 2;


/* =========================================================
   MUSIC PROVIDER
========================================================= */

export function MusicProvider({ children }) {

  /* =======================================================
     PLAYLIST AUDIO
  ======================================================= */

  const audioRef =
    useRef(null);


  /* =======================================================
     EXPERIENCE BGM AUDIO
  ======================================================= */

  const bgmAudioRef =
    useRef(null);


  /*
   * Currently active BGM chapter.
   *
   * 0 = none
   * 1 = Chapter 1
   * 2 = Chapter 2
   */

  const activeBgmChapterRef =
    useRef(0);


  /*
   * Number of times Chapter 2 has
   * completed.
   */

  const chapter2PlayCountRef =
    useRef(0);

  /*
 * Tracks whether Chapter 2 has already
 * been started during the current
 * post-Playlist experience.
 *
 * This prevents Notes → Ending from
 * accidentally starting Chapter 2 again
 * after it has naturally finished.
 */

  const chapter2StartedRef =
  useRef(false); 


  /*
   * Used to cancel an active fade.
   */

  const fadeAnimationRef =
    useRef(null);


  /*
   * Prevents old asynchronous BGM
   * callbacks from affecting a newer
   * chapter.
   */

  const bgmRequestIdRef =
    useRef(0);


  /* =======================================================
     PLAYLIST STATE
  ======================================================= */

  const [selected, setSelected] =
    useState(null);


  const [isPlaying, setIsPlaying] =
    useState(false);


  const [progress, setProgress] =
    useState(0);


  const [duration, setDuration] =
    useState(0);


  /* =======================================================
     GLOBAL AUDIO STATE
  ======================================================= */

  const [isMuted, setIsMuted] =
    useState(false);


  /*
   * This becomes true only after
   * Chapter 2 has completed its
   * second playthrough.
   */

  const [bgmAgainAvailable, setBgmAgainAvailable] =
    useState(false);


  /*
   * Ref version is needed inside
   * asynchronous audio callbacks.
   */

  const isMutedRef =
    useRef(false);


  /* =======================================================
     ACTIVE SONG
  ======================================================= */

  const activeSong =
    songs.find(
      (song) =>
        song.id === selected
    ) || null;


  /* =======================================================
     SELECT / RESTART SONG
  ======================================================= */

  const selectSong =
    async (song) => {

      if (!song) return;


      const audio =
        audioRef.current;


      /*
       * Clicking the currently selected
       * song restarts it from its chosen
       * VL starting point.
       */

      if (
        selected === song.id &&
        audio &&
        song.audio
      ) {

        try {

          const startTime =
            Number(
              song.startTime
            ) || 0;


          if (
            audio.readyState >= 1
          ) {

            const safeStartTime =
              Number.isFinite(
                audio.duration
              )
                ? Math.min(
                    Math.max(
                      startTime,
                      0
                    ),
                    Math.max(
                      audio.duration - 0.1,
                      0
                    )
                  )
                : startTime;


            audio.currentTime =
              safeStartTime;


            setProgress(
              safeStartTime
            );

          }


          await audio.play();

          setIsPlaying(true);

        } catch (error) {

          console.warn(
            "Unable to restart audio:",
            error
          );

          setIsPlaying(false);

        }

        return;

      }


      /*
       * Different song.
       */

      setSelected(
        song.id
      );

    };


  /* =======================================================
     PREVIOUS SONG
  ======================================================= */

  const previousSong =
    () => {

      if (!activeSong) return;


      const currentIndex =
        songs.findIndex(
          (song) =>
            song.id ===
            activeSong.id
        );


      if (
        currentIndex <= 0
      ) {
        return;
      }


      const previous =
        songs[
          currentIndex - 1
        ];


      setSelected(
        previous.id
      );

    };


  /* =======================================================
     NEXT SONG
  ======================================================= */

  const nextSong =
    () => {

      if (!activeSong) return;


      const currentIndex =
        songs.findIndex(
          (song) =>
            song.id ===
            activeSong.id
        );


      if (
        currentIndex === -1 ||
        currentIndex >=
          songs.length - 1
      ) {
        return;
      }


      const next =
        songs[
          currentIndex + 1
        ];


      setSelected(
        next.id
      );

    };


  /* =======================================================
     NAVIGATION STATE
  ======================================================= */

  const currentSongIndex =
    activeSong
      ? songs.findIndex(
          (song) =>
            song.id ===
            activeSong.id
        )
      : -1;


  const canGoPrevious =
    currentSongIndex > 0;


  const canGoNext =
    currentSongIndex >= 0 &&
    currentSongIndex <
      songs.length - 1;


  /* =======================================================
     FADE ANIMATION
  ======================================================= */

  const stopFadeAnimation =
    useCallback(
      () => {

        if (
          fadeAnimationRef.current
        ) {

          cancelAnimationFrame(
            fadeAnimationRef.current
          );

          fadeAnimationRef.current =
            null;

        }

      },
      []
    );


  const fadeBgmTo =
    useCallback(
      (
        targetVolume,
        duration =
          BGM_FADE_DURATION
      ) => {

        const audio =
          bgmAudioRef.current;


        if (!audio) return;


        stopFadeAnimation();


        /*
         * If muted, the physical volume
         * must remain zero.
         */

        const actualTarget =
          isMutedRef.current
            ? 0
            : targetVolume;


        const startVolume =
          audio.volume;


        const difference =
          actualTarget -
          startVolume;


        if (
          duration <= 0 ||
          Math.abs(
            difference
          ) < 0.01
        ) {

          audio.volume =
            actualTarget;

          return;

        }


        const startTime =
          performance.now();


        const animateFade =
          (currentTime) => {

            const elapsed =
              currentTime -
              startTime;


            const progressValue =
              Math.min(
                elapsed /
                  duration,
                1
              );


            const eased =
              1 -
              Math.pow(
                1 -
                  progressValue,
                3
              );


            audio.volume =
              Math.max(
                0,
                Math.min(
                  1,
                  startVolume +
                    difference *
                      eased
                )
              );


            if (
              progressValue <
              1
            ) {

              fadeAnimationRef.current =
                requestAnimationFrame(
                  animateFade
                );

            } else {

              fadeAnimationRef.current =
                null;

            }

          };


        fadeAnimationRef.current =
          requestAnimationFrame(
            animateFade
          );

      },
      [
        stopFadeAnimation,
      ]
    );


  /* =======================================================
     CHAPTER 2 — END HANDLER
  ======================================================= */

  const handleChapter2Ended =
    useCallback(
      async () => {

        const audio =
          bgmAudioRef.current;


        if (!audio) return;


        /*
         * Ignore stale callbacks.
         */

        if (
          activeBgmChapterRef.current !==
          2
        ) {
          return;
        }


        chapter2PlayCountRef.current +=
          1;


        const completedPlays =
          chapter2PlayCountRef.current;


        /*
         * First completion:
         * restart for the second play.
         */

        if (
          completedPlays <
          CHAPTER_2_MAX_PLAYS
        ) {

          try {

            audio.currentTime =
              0;


            await audio.play();

          } catch (error) {

            console.warn(
              "Unable to restart Chapter 2 BGM:",
              error
            );

          }

          return;

        }


        /*
         * Second completion:
         * completely stop the BGM.
         */

        audio.pause();

        audio.currentTime = 0;

        audio.volume =
          isMutedRef.current
            ? 0
            : 0;


        activeBgmChapterRef.current =
          0;


        /*
         * Now show BGM Again.
         */

        setBgmAgainAvailable(
          true
        );

      },
      []
    );


  /* =======================================================
     START BGM CHAPTER
  ======================================================= */

  const startBgmChapter =
    useCallback(
      async (chapter) => {

        const audio =
          bgmAudioRef.current;


        if (!audio) return;


        const source =
          chapter === 1
            ? chapter1Bgm
            : chapter === 2
              ? chapter2Bgm
              : null;


        if (!source) return;


        /*
         * If the same chapter is already
         * playing, don't restart it.
         */

        if (
          activeBgmChapterRef.current ===
            chapter &&
          !audio.paused
        ) {

          return;

        }


        stopFadeAnimation();


        /*
         * New chapter request.
         */

        bgmRequestIdRef.current +=
          1;


        const requestId =
          bgmRequestIdRef.current;


        /*
         * New Chapter 2 session starts
         * its two-play counter again.
         */

        if (
  chapter === 2
) {

  chapter2StartedRef.current =
    true;

  chapter2PlayCountRef.current =
    0;

  setBgmAgainAvailable(
    false
  );

}


        /*
         * Stop the previous BGM.
         */

        audio.pause();

        audio.currentTime = 0;


        /*
         * Change source.
         */

        audio.src =
          source;

        audio.load();


        activeBgmChapterRef.current =
          chapter;


        /*
         * Chapter 1 loops naturally.
         *
         * Chapter 2 does NOT use native
         * loop because we need to count
         * its two playthroughs.
         */

        audio.loop =
          chapter === 1;


        audio.volume =
          0;


        const playBgm =
          async () => {

            /*
             * Ignore an outdated request.
             */

            if (
              requestId !==
              bgmRequestIdRef.current
            ) {
              return;
            }


            try {

              await audio.play();


              fadeBgmTo(
                BGM_VOLUME
              );

            } catch (error) {

              console.warn(
                "Unable to start experience BGM:",
                error
              );

            }

          };


          /*
 * Start immediately.
 *
 * Do not wait for the canplay event.
 * The browser will handle buffering.
 */

await playBgm();
        

      },
      [
        fadeBgmTo,
        stopFadeAnimation,
      ]
    );


  /* =======================================================
     STOP BGM
  ======================================================= */

  const stopBgm =
    useCallback(
      (
        shouldReset = true
      ) => {

        const audio =
          bgmAudioRef.current;


        if (!audio) return;


        stopFadeAnimation();


        /*
         * Invalidate previous async
         * playback requests.
         */

        bgmRequestIdRef.current +=
          1;


        fadeBgmTo(
          0
        );


        const chapterAtStop =
          activeBgmChapterRef.current;


        window.setTimeout(
          () => {

            /*
             * Only stop if no new chapter
             * has started during the fade.
             */

            if (
              activeBgmChapterRef.current !==
              chapterAtStop
            ) {
              return;
            }


            audio.pause();


            if (
              shouldReset
            ) {

              audio.currentTime =
                0;

            }


            audio.volume = 0;


            activeBgmChapterRef.current =
              0;

          },
          BGM_FADE_DURATION + 50
        );

      },
      [
        fadeBgmTo,
        stopFadeAnimation,
      ]
    );


  /* =======================================================
   SECTION → BGM CHAPTER
======================================================= */

const setExperienceSection =
  useCallback(
    (sectionIndex) => {

      /*
       * 0 = Arrival
       * 1 = Little Things
       * 2 = Memories
       *
       * → Chapter 1
       */


      /*
       * 3 = Playlist
       *
       * → Silence
       */


      /*
       * 4 = Notes
       * 5 = Ending
       *
       * → Chapter 2
       */

      let nextChapter =
        0;


      if (
        sectionIndex >= 0 &&
        sectionIndex <= 2
      ) {

        nextChapter = 1;

      } else if (
        sectionIndex === 3
      ) {

        nextChapter = 0;

      } else if (
        sectionIndex >= 4
      ) {

        nextChapter = 2;

      }


      /*
       * Same active chapter:
       * do nothing.
       */

      if (
        nextChapter !== 0 &&
        activeBgmChapterRef.current ===
          nextChapter
      ) {

        return;

      }


      /*
       * Chapter 2 has already been started
       * during this post-Playlist sequence.
       *
       * If it has naturally finished, do NOT
       * restart it simply because the user
       * moved from Notes → Ending.
       *
       * BGM Again is the only intentional
       * way to start Chapter 2 again.
       */

      if (
        nextChapter === 2 &&
        chapter2StartedRef.current
      ) {

        return;

      }


      /*
       * Playlist has no BGM.
       *
       * Fade out the current chapter.
       */

      if (
        nextChapter === 0
      ) {

        stopBgm();

        return;

      }


      /*
       * Start the required chapter.
       */

      startBgmChapter(
        nextChapter
      );

    },
    [
      startBgmChapter,
      stopBgm,
    ]
  );


  /* =======================================================
     BGM AGAIN
  ======================================================= */

  const playBgmAgain =
    useCallback(
      async () => {

        const audio =
          bgmAudioRef.current;


        if (!audio) return;


        /*
         * Only Chapter 2 is allowed
         * to use BGM Again.
         */

        if (
          activeBgmChapterRef.current !==
          0
        ) {
          return;
        }


        stopFadeAnimation();


        bgmRequestIdRef.current +=
          1;


        const requestId =
          bgmRequestIdRef.current;


        chapter2StartedRef.current =
  true;

chapter2PlayCountRef.current =
  0;

setBgmAgainAvailable(
  false
);


        audio.pause();

        audio.currentTime =
          0;

        audio.src =
          chapter2Bgm;

        audio.load();

        audio.loop = false;

        audio.volume = 0;


        activeBgmChapterRef.current =
          2;


        const startAgain =
          async () => {

            if (
              requestId !==
              bgmRequestIdRef.current
            ) {
              return;
            }


            try {

              await audio.play();


              fadeBgmTo(
                BGM_VOLUME
              );

            } catch (error) {

              console.warn(
                "Unable to replay Chapter 2 BGM:",
                error
              );

            }

          };


        if (
          audio.readyState >= 3
        ) {

          await startAgain();

        } else {

          audio.addEventListener(
            "canplay",
            startAgain,
            {
              once: true,
            }
          );

        }

      },
      [
        fadeBgmTo,
        stopFadeAnimation,
      ]
    );


  /* =======================================================
     GLOBAL MUTE
  ======================================================= */

  const toggleMute =
    useCallback(
      () => {

        const nextMuted =
          !isMutedRef.current;


        isMutedRef.current =
          nextMuted;


        setIsMuted(
          nextMuted
        );


        /*
         * Playlist audio
         */

        const playlistAudio =
          audioRef.current;


        if (
          playlistAudio
        ) {

          playlistAudio.volume =
            nextMuted
              ? 0
              : 1;

        }


        /*
         * Experience BGM
         */

        const bgm =
          bgmAudioRef.current;


        if (
          bgm
        ) {

          bgm.volume =
            nextMuted
              ? 0
              : BGM_VOLUME;

        }

      },
      []
    );


  /* =======================================================
     LOAD SELECTED PLAYLIST SONG
  ======================================================= */

  useEffect(() => {

    const audio =
      audioRef.current;


    if (!audio) return;


    setProgress(0);

    setDuration(0);

    setIsPlaying(false);


    audio.pause();

    audio.removeAttribute(
      "src"
    );

    audio.load();


    if (
      !activeSong?.audio
    ) {
      return;
    }


    audio.src =
      activeSong.audio;

    audio.load();


    /*
     * Respect global mute.
     */

    audio.volume =
      isMutedRef.current
        ? 0
        : 1;


    let hasStarted =
      false;


    const startSong =
      async () => {

        if (
          hasStarted
        ) {
          return;
        }


        hasStarted = true;


        try {

          const startTime =
            Number(
              activeSong.startTime
            ) || 0;


          const safeStartTime =
            Number.isFinite(
              audio.duration
            )
              ? Math.min(
                  Math.max(
                    startTime,
                    0
                  ),
                  Math.max(
                    audio.duration - 0.1,
                    0
                  )
                )
              : startTime;


          audio.currentTime =
            safeStartTime;


          setProgress(
            safeStartTime
          );


          await audio.play();


          setIsPlaying(
            true
          );

        } catch (error) {

          console.warn(
            "Unable to autoplay audio:",
            error
          );

          setIsPlaying(
            false
          );

        }

      };


    audio.addEventListener(
      "canplay",
      startSong,
      {
        once: true,
      }
    );


    const handleMetadata =
      () => {

        if (
          audio.readyState >= 3
        ) {

          startSong();

        }

      };


    audio.addEventListener(
      "loadedmetadata",
      handleMetadata
    );


    return () => {

      audio.removeEventListener(
        "canplay",
        startSong
      );

      audio.removeEventListener(
        "loadedmetadata",
        handleMetadata
      );

    };

  }, [
    selected,
    activeSong,
  ]);


  /* =======================================================
     PLAY / PAUSE
  ======================================================= */

  const togglePlay =
    async () => {

      const audio =
        audioRef.current;


      if (
        !activeSong?.audio ||
        !audio
      ) {
        return;
      }


      try {

        if (
          audio.paused
        ) {

          await audio.play();

          setIsPlaying(
            true
          );

        } else {

          audio.pause();

          setIsPlaying(
            false
          );

        }

      } catch (error) {

        console.error(
          "Unable to play audio:",
          error
        );

      }

    };


  /* =======================================================
     PLAYLIST TIME UPDATE
  ======================================================= */

  const handleTimeUpdate =
    () => {

      const audio =
        audioRef.current;


      if (!audio) return;


      setProgress(
        audio.currentTime
      );

    };


  /* =======================================================
     PLAYLIST METADATA
  ======================================================= */

  const handleLoadedMetadata =
    () => {

      const audio =
        audioRef.current;


      if (!audio) return;


      if (
        Number.isFinite(
          audio.duration
        )
      ) {

        setDuration(
          audio.duration
        );

      }

    };


  /* =======================================================
     PLAYLIST ENDED
  ======================================================= */

  const handleEnded =
    () => {

      const audio =
        audioRef.current;


      setIsPlaying(
        false
      );


      if (audio) {

        setProgress(
          audio.duration || 0
        );

      }

    };


  /* =======================================================
     PLAYLIST SEEK
  ======================================================= */

  const handleSeek =
    (event) => {

      const audio =
        audioRef.current;


      if (!audio) return;


      const value =
        Number(
          event.target.value
        );


      if (
        !Number.isFinite(
          value
        )
      ) {
        return;
      }


      audio.currentTime =
        value;


      setProgress(
        value
      );

    };


  /* =======================================================
     CLOSE PLAYLIST PLAYER
  ======================================================= */

  const closePlayer =
    useCallback(
      () => {

        const audio =
          audioRef.current;


        if (audio) {

          audio.pause();

          audio.currentTime =
            0;

          audio.removeAttribute(
            "src"
          );

          audio.load();

        }


        setIsPlaying(
          false
        );

        setProgress(
          0
        );

        setDuration(
          0
        );

        setSelected(
          null
        );

      },
      []
    );


  /* =======================================================
     RESET ALL MUSIC
  ======================================================= */

  const resetAllMusic =
    useCallback(
      () => {

        /*
         * Playlist
         */

        closePlayer();


        /*
         * BGM
         */

        const bgm =
          bgmAudioRef.current;


        stopFadeAnimation();


        bgmRequestIdRef.current +=
          1;


        if (bgm) {

          bgm.pause();

          bgm.currentTime =
            0;

          bgm.removeAttribute(
            "src"
          );

          bgm.load();

          bgm.volume = 0;

        }


        activeBgmChapterRef.current =
          0;


        chapter2PlayCountRef.current =
          0;

        chapter2StartedRef.current =
          false;


        setBgmAgainAvailable(
          false
        );

      },
      [
        closePlayer,
        stopFadeAnimation,
      ]
    );


  /* =======================================================
     FORMAT TIME
  ======================================================= */

  const formatTime =
    (seconds) => {

      if (
        !Number.isFinite(
          seconds
        )
      ) {

        return "0:00";

      }


      const minutes =
        Math.floor(
          seconds / 60
        );


      const remaining =
        Math.floor(
          seconds % 60
        );


      return `${minutes}:${String(
        remaining
      ).padStart(
        2,
        "0"
      )}`;

    };


  /* =======================================================
     PROVIDER
  ======================================================= */

  return (

    <MusicContext.Provider
      value={{

        /* ===============================================
           PLAYLIST
        =============================================== */

        songs,

        activeSong,

        selected,

        isPlaying,

        progress,

        duration,

        selectSong,

        previousSong,

        nextSong,

        canGoPrevious,

        canGoNext,

        togglePlay,

        handleSeek,

        closePlayer,

        formatTime,


        /* ===============================================
           EXPERIENCE BGM
        =============================================== */

        setExperienceSection,

        stopBgm,

        resetAllMusic,


        /* ===============================================
           GLOBAL AUDIO
        =============================================== */

        isMuted,

        toggleMute,


        /* ===============================================
           CHAPTER 2
        =============================================== */

        bgmAgainAvailable,

        playBgmAgain,

      }}
    >

      {/* =================================================
          PLAYLIST AUDIO
      ================================================= */}

      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={
          handleTimeUpdate
        }
        onLoadedMetadata={
          handleLoadedMetadata
        }
        onEnded={
          handleEnded
        }
      />


      {/* =================================================
          EXPERIENCE BGM AUDIO
      ================================================= */}

      <audio
        ref={bgmAudioRef}
        preload="auto"
        onEnded={
          handleChapter2Ended
        }
      />


      {children}

    </MusicContext.Provider>

  );

}


/* =========================================================
   HOOK
========================================================= */

export function useMusic() {

  const context =
    useContext(
      MusicContext
    );


  if (!context) {

    throw new Error(
      "useMusic must be used inside MusicProvider"
    );

  }


  return context;

}