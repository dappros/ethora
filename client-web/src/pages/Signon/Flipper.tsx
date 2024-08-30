import React from "react"
import { motion } from "framer-motion"

interface FlipperProps {
  front: React.ReactNode
  back: React.ReactNode
  flip: boolean
  isMobile: boolean
}

const Flipper: React.FC<FlipperProps> = ({
  front,
  back,
  flip,
  isMobile = false,
}) => {
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
          alignItems: isMobile ? "start" : "center",
        }}
      >
        <motion.div
          style={{
            width: "100%",
            backfaceVisibility: "hidden",
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "start",
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
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "start",
          }}
        >
          {back}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Flipper
