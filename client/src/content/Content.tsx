import { ItemCard } from "./ItemCard.tsx";
import React, { useContext } from "react";
import { promptContext, PromptContextProvider, type promptContextType } from "../contexts/PromptContextProvider";

const dummyImages = [
  {
    url: "./icons/test.png",
    name: "itemname",
    site: "amazon"
  },

  {
    url: "./icons/test.png",
    name: "itemname",
    site: "amazon"
  },
  {
    url: "./icons/test.png",
    name: "itemname",
    site: "amazon"
  },
  {
    url: "./icons/test.png",
    name: "itemname",
    site: "amazon"
  },
  {
    url: "./icons/test.png",
    name: "itemname",
    site: "amazon"
  },
];

const results: boolean = false;
export function Content() {
  const { images } = useContext(promptContext)
  return (
    <div className="flex grow flex-col w-full justify-end items-center m-2">

      {/*Memo*/}
      <div className="flex w-full justify-end items-start">
        <div className="rounded-2xl bg-gray-100">
          <div className="flex w-full items-center rounded-2xl overflow-auto m-2">
            <img src="./icons/test.png" className="h-25 w-25 m-3 rounded-2xl" />
          </div>
          <p className="text-left m-3"> user text prompt </p>
        </div>
      </div>

      {/*Results*/}
      {results ? (
        <div className="w-full m-1">
          <p> here is what I found! </p>
          <div className="flex w-full items-center rounded-2xl overflow-auto m-2">
            {dummyImages.map(img => <ItemCard itemName={img.name} url={img.url} site={img.site} />)}
          </div>
        </div>
      ): (
      <h1 className = "animate-pulse text-gray-400"> fetching results... </h1>

      )}

    </div>
  )
}
