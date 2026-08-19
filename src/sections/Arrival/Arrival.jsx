import { motion } from "framer-motion";
import "./Arrival.css";

export default function Arrival({ onNext }) {

  return (

    <section className="section arrival">

      <div className="container arrival-container">

        {/* =================================================
            INTRO
        ================================================= */}

        <motion.p
  className="arrival-intro"

  initial={{
    opacity: 0,
    y: 10,
  }}

  animate={{
    opacity: 1,
    y: 0,
  }}

  transition={{
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1],
}}
>
  There are things I've never said.
</motion.p>


<motion.p
  className="arrival-intro arrival-second"

  initial={{
    opacity: 0,
    y: 10,
  }}

  animate={{
    opacity: 1,
    y: 0,
  }}

  transition={{
  duration: 0.55,
  delay: 0.08,
  ease: [0.22, 1, 0.36, 1],
}}
>
  So I thought I'd show you.
</motion.p>


<motion.div
  className="arrival-main"

  initial={{
    opacity: 0,
    y: 14,
  }}

  animate={{
    opacity: 1,
    y: 0,
  }}

  transition={{
  duration: 0.65,
  delay: 0.16,
  ease: [0.22, 1, 0.36, 1],
}}
>
  <h1>
    For the little things
    <br />
    that stayed with me.
  </h1>
</motion.div>

      </div>

    </section>

  );
}