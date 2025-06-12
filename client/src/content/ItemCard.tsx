import React from "react"

interface itemCardParams {
  itemName: string,
  imageUrl: string,
  url: string,
  site: string
}
export function ItemCard({ itemName, imageUrl, url, site }: itemCardParams) {
  return (
    <div className="shrink-0 w-1/2 h-40 flex rounded-xl justify-start items-center border border-gray-300 m-1 shadow-xl overflow-y-hidden overflow-x-auto text-sm p-2">
      <img src={imageUrl} className="rounded-2xl max-h-full w-2/5  m-3 object-contain" />
      <div className="w-3/5 h-full flex min-w-0 flex-col justify-start items-start p-1">
        <p className="whitespace-normal break-words min-w-0 text-left font-semibold overflow-scroll"> {itemName} </p>
        <p className="  text-left whitespace-normal"> 
          <a href="https://amazon.com" className="text-blue-900 underline flex items-center overflow-auto gap-1">
            on {site} <img src="./icons/open-link.png" className="h-3 w-3" />
          </a> 
        </p>
        <p className=" min-w-0 max-w-full text-left text-neutral-400 whitespace-normal"> prices may change </p>
        <p className=" text-left whitespace-normal">
          <a className="whitespace-normal  flex gap-1 items-center text-blue-800 underline overflow-auto" href={url} target="_blank" >
            buy now <img src="./icons/open-link.png" className="h-3 w-3" />
          </a>
        </p>
      </div>
    </div>
  )

}
