import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./OpeningGate.css";

export default function OpeningGate({
  onEnter,
  initialStage = "loading",
}) {
  const [stage, setStage] = useState(initialStage);
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  /*
   * Sync when Experience sends us back to the
   * headphone stage from Arrival.
   */
  useEffect(() => {
    setStage(initialStage);
  }, [initialStage]);

  /*
   * LOADING
   *
   * Blank screen first.
   * Then content appears.
   * Then progress runs.
   */
  useEffect(() => {
    if (stage !== "loading") return;

    setProgress(0);

    let frame;
    let startTimer;
    let finishTimer;

    const startLoading = () => {
      const duration = 4000;
      const start = performance.now();

      const updateProgress = (now) => {
        const elapsed = now - start;

        const raw = Math.min(
          elapsed / duration,
          1
        );

        const eased =
          1 - Math.pow(1 - raw, 2.15);

        setProgress(
          Math.round(eased * 100)
        );

        if (raw < 1) {
          frame =
            requestAnimationFrame(
              updateProgress
            );
        } else {
          finishTimer = setTimeout(() => {
            setStage("headphones");
          }, 550);
        }
      };

      frame =
        requestAnimationFrame(
          updateProgress
        );
    };

    /*
     * Quiet blank opening.
     */
    startTimer = setTimeout(
      startLoading,
      1050
    );

    return () => {
      clearTimeout(startTimer);
      clearTimeout(finishTimer);

      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, [stage]);

  /*
   * Continue from headphones
   * into Arrival.
   */
  const handleEnter = () => {
    if (leaving) return;

    setLeaving(true);

    setTimeout(() => {
      onEnter();
    }, 1000);
  };

  /*
   * Back from headphones
   * returns to loading.
   */
  const handleBack = () => {
    if (leaving) return;

    setProgress(0);
    setStage("loading");
  };

  return (
    <motion.div
      className="opening-gate"

      initial={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
      }}

      animate={{
        opacity: leaving ? 0 : 1,
        scale: leaving ? 1.025 : 1,
        filter: leaving
          ? "blur(10px)"
          : "blur(0px)",
      }}

      transition={{
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >

      {/* =================================================
          ATMOSPHERE
      ================================================= */}

      <div
        className="opening-gate-atmosphere"
        aria-hidden="true"
      />

      <div
        className="opening-gate-orbit"
        aria-hidden="true"
      />

      <div
        className="opening-gate-grain"
        aria-hidden="true"
      />


      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="opening-gate-content">

        <AnimatePresence mode="wait">


          {/* =================================================
              LOADING
          ================================================= */}

          {stage === "loading" && (

            <motion.div
              key="loading"

              className="
                opening-gate-stage
                opening-gate-loading
              "

              initial={{
                opacity: 0,
                y: 14,
                filter: "blur(8px)",
              }}

              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}

              exit={{
                opacity: 0,
                y: -10,
                filter: "blur(6px)",
              }}

              transition={{
                duration: 1.1,
                delay: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
            >

              <motion.span
                className="opening-gate-mark"

                initial={{
                  opacity: 0,
                  scale: 0.7,
                }}

                animate={{
                  opacity: 1,
                  scale: 1,
                }}

                transition={{
                  duration: 0.9,
                  delay: 0.95,
                }}
              >
                ·
              </motion.span>


              <h1>
                Just a moment.
              </h1>


              <div className="opening-gate-divider" />


              <div className="opening-gate-progress">

                <div
                  className="
                    opening-gate-progress-track
                  "
                >

                  <motion.div
                    className="
                      opening-gate-progress-fill
                    "

                    animate={{
                      width: `${progress}%`,
                    }}

                    transition={{
                      duration: 0.12,
                      ease: "linear",
                    }}
                  />

                </div>


                <div
                  className="
                    opening-gate-progress-meta
                  "
                >

                  <span>
                    LOADING
                  </span>

                  <span>
                    {progress}%
                  </span>

                </div>

              </div>

            </motion.div>

          )}


          {/* =================================================
              HEADPHONES
          ================================================= */}

          {stage === "headphones" && (

            <motion.div
              key="headphones"

              className="
                opening-gate-stage
                opening-gate-headphones
              "

              initial={{
                opacity: 0,
                y: 24,
                filter: "blur(10px)",
              }}

              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}

              exit={{
                opacity: 0,
                y: -18,
                filter: "blur(8px)",
              }}

              transition={{
                duration: 1.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >

              {/* Sound visual */}

              <motion.div
                className="opening-gate-sound"

                aria-hidden="true"

                initial={{
                  opacity: 0,
                  scaleX: 0.55,
                }}

                animate={{
                  opacity: 1,
                  scaleX: 1,
                }}

                transition={{
                  duration: 0.9,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >

                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />

              </motion.div>


              {/* Heading */}

              <motion.h1

                initial={{
                  opacity: 0,
                  y: 14,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  duration: 0.9,
                  delay: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >

                <span>
                  Wear your
                </span>

                <span>
                  headphones.
                </span>

              </motion.h1>


              {/* =================================================
                  HEADPHONE NAVIGATION
              ================================================= */}

              <div
                className="
                  opening-gate-navigation
                "
              >

                {/* BACK */}

                <motion.button
                  type="button"

                  className="
                    opening-gate-navigation-button
                  "

                  onClick={handleBack}

                  whileTap={{
                    scale: 0.96,
                  }}
                >

                  <span
                    className="
                      opening-gate-navigation-arrow
                    "
                  >
                    ←
                  </span>

                  <span>
                    back
                  </span>

                </motion.button>


                {/* CONTINUE */}

                <motion.button
                  type="button"

                  className="
                    opening-gate-navigation-button
                    opening-gate-navigation-primary
                  "

                  onClick={handleEnter}

                  whileHover={{
                    y: -2,
                  }}

                  whileTap={{
                    scale: 0.97,
                  }}
                >

                  <span>
                    continue
                  </span>

                  <span
                    className="
                      opening-gate-navigation-arrow
                    "
                  >
                    →
                  </span>

                </motion.button>

              </div>

            </motion.div>

          )}

        </AnimatePresence>

      </div>

    </motion.div>
  );
}