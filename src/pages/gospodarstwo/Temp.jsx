import {useState} from "react";
import {FaCamera} from "react-icons/fa";
import {useEffect} from "react";

function Operatorzy() {
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
    const stanowiskoRodzaj = e.target.value;
    setStanowisko(selectedRodzaj);
    setOperator({...operator, rodzaj_maszyny: selectedRodzaj});
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
    setSelectedId(operatorData.opearotr_id);
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
      const response = await fetch("/api/operatorzy");
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
              key={operatorzyData.opearotr_id}
              className="flex items-center w-full px-4 pt-2 pb-2 mb-2 border-b-2 border-gray-700"
              onClick={() => fillFormWithSelectedData(operatorzyData)}>
              <div className="flex-shrink-0 h-14 w-14">
                <img className="h-14 w-14 rounded" src={`http://localhost:5000/uploads/${operatorzyData.img}`} alt="Photo" />
              </div>
              <div className="ml-4">
                <div className="text-xl font-bold text-black">{(operatorzyData.imie, operatorzyData.nazwisko)}</div>
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
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rodzaj">
                  Rodzaj
                </label>
                <select
                  id="rodzaj_maszyny"
                  name="rodzaj_maszyny"
                  value={maszyna.rodzaj_maszyny}
                  onChange={handleRodzajChange}
                  className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md">
                  <option value="">Wybierz rodzaj maszyny</option>
                  {agriculturalMachines.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                  <option value="inne">Inne</option>
                </select>
                {isOtherRodzaj && (
                  <input
                    type="text"
                    name="customRodzaj"
                    placeholder="Wpisz rodzaj maszyny"
                    className="mt-2 w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md"
                    onChange={(e) => setMaszyna({...maszyna, rodzaj_maszyny: e.target.value})}
                  />
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nazwa">
                  Nazwa
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="nazwa"
                  type="text"
                  placeholder="Nazwa"
                  name="nazwa"
                  value={maszyna.nazwa}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="operator">
                  Operator
                </label>
                <select
                  id="operator"
                  name="operator"
                  value={operator}
                  onChange={handleChangeOperator}
                  className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md">
                  <option value="">Wybierz operatora</option>
                  {operatorData.map((op, index) => (
                    <option key={index} value={`${op.imie} ${op.nazwisko}`}>
                      {op.imie} {op.nazwisko}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-1/2 ml-4">
              <label
                htmlFor="photo-upload"
                className="h-60 border-2 border-blue-600 rounded flex flex-col items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200 relative">
                {/* {!selectedPhoto && (
                  <>
                    <div className="text-blue-600">
                      <FaCamera size="72px" />
                    </div>
                    <span className="mt-2 text-sm text-blue-600">Dodaj zdjęcie</span>
                  </>
                )} */}
                {/* {selectedPhoto ? (
                  <>
                    <img src={previewUrl} alt="Selected" className="w-full h-full object-cover rounded" />
                    <div
                      className="absolute top-0 right-0 bg-white bg-opacity-75 p-2 rounded-bl cursor-pointer hover:bg-opacity-100"
                      onClick={() => setSelectedPhoto(null)} // Add this to allow removing the selected photo
                    >
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

                {previewUrl && (
                  <>
                    <img src={previewUrl} alt="Selected" className="w-full h-full object-cover rounded" />
                    <div
                      className="absolute top-0 right-0 bg-white bg-opacity-75 p-2 rounded-bl cursor-pointer hover:bg-opacity-100"
                      onClick={() => setSelectedPhoto(null)}>
                      <FaCamera size="24px" className="text-blue-600" />
                    </div>
                  </> */}
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Selected" className="w-full h-full object-cover rounded" />
                    <div
                      className="absolute top-0 right-0 bg-white bg-opacity-75 p-2 rounded-bl cursor-pointer hover:bg-opacity-100"
                      onClick={() => {
                        setPreviewUrl(null);
                        setSelectedPhoto(null);
                      }} // This will clear both the preview and the selected file
                    >
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
          <h1 className="mb-2 text-lg font-bold opacity-80">Dane techniczne</h1>
          <div className="flex flex-col">
            <div className="flex flex-row">
              <div className="w-1/2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rokProdukcji">
                  Rok produkcji
                </label>
                <YearPicker selectedYear={maszyna.rok_produkcji} handleChange={(e) => setMaszyna({...maszyna, rok_produkcji: e.target.value})} />
              </div>
              <div className="w-1/2 mb-4 ml-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="masa">
                  Masa
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="masa"
                  type="text"
                  placeholder="Masa"
                  name="masa"
                  value={maszyna.masa}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-row">
              <div className="w-1/2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="szerokosc_robocza">
                  Szerokość robocza
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="szerokosc_robocza"
                  type="text"
                  placeholder="Szerokość robocza"
                  name="szerokosc_robocza"
                  value={maszyna.szerokosc_robocza}
                  onChange={handleChange}
                />
              </div>
              <div className="w-1/2 mb-4 ml-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="moc">
                  Moc
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="moc"
                  type="text"
                  placeholder="Moc"
                  name="moc"
                  value={maszyna.moc}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-row">
              <div className="w-1/2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="data_ubezpieczenia">
                  Data ubezpieczenia
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="data_ubezpieczenia"
                  type="date"
                  placeholder="Data ubezpieczenia"
                  name="data_ubezpieczenia"
                  value={maszyna.data_ubezpieczenia}
                  onChange={handleChange}
                />
              </div>
              <div className="w-1/2 mb-4 ml-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="data_przegladu">
                  Data przeglądu
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="data_przegladu"
                  type="date"
                  placeholder="Data przeglądu"
                  name="data_przegladu"
                  value={maszyna.data_przegladu}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <h1 className="mb-2 text-lg font-bold opacity-80">Ustawienia maszyny</h1>
          <div className="mb-4 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ustawienia">
              Opis
            </label>
            <input
              className="shadow appearance-none border rounded w-full h-40 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="ustawienia"
              type="text"
              name="ustawienia"
              value={maszyna.ustawienia}
              onChange={handleChange}
            />
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
