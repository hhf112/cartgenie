import React, { useContext } from 'react'
import { useRef } from 'react'
import { promptContext } from './contexts/PromptContextProvider'
import type { promptContextType } from "./contexts/PromptContextProvider"
import { SessionContext, type SessionContextType } from './contexts/SessionContextProvider'
import { contentContext, type contentContextType, type contentType, type Product } from './contexts/ContentContextProvider'


export function Form() {
  const { sessionToken } = useContext<SessionContextType>(SessionContext);
  const promptInfo = useRef<HTMLInputElement>(null);
  const ImageInputRef = useRef<HTMLInputElement>(document.createElement("input"));
  const UserInputRef = useRef<HTMLTextAreaElement>(document.createElement("textarea"));
  const { resetQuery, images, addImagesToState,} = useContext<promptContextType>(promptContext);
  const { setContent , fetching, setFetching} = useContext<contentContextType>(contentContext)



  async function submitPrompt() {
    const formData = new FormData();
    formData.append("session", sessionToken);
    
    images.forEach(img => formData.append("images", img.file));
    try {
      setContent((prev: contentType[]) => [...prev, {
        label: "memo",
        text: UserInputRef.current.value,
        products: [],
        imgs: images
      }])

      resetQuery();

      setFetching(true);
      const query = await fetch(`${import.meta.env.VITE_SERVERADDRESS}/upload`, {
        method: "POST",
        body: formData
      })

      const results = await query.json();

      const display : contentType = {
        label : "content",
        text: "this is what I found!",
        products: [],
        imgs: []
      }

      results.results.rows.forEach((row : {
        url : string,
        caption: string,
        product_url: string,
      }) => {
          display.products.push({
            title: row.caption,
            url: row.product_url,
            site: "amazon",
            imageUrl: row.url
          })
      })
      setFetching(false)
      setContent((prev: contentType[]) => [...prev, display]);
    } catch (err) {
      console.log(err);
      return;
    }
  }


  return (
    <form key={sessionToken} className=" w-full border-b-gray-200 p-2 rounded-3xl shadow-xl overflow-auto " onSubmit={(e) => {
      e.preventDefault();
      submitPrompt();
    }}>

      <textarea ref={UserInputRef} name="TextPrompt" className=" w-full resize-none focus:outline-none placeholder-gray-500 text-black h-10  overflow-auto p-2 "
        placeholder="Describe your ideas for better results..."
      />


      <input multiple type="file" name="ImagePrompt" accept="image/*" className="hidden" ref={ImageInputRef}
        onChange={e => { addImagesToState(e.target.files) }} />



      <div className="flex justify-end">
        <button type="button" className="w-8 cursor-pointer h-8 mx-2" onClick={() => {
          ImageInputRef.current.click();
        }}>
          <img src="./icons/attach.png" alt="upload images" className="w-8 h-8" />
        </button>

        <button type="submit" className="w-9 h-9 mx-1"> <img src="./icons/up-arrow.png" className="w-9 cursor-pointer h-9 hover:bg-gray-200 rounded-xl" /> </button>
      </div>
    </form >
  )
}

