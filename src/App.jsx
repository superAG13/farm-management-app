import {Routes, Route} from "react-router-dom";
import NavBar from "src/components/NavBar.jsx";
import Home from "./pages/home/Home.jsx";
import Gospodarstwo from "./pages/gospodarstwo/Gospodarstwo.jsx";
import Finanse from "./pages/finanse/Finanse";
import Kalendarz from "./pages/kalendarz/Kalendarz";
import Profil from "./pages/profil/Profil";
import Pola from "./pages/gospodarstwo/Pola";
import Uprawy from "./pages/gospodarstwo/Uprawy";
import Postep from "./pages/gospodarstwo/Postep";
import DodajPole from "./pages/gospodarstwo/DodajPole";
import "/src/pages/gospodarstwo/style.css";
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
          <Route path="/edytuj-uprawe/:id" element={<EdytujUprawe />} />
          <Route path="/operatorzy" element={<Operatorzy />} />
          <Route path="/maszyny" element={<Maszyny />} />
          <Route path="/srodki" element={<Srodki />} />
          <Route path="/dodaj-magazyn" element={<DodajMagazyn />} />
          <Route path="/edytuj-magazyn/:id" element={<EdytujMagazyn />} />
          <Route path="/rosliny" element={<Rosliny />} />
          <Route path="/nawozy" element={<Nawozy />} />
          <Route path="/zbiory" element={<Zbiory />} />
          <Route path="/dodaj-zbiory" element={<DodajZbiory />} />
          <Route path="/edytuj-zbiory/:id" element={<EdytujZbiory />} />
          <Route path="/dodaj-finanse" element={<DodajFinanse />} />
          <Route path="/edytuj-finanse/:id" element={<EdytujFinanse />} />
          <Route path="/dodaj-kalendarz" element={<DodajKalendarz />} />
          <Route path="/edytuj-kalendarz/:id" element={<EdytujKalendarz />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </LocationProvider>
    </div>
  );
};
export default App;
