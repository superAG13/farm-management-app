import {Routes, Route} from "react-router-dom";
import NavBar from "src/components/NavBar";
import Home from "src/pages/home/Home";
import Gospodarstwo from "src/pages/gospodarstwo/Gospodarstwo";
import Finanse from "src/pages/finanse/Finanse";
import Kalendarz from "src/pages/kalendarz/Kalendarz";
import Profil from "src/pages/profil/Profil";
import Pola from "src/pages/gospodarstwo/Pola";
import Uprawy from "src/pages/gospodarstwo/Uprawy";
import Postep from "src/pages/gospodarstwo/Postep";
import DodajPole from "src/pages/gospodarstwo/DodajPole";
import "/src/pages/gospodarstwo/stylesrccss";
import DodajUprawe from "src/pages/gospodarstwo/DodajUprawe";
import DodajPrace from "src/pages/gospodarstwo/DodajPrace";
import Operatorzy from "src/pages/gospodarstwo/Operatorzy";
import "leaflet-draw/dist/leafletsrcdrawsrccss";
import Maszyny from "src/pages/gospodarstwo/Maszyny";
import {LocationProvider} from "src/components/LocationContext";
import EdytujPole from "src/pages/gospodarstwo/EdytujPole";
import EdytujUprawe from "src/pages/gospodarstwo/EdytujUprawe";
import Srodki from "src/pages/gospodarstwo/Srodki";
import DodajMagazyn from "src/pages/gospodarstwo/DodajMagazyn";
import EdytujMagazyn from "src/pages/gospodarstwo/EdytujMagazyn";
import Rosliny from "src/pages/gospodarstwo/Rosliny";
import Nawozy from "src/pages/gospodarstwo/Nawozy";
import Zbiory from "src/pages/gospodarstwo/Zbiory";
import DodajZbiory from "src/pages/gospodarstwo/DodajZbiory";
import EdytujZbiory from "src/pages/gospodarstwo/EdytujZbiory";
import DodajFinanse from "src/pages/finanse/DodajFinanse";
import EdytujFinanse from "src/pages/finanse/EdytujFinanse";
import DodajKalendarz from "src/pages/kalendarz/DodajKalendarz";
import EdytujKalendarz from "src/pages/kalendarz/EdytujKalendarz";
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
