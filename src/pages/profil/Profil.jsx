import {useState} from "react";
import {FaCamera} from "react-icons/fa";
import {useEffect} from "react";

function Profil() {
  const [uzytkownik, setUzytkownik] = useState({
    imie: "",
    nazwisko: "",
    ulica: "",
    numer_domu: "",
    kod_pocztowy: "",
    miejscowosc: "",
    wojewodztwo: "",
    kraj: "",
    telefon: "",
    email: "",
    haslo: "",
    dane_id: "",
  });
  const [selectedId, setSelectedId] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleChange = (e) => {
    setUzytkownik({...uzytkownik, [e.target.name]: e.target.value});
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

  const fillFormWithSelectedData = (uzytkownikData) => {
    setUzytkownik({
      imie: uzytkownikData.imie,
      nazwisko: uzytkownikData.nazwisko,
      ulica: uzytkownikData.ulica,
      numer_domu: uzytkownikData.numer_domu,
      kod_pocztowy: uzytkownikData.kod_pocztowy,
      miejscowosc: uzytkownikData.miejscowosc,
      wojewodztwo: uzytkownikData.wojewodztwo,
      kraj: uzytkownikData.kraj,
      telefon: uzytkownikData.telefon,
      email: uzytkownikData.email,
      haslo: uzytkownikData.haslo,
      dane_id: uzytkownikData.dane_id,
    });
    const photoUrlFromDatabase = `http://localhost:5000/uploads/${uzytkownikData.img}`;
    setPreviewUrl(photoUrlFromDatabase);
    setSelectedId(uzytkownikData.uzytkownik_id);
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
    Object.keys(uzytkownik).forEach((key) => {
      formData.append(key, uzytkownik[key]);
    });

    // Determine the correct URL and HTTP method
    const url = `/api/uzytkownik/${selectedId}`;
    const method = "PUT";

    try {
      // Send the request with formData and without specifying Content-Type header
      const response = await fetch(url, {
        method: method,
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          Accept: "application/json",
        },
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Reset the form and state
      setSelectedId(null);
      setUzytkownik({
        imie: "",
        nazwisko: "",
        ulica: "",
        numer_domu: "",
        kod_pocztowy: "",
        miejscowosc: "",
        wojewodztwo: "",
        kraj: "",
        telefon: "",
        email: "",
        haslo: "",
      });
      loadUzytkownikData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const loadUzytkownikData = async () => {
    try {
      const response = await fetch("/api/uzytkownik", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      fillFormWithSelectedData(data[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    loadUzytkownikData();
  }, []);
  return (
    <div className="flex flex-row w-2/3 justify-between mx-auto h-screen">
      <div className="w-2/3 h-full p-5">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4 flex justify-between flex-row">
            <div className="flex flex-col w-1/2 justify-end">
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
                  value={uzytkownik.imie}
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
                  value={uzytkownik.nazwisko}
                  onChange={handleChange}
                />
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
                  value={uzytkownik.ulica}
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
                  value={uzytkownik.numer_domu}
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
                  value={uzytkownik.kod_pocztowy}
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
                  value={uzytkownik.miejscowosc}
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
                  value={uzytkownik.wojewodztwo}
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
                  value={uzytkownik.kraj}
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
                value={uzytkownik.telefon}
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
                value={uzytkownik.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <h1 className="mb-2 text-lg font-bold opacity-80">Zmień hasło</h1>
          <div className="flex items-center justify-end">
            <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`} type="submit">
              {"Edytuj"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profil;
