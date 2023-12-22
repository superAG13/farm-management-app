import {MapContainer, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {Link} from "react-router-dom";
import useGeoLocation from "../../hooks/useGeoLocation";
import {useEffect, useState} from "react";

function Pola() {
  const {latitude, longitude} = useGeoLocation();
  const [fields, setFields] = useState([]); // State to hold data from the database

  useEffect(() => {
    // Fetch the data when the component mounts
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => {
        // console.log("Fetched fields:", data); // Check the structure of fetched data
        setFields(data);
      })
      .catch((error) => console.error("Error fetching fields:", error));
  }, []);
  const handleDelete = (dzialkaId) => {
    console.log("Deleting field with ID:", dzialkaId);
    fetch(`/api/data/${dzialkaId}`, {
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
        setFields(fields.filter((field) => field.dzialka_id !== dzialkaId));
      })
      .catch((error) => {
        console.error("Error deleting field:", error);
        // Handle error
      });
  };
  return (
    <div className="flex flex-col w-5/6 h-1/3 px-8 space-beetween">
      {latitude && longitude && (
        <MapContainer center={[latitude, longitude]} zoom={13}>
          <TileLayer attribution="Google Maps Satellite" url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}" />
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
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider ">Nazwa</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider">Obręb</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider">Numer Ewidencyjny</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider">Uprawa</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider">Powierzchnia</th>
              <th className="px-6 py-3 border-b-2 border-gray-300"></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {fields.map((field, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle">{field.nazwa}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle">{field.obreb}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle">{field.numer_ewidencyjny}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle">{field.uprawa}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle">{field.area}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-sm leading-5 text-right align-middle">
                  <Link to={`/edytuj-pole/${field.dzialka_id}`} className="text-indigo-600 hover:text-indigo-900 px-2">
                    <button>Edytuj</button>
                  </Link>
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
