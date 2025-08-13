function Hero() {
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center">
        <button className="w-75 rounded-xl border-3 bg-white p-5 text-black hover:cursor-pointer">
          Set File Location
        </button>
        <button className="w-75 rounded-xl border-3 bg-white p-5 text-black hover:cursor-pointer">
          Enter Bar Mode!
        </button>
      </div>
    </>
  );
}

export default Hero;
