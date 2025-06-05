import { ItemCard } from "./ItemCard.tsx";
import React from "react";

export function Content() {
  return (
    <div className="w-full flex grow flex-col justify-center items-center">
      <div className=" flex grow-4/5 flex-col justify-center items-center overflow-auto">
        {/* <ItemCard/> */}
      </div>


      <div className=" flex grow-1/5 flex-col justify-center items-center overflow-auto">
        {/*text response from server*/}
      </div>
    </div>
  )
}
