import {MapContainer, TileLayer, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {Link} from "react-router-dom";
import useGeoLocation from "../../hooks/useGeoLocation";
import {useEffect, useState} from "react";
import "./style.css";
import L from "leaflet";
import {GeoJSON} from "react-leaflet";
function AddLabels({polygonData, areaThreshold, minZoomLevel, activePolygon}) {
  const map = useMap();

  useEffect(() => {
    let labelMarkers = [];
    let activePolygonLayer = null;
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

    if (activePolygon) {
      const polygon = L.polygon(activePolygon.geometry.coordinates[0].map((coord) => [coord[1], coord[0]]));
      polygon.setStyle({color: "red", weight: 3, fillOpacity: 0.9});
      activePolygonLayer = polygon.addTo(map);
    }

    updateLabels();

    map.on("zoomend", updateLabels);

    return () => {
      map.off("zoomend", updateLabels);
      labelMarkers.forEach((marker) => marker.remove());

      if (activePolygonLayer) {
        activePolygonLayer.remove();
      }
    };
  }, [map, polygonData, areaThreshold, minZoomLevel, activePolygon]); // Dodaj activePolygonId do listy zależności

  return null;
}
function Postep() {
  const {latitude, longitude} = useGeoLocation();
  const [isScrollable, setIsScrollable] = useState(false);
  const [prace, setPrace] = useState([]);
  const [polygonData, setPolygonData] = useState(null);
  const [activePolygon, setActivePolygon] = useState(null);
  const handleMouseEnter = (postepId) => {
    fetch(`/api/poly-prace/${postepId}`)
      .then((response) => response.json())
      .then((data) => {
        setActivePolygon(JSON.parse(data[0].polygon));
      })
      .catch((error) => {
        console.error("Error fetching polygon data:", error);
        setActivePolygon(null);
      });
  };
  useEffect(() => {
    fetch("/api/prace")
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((item) => {
          return {
            ...item,
            data: new Date(item.data).toISOString().split("T")[0],
          };
        });
        setPrace(formattedData);
        setIsScrollable(data.length > 5);
        return fetch("/api/polygons");
      })
      .then((response) => response.json())
      .then((data) => {
        const features = data.map((item) => {
          const feature = JSON.parse(item.polygon);
          const field = prace.find((p) => p.numer_ewidencyjny === item.numer_ewidencyjny); // Example identifier
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
  const handleDelete = (pracaId) => {
    fetch(`/api/prace/${pracaId}`, {
      method: "DELETE",
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
        setPrace(prace.filter((praca) => praca.postep_prac_id !== pracaId));
      })
      .catch((error) => {
        console.error("Error deleting praca:", error);
        // Handle error
      });
  };
  return (
    <div className="flex flex-col w-5/6 h-1/3 px-8 space-beetween">
      {latitude && longitude && (
        <MapContainer center={[latitude, longitude]} zoom={13}>
          <TileLayer attribution="Google Maps Satellite" url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}" />
          {polygonData && (
            <>
              <GeoJSON data={polygonData} />
              <AddLabels polygonData={polygonData} areaThreshold={50000} minZoomLevel={16} activePolygon={activePolygon} />
            </>
          )}
        </MapContainer>
      )}
      <div className="flex flex-row text-base font-bold opacity-80 py-2 justify-between">
        Historia prac
        <Link to="/dodaj-prace">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Dodaj</button>
        </Link>
      </div>
      <div className="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard rounded">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-56">Numer ewidencyjny</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-56">Praca</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-56">Powierzchnia działki</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-56">Powierzchnia pracy</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-52">Data</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-56">Operator</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 w-48"></th>
            </tr>
          </thead>
          <tbody className={isScrollable ? "scrollable-table" : ""}>
            {prace.map((praca, index) => (
              <tr
                key={index}
                onMouseEnter={() => handleMouseEnter(praca.postep_prac_id)}
                onMouseLeave={() => setActivePolygon(null)}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-56">
                  {praca.numer_ewidencyjny}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-56">{praca.praca}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-56">
                  {praca.powierzchnia_dzialki} ha
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-56">
                  {praca.powierzchnia_pracy} ha
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-52">{praca.data}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-56">{praca.operator}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-sm leading-5 text-right align-middle w-48">
                  {/* <Link to={`/edytuj-prace/${praca.postep_prac_id}`} className="text-indigo-600 hover:text-indigo-900 px-2">
                    <button>Edytuj</button>
                  </Link> */}
                  <button onClick={() => handleDelete(praca.postep_prac_id)} className="text-red-600 hover:text-red-900 mx-auto">
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

export default Postep;
