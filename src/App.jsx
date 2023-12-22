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
import "/src/pages/gospodarstwo/mapy.css";
import DodajUprawe from "./pages/gospodarstwo/DodajUprawe";
import DodajPrace from "./pages/gospodarstwo/DodajPrace";
import Operatorzy from "./pages/gospodarstwo/Operatorzy";
import "leaflet-draw/dist/leaflet.draw.css";
import Maszyny from "./pages/gospodarstwo/Maszyny";
import {LocationProvider} from "./components/LocationContext";
import EdytujPole from "./pages/gospodarstwo/EdytujPole";

const App = () => {
  return (
    <div className="flex flex-row">
      <LocationProvider>
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
          <Route path="/dodaj-uprawe" element={<DodajUprawe />} />
          <Route path="/dodaj-prace" element={<DodajPrace />} />
          <Route path="/edytuj-pole/:id" element={<EdytujPole />} />
          <Route path="/operatorzy" element={<Operatorzy />} />
          <Route path="/maszyny" element={<Maszyny />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </LocationProvider>
    </div>
  );
};
export default App;
