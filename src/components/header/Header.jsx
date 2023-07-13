import "./header.css";
import {AiFillHome} from "react-icons/ai";
import {GiWheat} from "react-icons/gi";
function Header() {
  return (
    <header className="main-header">
      <div className="container">
        <div className="logo-box">
          <GiWheat size="26px" />
          <a href="/pages/home" className="logo">
            MyFarm.net
          </a>
        </div>
        <nav className="main-nav">
          <ul className="nav-list">
            <li>
              <a href="/pages/home" className="nav-link">
                <AiFillHome size="24px" />
              </a>
            </li>
            <li>
              <a href="/pages/gospodarstwo" className="nav-link">
                Gospodarstwo
              </a>
            </li>
            <li>
              <a href="/pages/maps" className="nav-link">
                Mapy
              </a>
            </li>
            <li>
              <a href="/pages/calendar" className="nav-link">
                Kalendarz
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
