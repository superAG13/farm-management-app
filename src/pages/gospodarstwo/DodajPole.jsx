import {useState} from "react";
import {MapContainer, TileLayer} from "react-leaflet";

const DodajPole = () => {
  const [fieldData, setFieldData] = useState({
    nazwa: "",
    obreb: "",
    numer_ewidencyjny: "",
    powierzchnia: "",
  });

  const handleChange = (e) => {
    setFieldData({...fieldData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex border rounded-md bg-white h-3/6 m-4 px-4 py-6 flex-row w-full">
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
              id="powierzchnia"
              name="powierzchnia"
              value={fieldData.powierzchnia}
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
        <h1 className="text-base font-bold opacity-80">Wyrysuj obszar działki</h1>
        <MapContainer center={[48.8566, 2.3522]} zoom={13}>
          <TileLayer attribution="Google Maps Satellite" url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}" />
        </MapContainer>
      </div>
    </div>
  );
};

export default DodajPole;
