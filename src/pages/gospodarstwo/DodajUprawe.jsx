import {useState, useEffect} from "react";
import {MapContainer, TileLayer, WMSTileLayer} from "react-leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import LeafletDraw from "../../components/LeafletDraw";
import useGeoLocation from "../../hooks/useGeoLocation";
import {useNavigate} from "react-router-dom";
import {GeoJSON} from "react-leaflet";
import {usePopularCrops} from "../../hooks/usePopularCrops";
const DodajUprawe = () => {
  const popularCrops = usePopularCrops();
  const {latitude, longitude} = useGeoLocation();
  const navigate = useNavigate();
  const [uprawaData, setUprawaData] = useState({
    numer_ewidencyjny: "",
    uprawa: "",
  });
  const [uprawa, setUprawa] = useState("");
  const [isOtherUprawa, setIsOtherUprawa] = useState(false);

  const handleUprawaChange = (e) => {
    const selectedUprawa = e.target.value;
    setUprawa(selectedUprawa);
    setUprawaData({...uprawaData, uprawa: selectedUprawa});
    setIsOtherUprawa(selectedUprawa === "inne");
  };

  const [powierzchnia_dzialki, setPowierzchniaDzialki] = useState(0);
  const [fieldData, setFieldData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/area", {
          method: "GET",
          headers: {
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFieldData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const [powierzchnia_uprawy, setPowierzchniaUprawy] = useState("Wyrysuj obszar uprawy");
  const [polygon, setPolygon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [polygonData, setPolygonData] = useState(null);
  const [mapKey, setMapKey] = useState(Date.now());

  const handleAreaChange = (newArea) => {
    setPowierzchniaUprawy(newArea);
  };

  const handleChangeNumerEwidencyjny = (e) => {
    const numerEwidencyjny = e.target.value;
    setUprawaData({...uprawaData, numer_ewidencyjny: numerEwidencyjny});
  };

  useEffect(() => {
    const selectedFieldData = fieldData.find((field) => field.numer_ewidencyjny === uprawaData.numer_ewidencyjny);
    setPolygonData(null);
    if (selectedFieldData) {
      setPowierzchniaDzialki(selectedFieldData.area);
      setPolygonData(JSON.parse(selectedFieldData.polygon));
    } else {
      setPolygonData(null);
    }
    setMapKey(Date.now());
  }, [uprawaData.numer_ewidencyjny, fieldData]);

  const handleSavePolygon = (polygonData) => {
    const parsedPolygon = JSON.parse(polygonData);
    parsedPolygon.properties = {
      numer_ewidencyjny: uprawaData.numer_ewidencyjny,
      uprawa: uprawaData.uprawa,
    };
    console.log(parsedPolygon);
    setPolygon(JSON.stringify(parsedPolygon));
  };

  const handleChange = (e) => {
    handleChangeNumerEwidencyjny(e);
    setUprawaData({...uprawaData, [e.target.name]: e.target.value});
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    // Checking if numerical identifier is provided and valid
    if (!uprawaData.numer_ewidencyjny) {
      isValid = false;
      errors.numer_ewidencyjny = "Wybierz numer ewidencyjny.";
    }

    // Validating crop selection
    if (!uprawaData.uprawa) {
      isValid = false;
      errors.uprawa = "Wybierz uprawę.";
    } else if (isOtherUprawa && uprawaData.uprawa.length < 3) {
      isValid = false;
      errors.customUprawa = "Własna uprawa musi mieć co najmniej 3 znaki.";
    }

    // Validate polygon data
    if (!polygon) {
      isValid = false;
      errors.polygon = "Narysuj obszar uprawy na mapie.";
    }

    // Validate location data
    if (!latitude || !longitude) {
      isValid = false;
      errors.location = "Invalid location data.";
    }

    const cultivationArea = parseFloat(powierzchnia_uprawy);
    console.log(cultivationArea);
    if (isNaN(cultivationArea) || cultivationArea <= 0) {
      isValid = false;
      errors.area = "Podaj prawidłową powierzchnię uprawy.";
    } else if (cultivationArea > powierzchnia_dzialki) {
      isValid = false;
      errors.area = "Powierzchnia uprawy musi być mniejsza lub równa powierzchni działki.";
    }

    setErrorMessage(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const uprawaDataToSend = {
      ...uprawaData,
      powierzchnia_dzialki,
      powierzchnia_uprawy,
      polygon,
    };
    console.log(uprawaDataToSend);
    try {
      const response = await fetch("/api/uprawy", {
        method: "POST",
        headers: {
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uprawaDataToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      navigate("/uprawy");
    } catch (error) {
      console.error("Error adding uprawa:", error);
      setErrorMessage(`Error adding uprawa: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex border rounded-md bg-white h-3/6 m-4 px-4 py-6 flex-row w-5/6">
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-4">
            <label htmlFor="numer_ewidencyjny" className="block text-sm font-medium mb-1">
              Numer ewidencyjny
            </label>
            <select
              id="numer_ewidencyjny"
              name="numer_ewidencyjny"
              value={uprawaData.numer_ewidencyjny}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md">
              <option value="">Wybierz numer ewidencyjny</option>
              {fieldData.map((option) => (
                <option key={option.numer_ewidencyjny} value={option.numer_ewidencyjny}>
                  {option.numer_ewidencyjny}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="uprawa" className="block text-sm font-medium mb-1">
              Uprawa
            </label>
            <select
              id="uprawa"
              name="uprawa"
              value={uprawa}
              onChange={handleUprawaChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md">
              <option value="">Wybierz uprawę</option>
              {popularCrops.map((crop, index) => (
                <option key={index} value={crop}>
                  {crop}
                </option>
              ))}
              <option value="inne">Inne</option>
            </select>
            {isOtherUprawa && (
              <input
                type="text"
                name="customUprawa"
                placeholder="Wpisz nazwę uprawy"
                className="mt-2 w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
                onChange={(e) => setUprawaData({...uprawaData, uprawa: e.target.value})}
              />
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="powierzchnia_uprawy" className="block text-sm font-medium mb-1">
              Powierzchnia uprawy
            </label>
            <div className="flex-grow relative">
              <input
                type="text"
                value={powierzchnia_uprawy}
                readOnly
                className="w-full pl-2 pr-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">ha</span>
            </div>
          </div>
          {errorMessage.numer_ewidencyjny && <p className="text-red-500">{errorMessage.numer_ewidencyjny}</p>}
          {errorMessage.uprawa && <p className="text-red-500">{errorMessage.uprawa}</p>}
          {errorMessage.customUprawa && <p className="text-red-500">{errorMessage.customUprawa}</p>}
          {errorMessage.polygon && <p className="text-red-500">{errorMessage.polygon}</p>}
          {errorMessage.location && <p className="text-red-500">{errorMessage.location}</p>}
          {errorMessage.area && <p className="text-red-500">{errorMessage.area}</p>}
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
        <h1 className="text-base font-bold opacity-80">Wyrysuj obszar uprawy</h1>
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
            {polygonData && <GeoJSON key={mapKey} data={polygonData} />}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default DodajUprawe;
