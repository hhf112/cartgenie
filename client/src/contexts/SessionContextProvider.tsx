import { createContext, useState } from "react";

//interfaces
export interface SessionContextType {
  sessionToken: string,
  initSessionToken: () => void
}

//init context
export const SessionContext = createContext<SessionContextType>({
  sessionToken: "",
  initSessionToken: () => { }
})


export function SessionContextProvider({ children }: { children: React.ReactNode }) {
  //
  //states
  const [sessionToken, setSessionToken] = useState<string>("");

  //funcs
  function initSessionToken() {
    setSessionToken(crypto.randomUUID());
  }
  return (
    <SessionContext.Provider value={{
      sessionToken,
      initSessionToken
    }}>
      {children}
    </SessionContext.Provider>
  )
}
