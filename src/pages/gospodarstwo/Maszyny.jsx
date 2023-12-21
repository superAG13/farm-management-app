import {useState} from "react";
import {FaCamera} from "react-icons/fa";

function Maszyny() {
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    category: "",
    addressStreet: "",
    addressHouseNumber: "",
    postalCode: "",
    city: "",
    region: "",
    country: "Poland",
    phoneNumber: "",
    email: "",
    jednostkaRozliczeniowa: "",
    costPerHour: "",
  });

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("photo", event.target.files[0]);
  };

  const handlePhotoChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedPhoto(e.target.result);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <div className="flex flex-row w-2/3 justify-between mx-auto h-screen">
      <div className="flex flex-col p-5 w-1/3">
        <div className="w-full mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="search"
            type="text"
            placeholder="Wyszukaj"
          />
        </div>
        <div className="w-full bg-white shadow-md rounded h-full">
          <div className="flex items-center w-full px-4 pt-2 pb-2 mb-2 border-b-2 border-gray-700">
            <div className="flex-shrink-0 h-14 w-14">
              <img className="h-14 w-14 rounded" src="/src/assets/testMaszyny.jpg" alt="Profile" />
            </div>
            <div className="ml-4">
              <div className="text-xl font-bold text-black">Deutz Fahr 7250 TTV</div>
              <p className="text-gray-500">Ciągnik rolniczy</p>
            </div>
          </div>
          <div className="flex items-center w-full px-4 pt-2 pb-2 mb-2 border-b-2 border-gray-700">
            <div className="flex-shrink-0 h-14 w-14">
              <img className="h-14 w-14 rounded" src="/src/assets/testMaszyny.jpg" alt="Profile" />
            </div>
            <div className="ml-4">
              <div className="text-xl font-bold text-black">Deutz Fahr 7250 TTV</div>
              <p className="text-gray-500">Ciągnik rolniczy</p>
            </div>
          </div>
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
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="rodzaj"
                  type="text"
                  placeholder="Rodzaj"
                  name="rodzaj"
                  value={employee.rodzaj}
                  onChange={handleChange}
                />
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
                  value={employee.nazwa}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="operator">
                  Operator
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="operator"
                  type="text"
                  placeholder="Operator"
                  name="operator"
                  value={employee.operator}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="w-1/2 ml-4">
              <label
                htmlFor="photo-upload"
                className="h-60 border-2 border-blue-600 rounded flex flex-col items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200 relative">
                {!selectedPhoto && (
                  <>
                    <div className="text-blue-600">
                      <FaCamera size="72px" />
                    </div>
                    <span className="mt-2 text-sm text-blue-600">Dodaj zdjęcie</span>
                  </>
                )}
                {selectedPhoto && (
                  <>
                    <img src={selectedPhoto} alt="Selected" className="w-full h-full object-cover rounded" />
                    <div className="absolute bottom-0 right-0 bg-white bg-opacity-75 p-2 rounded-tr rounded-bl cursor-pointer hover:bg-opacity-100">
                      <FaCamera size="24px" className="text-blue-600" />
                    </div>
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
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="rokProdukcji"
                  type="text"
                  placeholder="Rok produkcji"
                  name="rokProdukcji"
                  value={employee.rokProdukcji}
                  onChange={handleChange}
                />
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
                  value={employee.masa}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-row">
              <div className="w-1/2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="szerokoscRobocza">
                  Szerokość robocza
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="szerokoscRobocza"
                  type="text"
                  placeholder="Szerokość robocza"
                  name="szerekoscRobocza"
                  value={employee.kodPocztowy}
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
                  value={employee.moc}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-row">
              <div className="w-1/2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dataUbezpiecznia">
                  Data ubezpieczenia
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="dataUbezpiecznia"
                  type="date"
                  placeholder="Data ubezpieczenia"
                  name="dataUbezpiecznia"
                  value={employee.dataUbezpiecznia}
                  onChange={handleChange}
                />
              </div>
              <div className="w-1/2 mb-4 ml-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dataPrzegladu">
                  Data przeglądu
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="dataPrzegladu"
                  type="date"
                  placeholder="Data przeglądu"
                  name="dataPrzegladu"
                  value={employee.dataPrzegladu}
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
              value={employee.ustawienia}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Dodaj
            </button>
            <button
              className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
              type="button">
              Usuń
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Maszyny;
