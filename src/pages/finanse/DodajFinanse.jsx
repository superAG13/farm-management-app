import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
const DodajFinanse = () => {
  const navigate = useNavigate();
  const [finanse, setFinanse] = useState({
    nazwa: "",
    rodzaj_dokumentu: "",
    opis: "",
    wartosc: "",
    data: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = async (e) => {
    setFinanse({...finanse, [e.target.name]: e.target.value});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/finanse", {
        method: "POST",
        headers: {
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finanse),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      navigate("/finanse");
    } catch (error) {
      console.error("Error adding finanse:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex border rounded-md bg-white h-3/6 m-4 px-4 py-6 flex-row w-2/3">
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-4">
            <label htmlFor="nazwa" className="block text-sm font-medium mb-1">
              Nazwa
            </label>
            <input
              type="text"
              id="nazwa"
              name="nazwa"
              value={finanse.nazwa}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md "
            />
          </div>
          <div className="mb-4">
            <label htmlFor="opis" className="block text-sm font-medium mb-1">
              Opis
            </label>
            <input
              type="text"
              id="opis"
              name="opis"
              value={finanse.opis}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md "
            />
          </div>
          <div className="mb-4 w-1/2">
            <label htmlFor="rodzaj_dokumentu" className="block text-sm font-medium mb-1">
              Rodzaj dokumentu
            </label>
            <select
              id="rodzaj_dokumentu"
              name="rodzaj_dokumentu"
              value={finanse.rodzaj_dokumentu}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md py-0.5">
              <option value="">Wybierz rodzaj dokumentu</option>
              <option value="Dokument sprzedaży">Dokument sprzedaży</option>
              <option value="Dokument zakupu">Dokument zakupu</option>
            </select>
          </div>

          <div className="mb-4 w-1/2">
            <label htmlFor="wartosc" className="block text-sm font-medium mb-1">
              Wartość
            </label>
            <input
              type="number"
              id="wartosc"
              name="wartosc"
              value={finanse.wartosc}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
            />
          </div>

          <div className="mb-4 w-1/2">
            <label htmlFor="data" className="block text-sm font-medium mb-1">
              Data
            </label>
            <input
              type="date"
              id="data"
              name="data"
              value={finanse.data}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isLoading}>
              {isLoading ? "Adding..." : "Dodaj"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DodajFinanse;
