import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import "../gospodarstwo/style.css";
import moment from "moment-timezone";
function Finanse() {
  const [finanse, setFinanse] = useState([]);
  const [isScrollable, setIsScrollable] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  useEffect(() => {
    fetch("/api/finanse", {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data); // Check the structure and content
        const formattedData = data.map((item) => {
          return {
            ...item,
            data: moment(item.data).format("YYYY-MM-DD"),
          };
        });
        setFinanse(formattedData);
        setIsScrollable(formattedData.length > 5);
      })
      .catch((error) => console.error("Error fetching data:", error));
    const clearSelection = (e) => {
      if (!e.target.closest("tr")) {
        setSelectedId(null);
      }
    };

    window.addEventListener("click", clearSelection);

    // Cleanup the event listener
    return () => window.removeEventListener("click", clearSelection);
  }, []);

  const handleRowClick = (id) => {
    setSelectedId(id);
  };
  const handleDelete = (finanseId) => {
    fetch(`/api/finanse/${finanseId}`, {
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
        setFinanse(finanse.filter((dokument) => dokument.dokument_id !== finanseId));
      })
      .catch((error) => {
        console.error("Error deleting dokument:", error);
        // Handle error
      });
  };
  const sprzedazyFinanse = finanse.filter((dokument) => dokument.rodzaj_dokumentu === "Dokument sprzedaży");
  const zakupyFinanse = finanse.filter((dokument) => dokument.rodzaj_dokumentu === "Dokument zakupu");
  const calculateSummary = () => {
    const koszta = zakupyFinanse.reduce((acc, curr) => acc + curr.wartosc, 0);
    const przychod = sprzedazyFinanse.reduce((acc, curr) => acc + curr.wartosc, 0);
    const zysk = przychod - koszta;
    return {koszta, przychod, zysk};
  };

  const summary = calculateSummary();

  return (
    <div className="flex flex-col w-5/6 h-5/6 px-8 justify-beetween">
      <div className="flex flex-row text-base font-bold opacity-80 py-2 justify-between">Finanse</div>
      {/* <h1 className="text-sm font-bold opacity-80">Dokumenty sprzedaży</h1> */}
      <div className="flex flex-row justify-beetwen">
        <div className="align-middle inline-block w-1/2 shadow overflow-hidden bg-white shadow-dashboard rounded h-96">
          <h1 className="text-sm font-bold opacity-80 pt-1 px-1">Dokumenty sprzedaży</h1>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-1 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-48">Nazwa</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-48">Opis</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-40">Wartość</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-40">Data</th>
              </tr>
            </thead>
            <tbody className={isScrollable ? "scrollable-table-magazyn" : ""}>
              {sprzedazyFinanse.map((dokument, index) => (
                <tr
                  key={dokument.id}
                  onClick={() => handleRowClick(dokument.dokument_id)}
                  className={`${selectedId === dokument.dokument_id ? "selected-row-style" : ""} ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-48">{dokument.nazwa}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-48">{dokument.opis}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-40">
                    {dokument.wartosc} zł
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-40">{dokument.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col justify-end">
          <Link to="/dodaj-finanse" className="mx-2 my-2">
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Dodaj</button>
          </Link>
          <Link to={`/edytuj-finanse/${selectedId}`} className="mx-2 mb-2">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Edytuj</button>
          </Link>
          <button
            onClick={() => handleDelete(selectedId)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-2">
            Usuń
          </button>
        </div>
        <div className="align-middle inline-block w-1/2 shadow overflow-hidden bg-white shadow-dashboard rounded h-96">
          <h1 className="text-sm font-bold opacity-80 pt-1 px-1">Dokumenty zakupu</h1>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-1 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-48">Nazwa</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-48">Opis</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-40">Wartość</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 tracking-wider w-40">Data</th>
              </tr>
            </thead>
            <tbody className={isScrollable ? "scrollable-table-magazyn" : ""}>
              {zakupyFinanse.map((dokument, index) => (
                <tr
                  key={dokument.id}
                  onClick={() => handleRowClick(dokument.dokument_id)}
                  className={`${selectedId === dokument.dokument_id ? "selected-row-style" : ""} ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-48">{dokument.nazwa}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-48">{dokument.opis}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-40">
                    {dokument.wartosc} zł
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-r border-gray-500 text-sm leading-5 text-center align-middle w-40">{dokument.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="financial-summary my-4 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full">
          <tbody className="divide-y divide-gray-200 overflow-hidden">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Koszty</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{summary.koszta.toFixed(2)} zł</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Przychód</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{summary.przychod.toFixed(2)} zł</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Zysk</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{summary.zysk.toFixed(2)} zł</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Finanse;
