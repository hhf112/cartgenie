import React, { useContext, useEffect, useState, useRef, type Dispatch, type SetStateAction, type RefObject } from 'react'
import type { Image, contentType, Item, Product, waitingMessage } from './ContentTypes'

const backend = import.meta.env.VITE_BACKEND;
if (!backend) {
  console.error("backend url not found.");
}

function ImageCard({ image, addImagesToState, removeImageFromState }: {
  image: Image,
  addImagesToState: (fileArray: FileList | null) => void,
  removeImageFromState: (imageKey: string) => void,
}) {
  return (
    <div className="w-full p-1 flex text-sm items-end overflow-auto" onDrop={(e) => {
      e.preventDefault();
      addImagesToState(e.dataTransfer.files);
    }} onDragOver={(e) => e.preventDefault()}>

      <div className="w-30 h-30 relative mx-1 shrink-0">
        <img src={image.url} className=" rounded-xl w-full h-full object-cover" />
        <button className="absolute top-3 right-3 cursor-pointer" type="button"
          onClick={() => removeImageFromState(image.url)} > <img src="./icons/remove.png" className="w-3  h-3 object-cover" /></button>
      </div>
    </div>
  )
}


export function QueryBox({
  setContent,
  setWaiting,
  resetQuery,
  removeImageFromState,
  images,
  addImagesToState,
}: {
  setContent: Dispatch<SetStateAction<contentType[]>>,
  setWaiting: Dispatch<SetStateAction<waitingMessage>>,
  resetQuery: (textbox: RefObject<HTMLTextAreaElement>) => void,
  removeImageFromState: (removeUrl: string) => void,
  addImagesToState: (fileArray: FileList | null) => Image[],
  images: Image[],
}) {

  /* use */
  const ImageInputRef = useRef<HTMLInputElement>(document.createElement("input"));
  const TextInputRef = useRef<HTMLTextAreaElement>(document.createElement("textarea"));

  /* states */
  const [mount, setMount] = useState<boolean>(false);
  const [secMount, setSecMount] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setMount(true);
      setSecMount(true);
      setTimeout(() => setSecMount(false), 500);
    }, 100);
  }, []);



  function addMemo(prompt: string, images: Image[]) {
    setContent((prev: contentType[]) => [...prev, {
      label: "memo",
      text: prompt,
      products: [],
      imgs: images
    }])
  }

  function addResults(rows: Item[]) {
    const display: contentType = {
      label: "content",
      text: `found ${rows.length} result(s)!`,
      products: [],
      imgs: []
    }

    rows.forEach((row) => {
      display.products.push({
        title: row.caption,
        url: row.product_url,
        site: "amazon",
        imageUrl: row.url
      })
    })

    setContent((prev: contentType[]) => [...prev, display]);
  }


  async function submitPrompt() {
    const prompt = TextInputRef.current.value
    const promptData = new FormData();
    promptData.append("text", prompt);
    images.forEach(img => promptData.append("images", img.file));
    addMemo(prompt, images);
    resetQuery(TextInputRef);
    setWaiting(prev => ({
      on: true,
      text: "processing your result please wait ..."
    }));

    try {
      let fch = 0;
      setTimeout(() => {
        if (!fch) {
          setWaiting({ text: "server is cold starting please wait a few seconds!", on: true });
        }
      }, 3000);

      const post = await fetch(`${backend}/upload`, {
        method: "POST",
        body: promptData,
      });
      fch = 1;

      if (post.status === 429) {
        setWaiting({
          on: true,
          text: "You are restricted to 2 requests per hour and 10 requests per day"
        });
        return;
      }

      else if (!post.ok) throw new Error("failed to get results")
      const postJSON = await post.json();
      const results = postJSON.rows;
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

  /* component */
  return (
    <div className="flex flex-col w-full">

      {/* IMAGES PREVIEW */}
      <div className="w-full p-1 flex text-sm items-end overflow-auto" onDrop={(e) => {
        e.preventDefault();
        addImagesToState(e.dataTransfer.files);
      }} onDragOver={(e) => e.preventDefault()}>

        {images.map((image, index) => (
          <ImageCard
            key={index.toString()}
            image={image} addImagesToState={addImagesToState} removeImageFromState={removeImageFromState} />
        ))}

        {images.length < 1 &&
          <h1 className={`my-1 text-neutral-400 font-semibold
      ${mount ? "translate-y-0 opacity-100" : "translate-y-4  opacity-0"}
  transition-all transform delay-200 duration-1000`}>
            upload or drag and drop images here.
          </h1>
        }
      </div>

      {/* FORM */}
      <form
        className={`flex flex-col w-full border border-neutral-200 p-2 rounded-3xl shadow-xl overflow-auto
      ${mount ? "scale-100" : "opacity-5"} 
  ${secMount && "shadow-cyan-200 shadow-lg"}
      transition-all transform delay-100 duration-75" }`}
        onSubmit={(e) => {
          e.preventDefault();
          submitPrompt();
        }}
      >
        <textarea
          className={`w-full resize-none focus:outline-none placeholder-neutral-500 
        text-neutral-800 flex-3  overflow-auto p-2 font-Inter
       ${mount ? "opacity-100 translate-y-0" : "opacity-5 -translate-y-2"} transition-all transform 
duration-200 delay-100`}
          ref={TextInputRef} name="TextPrompt"
          placeholder="Describe your ideas precisely for better results ..."
        />

        {/* BUTTONS */}
        <input multiple type="file" name="ImagePrompt" accept="image/*" className="hidden" ref={ImageInputRef}
          onChange={e => { addImagesToState(e.target.files) }} />

        <div className={`flex-1 items-center flex justify-end
          ${mount ? "opacity-100 translate-y-0" : "opacity-35 translate-y-1"}
          transition-all transform duration-100 delay-150`}>

          <button type="button"
            className="w-10 cursor-pointer h-10 p-1 rounded-xl mx-0.5
          hover:scale-105 hover:-translate-x-0.5 hover:bg-cyan-200
          transition-all transform duration-100 delay-100" onClick={() => {
              ImageInputRef.current.click();
            }}>
            <img src="./icons/attach.png" alt="upload images"
              className="w-full h-full" />
          </button>

          <button className="
         w-11 h-11 p-1 mx-0.5
          hover:scale-110 hover:-translate-y-1 transition-all delay-100 
          transform duration-200 "
            type="submit">
            <img src="./icons/up-arrow.png"
              className="w-full cursor-pointer h-full hover:bg-gray-200 rounded-xl" />
          </button>
        </div>

      </form >

      {/* BOTTOM TEXT */}
      <h1 className={`my-1 text-neutral-600 text-sm text-center
      ${mount ? "opacity-100" : "opacity-0"}
  transition-all transform delay-200 duration-1000`}>
        All results are produced using a limited database. purpose of this site is to serve as a demo.
      </h1>

    </div>
  )
}

