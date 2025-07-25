import React, { useContext } from "react"
import { SessionContext, type SessionContextType } from "./contexts/SessionContextProvider"


export function NavBar() {

  const { initSessionToken } = useContext(SessionContext);
  return (
    <div className=" border-neutral-200  fixed top-2 left-2 px-3 py-4 
      rounded-xl flex  justify-start items-center cursor-not-allowed">
      <div
        className=" font-semibold text-xl text-neutral-700 mx-0.5 rounded-xl text-center flex items-center object-cover"
        title="Learn More" >
        CartGenie
      </div>
      <div className="h-5 w-5 mx-0.5">
        <img src="/favicon.png" className="h-full w-full" />
      </div>
    </div>
  )

}
