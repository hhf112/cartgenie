import { Banner } from "./Banner.tsx"
import { Content } from "./content/Content.tsx";
import { Form } from "./Form.tsx"
import { ImagePreview } from './ImagePreview.tsx';

import { PromptContextProvider } from "./contexts/PromptContextProvider";



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
  return (
    <div className="flex flex-col h-screen items-center justify-end">
      <Banner />
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
