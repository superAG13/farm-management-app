import {MapContainer, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {Link} from "react-router-dom";
import useGeoLocation from "../../hooks/useGeoLocation";
import {useEffect, useState} from "react";
import {GeoJSON} from "react-leaflet";
import usePopularCrops from "../../hooks/usePopularCrops";
import useColors from "../../hooks/useColors";
function Uprawy() {
  const popularCrops = usePopularCrops();
  const colors = useColors();
  const {latitude, longitude} = useGeoLocation();
  const [isScrollable, setIsScrollable] = useState(false);
  const [uprawy, setUprawy] = useState([]);
  const [polygonData, setPolygonData] = useState(null);
  const [fieldData, setFieldData] = useState(null);
  useEffect(() => {
    fetch("/api/uprawy", {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUprawy(data);
        setIsScrollable(data.length > 5);
        return fetch("/api/poly-uprawy", {
          method: "GET",
          headers: {
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        });
      })
      .then((response) => response.json())
      .then((data) => {
        const features = data.map((item) => {
          const feature = JSON.parse(item.polygon);
          const uprawa = uprawy.find((u) => u.numer_ewidencyjny === item.numer_ewidencyjny); // Example identifier
          if (uprawa) {
            feature.properties = {...feature.properties, ...uprawa};
          }
          return feature;
        });

        setPolygonData({
          type: "FeatureCollection",
          features: features,
        });
        return fetch("/api/polygons", {
          method: "GET",
          headers: {
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        });
      })
      .then((response) => response.json())
      .then((data) => {
        const features = data.map((item) => {
          const feature = JSON.parse(item.polygon);
          const field = uprawy.find((f) => f.numer_ewidencyjny === item.numer_ewidencyjny); // Example identifier
          if (field) {
            feature.properties = {...feature.properties, ...field};
          }
          return feature;
        });

        setFieldData({
          type: "FeatureCollection",
          features: features,
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  const getFeatureStyle = (feature) => {
    const crop = feature.properties.uprawa;
    const color = colors[crop] || "gray"; // Default color if crop is not in the list
    return {color: color, weight: 2, fillOpacity: 0.8};
  };
  const getFieldStyle = (feature) => {
    return {color: "white", weight: 2, fillOpacity: 0};
  };
  const handleDelete = (uprawaId) => {
    fetch(`/api/uprawy/${uprawaId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message); // "Record deleted successfully"
        // Update the state to remove the item from the list, if necessary
        setUprawy(uprawy.filter((uprawa) => uprawa.uprawa_id !== uprawaId));
      })
      .catch((error) => {
        console.error("Error deleting uprawa:", error);
        // Handle error
      });
  };
  return (
    <div className="flex flex-col w-5/6 h-1/3 px-8 space-beetween">
      {latitude && longitude && (
        <MapContainer center={[latitude, longitude]} zoom={13}>
          <TileLayer attribution="Google Maps Satellite" url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}" />
          {polygonData && <GeoJSON data={polygonData} style={getFeatureStyle} />}
          {fieldData && <GeoJSON data={fieldData} style={getFieldStyle} />}
        </MapContainer>
      )}
      <div className="flex flex-row text-base font-bold opacity-80 py-2 justify-between">
        Uprawy
        <Link to="/dodaj-uprawe">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Dodaj</button>
        </Link>
      </div>
      <div className="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard rounded">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-72">Numer Ewidencyjny</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-96">Uprawa</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-80">Powierzchnia działki</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-80">Powierzchnia uprawy</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 w-52"></th>
            </tr>
          </thead>
          <tbody className={isScrollable ? "scrollable-table" : ""}>
            {uprawy.map((uprawa, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-72">
                  {uprawa.numer_ewidencyjny}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-96">{uprawa.uprawa}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-80">
                  {uprawa.powierzchnia_dzialki} ha
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-80">
                  {uprawa.powierzchnia_uprawy} ha
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-sm leading-5 text-right align-middle w-52">
                  {/* <Link to={`/edytuj-uprawe/${uprawa.uprawa_id}`} className="text-indigo-600 hover:text-indigo-900 px-2">
                    <button>Edytuj</button>
                  </Link> */}
                  <button onClick={() => handleDelete(uprawa.uprawa_id)} className="text-red-600 hover:text-red-900 mx-auto">
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Uprawy;
