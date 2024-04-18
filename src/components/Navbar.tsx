import { FiFile, FiPlus, FiUser, FiHome } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface INavbarProps {}

const Navbar: React.FunctionComponent<INavbarProps> = (props) => {
  const router = useRouter();

  return (
    <>
      <div className="fixed top-0 right-0 m-4">
        <Link href="/dashboard" aria-label="Dashboard">
          <FiHome
            size={24}
            className="text-black hover:text-blue-600 transition-colors duration-200"
          />
        </Link>
      </div>
      <nav className="bg-white shadow-lg fixed inset-x-0 bottom-0 z-10">
        <div className="px-5 py-3 flex justify-around items-center">
          <Link
            href="/sortir"
            aria-label="Sortir"
            className="focus:outline-none hover:text-blue-600 transition-colors duration-200"
          >
            <FiFile size={24} className="text-black" />
          </Link>
          <Link
            href="/input"
            aria-label="Input"
            className="focus:outline-none hover:bg-red-700 transition-colors duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
              <FiPlus size={24} color="white" />
            </div>
          </Link>
          <Link
            href="/profile"
            aria-label="Profil"
            className="focus:outline-none hover:text-blue-600 transition-colors duration-200"
          >
            <FiUser size={24} className="text-black" />
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;