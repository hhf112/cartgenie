import { ItemCard } from "./ItemCard.tsx";
import React, { useContext, useState } from "react";
import { promptContext, PromptContextProvider, type promptContextType } from "../contexts/PromptContextProvider";

import { contentContext, type Product, type contentContextType, type contentType } from "../contexts/ContentContextProvider.tsx";


export function Content() {
  const { fetching, content, setContent } = useContext<contentContextType>(contentContext);
  return (

    <div className="flex grow flex-col w-full justify-end items-center m-2">

      {content.length ? (
        content.map((cont: contentType) => {
          if (cont.label == "content") {
            return (
              <div className="w-full m-2">
                <p> here is what I found! </p>
                <div className="flex w-full items-center rounded-2xl overflow-auto m-2">
                  {cont.products.map(prod => <ItemCard itemName={prod.title} imageUrl={prod.imageUrl} url={prod.url} site={prod.site} />)}
                </div>
              </div>
            )
          }

          else if (cont.label == "memo") {
            return (
              <div className="flex w-full justify-end items-start m-2">
                <div className="rounded-2xl bg-gray-100">
                  <div className="flex w-full items-center rounded-xl overflow-auto m-1">
                    {cont.imgs.map(img => <img src={img.url} className="h-25 w-25 m-2 rounded-2xl object-cover" />)}
                  </div>
                  <p className="text-left my-2 mx-3"> {cont.text} </p>
                </div>
              </div>
            )
          }

        })
      ) : (
        <h1 className="text-2xl font-semibold text-neutral-800"> Welcome to Cart Genie! </h1>
      )
      }

      {fetching && <h1 className="animate-pulse text-gray-600"> fetching results ... </h1>}


    </div>
  )
}
