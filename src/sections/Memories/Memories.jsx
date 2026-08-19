import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./Memories.css";

const memories = [
  {
    id: 1,
    image: "/memories/childhood.jpg",
    rotate: -7,
    size: "small",
    desktop: { left: "18%", top: "20%" },
    mobile: { left: "18%", top: "20%" },
    quote: "You were always a little bit of magic, even before you knew it.",
  },
  {
    id: 2,
    image: "/memories/us.jpg",
    rotate: 5,
    size: "medium",
    desktop: { left: "42%", top: "19%" },
    mobile: { left: "51%", top: "18%" },
    quote: "There was something really easy about being around you.",
  },
  {
    id: 3,
    image: "/memories/smile.jpg",
    rotate: -4,
    size: "large",
    desktop: { left: "72%", top: "20%" },
    mobile: { left: "80%", top: "22%" },
    quote: "Your smile has a way of making everything feel a little lighter.",
  },
  {
    id: 4,
    image: "/memories/chocolate.jpg",
    rotate: 7,
    size: "small",
    desktop: { left: "77%", top: "52%" },
    mobile: { left: "76%", top: "52%" },
    quote: "You had no business being this cute here.",
  },
  {
    id: 5,
    image: "/memories/friends.jpg",
    rotate: -6,
    size: "medium",
    desktop: { left: "52%", top: "60%" },
    mobile: { left: "51%", top: "65%" },
    quote: "We didn't know it then, but this was the start of something special.",
  },
  {
    id: 6,
    image: "/memories/together.jpg",
    rotate: 8,
    size: "large",
    desktop: { left: "28%", top: "56%" },
    mobile: { left: "27%", top: "59%" },
    quote: "I think the three of us just had a way of making things more fun.",
  },
  {
    id: 7,
    image: "/memories/gb-vl.jpg",
    rotate: -3,
    size: "medium",
    desktop: { left: "20%", top: "75%" },
    mobile: { left: "20%", top: "78%" },
    quote:
      "Some people come into your life, and somewhere along the way, they become irreplaceable.",
  },
  {
    id: 8,
    image: "/memories/vl-sdk.jpg",
    rotate: 6,
    size: "small",
    desktop: { left: "59%", top: "39%" },
    mobile: { left: "58%", top: "40%" },
    quote: "Some friendships begin through you, and then become something entirely their own.",
  },
];

export default function Memories() {
  const [selected, setSelected] = useState(null);

  // Stores memories that have already been opened.
  // This persists for the current experience/session.
  const [visited, setVisited] = useState(new Set());

  const selectedMemory =
    memories.find((memory) => memory.id === selected) || null;

  const openMemory = (id) => {
    setSelected(id);

    setVisited((previous) => {
      const next = new Set(previous);
      next.add(id);
      return next;
    });
  };

  const closeMemory = () => {
    setSelected(null);
  };

  return (
    <section className="section fade memories">
      <div className="memory-wall">

        {/* HEADER */}

        <div className="memory-wall-heading">
          <span>Memories</span>
        </div>


        {/* MEMORY FIELD */}

        <div className="memory-field">

          {/* BACKDROP */}

          <AnimatePresence>
            {selected !== null && (
              <motion.button
                type="button"
                className="memory-backdrop"
                aria-label="Close memory"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={closeMemory}
              />
            )}
          </AnimatePresence>


          {/* MEMORY CARDS */}

          {memories.map((memory) => {
            const isSelected = selected === memory.id;
            const isVisited = visited.has(memory.id);
            const isDimmed = selected !== null && !isSelected;

            return (
              <motion.button
                key={memory.id}
                type="button"
                className={[
                  "memory-card",
                  `memory-${memory.size}`,
                  isVisited ? "memory-card-visited" : "",
                  isSelected ? "memory-card-selected" : "",
                  isDimmed ? "memory-card-dimmed" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}

                style={{
                  left: memory.desktop.left,
                  top: memory.desktop.top,
                  "--memory-mobile-left": memory.mobile.left,
                  "--memory-mobile-top": memory.mobile.top,
                }}

                animate={
                  isSelected
                    ? {
                        left: "50%",
                        top: "43%",
                        x: "-50%",
                        y: "-50%",
                        rotate: 0,
                        scale: 1,
                        opacity: 1,
                        zIndex: 30,
                      }
                    : {
                        x: "-50%",
                        y: "-50%",
                        rotate: memory.rotate,
                        scale: 1,
                        opacity: isDimmed ? 0.12 : 1,
                        zIndex: isDimmed ? 2 : 4,
                      }
                }

                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}

                whileHover={
                  selected === null
                    ? {
                        scale: 1.06,
                        rotate: 0,
                        zIndex: 10,
                      }
                    : undefined
                }

                whileTap={{
                  scale: 0.97,
                }}

                onClick={() =>
                  isSelected
                    ? closeMemory()
                    : openMemory(memory.id)
                }

                aria-label={
                  isSelected
                    ? "Close memory"
                    : "Open memory"
                }
              >
                <div className="memory-photo">
                  <img
                    src={memory.image}
                    alt=""
                    draggable="false"
                  />

                  <div className="memory-photo-overlay" />
                </div>
              </motion.button>
            );
          })}

        </div>


        {/* SELECTED QUOTE */}

        <AnimatePresence mode="wait">
          {selectedMemory && (
            <motion.div
              key={selectedMemory.id}
              className="memory-selected-content"

              initial={{
                opacity: 0,
                y: 14,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
                y: 8,
              }}

              transition={{
                duration: 0.55,
                delay: 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <p>{selectedMemory.quote}</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}