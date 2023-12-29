import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
const convertDateToYYYYMMDD = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  let month = "" + (date.getMonth() + 1),
    day = "" + date.getDate(),
    year = date.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};
const EdytujFinanse = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [finanse, setFinanse] = useState({
    nazwa: "",
    rodzaj_dokumentu: "",
    opis: "",
    wartosc: "",
    data: "",
  });
  useEffect(() => {
    fetch(`/api/finanse/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data[0]); // Check the structure and content
        setFinanse({
          nazwa: data[0].nazwa,
          rodzaj_dokumentu: data[0].rodzaj_dokumentu,
          opis: data[0].opis,
          wartosc: data[0].wartosc,
          data: convertDateToYYYYMMDD(data[0].data),
        });
      })
      .catch((error) => console.error("Error fetching zbiory:", error));
  }, [id]);
  const handleChange = async (e) => {
    setFinanse({...finanse, [e.target.name]: e.target.value});
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`/api/finanse/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finanse),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        navigate("/finanse");
      })
      .catch((error) => {
        console.error("Error updating field:", error);
      });
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
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              {"Edytuj"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EdytujFinanse;
