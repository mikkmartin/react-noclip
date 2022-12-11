import { createContext, FC, useContext, ReactNode } from "react";

type NoclipContext = {
  shortcuts: { [key: string]: string } | undefined;
  setShortcuts: React.Dispatch<
    React.SetStateAction<{ [key: string]: string } | undefined>
  >;
};

const NoclipContext = createContext<NoclipContext>(
  null as unknown as NoclipContext
);

type Props = NoclipContext & {
  children: ReactNode;
};

export const NoclipProvider: FC<Props> = ({
  children,
  shortcuts,
  setShortcuts,
}) => {
  return (
    <NoclipContext.Provider value={{ shortcuts, setShortcuts }}>
      {children}
    </NoclipContext.Provider>
  );
};

export const useNoclipContext = () => {
  const value = useContext(NoclipContext);
  if (!value) {
    throw new Error("useNoclipContext must be used within a NoclipProvider");
  }
  return value;
};
