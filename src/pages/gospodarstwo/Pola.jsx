import {MapContainer, TileLayer, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {Link} from "react-router-dom";
import useGeoLocation from "../../hooks/useGeoLocation";
import {useEffect, useState} from "react";
import "./style.css";
import L from "leaflet";
import {GeoJSON} from "react-leaflet";

function groupByDzialkaId(data) {
  const grouped = {};

  data.forEach((item) => {
    if (!grouped[item.dzialka_id]) {
      grouped[item.dzialka_id] = {...item, uprawa: []};
    }
    grouped[item.dzialka_id].uprawa.push(item.uprawa);
  });

  return Object.values(grouped);
}
//"className: bg-none text-center text-base text-white font-bold",
function AddLabels({polygonData, areaThreshold, minZoomLevel}) {
  const map = useMap();

  useEffect(() => {
    let labelMarkers = [];

    const updateLabels = () => {
      // Clear existing labels
      labelMarkers.forEach((marker) => marker.remove());
      labelMarkers = [];

      polygonData.features.forEach((feature) => {
        if (feature.properties && feature.properties.numer_ewidencyjny) {
          const polygon = L.polygon(feature.geometry.coordinates[0].map((coord) => [coord[1], coord[0]]));
          const area = L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0]);

          // Add label if the area is above the threshold or if zoom level is high enough
          if (area >= areaThreshold || map.getZoom() >= minZoomLevel) {
            const center = polygon.getBounds().getCenter();
            const label = L.marker(center, {
              icon: L.divIcon({
                className: "bg-none text-sm text-white font-bold", // Replace with your CSS class
                html: feature.properties.numer_ewidencyjny,
              }),
            }).addTo(map);
            labelMarkers.push(label);
          }
        }
      });
    };

    // Initial update
    updateLabels();

    // Re-update labels when zoom changes
    map.on("zoomend", updateLabels);

    // Clean up
    return () => {
      map.off("zoomend", updateLabels);
      labelMarkers.forEach((marker) => marker.remove());
    };
  }, [map, polygonData, areaThreshold, minZoomLevel]);

  return null;
}

function Pola() {
  const {latitude, longitude} = useGeoLocation();
  const [fields, setFields] = useState([]); // State to hold data from the database
  const [isScrollable, setIsScrollable] = useState(false);
  const [polygonData, setPolygonData] = useState(null);

  useEffect(() => {
    let fetchedFields = [];
    fetch("/api/pola", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        fetchedFields = groupByDzialkaId(data);
        setFields(fetchedFields);
        setIsScrollable(fetchedFields.length > 5);
        return fetch("/api/polygons", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        });
      })
      .then((response) => response.json())
      .then((data) => {
        const features = data.map((item) => {
          const feature = JSON.parse(item.polygon);
          const field = fields.find((f) => f.numer_ewidencyjny === item.numer_ewidencyjny); // Example identifier
          if (field) {
            feature.properties = {...feature.properties, ...field};
          }
          return feature;
        });

        setPolygonData({
          type: "FeatureCollection",
          features: features,
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleDelete = (dzialkaId) => {
    fetch(`/api/pola/${dzialkaId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
        setFields(fields.filter((field) => field.dzialka_id !== dzialkaId));
      })
      .catch((error) => {
        console.error("Error deleting field:", error);
        // Handle error
      });
  };
  const getFeatureStyle = (feature) => {
    return {color: "yellow", weight: 2, fillOpacity: 0.2};
  };
  return (
    <div className="flex flex-col w-5/6 h-1/3 px-8 space-beetween">
      {latitude && longitude && (
        <MapContainer center={[latitude, longitude]} zoom={13}>
          <TileLayer attribution="Google Maps Satellite" url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}" />
          {polygonData && (
            <>
              <GeoJSON data={polygonData} style={getFeatureStyle} />
              <AddLabels polygonData={polygonData} areaThreshold={50000} minZoomLevel={16} />
            </>
          )}
        </MapContainer>
      )}
      <div className="flex flex-row text-base font-bold opacity-80 py-2 justify-between">
        Pola
        <Link to="/dodaj-pole">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Dodaj</button>
        </Link>
      </div>
      <div className="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard rounded">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-72">Nazwa</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-64">Obręb</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-56">Numer Ewidencyjny</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-80">Uprawa</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-56">Powierzchnia</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 w-52"></th>
            </tr>
          </thead>
          <tbody className={isScrollable ? "scrollable-table" : ""}>
            {fields.map((field, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-72">{field.nazwa}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-64">{field.obreb}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-56">
                  {field.numer_ewidencyjny}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-80">
                  {field.uprawa.join(", ") ? field.uprawa.join(", ") : "Brak upraw"}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-56">{field.area} ha</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-sm leading-5 text-right align-middle w-52">
                  {/* <Link to={`/edytuj-pole/${field.dzialka_id}`} className="text-indigo-600 hover:text-indigo-900 px-2">
                    <button>Edytuj</button>
                  </Link> */}
                  <button onClick={() => handleDelete(field.dzialka_id)} className="text-red-600 hover:text-red-900 mx-auto">
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

export default Pola;
