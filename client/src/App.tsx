
import { useContext, useEffect } from "react";

import { NavBar } from "./NavBar.tsx"
import { Content } from "./content/Content.tsx";
import { Form } from "./Form.tsx"
import { ImagePreview } from './ImagePreview.tsx';

import { PromptContextProvider, promptContext, type promptContextType } from "./contexts/PromptContextProvider";
import { SessionContext, type SessionContextType } from "./contexts/SessionContextProvider.tsx";
import { ContentContextProvider } from "./contexts/ContentContextProvider.tsx";




function QueryBox() {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <ImagePreview />
      <Form />
      <p className="mt-1 mb-2 text-xs ">Upload an image and see the magic ✨</p>
    </div>
  );
}

function App() {
  const { sessionToken, initSessionToken } = useContext(SessionContext);

  useEffect(() => {
    console.log("new session.")
  }, [sessionToken])



  return (
    <div className="flex  flex-col h-screen  items-center justify-end">
      <NavBar />
      <div className="flex  flex-col h-screen w-3/5 items-center justify-end">
        <ContentContextProvider>
          <Content />
          <PromptContextProvider>
            <QueryBox />
          </PromptContextProvider>
        </ContentContextProvider>
      </div>
    </div >
  );
}

export default App
