import { useState } from "react";
import { useNoclip } from "react-noclip";
import { AnimatePresence, motion } from "framer-motion";
import styled from "@emotion/styled";

export default function Docs() {
  const [showHeader, setShowHeader] = useState(true);
  const [key, setKey] = useState(0);
  const [open, setOpen] = useState(false);

  useNoclip({
    toggleAnimation: () => setShowHeader(!showHeader),
    restartAnimation: () => setKey(key + 1),
    toggleOpen: () => setOpen(!open),
  });

  return (
    <Container>
        {showHeader && (
          <motion.div
            animate={open ? "open" : "closed"}
            className="animation-container"
            key={key}
          >
            <motion.div
              variants={{ closed: { x: "100%" }, open: { x: "40%" } }}
            />
            <motion.div />
            <motion.div
              variants={{ closed: { x: "-100%" }, open: { x: "-40%" } }}
            />
          </motion.div>
        )}
      <input type="text" />
      <button>does nothing</button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10rem;
  .animation-container {
    display: flex;
    div {
      width: 100px;
      height: 100px;
      border-radius: 100%;
      mix-blend-mode: screen;
      &:nth-of-type(1) {
        background: red;
      }
      &:nth-of-type(2) {
        background: #00ff00;
      }
      &:nth-of-type(3) {
        background: blue;
      }
    }
  }
`;
