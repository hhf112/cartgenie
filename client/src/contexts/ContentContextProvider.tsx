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
  addMemo: (prompt: string, images: Image[]) => { }
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


  return (
    <contentContext.Provider value={{
      content,
      waiting,
      setWaiting,
      addResults,
      addMemo,
    }}>

      {children}
    </contentContext.Provider>
  )

}
