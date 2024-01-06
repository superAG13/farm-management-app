import React from "react";
import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import moment from "moment";
const convertDateToLocal = (dateString) => {
  const date = new Date(dateString);
  const timeZoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - timeZoneOffset);
  return localDate.toISOString().slice(0, -1); // Remove 'Z' at the end
};
const EdytujKalendarz = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [kalendarz, setKalendarz] = useState({
    title: "",
    start: "",
    end: "",
    numer_ewidencyjny: "",
    operator: "",
    opis: "",
  });
  useEffect(() => {
    fetch(`/api/kalendarz/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setKalendarz({
          title: data[0].title,
          start: convertDateToLocal(data[0].start),
          end: convertDateToLocal(data[0].end),
          numer_ewidencyjny: data[0].numer_ewidencyjny,
          operator: data[0].operator,
          opis: data[0].opis,
        });
      })
      .catch((error) => console.error("Error fetching zbiory:", error));
  }, [id]);
  const [isLoading, setIsLoading] = useState(false);
  const [operatorData, setOperatorData] = useState([]);
  const handleChangeOperator = (e) => {
    setKalendarz({...kalendarz, operator: e.target.value});
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/operator", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setOperatorData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const [fieldData, setFieldData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/area", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFieldData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const handleChange = async (e) => {
    setKalendarz({...kalendarz, [e.target.name]: e.target.value});
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const kalendarz = {
      title: e.target.title.value,
      start: moment(e.target.start.value).format("YYYY-MM-DD HH:mm:ss"),
      end: moment(e.target.end.value).format("YYYY-MM-DD HH:mm:ss"),
      numer_ewidencyjny: e.target.numer_ewidencyjny.value,
      operator: e.target.operator.value,
      opis: e.target.opis.value,
    };
    fetch(`/api/kalendarz/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(kalendarz),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        navigate("/kalendarz");
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
              name="title"
              value={kalendarz.title}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md "
            />
          </div>
          <div className="mb-4 w-1/2">
            <label htmlFor="start" className="block text-sm font-medium mb-1">
              Data początkowa
            </label>
            <input
              type="datetime-local"
              placeholder="Data początkowa"
              name="start"
              value={kalendarz.start}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md "
            />
          </div>
          <div className="mb-4 w-1/2">
            <label htmlFor="end" className="block text-sm font-medium mb-1">
              Data końcowa
            </label>
            <input
              type="datetime-local"
              placeholder="Data końcowa"
              name="end"
              value={kalendarz.end}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md "
            />
          </div>

          <div className="mb-4 w-1/2">
            <label htmlFor="numer_ewidencyjny" className="block text-sm font-medium mb-1">
              Numer ewidencyjny
            </label>
            <select
              id="numer_ewidencyjny"
              name="numer_ewidencyjny"
              value={kalendarz.numer_ewidencyjny}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md p-0.5">
              <option value="">Wybierz numer ewidencyjny</option>
              {fieldData.map((option) => (
                <option key={option.numer_ewidencyjny} value={option.numer_ewidencyjny}>
                  {option.numer_ewidencyjny}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 w-1/2">
            <label htmlFor="operator" className="block text-sm font-medium mb-1">
              Operator
            </label>
            <select
              id="operator"
              name="operator"
              value={kalendarz.operator}
              onChange={handleChangeOperator}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md p-0.5">
              <option value="">Wybierz operatora</option>
              {operatorData.map((op, index) => (
                <option key={index} value={`${op.imie} ${op.nazwisko}`}>
                  {op.imie} {op.nazwisko}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="opis" className="block text-sm font-medium mb-1">
              Opis
            </label>
            <textarea
              id="opis"
              name="opis"
              value={kalendarz.opis}
              onChange={handleChange}
              className="w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-base border rounded-md "
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

export default EdytujKalendarz;
