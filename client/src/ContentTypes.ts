import React, { createContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

export interface Image {
  file: File,
  url: string,
  uploaded: boolean,
  key: string
}

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
