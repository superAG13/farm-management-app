import {ReactSVG} from "react-svg";
import {GiWheat} from "react-icons/gi";
import {HiUser} from "react-icons/hi2";
import {IoCalendarOutline} from "react-icons/io5";
import {Link} from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="bg-green-800 z-9999 flex flex-col w-64 h-screen text-white divide-y-2 pt-4 relative">
      <div className="flex flex-row items-center pb-4 pl-4">
        <GiWheat size="40px" />
        <h1 className=" font-bold text-xl px-3">MYFARM.NET</h1>
      </div>
      <div>
        <Link to="/" className="flex flex-row items-center py-4 pl-4">
          <ReactSVG src="/src/assets/home.svg" />
          <h1 className=" font-bold text-lg px-3">STRONA GŁÓWNA</h1>
        </Link>
      </div>

      <div>
        <ul className=" font-semibold text-lg">
          <li>
            <Link to="/gospodarstwo" className="flex flex-row items-center pt-4 pl-4 ">
              <ReactSVG src="/src/assets/farm.svg" />
              <h1 className="px-3">GOSPODARSTWO</h1>
            </Link>
          </li>
          <li>
            <Link to="/finanse" className="flex flex-row items-center pt-4 pl-4 ">
              <ReactSVG src="/src/assets/finanse.svg" />
              <h1 className="px-3">FINANSE</h1>
            </Link>
          </li>
          <li className="pl-4 py-4 border-b-2">
            <Link to="/kalendarz" className="flex flex-row items-center ">
              <IoCalendarOutline size="40px" />
              <h1 className="px-3">KALENDARZ</h1>
            </Link>
          </li>
        </ul>
      </div>

      <div className="py-4 absolute bottom-0">
        <ul className=" font-semibold text-lg divide-y-2">
          <li className="pl-4 pb-4">
            <Link to="/profil" className="flex flex-row items-center">
              <HiUser size="40px" />
              <h1 className="px-3">PROFIL UŻYTKOWNIKA</h1>
            </Link>
          </li>
          <li className="pl-4 pt-4">
            <Link to="/login" className="flex flex-row items-center">
              <ReactSVG src="/src/assets/logout.svg" />
              <h1 className="px-3">WYLOGUJ SIĘ</h1>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
