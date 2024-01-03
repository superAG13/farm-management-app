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
const EdytujZbiory = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [zbiory, setZbiory] = useState({
    kwit_wagowy: "",
    data_sprzedazy: "",
    wilgotnosc: "",
    masa: "",
    cena_bazowa: "",
  });
  useEffect(() => {
    fetch(`/api/zbiory/${id}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data[0]); // Check the structure and content
        setZbiory({
          kwit_wagowy: data[0].kwit_wagowy,
          data_sprzedazy: convertDateToYYYYMMDD(data[0].data_sprzedazy),
          wilgotnosc: data[0].wilgotnosc,
          masa: data[0].masa,
          cena_bazowa: data[0].cena_bazowa,
        });
      })
      .catch((error) => console.error("Error fetching zbiory:", error));
  }, [id]);

  const handleChange = async (e) => {
    setZbiory({...zbiory, [e.target.name]: e.target.value});
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`/api/zbiory/${id}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zbiory),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        navigate("/zbiory");
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
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Edytuj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EdytujZbiory;
