import { useContext, useEffect } from "react";

import { Home } from "./pages/Home/Home.tsx";

const backend = import.meta.env.VITE_BACKEND;
if (!backend) {
  console.error("backend url not found");
}

function App() {
  // const ping = async () => fetch(`${backend}/91u340`);
  //
  // useEffect(() => {
  //   const checkStatus = async () => {
  //     try {
  //     const status = await ping();
  //     const statusJSON = await status.json();
  //     } catch (err) {
  //       console.error ("service unreachable");
  //     }
  //   }
  //
  //   checkStatus();
  // }, []);


  return (
    <Home/>
  )
}

export default App
