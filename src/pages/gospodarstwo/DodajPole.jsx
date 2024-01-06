import React from "react";
import {useState} from "react";
import {MapContainer, TileLayer, WMSTileLayer} from "react-leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import LeafletDraw from "../../components/LeafletDraw";
import useGeoLocation from "../../hooks/useGeoLocation";
import {useNavigate} from "react-router-dom";
const DodajPole = () => {
  const {latitude, longitude} = useGeoLocation();
  const navigate = useNavigate();
  const [fieldData, setFieldData] = useState({
    nazwa: "",
    obreb: "",
    numer_ewidencyjny: "",
  });
  const [area, setArea] = useState("Wyrysuj obszar działki");
  const [polygon, setPolygon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAreaChange = (newArea) => {
    setArea(newArea);
  };

  const handleSavePolygon = (polygonData) => {
    const parsedPolygon = JSON.parse(polygonData);
    parsedPolygon.properties = {
      numer_ewidencyjny: fieldData.numer_ewidencyjny,
    };
    setPolygon(JSON.stringify(parsedPolygon));
  };

  const handleChange = (e) => {
    setFieldData({...fieldData, [e.target.name]: e.target.value});
  };

  const validateForm = () => {
    // Simple validation logic, can be expanded as needed
    if (!fieldData.nazwa || !fieldData.obreb || !fieldData.numer_ewidencyjny) {
      setErrorMessage("Wypełnij wszystkie pola.");
      return false;
    }
    if (!polygon) {
      setErrorMessage("Narysuj obszar działki na mapie.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const fieldDataToSend = {
      ...fieldData,
      area,
      polygon,
    };

    try {
      const response = await fetch("/api/pola", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fieldDataToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      navigate("/pola");
    } catch (error) {
      console.error("Error adding field:", error);
      setErrorMessage(`Error adding field: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex border rounded-md bg-white h-3/6 m-4 px-4 py-6 flex-row w-5/6">
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="p-8" data-testid="form">
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
            <div className="flex-grow relative">
              <input
                type="text"
                value={area}
                readOnly
                className="w-full pl-2 pr-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">ha</span>
            </div>
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isLoading}>
              {isLoading ? "Adding..." : "Dodaj"}
            </button>
          </div>
        </form>
      </div>
      <div className="flex flex-col w-2/3 ">
        <h1 className="text-base font-bold opacity-80">Wyrysuj obszar działki</h1>
        {latitude && longitude && (
          <MapContainer center={[latitude, longitude]} zoom={13}>
            <LeafletDraw onAreaChange={handleAreaChange} onSavePolygon={handleSavePolygon} />
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
