import React, { createContext, useState, type Dispatch, type ReactNode } from "react";


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
}

export interface contentContextType {
  content: contentType[]
  setContent: Dispatch<contentType[]>,
  fetching: boolean
}
export const contentContext = createContext<contentContextType>({
  content: [],
  setContent: (prev) => {},
  fetching: false
})


export function ContentContextProvider({children} : {children: React.ReactNode}) {
  const [content, setContent] = useState<contentType[]>([])
  const [fetching, setFetching] = useState<boolean>(false);

  return (
  <contentContext.Provider value = {{
      setContent,
      content,
      fetching
    }}>

    {children}
  </contentContext.Provider>
  )

}
