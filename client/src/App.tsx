
import { useContext, useEffect } from "react";

import { NavBar } from "./NavBar.tsx"
import { Content } from "./content/Content.tsx";
import { Form } from "./Form.tsx"
import { ImagePreview } from './ImagePreview.tsx';

import { PromptContextProvider, promptContext, type promptContextType } from "./contexts/PromptContextProvider";
import { SessionContext, type SessionContextType } from "./contexts/SessionContextProvider.tsx";
import { ContentContextProvider } from "./contexts/ContentContextProvider.tsx";

function App() {
  const { sessionToken, initSessionToken } = useContext(SessionContext);

  useEffect(() => {
    console.log("new session.")
  }, [sessionToken])



  return (
    <div className="flex px-70 flex-col h-screen  items-center justify-end">
      <NavBar />
      <div className="flex  w-full flex-col h-screen  items-center justify-end">
        <ContentContextProvider>
          <Content />
          <PromptContextProvider>
            <Form />
          </PromptContextProvider>
        </ContentContextProvider>
      </div>
    </div >
  );
}

export default App
