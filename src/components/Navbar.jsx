import "./../index.css";
import Logo from "./../assets/ink_by_luvdat.png";
import Author from "./../assets/author.png";

function Navbar() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full mb-20">
        <div className="flex flex-row items-center justify-between bg-[#030712] p-4 text-lg font-semibold">
          <div className="flex flex-row items-center text-3xl font-extrabold">
            <img src={Logo} alt="Barze Logo" className="m-2 h-12" />
            <div className="title">Barze</div>
          </div>
          <div className="flex flex-row items-center">
            <div className="author">Astronicle</div>
            <img src={Author} alt="Author" className="m-2 h-12 rounded-full" />
          </div>
        </div>
      </div>
      <div className="h-27"></div>
    </>
  );
}

export default Navbar;
