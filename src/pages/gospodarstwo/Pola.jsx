import {MapContainer, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {Link} from "react-router-dom";

function Pola() {
  return (
    <div className="flex flex-col w-5/6 h-1/3 px-8 space-beetween">
      <MapContainer center={[48.8566, 2.3522]} zoom={13}>
        <TileLayer attribution="Google Maps Satellite" url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}" />
      </MapContainer>
      <div className="flex flex-row text-base font-bold opacity-80 py-2 justify-between">
        Pola
        <Link to="/dodaj-pole">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Dodaj</button>
        </Link>
      </div>
    </div>
  );
}

export default Pola;
