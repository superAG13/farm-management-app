import {useState} from "react";
import {MapContainer, TileLayer} from "react-leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import LeafletDraw from "../../components/LeafletDraw";
import useGeoLocation from "../../hooks/useGeoLocation";

const DodajPrace = () => {
  const {latitude, longitude} = useGeoLocation();
  const [fieldData, setFieldData] = useState({
    numer_ewidencyjny: "",
    praca: "",
    powierzchnia_pracy: "",
    data: "",
    opertor: "",
  });

  const [area, setArea] = useState("Wyrysuj obszar pracy");

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
            <label htmlFor="praca" className="block text-sm font-medium mb-1">
              Praca
            </label>
            <input
              type="text"
              id="praca"
              name="praca"
              value={fieldData.praca}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="powierzchnia_pracy" className="block text-sm font-medium mb-1">
              Powierzchnia pracy
            </label>
            <input
              type="text"
              value={area}
              readOnly
              className="w-full px-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="data" className="block text-sm font-medium mb-1">
              Data
            </label>
            <input
              type="date"
              id="data"
              name="data"
              value={fieldData.data}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="operator" className="block text-sm font-medium mb-1">
              Operator
            </label>
            <input
              type="text"
              id="operator"
              name="operator"
              value={fieldData.operator}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
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
        <h1 className="text-base font-bold opacity-80">Wyrysuj obszar pracy</h1>
        {latitude && longitude && (
          <MapContainer center={[latitude, longitude]} zoom={13}>
            <LeafletDraw onAreaChange={handleAreaChange} />
            <TileLayer attribution="Google Maps Satellite" url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}" />
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default DodajPrace;
