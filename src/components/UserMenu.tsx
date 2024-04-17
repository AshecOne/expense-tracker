import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { logout } from '@/lib/features/userSlice';
import { MdSettings, MdExitToApp } from 'react-icons/md'; // Import ikon

interface IUserMenuProps {
  onClose: () => void;
}

const UserMenu: React.FC<IUserMenuProps> = ({ onClose }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSettings = () => {
    onClose();
    router.push('/setting');
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-30 bg-white rounded-md shadow-lg z-10">
      <button
        className="flex items-center justify-start w-full text-left px-4 py-2 text-black hover:bg-gray-100 hover:rounded-md"
        onClick={handleSettings}
      >
        <MdSettings className="mr-2"/> Settings
      </button>
      <button
        className="flex items-center justify-start w-full text-left px-4 py-2 text-black hover:bg-gray-100 hover:rounded-md"
        onClick={handleLogout}
      >
        <MdExitToApp className="mr-2"/> Logout
      </button>
    </div>
  );
};

export default UserMenu;
