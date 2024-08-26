import React from "react"
import { motion } from "framer-motion"

interface FlipperProps {
  front: React.ReactNode
  back: React.ReactNode
  flip: boolean
}

const Flipper: React.FC<FlipperProps> = ({ front, back, flip }) => {
  return (
    <motion.div
      style={{
        width: "100%",
        height: "100%",
        perspective: "1500px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 1.4s ease-in-out",
          transform: `rotateY(${flip ? 180 : 0}deg)`,
          willChange: "transform",
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <motion.div
          style={{
            width: "100%",
            backfaceVisibility: "hidden",
            position: "absolute",
          }}
        >
          {front}
        </motion.div>
        <motion.div
          style={{
            width: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: "absolute",
          }}
        >
          {back}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Flipper
