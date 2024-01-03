import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import "./style.css";
function Zbiory() {
  const [zbiory, setZbiory] = useState([]);
  const [isScrollable, setIsScrollable] = useState(false);
  useEffect(() => {
    fetch("/api/zbiory", {
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
            data_sprzedazy: new Date(item.data_sprzedazy).toISOString().split("T")[0],
          };
        });
        setZbiory(formattedData);
        setIsScrollable(formattedData.length > 15);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  const handleDelete = (zbiorId) => {
    fetch(`/api/zbiory/${zbiorId}`, {
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
        setZbiory(zbiory.filter((zbior) => zbior.zbiory_id !== zbiorId));
      })
      .catch((error) => {
        console.error("Error deleting zbior:", error);
        // Handle error
      });
  };
  const calculateTotals = () => {
    return zbiory.reduce(
      (totals, zbior) => {
        totals.masa += zbior.masa;
        totals.wartosc += zbior.wartosc;
        return totals;
      },
      {masa: 0, wartosc: 0}
    );
  };
  const totals = calculateTotals();
  return (
    <div className="flex flex-col w-5/6 h-5/6 px-8 justify-beetween">
      <div className="flex flex-row text-base font-bold opacity-80 py-2 justify-between">
        Zbiory
        <Link to="/dodaj-zbiory">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Dodaj</button>
        </Link>
      </div>
      <div className="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard rounded full-screen-table">
        <div className="table-container">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-96">Kwit wagowy</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-40">Data sprzedaży</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-40">Wilgotność</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-40">Masa</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-40">Cena bazowa</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-40">Cena</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-44">Wartość</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 w-40"></th>
              </tr>
            </thead>
            <tbody className={isScrollable ? "scrollable-table-magazyn" : ""}>
              {zbiory.map((zbior, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-96">{zbior.kwit_wagowy}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-40">
                    {zbior.data_sprzedazy}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-40">{zbior.wilgotnosc}%</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-40">{zbior.masa} kg</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-40">
                    {zbior.cena_bazowa} zł
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-40">{zbior.cena} zł</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-44">{zbior.wartosc}zł</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-sm leading-5 text-right align-middle w-40">
                    <Link to={`/edytuj-zbiory/${zbior.zbiory_id}`} className="text-indigo-600 hover:text-indigo-900 px-2">
                      <button>Edytuj</button>
                    </Link>
                    <button onClick={() => handleDelete(zbior.zbiory_id)} className="text-red-600 hover:text-red-900 mx-auto">
                      Usuń
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <table>
            <tfoot className="summary-row">
              <tr>
                <td className="px-6 py-4 whitespace-no-wrap border-t border-gray-500 text-sm leading-5 text-center align-middle w-96"></td>
                <td className="px-6 py-4 whitespace-no-wrap border-t border-gray-500 text-sm leading-5 text-center align-middle w-40"></td>
                <td className="px-6 py-4 whitespace-no-wrap border-t border-r border-gray-500 text-sm leading-5 text-center align-middle w-40"></td>
                <td className="px-6 py-4 whitespace-no-wrap border-t border-r border-gray-500 text-sm leading-5 text-center align-middle w-40">{totals.masa} kg</td>
                <td className="px-6 py-4 whitespace-no-wrap border-t  border-gray-500 text-sm leading-5 text-center align-middle w-40"></td>
                <td className="px-6 py-4 whitespace-no-wrap border-t border-r border-gray-500 text-sm leading-5 text-center align-middle w-40"></td>
                <td className="px-6 py-4 whitespace-no-wrap border-t border-r border-gray-500 text-sm leading-5 text-center align-middle w-44">{totals.wartosc}zł</td>
                <td className="px-6 py-4 whitespace-no-wrap border-t border-gray-500 text-sm leading-5 text-right align-middle w-44"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Zbiory;
