import { createContext, useContext, type ReactNode } from 'react';

const Ctx = createContext({});
export function DemoProvider({ children }: { children: ReactNode }) {
  return <Ctx.Provider value={{}}>{children}</Ctx.Provider>;
}
export const useDemo = () => useContext(Ctx);
