import { useState } from "react";
import { useNoclip } from "react-noclip";
import { AnimatePresence, motion } from "framer-motion";
import styled from "@emotion/styled";
import { useTheme } from "next-themes";
import { usePrevious } from "react-use";

const steps = 4;
const snappy = { type: "spring", stiffness: 500, damping: 40 };

export type Item = {
  description?: string;
  date: string;
  slug: string;
  id: string;
  url?: string;
  deletedAt?: string;
};

export default function Docs() {
  const [key, setKey] = useState(0);
  const [step, setStep] = useState(1);
  const { theme, setTheme } = useTheme();
  const prevStep = usePrevious(step);
  useNoclip(
    {
      editItem: {
        textField: "text-area",
        slug: {
          type: "text-input",
          value: "test",
        },
        public: "checkbox",
        preChecked: {
          type: "checkbox",
          value: true,
        },
        description: "text-area",
        onSubmit: (val) => console.log(val),
        // public: "checkbox",
      },
    }
    // editItem: Object.fromEntries(
    //   items.map((item) => [
    //     item.slug,
    //     {
    //       slug: {
    //         type: "text-input",
    //         value: item.slug,
    //       },
    //     },
    //   ])
    // ),
    // }
  );

  // useNoclip({
  //   prefilledForm: {
  //     test: "text-input",
  //     test2: {
  //       type: "text-input",
  //       value: "initial value",
  //     },
  //     test3: "text-area",
  //     onSubmit: (val) => console.log(val),
  //   },
  //   someNesting: {
  //     test: () => console.log("test"),
  //     test2: () => console.log("test2"),
  //     nestedForm: {
  //       test: {
  //         type: "text-input",
  //         value: "initial value",
  //       },
  //       test2: "text-input",
  //       onSubmit: console.log,
  //     },
  //   },
  //   restartAnimation: () => setKey(key + 1),
  //   previousStep: () => setStep(step % steps === 1 ? step : step - 1),
  //   nextStep: () => setStep(step % steps === steps - 1 ? step : step + 1),
  //   toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
  //   uploadFile: {
  //     file: "file-picker",
  //     date: "text-input",
  //     title: "text-input",
  //     temp: "file-picker",
  //     description: "text-area",
  //     onSubmit: async (values) => {
  //       //console.log(values)
  //       if (values.file) {
  //         const file = values.file as unknown as File;
  //         const blob = new Blob([file], { type: file.type });
  //         console.log(blob);
  //       }
  //     },
  //   },
  // });

  return (
    <Container layout {...animations} theme={theme} key={key}>
      <AnimatePresence initial={false} mode="popLayout" custom={step}>
        <motion.div
          layout
          key={step}
          initial="initial"
          animate="in"
          exit="exit"
          transition={{ ...snappy, duration: 0.1 }}
          variants={{
            initial: { x: prevStep! < step ? 50 : -50, opacity: 0 },
            in: { x: 0, opacity: 1 },
            exit: (_step) => ({ x: _step < step ? 50 : -50, opacity: 0 }),
          }}
        >
          {renderStep(step, () => setStep(step + 1))}
        </motion.div>
      </AnimatePresence>
    </Container>
  );
}

function renderStep(step: number, onAction: () => void) {
  const [input, setInput] = useState("");

  switch (step) {
    case 1:
      return (
        <motion.div
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <h1>Step one.</h1>
          <p>
            Some input that you have to fill, but want to skip in the
            dev/testing stage.
          </p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={onAction} disabled={input.length < 20}>
            Next step
          </button>
        </motion.div>
      );
    case 2:
      return <h1>You made it to step two!</h1>;
    case 3:
      return <h1>All done!</h1>;
  }
}

const animations = {
  initial: { opacity: 0, scale: 0.8, borderRadius: 20 },
  animate: { opacity: 1, scale: 1 },
  transition: { ...snappy, opacity: { duration: 0.2 } },
};

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  margin: auto;
  margin-top: 15vh;
  padding: 2rem;
  max-width: 400px;
  background: var(--bg);
  color: var(--fg);
  overflow: hidden;
  position: relative;
`;
