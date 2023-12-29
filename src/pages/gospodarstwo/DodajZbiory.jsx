import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
const DodajZbiory = () => {
  const navigate = useNavigate();
  const [zbiory, setZbiory] = useState({
    kwit_wagowy: "",
    data_sprzedazy: "",
    wilgotnosc: "",
    masa: "",
    cena_bazowa: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = async (e) => {
    setZbiory({...zbiory, [e.target.name]: e.target.value});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/zbiory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(zbiory),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      navigate("/zbiory");
    } catch (error) {
      console.error("Error adding zbiory:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex border rounded-md bg-white h-3/6 m-4 px-4 py-6 flex-row w-2/3">
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-4">
            <label htmlFor="kwit_wagowy" className="block text-sm font-medium mb-1">
              Kwit wagowy
            </label>
            <input
              type="text"
              id="kwit_wagowy"
              name="kwit_wagowy"
              value={zbiory.kwit_wagowy}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md "
            />
          </div>

          <div className="mb-4 w-1/2">
            <label htmlFor="data_sprzedazy" className="block text-sm font-medium mb-1">
              Data sprzedaży
            </label>
            <input
              type="date"
              id="data_sprzedazy"
              name="data_sprzedazy"
              value={zbiory.data_sprzedazy}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
            />
          </div>

          <div className="mb-4 w-1/2">
            <label htmlFor="wilgotnosc" className="block text-sm font-medium mb-1">
              Wilgotność
            </label>
            <input
              type="number"
              id="wilgotnosc"
              name="wilgotnosc"
              value={zbiory.wilgotnosc}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
            />
          </div>
          <div className="mb-4 w-1/2">
            <label htmlFor="masa" className="block text-sm font-medium mb-1">
              Masa
            </label>
            <input
              type="number"
              id="masa"
              name="masa"
              value={zbiory.masa}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
            />
          </div>
          <div className="mb-4 w-1/2">
            <label htmlFor="cena_bazowa" className="block text-sm font-medium mb-1">
              Cena bazowa
            </label>
            <input
              type="number"
              id="cena_bazowa"
              name="cena_bazowa"
              value={zbiory.cena_bazowa}
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

export default DodajZbiory;
