import {useState} from "react";
import {MapContainer, TileLayer, WMSTileLayer} from "react-leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import LeafletDraw from "../../components/LeafletDraw";
import useGeoLocation from "../../hooks/useGeoLocation";
const DodajPole = () => {
  const {latitude, longitude} = useGeoLocation();
  const [fieldData, setFieldData] = useState({
    nazwa: "",
    obreb: "",
    numer_ewidencyjny: "",
  });

  const [area, setArea] = useState("Wyrysuj obszar działki");

  const handleAreaChange = (newArea) => {
    setArea(newArea);
  };

  const handleChange = (e) => {
    setFieldData({...fieldData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex border rounded-md bg-white h-3/6 m-4 px-4 py-6 flex-row w-5/6">
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-4">
            <label htmlFor="nazwa" className="block text-sm font-medium mb-1">
              Nazwa
            </label>
            <input
              type="text"
              id="nazwa"
              name="nazwa"
              value={fieldData.nazwa}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md "
            />
          </div>

          <div className="mb-4">
            <label htmlFor="obreb" className="block text-sm font-medium mb-1">
              Obręb
            </label>
            <input
              type="text"
              id="obreb"
              name="obreb"
              value={fieldData.obreb}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="numer_ewidencyjny" className="block text-sm font-medium mb-1">
              Numer ewidencyjny
            </label>
            <input
              type="text"
              id="numer_ewidencyjny"
              name="numer_ewidencyjny"
              value={fieldData.numer_ewidencyjny}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="powierzchnia" className="block text-sm font-medium mb-1">
              Powierzchnia
            </label>
            <input
              type="text"
              value={area}
              readOnly
              className="w-full px-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
            />
          </div>
          <div className="flex items-center justify-end">
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4">
              Dodaj
            </button>
            <button
              type="button"
              onClick={() => {
                /* delete logic */
              }}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Usuń
            </button>
          </div>
        </form>
      </div>
      <div className="flex flex-col w-2/3 ">
        <h1 className="text-base font-bold opacity-80">Wyrysuj obszar działki</h1>
        {latitude && longitude && (
          <MapContainer center={[latitude, longitude]} zoom={13}>
            <LeafletDraw onAreaChange={handleAreaChange} />
            <TileLayer attribution="Google Maps Satellite" url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}" />
            <WMSTileLayer
              url="https://integracja.gugik.gov.pl/cgi-bin/KrajowaIntegracjaEwidencjiGruntow"
              layers="dzialki,numery_dzialek"
              tileSize={700}
              version="1.3.0"
              format="image/png"
              transparent={true}
            />
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default DodajPole;
