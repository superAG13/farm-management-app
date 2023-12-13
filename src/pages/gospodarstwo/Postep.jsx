import {MapContainer, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./mapy.css";
function Postep() {
  return (
    <div className="flex flex-col w-5/6">
      <MapContainer center={[48.8566, 2.3522]} zoom={13}>
        <TileLayer attribution="Google Maps Satellite" url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}" />
      </MapContainer>
      <div className="flex flex-col">Pola</div>
    </div>
  );
}

export default Postep;
