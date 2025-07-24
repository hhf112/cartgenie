import { useEffect, useState } from "react";

export function Disclaimer({ display, colorClass }:
  { display: string, colorClass: string }) {
  const [mountAnimation, setMountAnimation] = useState<boolean>(false);
  useEffect(() => {
    setMountAnimation(true);
    return () => {
      setMountAnimation(false);
    }
  }, []);

  const color: Record<string, string> = {
    "green": "bg-green-400",
    "red": "bg-red-400",
    "amber": "bg-amber-400",
  }
  return (
    <div className={`fixed bottom-5 ${mountAnimation ? "translate-y-0 scale-100" : "scale-80 translate-y-2"} 
transform duration-300 transition-all delay-75 ${color[colorClass]} py-2 px-3 rounded-xl opacity-100`}>
      <h2 className="text-white font-semibold ">
        {display}
      </h2>
    </div>
  )
}
