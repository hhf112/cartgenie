import React, { useContext, type Dispatch } from "react";
import { createContext, type SetStateAction } from "react";
import { useState } from "react";
import { SessionContext } from "./SessionContextProvider";



//globals
declare global {
  interface Image {
    file: File,
    url: string,
    uploaded: boolean,
    key: string
  }
}

export const serverAddress = import.meta.env.VITE_SERVER_ADDRESS;


//interfaces
export interface promptContextType {
  serverAddress: string,
  images: Image[],
  resetQuery: () => void,
  addImagesToState: (fileArray: FileList | null) => Image[],
  removeImageFromState: (imageKey: string) => void,
}

//init context
export const promptContext = createContext<promptContextType>({
  serverAddress: "",
  images: [],
  resetQuery: () => { },
  addImagesToState: () => [],
  removeImageFromState: () => { },
});


export function PromptContextProvider({
  children,
}: {children: React.ReactNode}) {
  
  //states
  const [images, setImages] = useState<Image[]>([]);



  //funcs
  function resetQuery() {
    setImages([]);
  }

  function addImagesToState(fileArray: FileList | null): Image[] {
    if (fileArray) {
      const tempImages: Image[] = Array.from(fileArray).map((img) => ({
        file: img,
        url: URL.createObjectURL(img),
        uploaded: false,
        key: sessionToken,
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
        serverAddress,
      }}
    >
      {children}
    </promptContext.Provider>
  )
}

