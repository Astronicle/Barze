import { useEffect } from "react";

function Hero(props) {
  const barMode = props.barMode;
  const setBarMode = props.setBarMode;

  function handleBarMode() {
    const newMode = !barMode;
    window.electronAPI.changeBarMode(newMode ? "bar" : "main");
  }

  useEffect(() => {
    window.electronAPI.onBarModeChanged((value) => {
      console.log("Renderer received barModeChanged:", value);
      setBarMode(value);
    });
  }, []);

  if (!barMode) {
    return (
      <>
        <div className="flex w-full flex-col items-center justify-center">
          <button className="w-75 rounded-xl border-3 bg-white p-5 text-black hover:cursor-pointer">
            Set File Location
          </button>
          <button
            className="w-75 rounded-xl border-3 bg-white p-5 text-black hover:cursor-pointer"
            onClick={handleBarMode}
          >
            Enter Bar Mode!
          </button>
        </div>
      </>
    );
  } else {
    return (
      <>
        <textarea
          placeholder="Enter text..."
          className="h-full w-full bg-white text-black"
        ></textarea>
      </>
    );
  }
}

export default Hero;
