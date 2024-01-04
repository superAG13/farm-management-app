import "leaflet/dist/leaflet.css";
import useGeoLocation from "../../hooks/useGeoLocation";
import L from "leaflet";
import {MapContainer, TileLayer, Marker, LayersControl, useMap, Popup} from "react-leaflet";
import {useEffect, useState, useRef} from "react";
import {GeoJSON} from "react-leaflet";
import useColors from "../../hooks/useColors";
import moment from "moment";
import "moment/locale/pl";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41], // Size of the icon shadow
});

L.Marker.prototype.options.icon = DefaultIcon;

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

function AddLabels({polygonData, areaThreshold, minZoomLevel}) {
  const map = useMap();
  let labelMarkers = [];

  const updateLabels = () => {
    // Clear existing labels
    labelMarkers.forEach((marker) => marker.remove());
    labelMarkers = [];

    if (!polygonData) return;

    polygonData.features.forEach((feature) => {
      if (feature.properties && feature.properties.numer_ewidencyjny) {
        const polygon = L.polygon(feature.geometry.coordinates[0].map((coord) => [coord[1], coord[0]]));
        const area = L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0]);

        if (area >= areaThreshold || map.getZoom() >= minZoomLevel) {
          const center = polygon.getBounds().getCenter();
          const label = L.marker(center, {
            icon: L.divIcon({
              className: "bg-none text-sm text-white font-bold",
              html: feature.properties.numer_ewidencyjny,
            }),
          });
          labelMarkers.push(label);
        }
      }
    });
  };

  useEffect(() => {
    const onOverlayAdd = (event) => {
      if (event.name === "Pola") {
        updateLabels();
        labelMarkers.forEach((marker) => marker.addTo(map));
      }
    };

    const onOverlayRemove = (event) => {
      if (event.name === "Pola") {
        labelMarkers.forEach((marker) => marker.remove());
      }
    };

    map.on("overlayadd", onOverlayAdd);
    map.on("overlayremove", onOverlayRemove);

    // Check if 'Pola' is initially checked and add labels if so
    updateLabels();
    labelMarkers.forEach((marker) => marker.addTo(map));

    return () => {
      map.off("overlayadd", onOverlayAdd);
      map.off("overlayremove", onOverlayRemove);
      labelMarkers.forEach((marker) => marker.remove());
    };
  }, [map, polygonData, areaThreshold, minZoomLevel]);

  return null;
}

const WeatherWidget = () => {
  useEffect(() => {
    // Funkcja do ładowania skryptu SDK
    const loadSdk = () => {
      if (document.getElementById("tomorrow-sdk")) {
        if (window.__TOMORROW__) {
          window.__TOMORROW__.renderWidget();
        }
        return;
      }

      const script = document.createElement("script");
      script.id = "tomorrow-sdk";
      script.src = "https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js";
      script.onload = () => {
        if (window.__TOMORROW__) {
          window.__TOMORROW__.renderWidget();
        }
      };

      document.body.appendChild(script);
    };

    // Ładowanie SDK
    loadSdk();
  }, []);

  return (
    <div
      className="tomorrow"
      data-location-id="" // Wstaw odpowiednie ID lokalizacji
      data-language="PL"
      data-unit-system="METRIC"
      data-skin="dark"
      data-widget-type="upcoming"
      style={{paddingBottom: "22px", position: "relative"}}>
      <a
        href="https://www.tomorrow.io/weather-api/"
        rel="nofollow noopener noreferrer"
        target="_blank"
        style={{position: "absolute", bottom: 0, transform: "translateX(-50%)", left: "50%"}}>
        <img alt="Powered by the Tomorrow.io Weather API" src="https://weather-website-client.tomorrow.io/img/powered-by.svg" width="250" height="18" />
      </a>
    </div>
  );
};
function Home() {
  const colors = useColors();
  const {latitude, longitude} = useGeoLocation();
  const [polygonData, setPolygonData] = useState(null);
  const [fields, setFields] = useState([]);
  const [uprawy, setUprawy] = useState([]);
  const [polyUprawaData, setPolyUprawaData] = useState(null);
  const markerRefs = useRef({});
  const customIcon = new L.DivIcon({
    className: "my-custom-pin",
    html: `<div style="background-color: #0000FF; width: 20px; height: 20px; border: 2px solid #000; border-radius: 50%;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
  const [calendarEvents, setCalendarEvents] = useState([]);
  useEffect(() => {
    let fetchedFields = [];
    fetch("/api/pola", {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        fetchedFields = groupByDzialkaId(data);
        setFields(fetchedFields);
        return fetch("/api/polygons", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
        return fetch("/api/uprawy", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
      })
      .then((response) => response.json())
      .then((data) => {
        setUprawy(data);
        return fetch("/api/poly-uprawy", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
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

        setPolyUprawaData({
          type: "FeatureCollection",
          features: features,
        });
        return fetch("/api/kalendarz", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const now = new Date();
            const futureEvents = data.filter((item) => {
              const startDate = new Date(item.start);
              const endDate = new Date(item.end);
              return endDate > now && startDate > now;
            });

            setCalendarEvents(futureEvents);
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
          <LayersControl.Overlay name="Pola" checked>
            {polygonData && (
              <>
                <GeoJSON data={polygonData} style={getFeatureStyle} />
                <AddLabels polygonData={polygonData} areaThreshold={50000} minZoomLevel={16} />
              </>
            )}
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Uprawy">{polyUprawaData && <GeoJSON data={polyUprawaData} style={getUprawaStyle} />}</LayersControl.Overlay>
        </LayersControl>
        {calendarEvents.map((event, index) => {
          // Find the feature that corresponds to the current event
          const feature = polygonData.features.find((f) => f.properties.numer_ewidencyjny === event.numer_ewidencyjny);
          if (feature) {
            const polygon = L.polygon(feature.geometry.coordinates[0].map((coord) => [coord[1], coord[0]]));
            const center = polygon.getBounds().getCenter();

            return (
              <Marker key={index} position={center}>
                <Popup>
                  <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{event.title}</h3>
                    <div className="mt-2 px-4 py-2">
                      <p className="text-sm text-gray-500">Od: {moment(event.start).format("LLLL")}</p>
                      <p className="text-sm text-gray-500">Do: {moment(event.end).format("LLLL")}</p>
                      <p className="text-sm text-gray-500">Numer ewidencyjny: {event.numer_ewidencyjny}</p>
                      <p className="text-sm text-gray-500">Operator: {event.operator}</p>
                      <p className="text-sm text-gray-500">Opis: {event.opis}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          } else {
            // If no matching feature was found, return null or some fallback UI
            return null;
          }
        })}
        <Marker position={[latitude, longitude]} icon={customIcon} />
      </MapContainer>
      <div className="flex flex-row w-full h-1/3 px-8 justify-center">
        <div className="w-[650px] h-[300px] my-2">
          <WeatherWidget />
        </div>
      </div>
    </div>
  );
}

export default Home;
