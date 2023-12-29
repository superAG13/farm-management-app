import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
const DodajMagazyn = () => {
  const navigate = useNavigate();
  const [magazyn, setMagazyn] = useState({
    nazwa: "",
    typ: "",
    data_zakupu: "",
    cena_netto: "",
    cena_brutto: "",
    ilosc: "",
    jednostka_magazynowa: "",
    zalecana_dawka: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = async (e) => {
    setMagazyn({...magazyn, [e.target.name]: e.target.value});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/magazyn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(magazyn),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (magazyn.typ === "Środki ochrony roślin") {
        navigate("/srodki");
      } else if (magazyn.typ === "Rośliny i odmiany") {
        navigate("/rosliny");
      } else {
        navigate("/nawozy");
      }
    } catch (error) {
      console.error("Error adding magazyn:", error);
      setErrorMessage(`Error adding magazyn: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex border rounded-md bg-white h-3/6 m-4 px-4 py-6 flex-row w-2/3">
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex flex-row">
            <div className="mb-4 w-1/2 pr-6">
              <label htmlFor="nazwa" className="block text-sm font-medium mb-1">
                Nazwa
              </label>
              <input
                type="text"
                id="nazwa"
                name="nazwa"
                value={magazyn.nazwa}
                onChange={handleChange}
                className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md "
              />
            </div>

            <div className="mb-4 w-1/2">
              <label htmlFor="typ" className="block text-sm font-medium mb-1">
                Rodzaj
              </label>
              <select
                id="typ"
                name="typ"
                value={magazyn.typ}
                onChange={handleChange}
                className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md py-0.5">
                <option value="">Wybierz rodzaj</option>
                <option value="Środki ochrony roślin">Środki ochrony roślin</option>
                <option value="Nawozy">Nawozy</option>
                <option value="Rośliny i odmiany">Rośliny i odmiany</option>
              </select>
            </div>
          </div>

          <div className="mb-4 w-1/2 pr-6">
            <label htmlFor="data_zakupu" className="block text-sm font-medium mb-1">
              Data zakupu
            </label>
            <input
              type="date"
              id="data_zakupu"
              name="data_zakupu"
              value={magazyn.data_zakupu}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
            />
          </div>
          <div className="flex flex-row">
            <div className="mb-4 w-1/2 pr-6">
              <label htmlFor="cena_netto" className="block text-sm font-medium mb-1">
                Cena netto
              </label>
              <input
                type="number"
                id="cena_netto"
                name="cena_netto"
                value={magazyn.cena_netto}
                onChange={handleChange}
                className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
              />
            </div>
            <div className="mb-4 w-1/2">
              <label htmlFor="cena_brutto" className="block text-sm font-medium mb-1">
                Cena brutto
              </label>
              <input
                type="number"
                id="cena_brutto"
                name="cena_brutto"
                value={magazyn.cena_brutto}
                onChange={handleChange}
                className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className="mb-4 w-1/2 pr-6">
              <label htmlFor="ilosc" className="block text-sm font-medium mb-1">
                Ilość
              </label>
              <input
                type="number"
                id="ilosc"
                name="ilosc"
                value={magazyn.ilosc}
                onChange={handleChange}
                className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
              />
            </div>
            <div className="mb-4 w-1/2">
              <label htmlFor="jednostka_magazynowa" className="block text-sm font-medium mb-1">
                Jednostka magazynowa
              </label>
              <select
                id="jednostka_magazynowa"
                name="jednostka_magazynowa"
                value={magazyn.jednostka_magazynowa}
                onChange={handleChange}
                className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md py-0.5">
                <option value="">Wybierz jednostkę magazynową</option>
                <option value="sztuki">Sztuki</option>
                <option value="kilogramy">Kilogramy</option>
                <option value="litry">Litry</option>
                <option value="opakowania">Opakowania</option>
                <option value="tony">Tony</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="zalecana_dawka" className="block text-sm font-medium mb-1">
              Zalecana dawka
            </label>
            <input
              type="text"
              id="zalecana_dawka"
              name="zalecana_dawka"
              value={magazyn.zalecana_dawka}
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

export default DodajMagazyn;
