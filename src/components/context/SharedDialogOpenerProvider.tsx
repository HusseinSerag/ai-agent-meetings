"use client";
import { ReactNode, createContext, useContext, useState } from "react";

const SharedUIContext = createContext<{
  isCreateAgentOpen: boolean;
  toggleIsCreateAgentOpen: (val: boolean) => void;
} | null>(null);

export function SharedDialogOpenerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isCreateAgentOpen, setIsCreateAgentOpen] = useState(false);
  return (
    <SharedUIContext.Provider
      value={{
        isCreateAgentOpen,
        toggleIsCreateAgentOpen: (val) => setIsCreateAgentOpen(val),
      }}
    >
      {children}
    </SharedUIContext.Provider>
  );
}

export function useDialogOpener() {
  const context = useContext(SharedUIContext);
  if (!context)
    throw new Error(
      `Please use \`${useDialogOpener.name}\` hook in a component wrapper inside the ${SharedDialogOpenerProvider.name} `
    );
  return context;
}
