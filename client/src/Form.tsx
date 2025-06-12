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
  const TextInputRef = useRef<HTMLTextAreaElement>(document.createElement("textarea"));
  const { resetQuery, images, addImagesToState, } = useContext<promptContextType>(promptContext);
  const { setContent, fetching, setFetching } = useContext<contentContextType>(contentContext)



  async function submitPrompt() {
    const formData = new FormData();
    formData.append("session", sessionToken);
    const prompt = TextInputRef.current.value

    formData.append("text", prompt);
    images.forEach(img => formData.append("images", img.file));
    try {
      setContent((prev: contentType[]) => [...prev, {
        label: "memo",
        text: TextInputRef.current.value,
        products: [],
        imgs: images
      }])


      TextInputRef.current.value = "";
      resetQuery();

      setFetching(true);
      const getEmbeddings = await fetch(`${import.meta.env.VITE_EMBEDADRR}/upload`, {
        method: "POST",
        body: formData
      })

      if (!getEmbeddings.ok) throw new Error("failed to generate embeddings")

      const embeds = await getEmbeddings.json();

      const results = await fetch(`${import.meta.env.VITE_RESADDR}/upload`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          embeddings: embeds
        })
      })


      if (!getEmbeddings.ok) throw new Error("failed to get results")
      const products = await results.json();

      const display: contentType = {
        label: "content",
        text: "this is what I found!",
        products: [],
        imgs: []
      }

      products.rows.forEach((row: {
        url: string,
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


  // function dummySubmit() {
  //   resetQuery();
  //   const display: contentType = {
  //     label: "content",
  //     text: "this is what I found!",
  //     products: [],
  //     imgs: []
  //   }
  //
  //   for (let i = 0; i < 3; i++) {
  //     display.products.push({
  //       title: "djkqwdnqwjdnkqwnjdnqkdjqwndknqjdnkqndjnqwkdqjknkdqndkjqwndkjqwndkqwdnkqwndjqndqwjdnkjqkwjdnkq",
  //       url: "djkqwdnqwjdnkqwnjdnqkdjqwndknqjdnkqndjnqwkdqjknkdqndkjqwndkjqwndkqwdnkqwndjqndqwjdnkjqkwjdnkq",
  //       site: "djkqwdnqwjdnkqwnjdnqkdjqwndknqjdnkqndjnqwkdqjknkdqndkjqwndkjqwndkqwdnkqwndjqndqwjdnkjqkwjdnkq",
  //       imageUrl: "./icons/attach.png",
  //     })
  //   }
  //
  //   setContent((prev: contentType[]) => [...prev, display]);
  // }
  //
  return (
    <form key={sessionToken} className=" w-full border-b-gray-200 p-2 rounded-3xl shadow-xl overflow-auto " onSubmit={(e) => {
      e.preventDefault();
      submitPrompt();
      // dummySubmit()
    }}>

      <textarea ref={TextInputRef} name="TextPrompt" className=" w-full resize-none focus:outline-none placeholder-gray-500 text-black h-10  overflow-auto p-2 "
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

