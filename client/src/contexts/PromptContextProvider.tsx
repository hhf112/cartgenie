import React, { type Dispatch } from "react";
import { createContext, type SetStateAction } from "react";
import { useState } from "react";

export const serverAddress = import.meta.env.VITE_SERVER_ADDRESS;

export interface promptContextType {
  serverAddress: string,
  images: Image[],
  resetQuery: () => void,
  addImagesToState: (fileArray: FileList | null) => Image[],
  removeImageFromState: (imageKey: string) => void,
}

export const promptContext = createContext<promptContextType>({
  serverAddress: "",
  images: [],
  resetQuery: () => { },
  addImagesToState: () => [],
  removeImageFromState: () => { }
});

declare global {
  interface Image {
    file: File,
    url: string,
    uploaded: boolean,
    key: string

  }
}

interface PromptContextProviderContexts {
  children: React.ReactNode;
}
export function PromptContextProvider({
  children,
}: PromptContextProviderContexts) {
  const [images, setImages] = useState<Image[]>([]);


  function resetQuery() {
    setImages([]);
  }

  function addImagesToState(fileArray: FileList | null): Image[] {
    if (fileArray) {
      const tempImages: Image[] = Array.from(fileArray).map((img) => ({
        file: img,
        url: URL.createObjectURL(img),
        uploaded: false,
        key: "",
      }));
      setImages((prev: Image[]): Image[] => [...prev, ...tempImages]);

      return tempImages;
    }
    else return [];
  }

  function removeImageFromState(removeUrl: string) {
    setImages((images) => {
      return images.filter(image => {
        if (image.url === removeUrl) URL.revokeObjectURL(image.url);
        return image.url !== removeUrl;
      })
    })
  }

  return (
    <promptContext.Provider
      value={{
        addImagesToState,
        removeImageFromState,
        images,
        resetQuery,
        serverAddress
      }}
    >
      {children}
    </promptContext.Provider>
  )
}

