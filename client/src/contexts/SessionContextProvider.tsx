import { createContext, useState } from "react";

export interface SessionContextType {
  sessionToken: string,
  initSessionToken: () => void
}

export const SessionContext = createContext<SessionContextType>({
  sessionToken: "",
  initSessionToken: () => { }
})


export function SessionContextProvider({ children }: { children: React.ReactNode }) {
  const [sessionToken, setSessionToken] = useState<string>("");

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
