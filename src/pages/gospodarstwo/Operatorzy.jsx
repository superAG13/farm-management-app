import {useState} from "react";
import {FaCamera} from "react-icons/fa";
import {useEffect} from "react";

function Operatorzy() {
  const jednostka = ["Godzina Pracy", "Dzień Roboczy", "Hektar", "Sztuka", "Tona", "Zadanie", "Stawka miesięczna"];
  const stanowiska = [
    "Właściciel",
    "Zarządca",
    "Operator",
    "Pracownik Polowy",
    "Weterynarz",
    "Specjalista ds. Marketingu i Sprzedaży Produktów Rolnych",
    "Magazynier",
    "Kierowca",
  ];
  const [operator, setOperator] = useState({
    imie: "",
    nazwisko: "",
    stanowisko: "",
    ulica: "",
    numer_domu: "",
    kod_pocztowy: "",
    miejscowosc: "",
    wojewodztwo: "",
    kraj: "",
    telefon: "",
    email: "",
    jednostka_rozliczeniowa: "",
    kwota_za_jednostke: "",
  });
  const [operatorzyData, setOperatorzyData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [stanowisko, setStanowisko] = useState("");
  const [isOtherStanowisko, setIsOtherStanowisko] = useState(false);

  const handleStanowiskoChange = (e) => {
    const selectedStanowisko = e.target.value;
    setStanowisko(selectedStanowisko);
    setOperator({...operator, stanowisko: selectedStanowisko});
    setIsOtherStanowisko(selectedStanowisko === "inne");
  };

  const handleChange = (e) => {
    setOperator({...operator, [e.target.name]: e.target.value});
  };

  const [previewUrl, setPreviewUrl] = useState("");

  const handlePhotoChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedPhoto(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);
    }
  };
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fillFormWithSelectedData = (operatorData) => {
    setOperator({
      imie: operatorData.imie,
      nazwisko: operatorData.nazwisko,
      stanowisko: operatorData.stanowisko,
      ulica: operatorData.ulica,
      numer_domu: operatorData.numer_domu,
      kod_pocztowy: operatorData.kod_pocztowy,
      miejscowosc: operatorData.miejscowosc,
      wojewodztwo: operatorData.wojewodztwo,
      kraj: operatorData.kraj,
      telefon: operatorData.telefon,
      email: operatorData.email,
      jednostka_rozliczeniowa: operatorData.jednostka_rozliczeniowa,
      kwota_za_jednostke: operatorData.kwota_za_jednostke,
    });
    const photoUrlFromDatabase = `http://localhost:5000/uploads/${operatorData.img}`;
    setPreviewUrl(photoUrlFromDatabase);
    setSelectedId(operatorData.operator_id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an instance of FormData
    const formData = new FormData();

    // Append the image file to formData if it exists
    if (selectedPhoto) {
      formData.append("image", selectedPhoto);
    }
    // Append other form data to formData
    Object.keys(operator).forEach((key) => {
      formData.append(key, operator[key]);
    });

    // Determine the correct URL and HTTP method
    const url = selectedId ? `/api/operatorzy/${selectedId}` : "/api/operatorzy";
    const method = selectedId ? "PUT" : "POST";

    try {
      // Send the request with formData and without specifying Content-Type header
      const response = await fetch(url, {
        method: method,
        body: formData,
        headers: {
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Reset the form and state
      setSelectedId(null);
      setOperator({
        imie: "",
        nazwisko: "",
        stanowisko: "",
        ulica: "",
        numer_domu: "",
        kod_pocztowy: "",
        miejscowosc: "",
        wojewodztwo: "",
        kraj: "",
        telefon: "",
        email: "",
        jednostka_rozliczeniowa: "",
        kwota_za_jednostke: "",
      });
      setPreviewUrl(null);
      setSelectedPhoto(null);
      loadOperatorzyData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedId) {
      try {
        const response = await fetch(`/api/operatorzy/${selectedId}`, {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Resetuj formularz i odśwież listę maszyn
        setSelectedId(null);
        setOperator({
          imie: "",
          nazwisko: "",
          stanowisko: "",
          ulica: "",
          numer_domu: "",
          kod_pocztowy: "",
          miejscowosc: "",
          wojewodztwo: "",
          kraj: "",
          telefon: "",
          email: "",
          jednostka_rozliczeniowa: "",
          kwota_za_jednostke: "",
        });
        setPreviewUrl(null);
        setSelectedPhoto(null);
        loadOperatorzyData();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const loadOperatorzyData = async () => {
    try {
      const response = await fetch("/api/operatorzy", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setOperatorzyData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    loadOperatorzyData();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase()); // Convert to lowercase for case-insensitive comparison
  };
  const filteredOperatorzyData = operatorzyData.filter((item) => item.imie.toLowerCase().includes(searchTerm) || item.nazwisko.toLowerCase().includes(searchTerm));
  return (
    <div className="flex flex-row w-2/3 justify-between mx-auto h-screen">
      <div className="flex flex-col p-5 w-1/3">
        <div className="w-full mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="search"
            type="text"
            placeholder="Wyszukaj"
            value={searchTerm}
            onChange={handleSearchChange} // Attach the search handler
          />
        </div>
        <div className="w-full bg-white shadow-md rounded h-full">
          {filteredOperatorzyData.map((operatorzyData) => (
            <div
              key={operatorzyData.operator_id}
              className="flex items-center w-full px-4 pt-2 pb-2 mb-2 border-b-2 border-gray-700"
              onClick={() => fillFormWithSelectedData(operatorzyData)}>
              <div className="flex-shrink-0 h-14 w-14">
                <img className="h-14 w-14 rounded" src={`http://localhost:5000/uploads/${operatorzyData.img}`} alt="Photo" />
              </div>
              <div className="ml-4">
                <div className="text-xl font-bold text-black">{`${operatorzyData.imie} ${operatorzyData.nazwisko}`}</div>
                <p className="text-gray-500">{operatorzyData.stanowisko}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-2/3 h-full p-5">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4 flex justify-between flex-row">
            <div className="flex flex-col w-1/2">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imie">
                  Imię
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="imie"
                  type="text"
                  placeholder="Imię"
                  name="imie"
                  value={operator.imie}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nazwisko">
                  Nazwisko
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="nazwisko"
                  type="text"
                  placeholder="Nazwisko"
                  name="nazwisko"
                  value={operator.nazwisko}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stanowisko">
                  Stanowisko
                </label>
                <select
                  id="stanowisko"
                  name="stanowisko"
                  value={operator.stanowisko}
                  onChange={handleStanowiskoChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                  <option value="">Wybierz stanowisko</option>
                  {stanowiska.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                  <option value="inne">Inne</option>
                </select>
                {isOtherStanowisko && (
                  <input
                    type="text"
                    name="customStanowisko"
                    placeholder="Wpisz stanowisko"
                    className="mt-2 w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
                    onChange={(e) => setOperator({...operator, rodzaj_maszyny: e.target.value})}
                  />
                )}
              </div>
            </div>
            <div className="w-1/2 ml-4">
              <label
                htmlFor="photo-upload"
                className="h-60 border-2 border-blue-600 rounded flex flex-col items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200 relative">
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Selected" className="w-full h-full object-cover rounded" />
                    <div
                      className="absolute top-0 right-0 bg-white bg-opacity-75 p-2 rounded-bl cursor-pointer hover:bg-opacity-100"
                      onClick={() => {
                        setPreviewUrl(null);
                        setSelectedPhoto(null);
                      }}>
                      <FaCamera size="24px" className="text-blue-600" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-blue-600">
                      <FaCamera size="72px" />
                    </div>
                    <span className="mt-2 text-sm text-blue-600">Dodaj zdjęcie</span>
                  </>
                )}
                <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
          </div>
          <h1 className="mb-2 text-lg font-bold opacity-80">Adres</h1>
          <div className="flex flex-col">
            <div className="flex flex-row">
              <div className="w-1/2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ulica">
                  Ulica
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="ulica"
                  type="text"
                  placeholder="Ulica"
                  name="ulica"
                  value={operator.ulica}
                  onChange={handleChange}
                />
              </div>
              <div className="w-1/2 mb-4 ml-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numer_domu">
                  Numer domu
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="numer_domu"
                  type="text"
                  placeholder="Numer domu"
                  name="numer_domu"
                  value={operator.numer_domu}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-row">
              <div className="w-1/2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kod_pocztowy">
                  Kod pocztowy
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="kod_pocztowy"
                  type="text"
                  placeholder="Kod pocztowy"
                  name="kod_pocztowy"
                  value={operator.kod_pocztowy}
                  onChange={handleChange}
                />
              </div>
              <div className="w-1/2 mb-4 ml-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="miejscowosc">
                  Miejscowość
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="miejscowosc"
                  type="text"
                  placeholder="Miejscowość"
                  name="miejscowosc"
                  value={operator.miejscowosc}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-row">
              <div className="w-1/2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="wojewodztwo">
                  Województwo
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="wojewodztwo"
                  type="text"
                  placeholder="Województwo"
                  name="wojewodztwo"
                  value={operator.wojewodztwo}
                  onChange={handleChange}
                />
              </div>
              <div className="w-1/2 mb-4 ml-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kraj">
                  Kraj
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="kraj"
                  type="text"
                  placeholder="Kraj"
                  name="kraj"
                  value={operator.kraj}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <h1 className="mb-2 text-lg font-bold opacity-80">Dane kontaktowe</h1>
          <div className="flex flex-row">
            <div className="mb-4 w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefon">
                Telefon
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="telefon"
                type="text"
                placeholder="Telefon"
                name="telefon"
                value={operator.telefon}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4 ml-4 w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                name="email"
                value={operator.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <h1 className="mb-2 text-lg font-bold opacity-80">Koszty</h1>
          <div className="flex flex-row">
            <div className="mb-4 w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jednostka_rozliczeniowa">
                Jednostka rozlicznieowa
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="jednostka_rozliczeniowa"
                name="jednostka_rozliczeniowa"
                value={operator.jednostka_rozliczeniowa}
                onChange={handleChange}>
                <option value="">Wybierz jednostkę rozliczeniową</option>
                {jednostka.map((unit, index) => (
                  <option key={index} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 ml-4 w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kwota_za_jednostke">
                Kwota za jednostkę (PLN)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="kwota_za_jednostke"
                type="number"
                placeholder="Kwota za jednostkę"
                name="kwota_za_jednostke"
                value={operator.kwota_za_jednostke}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <button
              className={`bg-${selectedId ? "blue" : "green"}-500 hover:bg-${
                selectedId ? "blue" : "green"
              }-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              type="submit">
              {selectedId ? "Edytuj" : "Dodaj"}
            </button>
            {selectedId && (
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleDelete}>
                Usuń
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Operatorzy;
