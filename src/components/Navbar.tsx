import * as React from "react";
import { FiFile, FiPlus, FiUser } from "react-icons/fi";
import Link from "next/link";

interface INavbarProps {}

const Navbar: React.FunctionComponent<INavbarProps> = (props) => {
  
  return (
    <nav className="bg-white shadow-lg fixed inset-x-0 bottom-0 z-10">
      <div className="px-5 py-3 flex justify-around items-center">
        <Link href="/sortir" aria-label="Sortir" className="focus:outline-none">
          <FiFile size={24} className="text-black" />
        </Link>
        <Link href="/input" aria-label="Input" className="focus:outline-none">
          <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
            <FiPlus size={24} color="white" />
          </div>
        </Link>
        <Link
          href="/profile"
          aria-label="Profil"
          className="focus:outline-none"
        >
          <FiUser size={24} className="text-black" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
