import React from "react"

interface itemCardParams {
  itemName: string,
  imageUrl: string,
  url: string,
  site: string
}
export function ItemCard({itemName, imageUrl, url, site} : itemCardParams) {
  return (
    <div className="shrink-0 w-1/2 flex rounded-xl justify-start items-start border border-gray-300 m-1 shadow-xl">
      <img src={imageUrl} className={`rounded-2xl h-30 w-30  m-3`}/>
      <div className = "shrink-0 flex flex-col justify-start items-start m-3 grow">
      <p className = "mx-2  text-left font-semibold"> {itemName} </p>
      <p className = "mx-2  text-left"> on {site} </p>
      <p className = "mx-2 my-1 text-left"> buy now: <a href={url}/> </p>
      </div>
    </div>
  )

}
