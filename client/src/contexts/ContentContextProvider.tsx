import React, { createContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { PromptContextProvider } from "./PromptContextProvider";


export interface Product {
  title: string,
  url: string,
  imageUrl: string,
  site: string,
}

export interface contentType {
  label: string,
  text: string,
  products: Product[]
  imgs: Image[]
}


export interface waitingMessage {
  text: string,
  on: boolean
}

export interface contentContextType {
  content: contentType[]
  waiting: waitingMessage,
  setWaiting: Dispatch<SetStateAction<waitingMessage>>,
  addResults: (rows: Item[]) => void,
  getEmbeddings: (prompt: FormData) => Promise<Number[]>,
  runSearch: (embeds: Number[]) => Promise<Item[]>,
  addMemo: (prompt: string, images: Image[]) => void,
}

export interface Item {
  url: string,
  caption: string,
  product_url: string,
}

export const contentContext = createContext<contentContextType>({
  content: [],
  waiting: {
    text: "",
    on: false,
  },
  setWaiting: (prev) => { },
  addResults: (rows: Item[]) => { },
  getEmbeddings: (prompt: FormData) => Promise.resolve([]),
  runSearch: (embeds: Number[]) => Promise.resolve([]),
  addMemo: (prompt: string, images: Image[]) => {}
})



export function ContentContextProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<contentType[]>([])
  const [waiting, setWaiting] = useState<waitingMessage>({
    text: "",
    on: false,
  });

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

    rows.forEach((row: {
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

    setContent((prev: contentType[]) => [...prev, display]);
  }

  async function getEmbeddings(promptData: FormData) {
    try {
      const getEmbeddings = await fetch(`${import.meta.env.VITE_EMBEDADRR}/upload`, {
        method: "POST",
        body: promptData
      })

      if (!getEmbeddings.ok) throw new Error("failed to query embeddings")
      const embeds = await getEmbeddings.json();

      return embeds;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async function runSearch(embeds: Number[]) {
    try {
      const results = await fetch(`${import.meta.env.VITE_RESADDR}/upload`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          embeddings: embeds
        })
      })
      if (!results.ok) throw new Error("failed to get results")
      const products = await results.json();
      return products.rows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }


  return (
    <contentContext.Provider value={{
      content,
      waiting,
      setWaiting,
      addResults,
      addMemo,
      getEmbeddings,
      runSearch,
    }}>

      {children}
    </contentContext.Provider>
  )

}
