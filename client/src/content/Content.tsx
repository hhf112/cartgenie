import { ItemCard } from "./ItemCard.tsx";
import React, { useContext, useState } from "react";
import { promptContext, PromptContextProvider, type promptContextType } from "../contexts/PromptContextProvider";

import { contentContext, type waitingMessage,   type Product, type contentContextType, type contentType } from "../contexts/ContentContextProvider.tsx";



export function Content() {
  const { waiting, content} = useContext<contentContextType>(contentContext);
  return (
    <div className="flex flex-col h-full overflow-y-auto w-full  min-w-0 overflow-x-hidden justify-start items-center  my-3 px-4">
      {content.length ? (
        content.map((cont: contentType) => {
          if (cont.label == "content") {
            return (
              <div className="w-full my-1">
                {/*will possibly return highest similarity score found here*/}
                <p> {cont.text} </p>
                <div className="flex w-full items-center rounded-2xl overflow-auto mx-1 my-1">
                  {cont.products.map(prod => <ItemCard itemName={prod.title} imageUrl={prod.imageUrl} url={prod.url} site={prod.site} />)}
                </div>
              </div>
            )
          }

          else if (cont.label == "memo") {
            return (
              <div className="flex w-full justify-end items-start my-1">
                <div className="rounded-2xl bg-gray-100">
                  <div className="flex w-full items-center rounded-xl overflow-auto m-1">
                    {cont.imgs.map(img => <img src={img.url} className="h-25 w-25 m-2 rounded-2xl object-cover" />)}
                  </div>
                  <p className="text-left text-sm my-2 mx-3"> {cont.text} <br /></p>
                </div>
              </div>
            )
          }

        })
      ) : (
        <h1 className="text-2xl font-semibold text-neutral-800"> Welcome to Cart Genie! </h1>
      )
      }

      {waiting.on && <h1 className="animate-pulse text-gray-600"> {waiting.text} </h1>}
    </div>
  )
}
