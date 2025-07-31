import { useState, type RefObject } from "react";
import { type Image, type contentType, type waitingMessage } from "../../ContentTypes";
import { NavBar } from "./NavBar";
import { Content } from "./Content";
import { QueryBox } from "./QueryBox";

export function Home() {
  const [content, setContent] = useState<contentType[]>([])
  const [waiting, setWaiting] = useState<waitingMessage>({
    text: "",
    on: false,
  });
  const [images, setImages] = useState<Image[]>([]);


  function addImagesToState(fileArray: FileList | null): Image[] {
    if (fileArray) {
      const tempImages: Image[] = Array.from(fileArray).map((img, index) => ({
        file: img,
        url: URL.createObjectURL(img),
        uploaded: false,
        key: index.toString(),
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

  function resetQuery(textbox: RefObject<HTMLTextAreaElement>) {
    textbox.current.value = ""
    setImages([]);
  }


  return (
    <div className="flex  px-70 flex-col h-screen  items-center justify-end">
      <NavBar />
      <div className="flex  w-full flex-col h-screen  items-center justify-end">
        <Content
          content={content}
          waiting={waiting}
        />
          <QueryBox
            setContent={setContent}
            setWaiting={setWaiting} 
            addImagesToState={addImagesToState}
            removeImageFromState={removeImageFromState}
            resetQuery={resetQuery}
            images={images}
          />

      </div>
    </div >

  )
}
