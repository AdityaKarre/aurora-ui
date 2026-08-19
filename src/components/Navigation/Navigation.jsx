import { motion } from "framer-motion";
import "./Navigation.css";

export default function Navigation({
  current,
  total,
  onPrevious,
  onNext,
}) {

  const isLast =
    current === total - 1;


  return (

    <motion.nav
      className="navigation"

      initial={{
        opacity: 0,
        y: 12,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}

      aria-label="Experience navigation"
    >

      {/* =================================================
          BACK
      ================================================= */}

      <button
        className="navigation-back"

        onClick={onPrevious}

        aria-label="Go to previous scene"
      >

        <span
          className="
            navigation-back-arrow
          "
        >
          ←
        </span>

        <span>
          back
        </span>

      </button>


      {/* =================================================
          PROGRESS
      ================================================= */}

      <div
        className="navigation-track"
        aria-hidden="true"
      >

        <span
          className="
            navigation-track-fill
          "

          style={{
            width:
              `${(
                (current + 1) /
                total
              ) * 100}%`,
          }}
        />

      </div>


      {/* =================================================
          CONTINUE
      ================================================= */}

      {!isLast && (

        <button
          className="
            navigation-next
          "

          onClick={onNext}

          aria-label="Continue to next scene"
        >

          <span>
            continue
          </span>

          <span
            className="
              navigation-next-arrow
            "
          >
            →
          </span>

        </button>

      )}

    </motion.nav>

  );
}