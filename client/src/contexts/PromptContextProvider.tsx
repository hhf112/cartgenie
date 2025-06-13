// import React, { useContext, type Dispatch } from "react";
import { createContext, useState, type SetStateAction , useContext, useRef, type RefObject, type Ref} from "react";
import { SessionContext, type SessionContextType } from "./SessionContextProvider";


//globals
declare global {
  interface Image {
    file: File,
    url: string,
    uploaded: boolean,
    key: string
  }
}

//interfaces
export interface promptContextType {
  images: Image[],
  resetQuery: (textbox: RefObject<HTMLTextAreaElement> ) => void,
  addImagesToState: (fileArray: FileList | null) => Image[],
  removeImageFromState: (imageKey: string) => void,
}


//init context
export const promptContext = createContext<promptContextType>({
  images: [],
  resetQuery: (textbox: RefObject<HTMLTextAreaElement>) => { },
  addImagesToState: () => [],
  removeImageFromState: () => { },
});


export function PromptContextProvider({
  children,
}: { children: React.ReactNode }) {

  //states
  const [images, setImages] = useState<Image[]>([]);
  const [appState, setAppState] = useState<string>("prompt")

  const { sessionToken } = useContext<SessionContextType>(SessionContext);



  //funcs
  function resetQuery(textbox: RefObject<HTMLTextAreaElement>) {
    textbox.current.value = ""
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
      }}
    >
      {children}
    </promptContext.Provider>
  )
}

