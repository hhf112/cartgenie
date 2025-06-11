import React, { useContext } from "react"
import { SessionContext, type SessionContextType } from "./contexts/SessionContextProvider"


export function NavBar() {

  const { initSessionToken } = useContext(SessionContext);
  return (
    <div className="flex justify-start w-1/5 items-stretch absolute left-3 top-0  h-15">

      {/* navbar */}
      <img title = "past chats" src = "./icons/nav-bar.png" className = "cursor-pointer p-2 m-1 rounded-xl hover:bg-gray-200"/>

      {/*New chat button*/}
      <img title="New chat" src="./icons/create-new-chat.png" className="cursor-pointer p-3 m-1 rounded-xl hover:bg-gray-200" onClick={() => initSessionToken()} />


      {/* meta */}
      < div title="Learn More" className="cursor-pointer font-semibold text-xl text-neutral-900 m-1 hover:bg-gray-200  px-2 py-3 rounded-xl text-center flex items-center"> CartGenie</div>
    </div >
  )

}
