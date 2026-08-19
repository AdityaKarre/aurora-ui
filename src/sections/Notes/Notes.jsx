import { motion } from "framer-motion";
import "./Notes.css";

const notes = [
  {
    text: "You notice the little things most people pass by.",
  },
  {
    text: "Somehow, people feel a little more at ease when you're around.",
  },
  {
    text: "Your smile has a way of changing the mood without asking it to.",
  },
  {
    text: "You have a way of making ordinary moments feel a little less ordinary.",
  },
  {
    text: "You don't let one wrong moment become the whole story about someone.",
  },
  {
    text: "You have your own way of making small moments stay.",
  },
];

export default function Notes() {
  return (
    <section className="section fade notes-section">
      <div className="notes-container">

        {/* =================================================
            HEADING
        ================================================= */}

        <header className="notes-header">
          <motion.h2
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
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            In the little things.
          </motion.h2>

          <motion.span
            className="notes-header-line"
            initial={{
              scaleX: 0,
              opacity: 0,
            }}
            animate={{
              scaleX: 1,
              opacity: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </header>


        {/* =================================================
            NOTES
        ================================================= */}

        <div className="notes-field">

          {notes.map((note, index) => (
            <motion.article
              key={index}
              className={`note note-${index + 1}`}

              initial={{
                opacity: 0,
                y: 28,
                filter: "blur(6px)",
              }}

              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}

              transition={{
                duration: 0.9,
                delay: 0.3 + index * 0.10,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="note-marker" />

              <p className="note-text">
                {note.text}
              </p>
            </motion.article>
          ))}

        </div>

      </div>
    </section>
  );
}