import "leaflet/dist/leaflet.css";
import WeatherForecast from "../../components/WeatherForecast";
import useGeoLocation from "../../hooks/useGeoLocation";
import L from "leaflet";
import {MapContainer, TileLayer, Marker, LayersControl, useMap} from "react-leaflet";
import {useEffect, useState, useRef} from "react";
import {GeoJSON} from "react-leaflet";
import useColors from "../../hooks/useColors";

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

  useEffect(() => {
    map.on("overlayadd", (event) => {
      if (event.name === "Pola") {
        updateLabels(event.layer);
      }
    });

    map.on("overlayremove", (event) => {
      if (event.name === "Pola") {
        labelMarkers.forEach((marker) => marker.remove());
        labelMarkers = [];
      }
    });

    return () => {
      map.off("overlayadd");
      map.off("overlayremove");
    };
  }, [map, polygonData, areaThreshold, minZoomLevel]);

  return null;
}
function Home() {
  const colors = useColors();
  const {latitude, longitude} = useGeoLocation();
  const [polygonData, setPolygonData] = useState(null);
  const [fields, setFields] = useState([]);
  const [uprawy, setUprawy] = useState([]);
  const [polyUprawaData, setPolyUprawaData] = useState(null);
  const [prace, setPrace] = useState([]);
  const [polyPracaData, setPolyPracaData] = useState(null);
  const customIcon = new L.DivIcon({
    className: "my-custom-pin",
    html: `<div style="background-color: #0000FF; width: 20px; height: 20px; border: 2px solid #000; border-radius: 50%;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
  useEffect(() => {
    let fetchedFields = [];
    fetch("/api/pola")
      .then((response) => response.json())
      .then((data) => {
        fetchedFields = groupByDzialkaId(data);
        setFields(fetchedFields);
        return fetch("/api/polygons");
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
        return fetch("/api/uprawy");
      })
      .then((response) => response.json())
      .then((data) => {
        setUprawy(data);
        return fetch("/api/poly-uprawy");
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

        setPolyUprawaData({
          type: "FeatureCollection",
          features: features,
        });
        return fetch("/api/prace");
      })
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((item) => {
          return {
            ...item,
            data: new Date(item.data).toISOString().split("T")[0],
          };
        });
        setPrace(formattedData);
        return fetch("/api/poly-prace");
      })
      .then((response) => response.json())
      .then((data) => {
        const features = data.map((item) => {
          const feature = JSON.parse(item.polygon);
          const praca = prace.find((p) => p.numer_ewidencyjny === item.numer_ewidencyjny); // Example identifier
          if (praca) {
            feature.properties = {...feature.properties, ...praca};
          }
          return feature;
        });

        setPolyPracaData({
          type: "FeatureCollection",
          features: features,
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  const getFeatureStyle = (feature) => {
    return {color: "white", weight: 3, fillOpacity: 0.2};
  };
  const getUprawaStyle = (feature) => {
    const crop = feature.properties.uprawa;
    const color = colors[crop] || "gray"; // Default color if crop is not in the list
    return {color: color, weight: 2, fillOpacity: 1};
  };
  if (!latitude || !longitude) {
    return <div>Loading map...</div>;
  }
  return (
    <div className="flex flex-col w-5/6 h-1/3 px-8 space-beetween">
      <MapContainer center={[latitude, longitude]} zoom={16} style={{height: "400px", width: "100%"}}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Satelita">
            <TileLayer attribution="Google Maps Satellite" url="https://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}" />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay name="Pola">
            {polygonData && (
              <>
                <GeoJSON data={polygonData} style={getFeatureStyle} />
                <AddLabels polygonData={polygonData} areaThreshold={50000} minZoomLevel={16} />
              </>
            )}
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Uprawy">{polyUprawaData && <GeoJSON data={polyUprawaData} style={getUprawaStyle} />}</LayersControl.Overlay>
          <LayersControl.Overlay name="Prace">{polyPracaData && <GeoJSON data={polyPracaData} />}</LayersControl.Overlay>
        </LayersControl>
        <Marker position={[latitude, longitude]} icon={customIcon} />
      </MapContainer>
      <WeatherForecast />
    </div>
  );
}

export default Home;
