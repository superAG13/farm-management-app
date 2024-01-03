import {Route, Routes} from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/home/Home";
import Gospodarstwo from "./pages/gospodarstwo/Gospodarstwo";
import Finanse from "./pages/finanse/Finanse";
import Kalendarz from "./pages/kalendarz/Kalendarz";
import Profil from "./pages/profil/Profil";
import Pola from "./pages/gospodarstwo/Pola";
import Uprawy from "./pages/gospodarstwo/Uprawy";
import Postep from "./pages/gospodarstwo/Postep";
import DodajPole from "./pages/gospodarstwo/DodajPole";
import "./pages/gospodarstwo/style.css";
import DodajUprawe from "./pages/gospodarstwo/DodajUprawe";
import DodajPrace from "./pages/gospodarstwo/DodajPrace";
import Operatorzy from "./pages/gospodarstwo/Operatorzy";
import "leaflet-draw/dist/leaflet.draw.css";
import Maszyny from "./pages/gospodarstwo/Maszyny";
import {LocationProvider} from "./components/LocationContext";
import EdytujPole from "./pages/gospodarstwo/EdytujPole";
import EdytujUprawe from "./pages/gospodarstwo/EdytujUprawe";
import Srodki from "./pages/gospodarstwo/Srodki";
import DodajMagazyn from "./pages/gospodarstwo/DodajMagazyn";
import EdytujMagazyn from "./pages/gospodarstwo/EdytujMagazyn";
import Rosliny from "./pages/gospodarstwo/Rosliny";
import Nawozy from "./pages/gospodarstwo/Nawozy";
import Zbiory from "./pages/gospodarstwo/Zbiory";
import DodajZbiory from "./pages/gospodarstwo/DodajZbiory";
import EdytujZbiory from "./pages/gospodarstwo/EdytujZbiory";
import DodajFinanse from "./pages/finanse/DodajFinanse";
import EdytujFinanse from "./pages/finanse/EdytujFinanse";
import DodajKalendarz from "./pages/kalendarz/DodajKalendarz";
import EdytujKalendarz from "./pages/kalendarz/EdytujKalendarz";
import Login from "./pages/login/Login";
import {useLocation} from "react-router-dom";
import {Navigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Register from "./pages/login/Register";
import ForgotPassword from "./pages/login/ForgotPassword";
import ResetPassword from "./pages/login/ResetPassword";
const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return false; // No token found, user is not logged in
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = new Date().getTime() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem("authToken"); // Token expired, remove it
      return false;
    }
    return true; // Token is present and valid
  } catch (error) {
    // Handle error, token might be invalid
    return false;
  }
};
const ProtectedRoute = ({element: Element}) => {
  return isAuthenticated() ? Element : <Navigate to="/login" />;
};

const App = () => {
  const location = useLocation();
  const path = location.pathname;

  const isLoginPage = path === "/login" || path === "/register" || path === "/forgot-password" || path === "/" || path.startsWith("/reset-password/");

  return (
    <div className="flex flex-row">
      <LocationProvider>
        {!isLoginPage && <NavBar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/strona-glowna" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/gospodarstwo" element={<ProtectedRoute element={<Gospodarstwo />} />} />
          <Route path="/finanse" element={<ProtectedRoute element={<Finanse />} />} />
          <Route path="/kalendarz" element={<ProtectedRoute element={<Kalendarz />} />} />
          <Route path="/profil" element={<ProtectedRoute element={<Profil />} />} />
          <Route path="/pola" element={<ProtectedRoute element={<Pola />} />} />
          <Route path="/uprawy" element={<ProtectedRoute element={<Uprawy />} />} />
          <Route path="/postep" element={<ProtectedRoute element={<Postep />} />} />
          <Route path="/dodaj-pole" element={<ProtectedRoute element={<DodajPole />} />} />
          <Route path="/dodaj-uprawe" element={<ProtectedRoute element={<DodajUprawe />} />} />
          <Route path="/dodaj-prace" element={<ProtectedRoute element={<DodajPrace />} />} />
          <Route path="/edytuj-pole/:id" element={<ProtectedRoute element={<EdytujPole />} />} />
          <Route path="/edytuj-uprawe/:id" element={<ProtectedRoute element={<EdytujUprawe />} />} />
          <Route path="/operatorzy" element={<ProtectedRoute element={<Operatorzy />} />} />
          <Route path="/maszyny" element={<ProtectedRoute element={<Maszyny />} />} />
          <Route path="/srodki" element={<ProtectedRoute element={<Srodki />} />} />
          <Route path="/dodaj-magazyn" element={<ProtectedRoute element={<DodajMagazyn />} />} />
          <Route path="/edytuj-magazyn/:id" element={<ProtectedRoute element={<EdytujMagazyn />} />} />
          <Route path="/rosliny" element={<ProtectedRoute element={<Rosliny />} />} />
          <Route path="/nawozy" element={<ProtectedRoute element={<Nawozy />} />} />
          <Route path="/zbiory" element={<ProtectedRoute element={<Zbiory />} />} />
          <Route path="/dodaj-zbiory" element={<ProtectedRoute element={<DodajZbiory />} />} />
          <Route path="/edytuj-zbiory/:id" element={<ProtectedRoute element={<EdytujZbiory />} />} />
          <Route path="/dodaj-finanse" element={<ProtectedRoute element={<DodajFinanse />} />} />
          <Route path="/edytuj-finanse/:id" element={<ProtectedRoute element={<EdytujFinanse />} />} />
          <Route path="/dodaj-kalendarz" element={<ProtectedRoute element={<DodajKalendarz />} />} />
          <Route path="/edytuj-kalendarz/:id" element={<ProtectedRoute element={<EdytujKalendarz />} />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </LocationProvider>
    </div>
  );
};
export default App;
