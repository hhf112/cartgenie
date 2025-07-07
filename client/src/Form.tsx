import React, { useContext } from 'react'
import { useRef } from 'react'
import { promptContext } from './contexts/PromptContextProvider'
import type { promptContextType } from "./contexts/PromptContextProvider"
import { SessionContext, type SessionContextType } from './contexts/SessionContextProvider'
import { contentContext, type contentContextType, type contentType, type Product, type waitingMessage } from './contexts/ContentContextProvider'


export function Form() {
  const { sessionToken } = useContext<SessionContextType>(SessionContext);
  const promptInfo = useRef<HTMLInputElement>(null);
  const ImageInputRef = useRef<HTMLInputElement>(document.createElement("input"));
  const TextInputRef = useRef<HTMLTextAreaElement>(document.createElement("textarea"));
  const { resetQuery, images, addImagesToState, } = useContext<promptContextType>(promptContext);
  const { addMemo , waiting, setWaiting, addResults, getEmbeddings, runSearch} = useContext<contentContextType>(contentContext)



  async function submitPrompt() {
    const promptData = new FormData();
    promptData.append("session", sessionToken);
    const prompt = TextInputRef.current.value

    promptData.append("text", prompt);
    images.forEach(img => promptData.append("images", img.file));
    try {
      addMemo(prompt, images);
      resetQuery(TextInputRef);

      setWaiting(prev => ({
        on: true,
        text: "processing image ..."
      }));

      const embeds = await getEmbeddings(promptData);

      setWaiting(prev => ({
        on: true,
        text: "searching for matches ..."
      }));

      const results = await runSearch(embeds);
      addResults(results);

      setWaiting(prev => ({
        text: "",
        on: false,
      }))

    } catch (err) {
      setWaiting(prev => ({
        text: "Unknown error occured. Please try again later.",
        on: false,
      }))
      console.log(err);
      return;
    }
  }

  return (
    <form key={sessionToken} className=" w-full border-b-gray-200 p-2 rounded-3xl shadow-xl overflow-auto " onSubmit={(e) => {
      e.preventDefault();
      submitPrompt();
    }}>

      <textarea ref={TextInputRef} name="TextPrompt" className=" w-full resize-none focus:outline-none placeholder-gray-500 text-black h-10  overflow-auto p-2 "
        placeholder="Describe your ideas precisely for better results."
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

