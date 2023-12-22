import {MapContainer, Marker, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import WeatherForecast from "../../components/WeatherForecast";
import useGeoLocation from "../../hooks/useGeoLocation";

function Home() {
  const {latitude, longitude} = useGeoLocation();
  return (
    <div className="flex flex-col w-5/6 h-1/3 px-8 space-beetween">
      {latitude && longitude && (
        <MapContainer center={[latitude, longitude]} zoom={16}>
          <TileLayer attribution="Google Maps Satellite" url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}" />
          <Marker position={[latitude, longitude]} />
        </MapContainer>
      )}
      <WeatherForecast />
    </div>
  );
}

export default Home;
