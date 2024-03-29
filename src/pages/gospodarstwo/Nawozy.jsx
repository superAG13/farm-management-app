import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import "./style.css";
import moment from "moment-timezone";
function Nawozy() {
  const [nawozy, setNawozy] = useState([]);
  const [isScrollable, setIsScrollable] = useState(false);
  useEffect(() => {
    fetch("/api/nawozy", {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((item) => {
          return {
            ...item,
            data_zakupu: moment(item.data_zakupu).format("YYYY-MM-DD"),
          };
        });
        setNawozy(formattedData);
        setIsScrollable(formattedData.length > 15);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  const handleDelete = (magazynId) => {
    fetch(`/api/magazyn/${magazynId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
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
        setNawozy(nawozy.filter((nawoz) => nawoz.magazyn_id !== magazynId));
      })
      .catch((error) => {
        console.error("Error deleting nawoz:", error);
        // Handle error
      });
  };
  return (
    <div className="flex flex-col w-5/6 h-5/6 px-8 justify-beetween">
      <div className="flex flex-row text-base font-bold opacity-80 py-2 justify-between">
        Nawozy
        <Link to="/dodaj-magazyn">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Dodaj</button>
        </Link>
      </div>
      <div className="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard rounded">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-72">Nazwa</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-40">Data zakupu</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-36">Cena netto</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-36">Cena brutto</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-36">Ilość</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-36">Jednostka magazynowa</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-40">Wartość</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-48">Zalecana dawka</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 w-36"></th>
            </tr>
          </thead>
          <tbody className={isScrollable ? "scrollable-table-magazyn" : ""}>
            {nawozy.map((nawoz, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-72">{nawoz.nazwa}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-40">{nawoz.data_zakupu}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-36">{nawoz.cena_netto} zł</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-36">{nawoz.cena_brutto} zł</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-36">{nawoz.ilosc}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-36">
                  {nawoz.jednostka_magazynowa}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-40">{nawoz.wartosc}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-48">{nawoz.zalecana_dawka}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-sm leading-5 text-right align-middle w-36">
                  <Link to={`/edytuj-magazyn/${nawoz.magazyn_id}`} className="text-indigo-600 hover:text-indigo-900 px-2">
                    <button>Edytuj</button>
                  </Link>
                  <button onClick={() => handleDelete(nawoz.magazyn_id)} className="text-red-600 hover:text-red-900 mx-auto">
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

export default Nawozy;
