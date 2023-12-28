import L from "leaflet";
import {MapContainer, TileLayer, useMap} from "react-leaflet";

function PolygonLayer({polygonData}) {
  const map = useMap();

  useEffect(() => {
    if (polygonData && map) {
      L.geoJSON(polygonData).addTo(map);
    }
  }, [polygonData, map]);

  return null;
}

function PolaMap({polygonData}) {
  return (
    <MapContainer center={[latitude, longitude]} zoom={13} style={{height: "400px", width: "100%"}}>
      <PolygonLayer polygonData={polygonData} />
    </MapContainer>
  );
}
export default PolaMap;
