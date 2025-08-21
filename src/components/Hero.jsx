import { useEffect, useState, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

function Hero(props) {
  const barMode = props.barMode;
  const setBarMode = props.setBarMode;
  const [mdFilePath, setMdFilePath] = useState(null); // state to hold the selected Markdown file path
  const [inputText, setInputText] = useState(""); // state to hold the input text
  const textareaRef = useRef(null); // reference to the textarea for focus management (not used in this snippet but can be useful for future enhancements)

  function handleBarMode() {
    const newMode = !barMode;
    window.electronAPI.changeBarMode(newMode ? "bar" : "main");
  }

  async function handleSetFileLocation() {
    const filePath = await window.electronAPI.selectMdFile(); // opens a dialog to select a Markdown file
    if (filePath) setMdFilePath(filePath); // sets the selected file path to state
  }

  useEffect(() => {
    window.electronAPI.onBarModeChanged(async (value) => {
      setBarMode(value);
      if (value) {
        // If entering bar mode, fetch the file path from main process
        const filePath = await window.electronAPI.getMdFilePath();
        setMdFilePath(filePath);
      }
    });
  }, []);

  useHotkeys(
    "ctrl+b",
    (event) => {
      event.preventDefault();
      handleBarMode();
    },
    {
      enableOnFormTags:["TEXTAREA"],
    },
  );

  async function handleTextareaKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey && mdFilePath && inputText.trim()) { //when user presses Enter without Shift and if mdFilePath is set and inputText is not empty then
      e.preventDefault(); //prevents default behavior of Enter key
      await window.electronAPI.appendToMdFile(mdFilePath, inputText.trim()); // appends the input text to the selected Markdown file
      setInputText(""); // clears the input text after appending
    }
  }

  if (!barMode) {
    return (
      <>
        <div className="flex w-full flex-col items-center justify-center">
          <button
            className="w-75 rounded-xl border-3 bg-white p-5 text-black hover:cursor-pointer"
            onClick={handleSetFileLocation}
          >
            Set File Location
          </button>
          <div className="text-xs text-gray-500 mt-2">
            {mdFilePath ? `Selected: ${mdFilePath}` : "No file selected"}
          </div>
          <button
            className="w-75 rounded-xl border-3 bg-white p-5 text-black hover:cursor-pointer"
            onClick={handleBarMode}
            disabled={!mdFilePath} // disables the button if no file is selected
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
          ref={textareaRef} // reference to the textarea for potential future focus management THIS IS NOT USED IN THIS SNIPPET
          placeholder="Enter text..."
          className="h-full w-full bg-white text-black"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)} // updates the input text state on change
          onKeyDown={handleTextareaKeyDown} // handles key down events for the textarea mainly for Enter key handling
          disabled={!mdFilePath} // disables the textarea if no file is selected
        ></textarea>
        {!mdFilePath && (
          <div className="text-xs text-red-500 mt-2">
            Please select a Markdown file first.
          </div>
        )}
      </>
    );
  }
}

export default Hero;
