import {useState, useEffect} from "react";
import {MapContainer, TileLayer, GeoJSON, WMSTileLayer} from "react-leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import LeafletDraw from "../../components/LeafletDraw";
import useGeoLocation from "../../hooks/useGeoLocation";
import {useNavigate} from "react-router-dom";

const DodajPrace = () => {
  const navigate = useNavigate();
  const {latitude, longitude} = useGeoLocation();
  const [pracaData, setPracaData] = useState({
    numer_ewidencyjny: "",
    praca: "",
    data: "",
    operator: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [polygonData, setPolygonData] = useState(null);
  const [mapKey, setMapKey] = useState(Date.now());
  const [fieldData, setFieldData] = useState([]);
  const [powierzchnia_dzialki, setPowierzchniaDzialki] = useState(0);
  const [polygon, setPolygon] = useState(null);
  const [operator, setOperator] = useState("");
  const handleSavePolygon = (polygonData) => {
    const parsedPolygon = JSON.parse(polygonData);
    parsedPolygon.properties = {
      numer_ewidencyjny: pracaData.numer_ewidencyjny,
      praca: pracaData.praca,
    };
    console.log(parsedPolygon);
    setPolygon(JSON.stringify(parsedPolygon));
  };
  const handleChangeOperator = (e) => {
    setOperator(e.target.value);
  };
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
  const [operatorData, setOperatorData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/operator", {
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
        setOperatorData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const handleChangeNumerEwidencyjny = (e) => {
    const numerEwidencyjny = e.target.value;
    setPracaData({...pracaData, numer_ewidencyjny: numerEwidencyjny});
  };
  useEffect(() => {
    const selectedFieldData = fieldData.find((field) => field.numer_ewidencyjny === pracaData.numer_ewidencyjny);
    setPolygonData(null);
    if (selectedFieldData) {
      setPowierzchniaDzialki(selectedFieldData.area);
      setPolygonData(JSON.parse(selectedFieldData.polygon));
    } else {
      setPolygonData(null);
    }
    setMapKey(Date.now());
  }, [pracaData.numer_ewidencyjny, fieldData]);
  // const validateForm = () => {
  //   let isValid = true;
  //   let errors = {};

  //   // Checking if numerical identifier is provided and valid
  //   if (!pracaData.numer_ewidencyjny) {
  //     isValid = false;
  //     errors.numer_ewidencyjny = "Wybierz numer ewidencyjny.";
  //   }

  //   // Validating work type
  //   if (!pracaData.praca) {
  //     isValid = false;
  //     errors.praca = "Wpisz rodzaj pracy.";
  //   }

  //   // Validate work surface area
  //   const workSurfaceArea = parseFloat(pracaData.powierzchnia_pracy);
  //   if (isNaN(workSurfaceArea) || workSurfaceArea <= 0) {
  //     isValid = false;
  //     errors.powierzchnia_pracy = "Podaj prawidłową powierzchnię pracy.";
  //   }

  //   // Validate date format (dd.mm.yyyy)
  //   const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
  //   if (!dateRegex.test(pracaData.data)) {
  //     isValid = false;
  //     errors.data = "Podaj datę w formacie dd.mm.rrrr.";
  //   }

  //   // Validate operator selection
  //   if (!pracaData.operator) {
  //     isValid = false;
  //     errors.operator = "Wybierz operatora.";
  //   }

  //   setErrorMessage(errors);
  //   return isValid;
  // };
  const [powierzchnia_pracy, setPowierzchniaPracy] = useState("Wyrysuj obszar pracy");
  const handleAreaChange = (newArea) => {
    setPowierzchniaPracy(newArea);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const pracaDataToSend = {
      ...pracaData,
      powierzchnia_dzialki,
      powierzchnia_pracy,
      polygon,
      operator,
    };

    try {
      const response = await fetch("/api/prace", {
        method: "POST",
        headers: {
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pracaDataToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      navigate("/postep");
    } catch (error) {
      console.error("Error adding praca:", error);
      setErrorMessage(`Error adding praca: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    handleChangeNumerEwidencyjny(e);
    handleChangeOperator(e);
    setPracaData({...pracaData, [e.target.name]: e.target.value});
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
              value={pracaData.numer_ewidencyjny}
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
            <label htmlFor="praca" className="block text-sm font-medium mb-1">
              Praca
            </label>
            <input
              type="text"
              id="praca"
              name="praca"
              value={pracaData.praca}
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
              value={powierzchnia_pracy}
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
              value={pracaData.data}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="operator" className="block text-sm font-medium mb-1">
              Operator
            </label>
            <select
              id="operator"
              name="operator"
              value={operator}
              onChange={handleChangeOperator}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md">
              <option value="">Wybierz operatora</option>
              {operatorData.map((op, index) => (
                <option key={index} value={`${op.imie} ${op.nazwisko}`}>
                  {op.imie} {op.nazwisko}
                </option>
              ))}
            </select>
          </div>
          {/* {errorMessage.numer_ewidencyjny && <p className="text-red-500">{errorMessage.numer_ewidencyjny}</p>}
          {errorMessage.praca && <p className="text-red-500">{errorMessage.praca}</p>}
          {errorMessage.powierzchnia_pracy && <p className="text-red-500">{errorMessage.powierzchnia_pracy}</p>}
          {errorMessage.data && <p className="text-red-500">{errorMessage.data}</p>}
          {errorMessage.operator && <p className="text-red-500">{errorMessage.operator}</p>} */}
          <div className="flex items-center justify-end">
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4">
              Dodaj
            </button>
          </div>
        </form>
      </div>
      <div className="flex flex-col w-2/3 ">
        <h1 className="text-base font-bold opacity-80">Wyrysuj obszar pracy</h1>
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

export default DodajPrace;
