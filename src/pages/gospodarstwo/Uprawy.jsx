import {MapContainer, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {Link} from "react-router-dom";
import useGeoLocation from "../../hooks/useGeoLocation";
function Uprawy() {
  const {latitude, longitude} = useGeoLocation();
  return (
    <div className="flex flex-col w-5/6 h-1/3 px-8 space-beetween">
      {latitude && longitude && (
        <MapContainer center={[latitude, longitude]} zoom={13}>
          <TileLayer attribution="Google Maps Satellite" url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}" />
        </MapContainer>
      )}
      <div className="flex flex-row text-base font-bold opacity-80 py-2 justify-between">
        Uprawy
        <Link to="/dodaj-uprawe">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Dodaj</button>
        </Link>
      </div>
    </div>
  );
}

export default Uprawy;
