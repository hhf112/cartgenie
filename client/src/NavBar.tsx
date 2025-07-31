import React, { useContext, useEffect, useState } from "react"


export function NavBar() {
  const [mount, setMount] = useState(false);
  useEffect(() => setMount(true), []);


  return (
    <div className=" border-neutral-200  fixed top-2 left-2 px-3 py-4 
      rounded-xl flex  justify-start items-center cursor-not-allowed">
      <div
        className={`font-semibold font-Inter text-xl text-neutral-600 mx-0.5 
        rounded-xl text-center flex items-center object-cover
${mount ? " opacity-100 scale-100" : "opacity-0  scale-90"} 
duration-800 transition-all transform`}
        title="Learn More" >
        CartGenie
      </div>
      <div className="h-5 w-5 mx-0.5">
        <img src="/favicon.png" className="h-full w-full" />
      </div>
    </div>
  )

}
