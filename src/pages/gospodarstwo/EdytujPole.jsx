import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {MapContainer, TileLayer, WMSTileLayer} from "react-leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import LeafletDraw from "../../components/LeafletDraw";
import useGeoLocation from "../../hooks/useGeoLocation";
import {GeoJSON} from "react-leaflet";

const EdytujPole = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const {latitude, longitude} = useGeoLocation();
  const [fieldData, setFieldData] = useState({
    nazwa: "",
    obreb: "",
    numer_ewidencyjny: "",
    area: "",
    polygon: "",
    uzytkownik_id: "",
  });
  const [area, setArea] = useState("");

  const handleAreaChange = (newArea) => {
    setArea(newArea);
  };
  const [polygon, setPolygon] = useState(null);

  const handleSavePolygon = (polygonData) => {
    setPolygon(polygonData);
  };
  useEffect(() => {
    fetch(`/api/pola/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data[0]); // Check the structure and content
        setFieldData({
          nazwa: data[0].nazwa,
          obreb: data[0].obreb,
          numer_ewidencyjny: data[0].numer_ewidencyjny,
          area: data[0].area,
          polygon: data[0].polygon,
          uzytkownik_id: data[0].uzytkownik_id,
        });
        if (data[0].polygon) {
          setPolygon(JSON.parse(data[0].polygon));
        }
      })
      .catch((error) => console.error("Error fetching field:", error));
  }, [id]);

  const handleChange = (e) => {
    setFieldData({...fieldData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`/api/pola/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fieldData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        navigate("/pola");
      })
      .catch((error) => {
        console.error("Error updating field:", error);
      });
  };

  if (fieldData === null) {
    return <div>Loading...</div>;
  }
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
              value={fieldData.area}
              readOnly
              className="w-full px-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
            />
          </div>
          <div className="flex items-center justify-end">
            <button type="submit" className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Edytuj
            </button>
          </div>
        </form>
      </div>
      <div className="flex flex-col w-2/3 ">
        <h1 className="text-base font-bold opacity-80">Wyrysuj obszar działki</h1>
        {latitude && longitude && (
          <MapContainer center={[latitude, longitude]} zoom={12}>
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
            {fieldData.polygon && <GeoJSON data={polygon} />}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default EdytujPole;
