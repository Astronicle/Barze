import { useEffect, useState, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { FaFileAlt, FaArrowRight } from "react-icons/fa";

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
      <div className="flex w-full min-h-[60vh] flex-col items-center justify-center">
        <button
          className="flex items-center gap-2 w-80 rounded-xl border-2 border-gray-400 bg-white p-5 text-black text-lg font-semibold shadow hover:bg-gray-50 transition"
          onClick={handleSetFileLocation}
        >
          <FaFileAlt className="text-blue-500" />
          Set File Location
        </button>
        <div className="mt-4 w-80 rounded bg-gray-200 px-4 py-2 text-xs text-gray-700 border border-gray-300 shadow-inner">
          {mdFilePath ? (
            <>
              <span className="font-bold text-green-700">Selected:</span>
              <span className="ml-2 break-all">{mdFilePath}</span>
            </>
          ) : (
            <span className="text-red-500">No file selected</span>
          )}
        </div>
        <button
          className={`flex items-center gap-2 w-80 mt-6 rounded-xl border-2 bg-blue-600 p-5 text-white text-lg font-semibold shadow hover:bg-blue-700 transition ${!mdFilePath ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleBarMode}
          disabled={!mdFilePath} // disables the button if no file is selected
        >
          <FaArrowRight />
          Enter Bar Mode
        </button>
      </div>
    );
  } else {
    return (
      <>
        <textarea
          ref={textareaRef}
          placeholder="Enter text..."
          className="h-24 w-full max-w-2xl mx-auto rounded-lg border-2 border-gray-300 bg-white text-black p-4 text-base shadow focus:outline-none focus:border-blue-500 transition"
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
