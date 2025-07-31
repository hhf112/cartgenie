import { ItemCard } from "./ItemCard.tsx";
import React, { Suspense, useContext, useEffect, useState } from "react";

import type { waitingMessage, Product, contentContextType, contentType } from "../../ContentTypes.ts";


function Memo({ cont }: { cont: contentType }) {
  const [mount, setMount] = useState<boolean>(false);
  useEffect(() => setMount(true), []);
  return (
    <div className="flex w-full justify-end items-start my-1">

      <div className={`rounded-2xl p-1 bg-gray-100
            ${mount ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
            transition-all transform duration-150`}>

        <div className="flex w-full items-center rounded-xl overflow-auto m-1">
          {cont.imgs.map(img => <img src={img.url} className="h-25 w-25 m-2 rounded-2xl object-cover" />)}
        </div>

        <p className="text-left text-neutral-700 text-sm my-2 mx-3">
          {cont.text} <br />
        </p>

      </div>

    </div>
  )

}

export function Content({ content, waiting }: { content: contentType[], waiting: waitingMessage }) {
  /* states */
  const [mount, setMount] = useState<boolean>(false);

  useEffect(() => setMount(true), []);

  /* component */
  return (
    <div
      className="p-4 flex flex-col h-full  overflow-y-auto w-full  min-w-0 overflow-x-hidden justify-end items-center  my-3 px-4">

      {content.length ? (
        content.map((cont: contentType) => {
          if (cont.label == "content") {
            return (
              <div className="w-full my-1">
                <p className="text-neutral-600 font-Inter"> {cont.text} </p>
                <div className="flex w-full items-center rounded-2xl overflow-auto mx-1 my-1">
                  {cont.products.map(prod => <ItemCard itemName={prod.title} imageUrl={prod.imageUrl} url={prod.url} site={prod.site} />)}
                </div>

              </div>
            )
          }
          else if (cont.label == "memo") {
            return <Memo cont={cont} />
          }

        })
      ) : (
        <h1 className={`text-2xl  font-Inter text-neutral-500
${mount ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-80 translate-y-5"}
transition-all transform duration-500 delay-400`}>
          Attach an image or a prompt!
        </h1>
      )
      }

      {waiting.on && <h1 className="animate-pulse text-gray-600"> {waiting.text} </h1>}
    </div>
  )
}
