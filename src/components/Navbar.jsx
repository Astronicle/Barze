import { useState, useRef, useEffect } from "react";
import "./../index.css";
import Logo from "./../assets/ink_by_luvdat.png";
import Author from "./../assets/author.png";

const PHRASES = [
  "trust:tm:",
  "i got this",
  "spitting barze",
  "existing",
];

function Navbar(props) {
  const barMode = props.barMode;
  const [showChat, setShowChat] = useState(false);
  const [randomPhrase, setRandomPhrase] = useState("");
  const authorRef = useRef(null);

  // Select a random phrase when chat opens
  useEffect(() => {
    if (showChat) {
      const phraseID = Math.floor(Math.random() * PHRASES.length);
      setRandomPhrase(PHRASES[phraseID]);
    }
  }, [showChat]);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        authorRef.current &&
        !authorRef.current.contains(event.target)
      ) {
        setShowChat(false);
      }
    }
    if (showChat) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showChat]);

// How it works-
// When popup is open:
// A global mousedown listener is added.
// Inside the listener:
// If the click is NOT inside the button and NOT inside the popup (chatRef), then setShowChat(false) → close it.
// When popup closes or component unmounts, the listener is removed.

  if (!barMode) {
    return (
      <>
        <div className="fixed top-0 left-0 w-full z-50">
          <div className="flex flex-row items-center justify-between bg-gradient-to-r from-[#030712] via-[#1a2332] to-[#2d3748] p-4 shadow-lg">
            <div className="flex flex-row items-center gap-4">
              <img
                src={Logo}
                alt="Barze Logo"
                className="h-12 w-12 rounded-lg border-2 border-gray-700 shadow select-none"
              />
              <span className="text-3xl font-extrabold text-white tracking-wide drop-shadow select-none">
                Barze
              </span>
            </div>
            <div
              ref={authorRef}
              className="relative flex flex-row items-center gap-3 hover:bg-gray-800 px-3 py-2 rounded-lg transition cursor-pointer"
              onClick={() => setShowChat((prev) => !prev)}
            >
              <span className="author text-lg font-semibold text-gray-200 select-none">
                Astronicle
              </span>
              <img
                src={Author}
                alt="Author"
                className="h-10 w-10 rounded-full border-2 border-blue-400 shadow select-none"
              />
              {showChat && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white bg-opacity-95 rounded-xl shadow-lg border border-blue-400 z-50 p-3 text-sm text-gray-800 select-none">
                  <div className="px-2 py-1 rounded bg-blue-50 text-center">{randomPhrase}</div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full h-2 moving-gradient-bar opacity-80"></div>
        </div>
        <div className="h-20"></div>
      </>
    );
  }
}

export default Navbar;
