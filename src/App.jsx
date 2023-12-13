import {Routes, Route} from "react-router-dom";
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
const App = () => {
  return (
    <div className="flex flex-row">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gospodarstwo" element={<Gospodarstwo />} />
        <Route path="/finanse" element={<Finanse />} />
        <Route path="/kalendarz" element={<Kalendarz />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/pola" element={<Pola />} />
        <Route path="/uprawy" element={<Uprawy />} />
        <Route path="/postep" element={<Postep />} />
        <Route path="/dodaj-pole" element={<DodajPole />} />
      </Routes>
    </div>
  );
};
export default App;
