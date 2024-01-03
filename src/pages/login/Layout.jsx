import background from "../../assets/background.jpg";
import {GiWheat} from "react-icons/gi";
import {Link} from "react-router-dom";
function Layout({children}) {
  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-cover w-full" style={{backgroundImage: `url(${background})`}}>
      <div>
        <Link to="/login">
          <GiWheat className="w-20 h-20 fill-white" />
        </Link>
      </div>

      <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">{children}</div>
    </div>
  );
}
export default Layout;
