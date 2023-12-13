import {MapContainer, Marker, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {useEffect, useState} from "react";
import WeatherForecast from "../../components/WeatherForecast";

function Home() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    }
  }, []);

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
