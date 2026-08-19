import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./Ending.css";

const thoughts = [
  {
    id: 1,
    type: "opening",
    title: (
      <>
        Maybe some things
        <br />
        are meant to stay.
      </>
    ),
    subtitle: "Even after the moment has passed.",
  },

  {
    id: 2,
    type: "realization",
    title: (
      <>
        Some people become important to us
        <br />
        without ever realizing it.
      </>
    ),
  },

  {
    id: 3,
    type: "matter",
    title: (
      <>
        You may not always see it,
        <br />
        <strong>but you matter.</strong>
      </>
    ),
    subtitle: "More than you probably know.",
  },

  {
    id: 4,
    type: "final",
    title: "Some things are worth keeping.",
  },
];


/* =========================================================
   TIMING
========================================================= */

const MOBILE_DELAY = 2200;
const DESKTOP_DELAY = 4000;


export default function Ending({ onRestart }) {

  const [visibleCount, setVisibleCount] = useState(1);


  /* =======================================================
     REVEAL THOUGHTS
  ======================================================= */

  useEffect(() => {

    if (visibleCount >= thoughts.length) {
      return;
    }

    const isDesktop =
      window.matchMedia("(min-width: 601px)").matches;

    const revealDelay = isDesktop
      ? DESKTOP_DELAY
      : MOBILE_DELAY;


    const timer = setTimeout(() => {

      setVisibleCount((count) => count + 1);

    }, revealDelay);


    return () => clearTimeout(timer);

  }, [visibleCount]);


  return (

    <section className="section fade ending-section">

      {/* =================================================
          ATMOSPHERE
      ================================================= */}

      <div className="ending-atmosphere" />

      <div className="ending-stars" />


      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div className="ending-container">

        <div className="ending-content">


          {/* =================================================
              THOUGHTS
          ================================================= */}

          {thoughts.map((thought, index) => {

            const isVisible =
              index < visibleCount;

            const isCurrent =
              index === visibleCount - 1;

            const isPast =
              index < visibleCount - 1;


            if (!isVisible) {
              return null;
            }


            return (

              <motion.div

                key={thought.id}

                className={`
                  ending-thought
                  ending-thought--${thought.type}
                  ${isCurrent ? "ending-thought--current" : ""}
                  ${isPast ? "ending-thought--past" : ""}
                `}

                initial={{
                  opacity: 0,
                  y: 18,
                  filter: "blur(5px)",
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}

                transition={{
                  duration:
                    window.matchMedia("(min-width: 601px)").matches
                      ? 1.25
                      : 1,
                  ease: [0.22, 1, 0.36, 1],
                }}

              >

                {/* =========================================
                    OPENING
                ========================================= */}

                {thought.type === "opening" && (

                  <>

                    <h1>
                      {thought.title}
                    </h1>

                    <p className="ending-subtitle">
                      {thought.subtitle}
                    </p>

                  </>

                )}


                {/* =========================================
                    REALIZATION
                ========================================= */}

                {thought.type === "realization" && (

                  <h2>
                    {thought.title}
                  </h2>

                )}


                {/* =========================================
                    MATTER
                ========================================= */}

                {thought.type === "matter" && (

                  <>

                    <h2>
                      {thought.title}
                    </h2>

                    <p className="ending-subtitle">
                      {thought.subtitle}
                    </p>

                  </>

                )}


                {/* =========================================
                    FINAL
                ========================================= */}

                {thought.type === "final" && (

                  <p className="ending-final-thought">
                    {thought.title}
                  </p>

                )}

              </motion.div>

            );

          })}


          {/* =================================================
              BEGIN AGAIN
          ================================================= */}

          {visibleCount === thoughts.length && (

            <motion.button

              className="ending-replay"

              initial={{
                opacity: 0,
                y: 10,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                duration: 0.8,
                delay: 0.7,
              }}

              onClick={onRestart}

            >

              <span>
                ↻
              </span>

              Begin again

            </motion.button>

          )}

        </div>

      </div>

    </section>

  );
}