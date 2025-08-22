import "./../index.css";
import Logo from "./../assets/ink_by_luvdat.png";
import Author from "./../assets/author.png";

function Navbar(props) {
  const barMode = props.barMode;

  if (!barMode) {
    return (
      <>
        <div className="fixed top-0 left-0 w-full z-50">
          <div className="flex flex-row items-center justify-between bg-gradient-to-r from-[#030712] via-[#1a2332] to-[#2d3748] p-4 shadow-lg">
            <div className="flex flex-row items-center gap-4">
              <img
                src={Logo}
                alt="Barze Logo"
                className="h-12 w-12 rounded-lg border-2 border-gray-700 shadow"
              />
              <span className="text-3xl font-extrabold text-white tracking-wide drop-shadow">
                Barze
              </span>
            </div>
            <div className="flex flex-row items-center gap-3 hover:bg-gray-800 px-3 py-2 rounded-lg transition cursor-pointer">
              <span className="author text-lg font-semibold text-gray-200">
                Astronicle
              </span>
              <img
                src={Author}
                alt="Author"
                className="h-10 w-10 rounded-full border-2 border-blue-400 shadow"
              />
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
