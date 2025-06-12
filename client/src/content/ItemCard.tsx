import React from "react"

interface itemCardParams {
  itemName: string,
  imageUrl: string,
  url: string,
  site: string
}
export function ItemCard({ itemName, imageUrl, url, site }: itemCardParams) {
  return (
    <div className="min-w-1/2 h-40 flex rounded-xl justify-start items-center border border-gray-300 m-1 shadow-xl overflow-auto text-sm p-1">
      <img src={imageUrl} className="rounded-2xl max-h-full w-2/5  m-3 object-cover" />
      <div className="w-3/5 flex min-w-0 flex-col justify-start items-start p-2">
        <p className="whitespace-normal break-words min-w-0 text-left font-semibold overflow-auto"> {itemName} </p>
        <p className="  text-left whitespace-normal"> on <a href="https://amazon.com" className="text-cyan-300 underline"> {site} </a> </p>
        <p className=" min-w-0 max-w-full my-1 text-left text-neutral-400 whitespace-normal overflow-auto,"> prices may change from the time of database building </p>
        <p className=" my-1 text-left whitespace-normal"> buy now: <a className="whitespace-normal  text-green-300 underline overflow-auto" href={url} > link to product </a> </p>
      </div>
    </div>
  )

}
