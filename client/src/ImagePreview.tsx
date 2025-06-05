import React from "react";
import { useContext, useEffect } from "react";
import { promptContext } from "./contexts/PromptContextProvider.tsx";

export function ImagePreview() {

  const { removeImageFromState, addImagesToState, images, serverAddress } = useContext(promptContext);
  function serverDeleteImage(imageKey : Image["key"]) {
    removeImageFromState(imageKey);
    fetch(`${serverAddress}/deleteImage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: imageKey })
    })
  }


  return (
    <div className="w-full p-1  flex text-sm items-end overflow-auto" onDrop={(e) => {
      e.preventDefault();
      addImagesToState(e.dataTransfer.files);
    }} onDragOver={(e) => e.preventDefault()}>

      {images.map((image, index) => (
        <div key={index} className="w-40 h-40 relative mx-1">
           <img src={image.url} className=" rounded-xl w-40 h-40" />
          <button className="absolute top-3 right-3 cursor-pointer" type="button"
            onClick={() => removeImageFromState(image.url)} > <img src="./icons/remove.png" className="w-3  h-3" /></button>
        </div>
      ))}
      {images.length < 1 && <h1 className="my-1"> Upload or drag and drop images here. </h1>}
    </div>
  )
}
