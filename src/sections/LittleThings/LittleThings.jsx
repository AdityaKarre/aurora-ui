import { useState } from "react";
import "./LittleThings.css";
import { AnimatePresence, motion } from "framer-motion";

const observations = [
  "You make conversations feel easy.",
  "You know when someone needs you, without them having to say it.",
  "You have a way of making people smile without trying.",
  "You make people feel comfortable just being themselves.",
];

export default function LittleThings({
  onNext,
  onSequenceComplete,
}) {
  const [current, setCurrent] = useState(0);

  const isLast = current === observations.length - 1;

  const handleContinue = () => {
    if (!isLast) {
      setCurrent((prev) => prev + 1);
      return;
    }

    onSequenceComplete?.();
  };

  return (
    <section className="section little-things">
      <div className="container little-things-scene">

        {/* =================================================
            OBSERVATION
        ================================================= */}

        <div className="observation">

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="observation-number">
                {String(current + 1).padStart(2, "0")}
              </span>

              <p>
                {observations[current]}
              </p>
            </motion.div>
          </AnimatePresence>

        </div>


        {/* =================================================
            INTERNAL NEXT
            Hidden on final observation
        ================================================= */}

        <AnimatePresence mode="wait">
          {!isLast && (
            <motion.button
              key="next"
              className="observation-continue"
              onClick={handleContinue}
              initial={{
                opacity: 0,
                y: 5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -5,
              }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span>next</span>

              <span className="observation-arrow">
                →
              </span>
            </motion.button>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}