import Navbar from "./Navbar";
import SectionSeparator from "./SectionSeparator";

const Header = () => {
  return (
    <header className="relative flex flex-col items-center justify-end mt-10 md:mt-20">
      <div className="max-w-4xl w-full px-4">
        <div>
          <h1 className="text-6xl md:text-8xl font-bold text-[#1e293b] font-charm mb-6 text-center">
            Gena Courtney
          </h1>
          <div className="relative flex justify-center items-center mb-8">
            <p className="text-md bg-inherit text-[#64748b]">Artist</p>
          </div>
        </div>

        <Navbar />

        <SectionSeparator />
      </div>
    </header>
  );
};

export default Header;
