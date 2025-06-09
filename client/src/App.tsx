//dakr mode compatibility to be added.
import { NavBar } from "./NavBar.tsx"
import { Content } from "./content/Content.tsx";
import { Form } from "./Form.tsx"
import { ImagePreview } from './ImagePreview.tsx';

import { PromptContextProvider, promptContext, type promptContextType } from "./contexts/PromptContextProvider";
import { useContext, useEffect } from "react";
import { SessionContext, type SessionContextType } from "./contexts/SessionContextProvider.tsx";



function QueryBox() {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <ImagePreview />
      <Form />
      <p className="mt-1 mb-2 text-xs ">Upload images for better recommendations.</p>
    </div>
  );
}

function App() {
  const { sessionToken,  initSessionToken } = useContext(SessionContext);

  useEffect(() => {
    console.log(sessionToken)
  }, [sessionToken])



  return (
    <div className="flex dark:bg-gray-900 flex-col h-screen  items-center justify-end">
      <NavBar />
      <div className="flex flex-col h-screen w-3/5 items-center justify-end">
        <Content />
        <PromptContextProvider>
          <QueryBox />
        </PromptContextProvider>
      </div>
    </div >
  );
}

export default App
