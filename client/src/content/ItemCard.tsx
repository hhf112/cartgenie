import React from "react"

interface itemCardParams {
  itemName: string,
  imageUrl: string,
  url: string,
  site: string
}
export function ItemCard({itemName, imageUrl, url, site} : itemCardParams) {
  console.log(url)
  return (
    <div className="shrink-0 max-w-1/3 flex rounded-xl justify-start items-start border border-gray-300 m-1 shadow-xl overflow-y-auto">
      <img src={imageUrl} className={`rounded-2xl h-30 w-30  m-3`}/>
      <div className = "shrink-0 flex flex-col justify-start items-start m-3 grow">
      <p className = "w-full break-words mx-2  text-left font-semibold"> {itemName} </p>
      <p className = "mx-2  text-left overflow-auto"> on {site} </p>
      <p className = "mx-2 my-1 text-left overflow-auto"> buy now: <a className = "overflow-auto text-green-300 underline" href={url} > link to product </a> </p>
      </div>
    </div>
  )

}
