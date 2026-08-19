import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Arrival from "../sections/Arrival/Arrival";
import LittleThings from "../sections/LittleThings/LittleThings";
import Memories from "../sections/Memories/Memories";
import Playlist from "../sections/Playlist/Playlist";
import Notes from "../sections/Notes/Notes";
import Ending from "../sections/Ending/Ending";

import Background from "../components/Background/Background";
import Navigation from "../components/Navigation/Navigation";
import OpeningGate from "../components/OpeningGate/OpeningGate";

import { useMusic } from "../context/MusicContext";


/* =========================================================
   SECTIONS
========================================================= */

const sections = [
  Arrival,
  LittleThings,
  Memories,
  Playlist,
  Notes,
  Ending,
];

const memoriesImages = [
  "/memories/childhood.jpg",
  "/memories/us.jpg",
  "/memories/smile.jpg",
  "/memories/chocolate.jpg",
  "/memories/friends.jpg",
  "/memories/together.jpg",
  "/memories/gb-vl.jpg",
  "/memories/vl-sdk.jpg",
];


/* =========================================================
   UNIVERSAL SECTION TRANSITION
========================================================= */

const sectionTransition = {
  duration: 0.9,
  ease: [0.22, 1, 0.36, 1],
};


const sectionVariants = {
  initial: {
    opacity: 0,
  },

  animate: {
    opacity: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },

  exit: {
    opacity: 0,
    transition: {
      duration: 0.45,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};


/* =========================================================
   EXPERIENCE
========================================================= */

export default function Experience() {

  const [current, setCurrent] =
    useState(0);

  useEffect(() => {
  if (current !== 1) return;

  memoriesImages.forEach((src) => {
    const image = new Image();
    image.src = src;
  });
}, [current]);


  const [entered, setEntered] =
    useState(false);


  /*
   * Controls which Opening Gate stage
   * appears when returning from Arrival.
   */

  const [gateStage, setGateStage] =
    useState("loading");


  /*
   * Kept because the existing project
   * uses it for sequence logic.
   */

  const [
    sequenceComplete,
    setSequenceComplete,
  ] = useState(
    current !== 1
  );


  const {
    closePlayer,
    setExperienceSection,
    resetAllMusic,

    isMuted,
    toggleMute,

    bgmAgainAvailable,
    playBgmAgain,
  } = useMusic();


  /* =========================================================
     EXPERIENCE BGM
  ========================================================= */

  useEffect(() => {

    if (!entered) {
      return;
    }


    setExperienceSection(
      current
    );

  }, [
    current,
    entered,
    setExperienceSection,
  ]);


  /* =========================================================
     PLAYLIST MUSIC
  ========================================================= */

  useEffect(() => {

    if (
      current !== 3
    ) {

      closePlayer();

    }

  }, [
    current,
    closePlayer,
  ]);


  const CurrentSection =
    sections[current];


  /* =========================================================
     ENTER EXPERIENCE
  ========================================================= */

  const enterExperience =
    () => {

      setEntered(true);

    };


  /* =========================================================
     NEXT
  ========================================================= */

  const next =
    () => {

      if (
        current <
        sections.length - 1
      ) {

        setSequenceComplete(
          true
        );

        setCurrent(
          (value) =>
            value + 1
        );

      }

    };


  /* =========================================================
     PREVIOUS
  ========================================================= */

  const previous =
    () => {

      /*
       * Arrival → Headphones
       */

      if (
        current === 0
      ) {

        resetAllMusic();

        setGateStage(
          "headphones"
        );

        setEntered(
          false
        );

        return;

      }


      /*
       * Normal backward navigation.
       */

      if (
        current > 0
      ) {

        setCurrent(
          (value) =>
            value - 1
        );

      }

    };


  /* =========================================================
     RESTART
  ========================================================= */

  const restartExperience =
    () => {

      resetAllMusic();

      setSequenceComplete(
        true
      );

      setCurrent(
        0
      );

      setGateStage(
        "loading"
      );

      setEntered(
        false
      );

    };


  return (
    <>

      <Background />


      {/* =================================================
          OPENING GATE
      ================================================= */}

      <AnimatePresence
        mode="wait"
      >

        {!entered && (

          <OpeningGate
            key={
              `opening-${gateStage}`
            }
            initialStage={
              gateStage
            }
            onEnter={
              enterExperience
            }
          />

        )}

      </AnimatePresence>


      {/* =================================================
          MAIN EXPERIENCE
      ================================================= */}

      <div
        className={
          `app-shell ${
            current === 3
              ? "playlist-active"
              : ""
          }`
        }
      >

        {/* =================================================
            AUDIO CONTROLS
        ================================================= */}

        {entered && (

          <div
            className="experience-audio-controls"
          >

            {/* ---------------------------------------------
                MUTE
            --------------------------------------------- */}

            <button
  type="button"
  className={`experience-audio-button ${
    isMuted ? "is-muted" : ""
  }`}
  onClick={toggleMute}
  aria-label={
    isMuted
      ? "Unmute audio"
      : "Mute audio"
  }
>
  {isMuted ? (

    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="audio-control-svg"
    >
      <path
        d="M11 5 6.8 9H4v6h2.8L11 19V5Z"
      />

      <path
        d="m16 9-4 6"
      />

      <path
        d="m12 9 4 6"
      />
    </svg>

  ) : (

    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="audio-control-svg"
    >
      <path
        d="M11 5 6.8 9H4v6h2.8L11 19V5Z"
      />

      <path
        d="M15 9.5a4 4 0 0 1 0 5"
      />

      <path
        d="M17.5 7a7 7 0 0 1 0 10"
      />
    </svg>

  )}
</button>


            {/* ---------------------------------------------
                BGM AGAIN
            --------------------------------------------- */}

            {bgmAgainAvailable && (

              <button
                type="button"
                className="bgm-again-button"
                onClick={
                  playBgmAgain
                }
                aria-label="Play BGM again"
              >

                <span
                  className="bgm-again-icon"
                  aria-hidden="true"
                >
                  ↻
                </span>

                <span>
                  BGM again
                </span>

              </button>

            )}

          </div>

        )}


        <main className="content">

          <AnimatePresence
            initial={false}
          >

            <motion.div

              key={current}

              className="section-stage"

              variants={
                sectionVariants
              }

              initial="initial"

              animate="animate"

              exit="exit"

              transition={
                sectionTransition
              }
            >

              <CurrentSection

                onNext={
                  next
                }

                onSequenceComplete={() =>
                  setSequenceComplete(
                    true
                  )
                }

                onRestart={
                  restartExperience
                }

              />

            </motion.div>

          </AnimatePresence>

        </main>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        {entered && (

          <Navigation
            current={
              current
            }
            total={
              sections.length
            }
            onPrevious={
              previous
            }
            onNext={
              next
            }
          />

        )}

      </div>

    </>
  );
}